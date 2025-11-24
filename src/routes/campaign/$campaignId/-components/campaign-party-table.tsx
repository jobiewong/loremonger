import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Campaign, Player } from "~/types";

interface CampaignWithPlaters extends Campaign {
  players: Player[];
}

export function CampaignPartyTable({
  campaign,
}: {
  campaign: CampaignWithPlaters;
}) {
  return (
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
  );
}
