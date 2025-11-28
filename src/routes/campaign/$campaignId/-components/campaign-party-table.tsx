import { IconCrossMedium } from "central-icons";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import playersCollection, { usePlayers } from "~/server/collections/players";
import { Campaign, Player } from "~/types";

interface CampaignWithPlaters extends Campaign {
  players: Player[];
}

export function CampaignPartyTable({
  campaign,
}: {
  campaign: CampaignWithPlaters;
}) {
  const { data: players } = usePlayers(campaign?.id);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Character</TableHead>
          <TableHead className="w-6 px-0 text-right" />
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
        {players.map((player) => (
          <TableRow key={player.id} className="group">
            <TableCell>{player.playerName}</TableCell>
            <TableCell>{player.characterName}</TableCell>
            <TableCell className="w-6 px-0 text-right">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  playersCollection.delete(player.id);
                  toast.success(`${player.playerName} removed from campaign`);
                }}
              >
                <IconCrossMedium />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
