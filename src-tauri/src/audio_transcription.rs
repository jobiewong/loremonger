use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::Command;
use tauri::{command, AppHandle, Manager};

use crate::audio_utils;

const MAX_FILE_SIZE: usize = 25 * 1024 * 1024; // 25MB in bytes

#[derive(Debug, Serialize, Deserialize)]
pub struct TranscriptionRequest {
    pub audio_data: Vec<u8>,
    pub api_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TranscriptionResponse {
    pub text: String,
}

#[command]
pub async fn transcribe_audio(
    app: AppHandle,
    request: TranscriptionRequest,
) -> Result<TranscriptionResponse, String> {
    if request.audio_data.len() > MAX_FILE_SIZE {
        return transcribe_large_file(app, request).await;
    }

    transcribe_chunk(&request.audio_data, &request.api_key).await
}

async fn transcribe_large_file(
    app: AppHandle,
    request: TranscriptionRequest,
) -> Result<TranscriptionResponse, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Could not resolve app data directory: {:?}", e))?;

    let temp_dir = app_data_dir.join("temp_transcription");
    std::fs::create_dir_all(&temp_dir)
        .map_err(|e| format!("Failed to create temp directory at {:?}: {}", temp_dir, e))?;

    let input_file = temp_dir.join("input_audio.mp3");
    std::fs::write(&input_file, &request.audio_data)
        .map_err(|e| format!("Failed to write temp audio file to {:?}: {}", input_file, e))?;

    let ffmpeg_path = audio_utils::get_ffmpeg_path(&app)
        .map_err(|e| format!("Failed to get FFmpeg path: {}", e))?;
    
    let duration = get_audio_duration(&ffmpeg_path, &input_file)
        .map_err(|e| format!("Failed to get audio duration: {}", e))?;

    let file_size_mb = request.audio_data.len() as f64 / (1024.0 * 1024.0);
    let target_chunk_size_mb = 20.0; // Target 20MB chunks for safety margin
    let num_chunks_f = (file_size_mb / target_chunk_size_mb).ceil();
    let num_chunks = num_chunks_f as usize;
    let chunk_duration = duration / num_chunks_f;

    eprintln!(
        "Large file detected: {:.2}MB, {:.2}s duration. Splitting into {} chunks of ~{:.2}s each",
        file_size_mb, duration, num_chunks, chunk_duration
    );

    let mut transcripts = Vec::new();

    for i in 0..num_chunks {
        eprintln!("Processing chunk {}/{}", i + 1, num_chunks);
        
        let start_time = i as f64 * chunk_duration;
        // Ensure last chunk doesn't exceed duration
        let actual_chunk_duration = if start_time + chunk_duration > duration {
            duration - start_time
        } else {
            chunk_duration
        };

        if actual_chunk_duration < 0.1 {
            eprintln!("Skipping chunk {}: duration too small ({:.2}s)", i, actual_chunk_duration);
            continue;
        }

        let chunk_file = temp_dir.join(format!("chunk_{}.mp3", i));

        eprintln!("Extracting chunk {}: start={:.2}s, duration={:.2}s", i, start_time, actual_chunk_duration);
        extract_audio_chunk(
            &ffmpeg_path,
            &input_file,
            &chunk_file,
            start_time,
            actual_chunk_duration,
        )
        .map_err(|e| format!("Failed to extract chunk {} (start: {:.2}s, duration: {:.2}s): {}", i, start_time, actual_chunk_duration, e))?;

        let chunk_size = std::fs::metadata(&chunk_file)
            .map_err(|e| format!("Failed to get chunk file metadata: {}", e))?
            .len();
        
        if chunk_size == 0 {
            return Err(format!("Chunk {} file is empty (0 bytes)", i));
        }

        eprintln!("Chunk {} extracted: {} bytes", i, chunk_size);

        let chunk_data = std::fs::read(&chunk_file)
            .map_err(|e| format!("Failed to read chunk file {:?}: {}", chunk_file, e))?;

        eprintln!("Transcribing chunk {}/{} ({} bytes)...", i + 1, num_chunks, chunk_data.len());
        let chunk_transcript = transcribe_chunk(&chunk_data, &request.api_key)
            .await
            .map_err(|e| format!("Failed to transcribe chunk {}: {}", i, e))?;
        
        eprintln!("Chunk {} transcribed: {} characters", i, chunk_transcript.text.len());
        transcripts.push(chunk_transcript.text);

        if let Err(e) = std::fs::remove_file(&chunk_file) {
            eprintln!("Warning: Failed to remove chunk file {:?}: {}", chunk_file, e);
        }
    }

    // Clean up temp directory
    let _ = std::fs::remove_dir_all(&temp_dir);

    let full_transcript = transcripts.join(" ");

    eprintln!("Transcription complete: {} chunks, {} total characters", num_chunks, full_transcript.len());

    Ok(TranscriptionResponse {
        text: full_transcript,
    })
}

