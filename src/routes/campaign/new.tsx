import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createInsertSchema } from "drizzle-zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { AlertDialog } from "~/components/ui/alert-dialog";

import { Scroller } from "~/components/ui/scroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { generateId } from "~/lib/utils";
import { CampaignDetailsForm } from "~/routes/campaign/-components/campaign-details-form";
import { NoPlayerAlertDialog } from "~/routes/campaign/-components/no-player-alert-dialog";
import { PartyMembersForm } from "~/routes/campaign/-components/party-members-form";
import campaignsCollection from "~/server/collections/campaigns";
import playersCollection from "~/server/collections/players";

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
  const navigate = useNavigate();
  const [noPlayerAlertDialogOpen, setNoPlayerAlertDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof campaignDetailsSchema>>({
    resolver: zodResolver(campaignDetailsSchema),
    defaultValues: {
      id: "",
      name: "",
      dmName: "",
    },
  });
  console.log(form.formState.errors);

  function submitCampaignForm(values: z.infer<typeof campaignDetailsSchema>) {
    if (partyMembers.length === 0) {
      setNoPlayerAlertDialogOpen(true);
      return;
    } else {
      handleCreateCampaign(values);
    }
  }

  function handleCreateCampaign(values: z.infer<typeof campaignDetailsSchema>) {
    const id = generateId();
    const date = new Date().toISOString();

    campaignsCollection.insert({
      ...values,
      id,
      description: values.description ?? null,
      outputDirectory: values.outputDirectory ?? null,
      namingConvention: values.namingConvention ?? null,
      createdAt: date,
      updatedAt: date,
    });

    for (const player of partyMembers) {
      playersCollection.insert({
        ...player,
        campaignId: id,
        createdAt: date,
        updatedAt: date,
      });
    }

    toast.success(`Campaign created`, {
      description: values.name,
    });
    navigate({ to: "/campaign/$id", params: { id } });
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
              <CampaignDetailsForm form={form} onSubmit={submitCampaignForm} />
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
      <NoPlayerAlertDialog
        open={noPlayerAlertDialogOpen}
        setOpen={setNoPlayerAlertDialogOpen}
        onConfirm={() => handleCreateCampaign(form.getValues())}
      />
    </main>
  );
}
