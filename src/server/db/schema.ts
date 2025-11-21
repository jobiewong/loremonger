import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  dmName: text("dm_name").notNull(),
  description: text("description"),
  outputDirectory: text("output_directory"),
  namingConvention: text("naming_convention"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const campaignRelations = relations(campaigns, ({ many }) => ({
  players: many(players),
  sessions: many(sessions),
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
  campaignId: text("campaign_id").references(() => campaigns.id),
  number: integer("number").notNull(),
  name: text("name"),
  duration: integer("duration").notNull(),
  wordCount: integer("word_count"),
  noteWordCount: integer("note_word_count"),
  filePath: text("file_path").notNull(),
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
