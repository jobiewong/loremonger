# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Loremonger is a Tauri 2 desktop app for transcribing TTRPG audio sessions and generating structured Markdown session notes. Built with React + TypeScript frontend and a Rust backend. Uses OpenAI and ElevenLabs APIs for transcription, and the Vercel AI SDK with OpenAI for note generation.

## Development Commands

```bash
npm run dev              # Start Vite dev server (port 1420)
npm run build            # TypeScript check + Vite build
npm run tauri dev        # Full Tauri dev mode (frontend + Rust backend)
npm run tauri build      # Production build

# Database
npm run db:generate      # Generate Drizzle migrations from schema changes
npm run db:push          # Push schema changes directly (dev only)
npm run db:studio        # Open Drizzle Studio for database inspection
```

After modifying `src/server/db/schema.ts`, run `npm run db:generate` to create a migration in `src-tauri/migrations/`. Migrations are auto-loaded at app startup via the Rust build script (`src-tauri/build.rs`).

## Architecture

### Data Layer
- **SQLite** database managed by Tauri's SQL plugin (`tauri-plugin-sql`)
- **Drizzle ORM** with sqlite-proxy driver — SQL executes via Tauri `invoke("run_sql")` IPC to the Rust backend (`src-tauri/src/drizzle_proxy.rs`)
- **TanStack DB** collections (`src/server/collections/`) provide reactive queries with `useLiveQuery` hooks and optimistic CRUD mutations
- **Schema** at `src/server/db/schema.ts` — tables: `campaigns`, `players`, `sessions`
- **Migrations** in `src-tauri/migrations/` — auto-compiled into Rust binary via `build.rs`

### Frontend Stack
- **React 19** with TypeScript, **Vite 7** bundler
- **TanStack Router** — file-based routing in `src/routes/`, route tree auto-generated at `src/routeTree.gen.ts` (don't edit directly)
- **Tailwind CSS 4** with shadcn/ui components (`src/components/ui/`)
- **Jotai** for ephemeral UI state (audio upload progress)
- **React Hook Form + Zod** for form validation
- **next-themes** for dark/light/system theme

### Tauri Backend (Rust)
- `src-tauri/src/lib.rs` — plugin registration + command handler setup
- `src-tauri/src/drizzle_proxy.rs` — `run_sql` command: executes SQL queries via sqlx
- `src-tauri/src/audio_processor.rs` — `process_audio_files` command: FFmpeg-based audio merging/conversion
- `src-tauri/src/audio_transcription.rs` — `transcribe_audio` command: OpenAI Whisper API with chunking for large files
- `src-tauri/src/audio_utils.rs` — FFmpeg binary path resolution per platform

### Audio Processing Pipeline
1. User uploads audio/video files → written to temp dir via `@tauri-apps/plugin-fs`
2. Tauri `process_audio_files` command merges/converts to MP3 via FFmpeg
3. Transcription dispatched based on settings preference:
   - **ElevenLabs**: Direct API call from frontend via `@elevenlabs/elevenlabs-js` SDK (supports diarization)
   - **OpenAI**: Via Tauri `transcribe_audio` Rust command (handles chunking for >25MB files)
4. Transcript saved to `{appDataDir}/sessions/{sessionId}/transcript.txt`
5. Notes generated via Vercel AI SDK (`generateText` with `gpt-5-nano`)
6. Notes saved to campaign's configured output directory
7. Session record updated in database with metadata

### Security
- API keys stored in **Tauri Stronghold** vault (encrypted, argon2 password derivation)
- Access via `src/lib/stronghold.ts` (`initStronghold`, `insertRecord`, `getRecord`)
- Cached at runtime in `src/lib/openai-utils.ts` and `src/lib/el-labs-utils.ts`

## Key Patterns

### Path Alias
- `~/` maps to `./src/` (tsconfig.json + vite.config.ts)

### Database Changes Workflow
1. Modify schema in `src/server/db/schema.ts`
2. Run `npm run db:generate` to create migration SQL
3. Migration is auto-included in Rust build via `build.rs`
4. On app startup, `tauri-plugin-sql` runs pending migrations

### Adding a TanStack DB Collection
Follow the pattern in `src/server/collections/campaigns.ts`:
- `createCollection` with `queryCollectionOptions` for query/mutation handlers
- Export a `use*` hook wrapping `useLiveQuery`
- Mutations go through `collection.insert/update/delete` which trigger Drizzle writes

### Route Structure
- `/` — Campaign list (home)
- `/campaign/new` — Create campaign form
- `/campaign/$campaignId/` — Campaign detail (players, sessions)
- `/campaign/$campaignId/$sessionId/` — Session detail (upload, transcription, notes)
- `/settings/` — API key management
- Route-specific components go in `-components/` directories adjacent to their route

### Forms
Use React Hook Form with Zod schemas and `@hookform/resolvers`. Form components use the `Field` system from `src/components/ui/field.tsx`.

### File Naming Conventions
Output file paths support template variables: `{campaignName}`, `{sessionNumber}`, `{sessionName}`, `{currentDate}`, `{currentTime}` — see `generateFilePath` and `generateFileName` in `src/lib/utils.ts`.

### Commit Convention
Uses conventional commits enforced by commitlint + husky. Format: `type: description` (e.g., `feat: add session editing`).
