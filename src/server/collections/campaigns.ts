import { createCollection, eq as eqDb } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useLiveQuery } from "@tanstack/react-db";
import { desc, eq } from "drizzle-orm";
import { queryClient } from "~/server/collections";
import db from "~/server/db";
import { campaigns } from "~/server/db/schema";

const campaignsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["campaigns"],
    queryClient: queryClient,
    queryFn: async () => {
      return await db.query.campaigns.findMany({
        orderBy: [desc(campaigns.updatedAt)],
        with: {
          players: true,
          sessions: true,
        },
      });
    },
    getKey: (campaign) => campaign.id,
    onInsert: async ({ transaction }) => {
      const { modified: newCampaign } = transaction.mutations[0];
      await db.insert(campaigns).values(newCampaign);
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await db
        .update(campaigns)
        .set(modified)
        .where(eq(campaigns.id, original.id));
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await db.delete(campaigns).where(eq(campaigns.id, original.id));
    },
  })
);

export const useCampaigns = () => {
  return useLiveQuery((q) => q.from({ campaigns: campaignsCollection }));
};

export const useCampaign = (id: string) => {
  return useLiveQuery((q) =>
    q
      .from({ campaign: campaignsCollection })
      .where(({ campaign }) => eqDb(campaign.id, id))
      .findOne()
  );
};

export default campaignsCollection;
