import { defineConfig } from "drizzle-kit";

// Note: For Tauri apps, the database path is determined at runtime.
// This config is mainly for type generation and development.
// For production, migrations should be run programmatically in the app.
export default defineConfig({
  out: "./src-tauri/migrations",
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  verbose: false,
  strict: true,
});
