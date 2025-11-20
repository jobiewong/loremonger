import { createCollection, eq as eqDb } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useLiveQuery } from "@tanstack/react-db";
import { eq } from "drizzle-orm";
import { queryClient } from "~/server/collections";
import db from "~/server/db";
import { sessions } from "~/server/db/schema";

const sessionsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["sessions"],
    queryClient: queryClient,
    queryFn: async () => {
      return await db.query.sessions.findMany();
    },
    getKey: (session) => session.id,
    onInsert: async ({ transaction }) => {
      const { modified: newSession } = transaction.mutations[0];
      await db.insert(sessions).values(newSession);
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await db
        .update(sessions)
        .set(modified)
        .where(eq(sessions.id, original.id));
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await db.delete(sessions).where(eq(sessions.id, original.id));
    },
  })
);

export const useSessions = (campaignId: string | undefined) => {
  return useLiveQuery((q) =>
    q
      .from({ sessions: sessionsCollection })
      .where(({ sessions }) => eqDb(sessions.campaignId, campaignId))
  );
};

export default sessionsCollection;
