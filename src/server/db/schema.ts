import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  dmName: text("dm_name").notNull(),
  description: text("description").notNull(),
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
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  playerName: text("player_name").notNull(),
  characterName: text("character_name").notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const playerRelations = relations(players, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [players.campaignId],
    references: [campaigns.id],
  }),
}));

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  date: text("date").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [sessions.campaignId],
    references: [campaigns.id],
  }),
}));