async fn transcribe_chunk(
    audio_data: &[u8],
    api_key: &str,
) -> Result<TranscriptionResponse, String> {
    if audio_data.is_empty() {
        return Err("Audio data is empty".to_string());
    }

    if api_key.is_empty() {
        return Err("OpenAI API key is empty".to_string());
    }

    let client = reqwest::Client::new();

    let form = reqwest::multipart::Form::new()
        .part(
            "file",
            reqwest::multipart::Part::bytes(audio_data.to_vec())
                .file_name("audio.mp3")
                .mime_str("audio/mpeg")
                .map_err(|e| format!("Failed to set mime type: {}", e))?,
        )
        .text("model", "whisper-1");

    let response = client
        .post("https://api.openai.com/v1/audio/transcriptions")
        .header("Authorization", format!("Bearer {}", api_key))
        .multipart(form)
        .send()
        .await
        .map_err(|e| format!("Failed to send request to OpenAI API: {}", e))?;

    let status = response.status();
    if !status.is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!(
            "OpenAI API error (status {}): {}",
            status.as_u16(),
            error_text
        ));
    }

    let transcription: TranscriptionResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse OpenAI API response: {}", e))?;

    Ok(transcription)
}

fn get_audio_duration(ffmpeg_path: &Path, audio_file: &Path) -> Result<f64, String> {
    let ffmpeg_str = ffmpeg_path.to_str().ok_or("Invalid FFmpeg path")?;
    let audio_str = audio_file.to_str().ok_or("Invalid audio file path")?;

    if !ffmpeg_path.exists() {
        return Err(format!(
            "FFmpeg executable not found at: {}",
            ffmpeg_str
        ));
    }

    if !audio_file.exists() {
        return Err(format!(
            "Audio file does not exist: {}",
            audio_str
        ));
    }

    let version_check = Command::new(ffmpeg_str)
        .arg("-version")
        .output();
    
    match version_check {
        Ok(output) if output.status.success() => {
        }
        Ok(_) => {
            return Err(format!(
                "FFmpeg exists but failed to run version check. Path: {}",
                ffmpeg_str
            ));
        }
        Err(e) => {
            return Err(format!(
                "Failed to execute FFmpeg at {}: {}. Please ensure FFmpeg is installed and accessible.",
                ffmpeg_str,
                e
            ));
        }
    }

    let output = Command::new(ffmpeg_str)
        .args([
            "-i",
            audio_str,
            "-t",
            "1",
            "-f",
            "null",
        ])
        .arg(if cfg!(target_os = "windows") {
            "NUL"
        } else {
            "/dev/null"
        })
        .stderr(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .output()
        .map_err(|e| format!("Failed to run FFmpeg ({}): {}", ffmpeg_str, e))?;

    let stderr = String::from_utf8_lossy(&output.stderr);
    
    // Parse duration from stderr output
    // FFmpeg outputs: "Duration: HH:MM:SS.mmm, start: ..."
    let duration = extract_duration_from_ffmpeg_output(&stderr)
        .ok_or_else(|| {
            format!(
                "Failed to extract duration from FFmpeg output. Stderr: {}. Exit code: {:?}",
                stderr,
                output.status.code()
            )
        })?;

    Ok(duration)
}

fn extract_duration_from_ffmpeg_output(stderr: &str) -> Option<f64> {
    // Look for "Duration: HH:MM:SS.mmm" pattern in stderr
    for line in stderr.lines() {
        if let Some(duration_pos) = line.find("Duration:") {
            let duration_str = &line[duration_pos + 9..];
            let end_pos = duration_str.find(',').unwrap_or(duration_str.len());
            let duration_str = duration_str[..end_pos].trim();
            
            let parts: Vec<&str> = duration_str.split(':').collect();
            if parts.len() == 3 {
                let hours: f64 = parts[0].parse().ok()?;
                let minutes: f64 = parts[1].parse().ok()?;
                let seconds_str = parts[2];
                let seconds: f64 = seconds_str.parse().ok()?;
                
                return Some(hours * 3600.0 + minutes * 60.0 + seconds);
            }
        }
    }
    None
}

fn extract_audio_chunk(
    ffmpeg_path: &Path,
    input: &Path,
    output: &Path,
    start_time: f64,
    duration: f64,
) -> Result<(), String> {
    let ffmpeg_str = ffmpeg_path.to_str().ok_or("Invalid FFmpeg path")?;
    let input_str = input.to_str().ok_or("Invalid input path")?;
    let output_str = output.to_str().ok_or("Invalid output path")?;

    if start_time < 0.0 {
        return Err("Start time cannot be negative".to_string());
    }
    if duration <= 0.0 {
        return Err(format!("Duration must be positive, got: {}", duration));
    }

    let result = Command::new(ffmpeg_str)
        .args([
            "-i",
            input_str,
            "-ss",
            &format!("{:.3}", start_time), 
            "-t",
            &format!("{:.3}", duration),
            "-acodec",
            "copy",
            "-avoid_negative_ts",
            "make_zero", 
            "-y",
            output_str,
        ])
        .output();

    match result {
        Ok(output) => {
            if !output.status.success() {
                let stderr = String::from_utf8_lossy(&output.stderr);
                let stdout = String::from_utf8_lossy(&output.stdout);
                return Err(format!(
                    "FFmpeg extraction failed. Exit code: {:?}. Stderr: {}. Stdout: {}",
                    output.status.code(),
                    stderr,
                    stdout
                ));
            }
            Ok(())
        }
        Err(e) => Err(format!("Failed to run FFmpeg: {}", e)),
    }
}