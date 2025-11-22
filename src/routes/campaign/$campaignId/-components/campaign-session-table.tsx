import { Link } from "@tanstack/react-router";
import { IconCrossMedium } from "central-icons";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
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
import sessionsCollection from "~/server/collections/sessions";
import { Session } from "~/types";

export function CampaignSessionTable({ sessions }: { sessions: Session[] }) {
  function handleDeleteSession(sessionId: string) {
    sessionsCollection.delete(sessionId);
  }

  return (
    <Table className="table-auto max-w-full overflow-x-hidden">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-20">Date</TableHead>
          <TableHead className="text-right w-[60px]">Duration</TableHead>
          <TableHead className="p-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.number}</TableCell>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <TableCell className="max-w-42 truncate">
                    <Link
                      disabled={!session.campaignId}
                      to={`/campaign/$campaignId/$sessionId`}
                      params={{
                        campaignId: session.campaignId ?? "",
                        sessionId: session.id,
                      }}
                      className="hover:underline"
                    >
                      {session.name ?? "-"}
                    </Link>
                  </TableCell>
                </TooltipTrigger>
                <TooltipContent
                  disabled={session.name === null || session.name.length < 20}
                >
                  {session.name ?? "-"}
                </TooltipContent>
              </Tooltip>
              <TableCell>{format(session.createdAt, "d MMM, yyyy")}</TableCell>
              <TableCell className="text-right">
                {session.duration ? session.duration.toFixed(2) : "-"}s
              </TableCell>
              <TableCell className="w-6 px-0 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="size-6"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  <IconCrossMedium />
                </Button>
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
  );
}
