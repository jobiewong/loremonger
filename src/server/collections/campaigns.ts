import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { eq } from "drizzle-orm";
import { queryClient } from "~/server/collections";
import db from "~/server/db";
import { campaigns } from "~/server/db/schema";

const campaignsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["campaigns"],
    queryClient: queryClient,
    queryFn: async () => {
      return await db.query.campaigns.findMany();
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

export default campaignsCollection;
