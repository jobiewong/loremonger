# Loremonger

Loremonger is a small utility for automatically generating D&D session notes from an audio recording. The notes are generated in markdown format to be used in a program such as Obsidian. Recordings can be multiple audio or video files — uploads are automatically concatenated and converted to a single .mp3 file.

It was created for DM's and players to easily generate summaries of past sessions, and free up energy to enjoy the sessions and not worry about getting all the details written down.

## Tech Stack

- Tauri
- React (Tanstack Start)
- DrizzleORM
- Tailwind
- Elevenlabs for transcription + GPT5.1 nano for note generation

## Architecture

Tauri is used for its low overhead and compatibility with frontend javascript frameworks like React. Tanstack Start is used (Tanstack Router + TanstackDB) for ease-of-use and because I wanted to test out TanstackDB in a side-project. It allows for automatic optimistic updates which is great for a desktop app like this. Data is stored in a local sqlite database and queried using DrizzleORM and TanstackDB for type-safe query generation. As there are no complex SQL queries needed in this app this was sufficient. API keys are provided by the user and configured in the in-app settings. These are then encrypted and stored using Tauri Stronghold. They are fetched on-demand by the client-side of the app in order for the AI SDK and JavaScript ElevenLabs SDK to be used (I am bad at Rust). While this isn't technically the safest thing to do (secrets on the client-side), as this is a desktop app I figured it was probably fine.

Audio uploads are processed completely locally. Rust + ffmpeg is used for converting and videos to audio and concatenating multiple files. The outputted audio file is saved to the user's disk then sent to ElevenLabs for transcription. The transcript is saved to disk, then sent to OpenAI for note generation.

In the future, I want to have the ouput be an more Obsidian-like format. i.e. linked network of notes and sub-notes with characters/locations/events updated using a read + edit agentic workflow.

## Requirements

- An OpenAI API key
- An ElevenLabs API key
- Ffmpeg

## Todo

- [ ] Detect if ffmpeg is installed and give option to download it if not
- [ ] Refactor: audio-upload component
- [ ] Delete associated files when deleting a session or campaign
- [ ] Prompt customziation in settings
- [ ] Prompt when re-transcribing audio for a session that old data will be overwritten
- [ ] Implement Obsidian-style markdown linking for notes to create a networked knowledge base
- [ ] Add functionality to scan existing notes (locations, events, people) in a campaign's output directory and automatically update them based on new session transcripts
