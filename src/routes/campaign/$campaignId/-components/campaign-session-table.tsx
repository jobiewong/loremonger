import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Session } from "~/types";

export function CampaignSessionTable({ sessions }: { sessions: Session[] }) {
  return (
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
              <TableCell>{session.number}</TableCell>
              <TableCell>
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
              <TableCell>{format(session.createdAt, "d MMM, yyyy")}</TableCell>
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
