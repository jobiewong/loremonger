# Loremonger Phase 2 - Implementation Plan

## Context

Loremonger is a Tauri 2 desktop app (v1.2.0) for transcribing TTRPG audio sessions and generating structured Markdown session notes. The app already has:
- Working audio upload → FFmpeg processing → transcription (OpenAI/ElevenLabs) → note generation pipeline
- SQLite database with Drizzle ORM (campaigns, players, sessions tables)
- TanStack DB collections for reactive state management
- Tauri Rust backend with audio processing, transcription, and SQL proxy commands
- Stronghold vault for secure API key storage
- Full UI with campaign/session management

Phase 2 adds: (1) transcription model selection, (2) agentic note generation that integrates with Obsidian vaults, (3) configurable LLM provider for note generation, and (4) per-campaign Obsidian vault configuration.

---

## Architecture Decision: Stay with Tauri (Frontend-Heavy)

**No migration to Electron.** The Vercel AI SDK (`ai` + `@ai-sdk/openai`) uses standard `fetch` and Web Streams APIs — confirmed to work in Tauri's webview with `apiKey` passed via options. Existing Tauri plugins already provide filesystem access, native dialogs, and SQL.

**Local Whisper is deferred** to a future milestone. API-based transcription (OpenAI + ElevenLabs) comes first. When implemented, whisper.cpp can be bundled as a Tauri sidecar (C++ binary, no Python required).

### Key Technical Findings

- The Vercel AI SDK v5 uses standard `fetch` internally, no Node.js-specific APIs. Works in browser/webview.
- API keys must be passed via `createOpenAI({ apiKey: "..." })` options, NOT environment variables.
- Tauri CSP is already `null` — CORS won't block API calls.
- Existing Stronghold vault stores API keys; existing Drizzle/TanStack DB stores campaign data.

---

## Data Model Changes

### Settings Separation

**App-level settings** (Stronghold vault — encrypted, not in database):
- API keys (OpenAI, ElevenLabs, Anthropic)
- Default transcription provider + model
- Default note generation provider + model

**Campaign-level settings** (SQLite database via Drizzle):
- `customSystemPrompt` on campaigns table
- Obsidian vault configuration in new `campaign_vaults` table

### Schema Changes

**Modify `src/server/db/schema.ts`:**

Add column to `campaigns` table:
```typescript
customSystemPrompt: text("custom_system_prompt"),
```

Add new `campaignVaults` table:
```typescript
export const campaignVaults = sqliteTable("campaign_vaults", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id").references(() => campaigns.id).notNull().unique(),
  vaultPath: text("vault_path").notNull(),
  sessionDir: text("session_dir").notNull().default("Sessions"),
  characterDir: text("character_dir").notNull().default("Characters"),
  locationDir: text("location_dir").notNull().default("Locations"),
  itemDir: text("item_dir").notNull().default("Items"),
  sessionTemplate: text("session_template"),
  characterTemplate: text("character_template"),
  locationTemplate: text("location_template"),
  itemTemplate: text("item_template"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
```

Add relations:
```typescript
export const campaignVaultRelations = relations(campaignVaults, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignVaults.campaignId],
    references: [campaigns.id],
  }),
}));

// Update existing campaignRelations:
export const campaignRelations = relations(campaigns, ({ many, one }) => ({
  players: many(players),
  sessions: many(sessions),
  vault: one(campaignVaults),
}));
```

After schema changes, run `npm run db:generate` to create the migration.

---

## Milestone 1: Schema + Settings Refactor

### 1a. Database schema changes
1. Add `customSystemPrompt` column to `campaigns` table
2. Add `campaign_vaults` table + relations (as above)
3. Run `npm run db:generate` → creates migration in `src-tauri/migrations/`
4. Update types in `src/types/index.ts` — add `CampaignVault` type

### 1b. New TanStack DB collection

**New file: `src/server/collections/campaign-vaults.ts`**
- Follow existing pattern from `src/server/collections/campaigns.ts`
- `useCampaignVault(campaignId)` hook using `useLiveQuery` with filter
- CRUD handlers for insert/update/delete via Drizzle

### 1c. Settings page refactor

**Modify `src/routes/settings/index.tsx`:**
- Keep existing API key inputs (Stronghold)
- Add default transcription provider/model selector
- Add default note generation provider/model selector
- Store defaults in Stronghold:
  - `default-transcription-provider` (openai | elevenlabs)
  - `default-transcription-model` (e.g., gpt-4o-transcribe, scribe_v1)
  - `default-note-generation-provider` (openai | anthropic)
  - `default-note-generation-model` (e.g., gpt-5-nano)

