import { Link } from "@tanstack/react-router";
import { TimeAgo } from "~/components/time-ago";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCampaigns } from "~/server/collections/campaigns";

export function CampaignListTable() {
  const { data: campaigns } = useCampaigns();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Dungeon Master</TableHead>
          <TableHead className="text-right">Sessions</TableHead>
          <TableHead className="text-right">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns?.map((campaign) => {
          return (
            <TableRow key={campaign.id}>
              <TableCell>
                <Link
                  to="/campaign/$campaignId"
                  params={{ campaignId: campaign.id }}
                  className="hover:underline"
                >
                  {campaign.name}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {campaign.dmName}
              </TableCell>
              <TableCell className="text-right">
                {campaign.sessions.length}
              </TableCell>
              <TableCell className="text-right">
                {campaign.updatedAt ? (
                  <TimeAgo
                    date={new Date(campaign.updatedAt)}
                    timeStyle="long"
                    className="text-inherit"
                  />
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
