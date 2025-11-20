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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Character</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{campaign?.dmName}</TableCell>
                      <TableCell className="align-middle">
                        <Badge
                          variant="outline"
                          className="bg-orange-100 dark:bg-orange-900 -translate-y-px"
                        >
                          Dungeon Master
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {campaign?.players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.characterName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
          <section>
            <h2 className="px-4 mb-2 font-medium">Sessions</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions && sessions.length > 0 ? (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        {campaign?.id ? session.number : "-"}
                      </TableCell>
                      <TableCell>
                        <Link
                          disabled={!campaign?.id}
                          to={`/campaign/$campaignId/$sessionId`}
                          params={{
                            campaignId: campaign?.id ?? "",
                            sessionId: session.id,
                          }}
                          className="hover:underline"
                        >
                          {session.name ?? "-"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {format(session.createdAt, "d MMM, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="w-full text-center text-muted-foreground"
                    >
                      No sessions yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <CreateSessionDialog />
          </section>
        </Scroller>
      </div>
    </main>
  );
}
