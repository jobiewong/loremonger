use std::fs;
use tauri::Manager;
mod audio_processor;
mod audio_transcription;
mod audio_utils;
mod drizzle_proxy;
include!(concat!(env!("OUT_DIR"), "/generated_migrations.rs"));

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = load_migrations();
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:database.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("could not resolve app data path");

            fs::create_dir_all(&app_data_dir).expect("failed to create app data directory");

            let salt_path = app_data_dir.join("salt.txt");
            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            drizzle_proxy::run_sql,
            audio_processor::process_audio_files,
            audio_transcription::transcribe_audio
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
