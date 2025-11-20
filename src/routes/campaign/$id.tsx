import { createFileRoute, useLoaderData } from "@tanstack/react-router";
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
import campaignsCollection from "~/server/collections/campaigns";
import { usePlayers } from "~/server/collections/players";

export const Route = createFileRoute("/campaign/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const campaign = await campaignsCollection.get(params.id);
    return { campaign };
  },
});

function RouteComponent() {
  const { campaign } = useLoaderData({ from: Route.id });
  console.log("🚀 ~ RouteComponent ~ campaign:", campaign);
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper overflow-hidden justify-start! items-start!">
        <Scroller className="size-full overflow-x-hidden py-8 space-y-4">
          <div className="border-b pb-4 px-4 w-full">
            <h1 className="text-2xl font-bold">{campaign?.name}</h1>
            <div>
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
          </div>
          <div>
            {campaign && campaign.players.length > 0 && (
              <div>
                <h2 className="px-4 mb-2">Players</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Character</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
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
          </div>
        </Scroller>
      </div>
    </main>
  );
}
