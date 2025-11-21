use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::{command, AppHandle, Manager};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessAudioRequest {
    pub file_paths: Vec<String>,
    pub output_filename: String,
    pub session_id: String,
}

// Get the path to the bundled FFmpeg binary
fn get_ffmpeg_path(app: &AppHandle) -> Result<PathBuf, String> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|_| "Could not resolve resource directory")?;
    
    #[cfg(target_os = "macos")]
    let ffmpeg_path = resource_dir.join("binaries").join("macos").join("ffmpeg");
    
    #[cfg(target_os = "windows")]
    let ffmpeg_path = resource_dir.join("binaries").join("windows").join("ffmpeg.exe");
    
    // TODO: Add Linux binariess
    // #[cfg(target_os = "linux")]
    // let ffmpeg_path = resource_dir.join("binaries").join("linux").join("ffmpeg");
    
    // If bundled FFmpeg doesn't exist, try system FFmpeg as fallback
    if !ffmpeg_path.exists() {
        // Try system FFmpeg
        #[cfg(target_os = "windows")]
        return Ok(PathBuf::from("ffmpeg.exe"));
        
        #[cfg(not(target_os = "windows"))]
        return Ok(PathBuf::from("ffmpeg"));
    }
    
    // Make FFmpeg executable on Unix systems
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = std::fs::metadata(&ffmpeg_path)
            .map_err(|e| format!("Failed to get FFmpeg metadata: {}", e))?
            .permissions();
        perms.set_mode(0o755);
        std::fs::set_permissions(&ffmpeg_path, perms)
            .map_err(|e| format!("Failed to set FFmpeg permissions: {}", e))?;
    }
    
    Ok(ffmpeg_path)
}

#[command]
pub async fn process_audio_files(
    app: AppHandle,
    request: ProcessAudioRequest,
) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|_| "Could not resolve app data directory")?;
    
        let session_dir = app_data_dir.join("sessions").join(&request.session_id);
        std::fs::create_dir_all(&session_dir)
            .map_err(|e| format!("Failed to create session directory: {}", e))?;
        
        // Output path: app_data_dir/sessions/{session_id}/audio.mp3
        let output_path = session_dir.join("audio.mp3");
    
    let ffmpeg_path = get_ffmpeg_path(&app)?;
    
    let temp_dir = app_data_dir.join("temp_audio");
    std::fs::create_dir_all(&temp_dir)
        .map_err(|e| format!("Failed to create temp directory: {}", e))?;
    
    // 1. Convert all videos to audio, keep audio files as-is
    let mut audio_files = Vec::new();
    for (index, input_path) in request.file_paths.iter().enumerate() {
        let input_path = PathBuf::from(input_path);
        let is_video = is_video_file(&input_path);
        
        let audio_path = if is_video {
            // Convert video to audio
            let temp_audio = temp_dir.join(format!("audio_{}.wav", index));
            convert_video_to_audio(&ffmpeg_path, &input_path, &temp_audio)
                .map_err(|e| format!("Failed to convert video to audio: {}", e))?;
            temp_audio
        } else {
            // Already audio, use as-is
            input_path
        };
        
        audio_files.push(audio_path);
    }
    
    // 2. Concatenate all audio files
    if audio_files.len() == 1 {
        // Copy to output if only single file
        std::fs::copy(&audio_files[0], &output_path)
            .map_err(|e| format!("Failed to copy file: {}", e))?;
    } else {
        concatenate_audio_files(&ffmpeg_path, &audio_files, &output_path)
            .map_err(|e| format!("Failed to concatenate audio: {}", e))?;
    }
    
    // Cleanup temp directory
    let _ = std::fs::remove_dir_all(&temp_dir);
    
    Ok(output_path.to_string_lossy().to_string())
}

fn is_video_file(path: &Path) -> bool {
    if let Some(ext) = path.extension() {
        let ext_lower = ext.to_string_lossy().to_lowercase();
        matches!(
            ext_lower.as_str(),
            "mp4" | "mov" | "avi" | "mkv" | "webm" | "m4v" | "flv" | "wmv"
        )
    } else {
        false
    }
}

fn convert_video_to_audio(
    ffmpeg_path: &Path,
    input: &Path,
    output: &Path,
) -> Result<(), String> {
    let output_str = output
        .to_str()
        .ok_or("Invalid output path")?;
    
    let input_str = input
        .to_str()
        .ok_or("Invalid input path")?;
    
    let ffmpeg_str = ffmpeg_path
        .to_str()
        .ok_or("Invalid FFmpeg path")?;
    
    let result = Command::new(ffmpeg_str)
        .args([
            "-i", input_str,
            "-vn",                    // No video
            "-acodec", "pcm_s16le",   // PCM audio codec
            "-ar", "44100",           // Sample rate
            "-ac", "2",               // Stereo
            "-y",                     // Overwrite output
            output_str,
        ])
        .output();
    
    match result {
        Ok(output) => {
            if !output.status.success() {
                let stderr = String::from_utf8_lossy(&output.stderr);
                return Err(format!("FFmpeg conversion failed: {}", stderr));
            }
            Ok(())
        }
        Err(e) => {
            Err(format!("Failed to run FFmpeg: {}", e))
        }
    }
}

fn concatenate_audio_files(
    ffmpeg_path: &Path,
    inputs: &[PathBuf],
    output: &Path,
) -> Result<(), String> {
    if inputs.is_empty() {
        return Err("No input files provided".to_string());
    }
    
    // Create a file list for FFmpeg concat
    let temp_dir = output
        .parent()
        .ok_or("Invalid output path")?;
    
    let concat_list = temp_dir.join("concat_list.txt");
    
    // Write concat list file
    let list_content: String = inputs
        .iter()
        .map(|p| {
            let path_str = p.to_string_lossy().replace('\\', "/").replace('\'', "'\\''");
            format!("file '{}'\n", path_str)
        })
        .collect();
    
    std::fs::write(&concat_list, list_content)
        .map_err(|e| format!("Failed to write concat list: {}", e))?;
    
    let output_str = output
        .to_str()
        .ok_or("Invalid output path")?;
    
    let concat_list_str = concat_list
        .to_str()
        .ok_or("Invalid concat list path")?;
    
    let ffmpeg_str = ffmpeg_path
        .to_str()
        .ok_or("Invalid FFmpeg path")?;
    
    let result = Command::new(ffmpeg_str)
        .args([
            "-f", "concat",
            "-safe", "0",
            "-i", concat_list_str,
            "-c", "copy", 
            "-y",
            output_str,
        ])
        .output();
    
    let _ = std::fs::remove_file(&concat_list);
    
    match result {
        Ok(output) => {
            if !output.status.success() {
                let stderr = String::from_utf8_lossy(&output.stderr);
                return Err(format!("FFmpeg concat failed: {}", stderr));
            }
            Ok(())
        }
        Err(e) => {
            Err(format!("Failed to run FFmpeg: {}", e))
        }
    }
}