use tauri::Manager;
use std::fs;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default().setup(|app| {
        let app_local_data_dir = app
            .path()
            .app_local_data_dir()
            .expect("could not resolve app local data path");
        
        // Ensure the directory exists before creating the salt file
        fs::create_dir_all(&app_local_data_dir)
            .expect("failed to create app local data directory");
        
        let salt_path = app_local_data_dir.join("salt.txt");
        app.handle().plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
        Ok(())
    })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