### 1d. New dependency

**Install `@ai-sdk/anthropic`** — Anthropic provider for note generation

---

## Milestone 2: Campaign Vault UI

### 2a. Campaign creation form

**Modify `src/routes/campaign/new.tsx`:**
- Add optional `customSystemPrompt` textarea
- Add optional Obsidian vault configuration section:
  - Vault path picker (uses `@tauri-apps/plugin-dialog` directory picker)
  - Directory name inputs: Sessions, Characters, Locations, Items (with defaults)
  - Optional template file pickers for each note type
- On campaign creation, insert `campaignVaults` record if vault path provided

### 2b. Campaign edit dialog

**Modify `src/components/header/edit-campaign-dialog.tsx`:**
- Add `customSystemPrompt` field
- Add Obsidian vault configuration (create/edit `campaignVaults` record)

### 2c. Campaign detail page

**Modify `src/routes/campaign/$campaignId/index.tsx`:**
- Show vault configuration status (linked vault path, or "No vault configured")
- Quick link to edit vault settings

---

## Milestone 3: Transcription Model Selection

### 3a. Update transcription flow

**Modify `src/lib/el-labs-utils.ts`:**
- Read default transcription provider/model from Stronghold settings
- Support model selection (pass model from settings instead of hardcoded `scribe_v1` / `gpt-4o-transcribe`)

**Modify `src/components/audio-upload/index.tsx`:**
- Display which transcription provider/model will be used (read from settings)
- Optionally allow per-session override

### 3b. Note generation model selection

**Modify `src/lib/openai-utils.ts`:**
- Read default note generation provider/model from Stronghold settings
- Create model factory supporting OpenAI + Anthropic via `@ai-sdk/openai` and `@ai-sdk/anthropic`
- Replace hardcoded `gpt-5-nano` with configurable model
- Inject `customSystemPrompt` from campaign into the system prompt

---

## Milestone 4: Obsidian Vault Integration

### 4a. Vault service

**New file: `src/lib/vault/vault-service.ts`**
- Uses `@tauri-apps/plugin-fs` for all file operations
- Takes vault config from `campaignVaults` table
- Key functions:
  - `listNotes(directory)` — list .md files in a vault subdirectory
  - `readNote(name)` — read a note's content
  - `searchNotes(query)` — search note contents (string match)
  - `createNote(directory, name, content)` — write a new .md file
  - `updateNote(name, newContent)` — overwrite an existing note
  - `readTemplate(templatePath)` — read a template file
  - `getNoteIndex()` — return all note names (for wikilink context)

**New file: `src/lib/vault/markdown-utils.ts`**
- `extractWikilinks(markdown)` — parse `[[Note Name]]` links
- `createWikilink(name, displayText?)` — generate wikilink string
- `extractFrontmatter(markdown)` — parse YAML frontmatter

### 4b. Vault preview component

**New file: `src/components/vault/vault-preview.tsx`**
- Shows vault directory tree for verification on campaign page
- Lists existing notes per directory

---

## Milestone 5: Agentic Note Generation

### 5a. Model factory

**New file: `src/lib/agent/model-factory.ts`**
- Uses `createOpenAI` from `@ai-sdk/openai` and `createAnthropic` from `@ai-sdk/anthropic`
- Takes provider/model/apiKey from settings → returns model instance
- API keys loaded from Stronghold (existing cached pattern in `openai-utils.ts`)

### 5b. Agent tools

**New file: `src/lib/agent/vault-tools.ts`**
- Defines tools for Vercel AI SDK `generateText` with tool calling:
  - `listNotes` — list notes in a directory
  - `readNote` — read note content
  - `searchNotes` — search vault content
  - `readTemplate` — read a template file
- Tools use `zod` schemas for parameter validation
- Tools call through `VaultService` from milestone 4

### 5c. Note generation orchestrator

**New file: `src/lib/agent/note-generator.ts`**

**Two-phase pipeline:**

**Phase 1 — Session Note Generation:**
- Input: transcript, campaign (with players, dmName, customSystemPrompt), vault note index
- System prompt includes: party members, campaign context, existing note names, wikilink instructions
- Uses `generateText` with `listNotes`, `readNote`, `searchNotes` tools and `maxSteps: 10`
- Output: session note markdown with `[[wikilinks]]`

**Phase 2 — Entity Updates:**
- Parse wikilinks from session note to identify mentioned entities
- For each entity, run `generateText` with `readNote`, `readTemplate` tools and `maxSteps: 5`
- LLM reads existing note, determines what changed, proposes update or new note
- Output: list of proposed creates/updates

### 5d. Prompts

