import { InferSelectModel } from "drizzle-orm";
import { campaigns } from "~/server/db/schema";

export type Player = {
  name: string;
  playerName: string;
  type: "player" | "gm";
};

export type Campaign = InferSelectModel<typeof campaigns>;
