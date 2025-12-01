use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Gets the path to the FFmpeg executable
pub fn get_ffmpeg_path(app: &AppHandle) -> Result<PathBuf, String> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|_| "Could not resolve resource directory")?;

    #[cfg(target_os = "windows")]
    let possible_paths = vec![
        resource_dir.join("binaries").join("ffmpeg.exe"),
        resource_dir.join("binaries").join("windows").join("ffmpeg.exe"),
    ];

    #[cfg(target_os = "macos")]
    let possible_paths = vec![
        resource_dir.join("binaries").join("ffmpeg"),
        resource_dir.join("binaries").join("macos").join("ffmpeg"),
    ];

    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    let possible_paths = vec![
        resource_dir.join("binaries").join("ffmpeg"),
        resource_dir.join("binaries").join("linux").join("ffmpeg"),
    ];

    for ffmpeg_path in &possible_paths {
        if ffmpeg_path.exists() {
            // Make FFmpeg executable on Unix systems
            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;
                if let Ok(mut perms) = std::fs::metadata(ffmpeg_path).map(|m| m.permissions()) {
                    perms.set_mode(0o755);
                    let _ = std::fs::set_permissions(ffmpeg_path, perms);
                }
            }
            return Ok(ffmpeg_path.clone());
        }
    }

    let tried_paths: Vec<String> = possible_paths
        .iter()
        .map(|p| p.to_string_lossy().to_string())
        .collect();
    
    eprintln!(
        "Warning: Bundled FFmpeg not found. Tried paths: {:?}. Resource dir: {:?}. Falling back to system FFmpeg.",
        tried_paths,
        resource_dir
    );

    #[cfg(target_os = "windows")]
    return Ok(PathBuf::from("ffmpeg.exe"));

    #[cfg(not(target_os = "windows"))]
    Ok(PathBuf::from("ffmpeg"))

}

