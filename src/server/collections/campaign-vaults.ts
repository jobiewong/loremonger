import { createCollection, eq as eqDb } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useLiveQuery } from "@tanstack/react-db";
import { eq } from "drizzle-orm";
import { queryClient } from "~/server/collections";
import db from "~/server/db";
import { campaignVaults } from "~/server/db/schema";

const campaignVaultsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["campaignVaults"],
    queryClient: queryClient,
    queryFn: async () => {
      return await db.query.campaignVaults.findMany({
        with: {
          campaign: true,
        },
      });
    },
    getKey: (vault) => vault.id,
    onInsert: async ({ transaction }) => {
      const { modified: newVault } = transaction.mutations[0];
      await db.insert(campaignVaults).values(newVault);
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      await db
        .update(campaignVaults)
        .set(modified)
        .where(eq(campaignVaults.id, original.id));
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await db.delete(campaignVaults).where(eq(campaignVaults.id, original.id));
    },
  })
);

export const useCampaignVaults = () => {
  return useLiveQuery((q) =>
    q.from({ campaignVaults: campaignVaultsCollection })
  );
};

export const useCampaignVault = (campaignId: string) => {
  return useLiveQuery((q) =>
    q
      .from({ vault: campaignVaultsCollection })
      .where(({ vault }) => eqDb(vault.campaignId, campaignId))
      .findOne()
  );
};

export default campaignVaultsCollection;
