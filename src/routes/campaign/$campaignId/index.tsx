import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { Scroller } from "~/components/ui/scroller";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { isEmpty } from "~/lib/utils";
import { CampaignPartyTable } from "~/routes/campaign/$campaignId/-components/campaign-party-table";
import { CampaignSessionTable } from "~/routes/campaign/$campaignId/-components/campaign-session-table";
import { CreateSessionDialog } from "~/routes/campaign/-components/create-session-dialog";
import campaignsCollection from "~/server/collections/campaigns";
import { usePlayers } from "~/server/collections/players";
import { useSessions } from "~/server/collections/sessions";

export const Route = createFileRoute("/campaign/$campaignId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const campaign = await campaignsCollection.get(params.campaignId);
    return { campaign };
  },
});

function RouteComponent() {
  const { campaign } = useLoaderData({ from: Route.id });
  const { data: sessions } = useSessions(campaign?.id);

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper overflow-hidden justify-start! items-start!">
        <Scroller className="size-full overflow-x-hidden py-8 space-y-6">
          <section className="border-b pb-4 px-4 w-full">
            <h1 className="text-2xl font-bold">{campaign?.name}</h1>
            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="bg-accent">
                    {format(
                      new Date(campaign?.createdAt ?? new Date()),
                      "d MMM, yyyy"
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">Created At</TooltipContent>
              </Tooltip>
            </div>
          </section>
          {!isEmpty(campaign?.description) && (
            <section className="px-4">
              <p className="text-sm">{campaign?.description}</p>
            </section>
          )}
          <section>
            {campaign && campaign.players.length > 0 && (
              <div>
                <h2 className="px-4 mb-2 font-medium">
                  Players{" "}
                  <span className="text-muted-foreground">
                    ({campaign.players.length})
                  </span>
                </h2>
                <CampaignPartyTable campaign={campaign} />
              </div>
            )}
          </section>
          <section>
            <h2 className="px-4 mb-2 font-medium">Sessions</h2>
            <CampaignSessionTable sessions={sessions} />
            <CreateSessionDialog />
          </section>
        </Scroller>
      </div>
    </main>
  );
}
