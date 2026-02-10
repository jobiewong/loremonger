import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  dmName: text("dm_name").notNull(),
  description: text("description"),
  outputDirectory: text("output_directory"),
  namingConvention: text("naming_convention")
    .notNull()
    .default("{currentDate}-{currentTime}_notes.md"),
  customSystemPrompt: text("custom_system_prompt"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const campaignRelations = relations(campaigns, ({ many, one }) => ({
  players: many(players),
  sessions: many(sessions),
  vault: one(campaignVaults),
}));

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  playerName: text("player_name").notNull(),
  characterName: text("character_name").notNull(),
  campaignId: text("campaign_id").references(() => campaigns.id),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const playerRelations = relations(players, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [players.campaignId],
    references: [campaigns.id],
  }),
}));

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .references(() => campaigns.id)
    .notNull(),
  number: integer("number").notNull(),
  name: text("name"),
  duration: real("duration").notNull().default(0),
  wordCount: integer("word_count"),
  noteWordCount: integer("note_word_count"),
  filePath: text("file_path"),
  date: text("date").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [sessions.campaignId],
    references: [campaigns.id],
  }),
}));

export const campaignVaults = sqliteTable("campaign_vaults", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .references(() => campaigns.id)
    .notNull()
    .unique(),
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

export const campaignVaultRelations = relations(campaignVaults, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignVaults.campaignId],
    references: [campaigns.id],
  }),
}));
