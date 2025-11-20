import { createFileRoute } from "@tanstack/react-router";
import { createInsertSchema } from "drizzle-zod";
import { useState } from "react";
import { z } from "zod/v4";

import { Scroller } from "~/components/ui/scroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CampaignDetailsForm } from "~/routes/campaign/-components/campaign-details-form";
import { PartyMembersForm } from "~/routes/campaign/-components/party-members-form";

import { campaigns, players } from "~/server/db/schema";

export const Route = createFileRoute("/campaign/new")({
  component: RouteComponent,
});

export const campaignDetailsSchema = createInsertSchema(campaigns, {
  name: (schema) => schema.min(1, "Campaign name is required"),
  dmName: (schema) => schema.min(1, "Dungeon master name is required"),
});
export const partyMembersSchema = createInsertSchema(players, {
  playerName: (schema) => schema.min(2, "Player name must be at least 2 chars"),
  characterName: (schema) =>
    schema.min(2, "Character name must be at least 2 chars"),
});

function RouteComponent() {
  const [partyMembers, setPartyMembers] = useState<
    z.infer<typeof partyMembersSchema>[]
  >([]);

  function handleCreateCampaign(values: z.infer<typeof campaignDetailsSchema>) {
    console.log(values);
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper justify-start! overflow-hidden">
        <Scroller className="size-full max-h-[calc(100vh-var(--header-height))] overflow-x-hidden py-8 px-4">
          <h1 className="text-2xl font-bold">New Campaign</h1>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="-mx-4 w-[calc(100%+2rem+2px)] -translate-x-px">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="party">
                Party
                {partyMembers.length > 0 && (
                  <span className="text-muted-foreground">
                    ({partyMembers.length})
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <CampaignDetailsForm onSubmit={handleCreateCampaign} />
            </TabsContent>
            <TabsContent value="party">
              <PartyMembersForm
                partyMembers={partyMembers}
                setPartyMembers={setPartyMembers}
              />
            </TabsContent>
          </Tabs>
        </Scroller>
      </div>
    </main>
  );
}
