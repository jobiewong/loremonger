import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useLiveQuery } from "@tanstack/react-db";
import { eq } from "drizzle-orm";
import { queryClient } from "~/server/collections";
import db from "~/server/db";
import { players } from "~/server/db/schema";

const playersCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["players"],
    queryClient: queryClient,
    queryFn: async () => {
      return await db.query.players.findMany();
    },
    getKey: (player) => player.id,
    onInsert: async ({ transaction }) => {
      const { modified: newPlayer } = transaction.mutations[0];
      await db.insert(players).values(newPlayer);
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await db.update(players).set(modified).where(eq(players.id, original.id));
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await db.delete(players).where(eq(players.id, original.id));
    },
  })
);

export const usePlayers = () => {
  return useLiveQuery((q) => q.from({ players: playersCollection }));
};

export default playersCollection;