**New file: `src/lib/agent/prompts.ts`**
- `buildSessionSystemPrompt(campaign, noteIndex)` — incorporates party, DM name, campaign's customSystemPrompt, note index, template structure
- `buildEntityUpdatePrompt(entityType, sessionNote)` — guides entity note creation/updates
- Reuse existing note structure from `src/lib/openai-utils.ts:generateNotes()` (Summary, Characters, Locations, Timeline, Key Clues, etc.)

### 5e. Preview & approval UI

**New file: `src/components/generation/generation-panel.tsx`**
- Progress display: "Reading existing notes...", "Generating session note...", "Updating character: X..."
- Preview of ALL proposed changes before writing
- User can approve all, approve selectively, or cancel
- On approval, writes changes via VaultService

**New file: `src/components/generation/note-preview.tsx`**
- Markdown preview of proposed notes
- Diff view for updates (old vs new)

**New file: `src/hooks/use-note-generation.ts`**
- Workflow state machine: idle → generating → reviewing → writing → complete
- Tracks progress, results, approval state

### 5f. Integration

**Modify `src/components/audio-upload/index.tsx`:**
- After current note generation completes, if campaign has a vault configured:
  - Offer "Generate Vault Notes" button (agentic pipeline)
  - Or integrate into the existing flow as an additional step

---

## Milestone 6: Polish

- Error handling: network failures, API errors, missing vault paths, invalid settings
- Loading states and progress indicators throughout
- Settings validation (required fields, valid paths)
- Consider `streamText` instead of `generateText` for real-time note preview during generation

---

## Future Milestones (Deferred)

### Local Whisper Support
- Bundle `whisper.cpp` CLI as a Tauri sidecar (no Python needed — C++ port)
- Add `@tauri-apps/plugin-shell` for running the sidecar
- Model files (~75MB-2.9GB) downloaded on first use to app data directory
- Also enables audio chunking via bundled `ffmpeg` sidecar for OpenAI's 25MB limit

---

## Files Summary

### New files
```
src/server/collections/campaign-vaults.ts    — TanStack DB collection for vault config
src/lib/vault/vault-service.ts               — Obsidian vault read/write operations
src/lib/vault/markdown-utils.ts              — Wikilink parsing, frontmatter extraction
src/lib/agent/model-factory.ts               — Multi-provider model instantiation
src/lib/agent/vault-tools.ts                 — AI SDK tool definitions for vault operations
src/lib/agent/note-generator.ts              — Two-phase agentic orchestrator
src/lib/agent/prompts.ts                     — System prompt templates
src/hooks/use-note-generation.ts             — Note generation workflow hook
src/components/generation/generation-panel.tsx — Generation progress + preview UI
src/components/generation/note-preview.tsx    — Markdown preview + diff view
src/components/vault/vault-preview.tsx        — Vault directory tree viewer
```

### Modified files
```
src/server/db/schema.ts                      — add customSystemPrompt + campaign_vaults table
src/types/index.ts                           — add CampaignVault type
src/routes/settings/index.tsx                — narrow to defaults + API keys only
src/routes/campaign/new.tsx                  — add vault config + customSystemPrompt
src/routes/campaign/$campaignId/index.tsx    — show vault status
src/components/header/edit-campaign-dialog.tsx — add vault config + customSystemPrompt editing
src/lib/openai-utils.ts                      — configurable model + customSystemPrompt injection
src/lib/el-labs-utils.ts                     — configurable transcription model
src/components/audio-upload/index.tsx        — integrate vault-based generation option
package.json                                 — add @ai-sdk/anthropic
```

---

## Verification Plan

**M1 (Schema + Settings):** Run `npm run db:generate`, verify migration SQL. Run `npm run tauri dev`, verify migration runs. Settings page shows provider/model defaults. API keys persist in Stronghold.

**M2 (Campaign Vault UI):** Create campaign with vault path and custom system prompt. Edit campaign — verify vault config persists. Campaign detail shows vault status.

**M3 (Transcription Models):** Change default transcription provider in settings. Transcribe audio — verify correct provider is used. Verify model name is configurable.

**M4 (Vault Integration):** Point campaign at an Obsidian vault. Verify vault preview shows correct structure. Test reading/listing notes from the app.

**M5 (Agentic Notes):** Transcribe a session, trigger vault note generation. Verify agent reads existing notes, generates session note with wikilinks, proposes entity updates. Review preview, approve, verify notes appear in Obsidian vault with correct wikilinks.

**M6 (Polish):** Test error scenarios: invalid API key, unreachable API, missing vault path, empty vault. Verify graceful error messages.
