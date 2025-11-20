import { IconCrossMedium, IconPeopleAdd } from "central-icons";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { partyMembersSchema } from "~/routes/campaign/new";

export function PartyMembersForm({
  partyMembers,
  setPartyMembers,
}: {
  partyMembers: z.infer<typeof partyMembersSchema>[];
  setPartyMembers: (partyMembers: z.infer<typeof partyMembersSchema>[]) => void;
}) {
  const form = useForm<z.infer<typeof partyMembersSchema>>();
  function handleSubmit(values: z.infer<typeof partyMembersSchema>) {
    setPartyMembers([...partyMembers, values]);
  }

  return (
    <form
      className="w-full mt-4 space-y-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ul className="border-y -mx-4 w-[calc(100%+2rem)] space-y-2">
        {partyMembers.length > 0 ? (
          partyMembers.map((member) => (
            <PartyMemberItem key={member.id} member={member} />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No party members added yet.
          </p>
        )}
      </ul>
      <FieldSet>
        <FieldLegend>Party Members</FieldLegend>
        <FieldDescription>
          Enter the names of the players in your campaign. This will help the
          transcriber identify the players during sessions.
        </FieldDescription>
        <Controller
          name="playerName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="playerName">Player Name</FieldLabel>
              <Input {...field} id="playerName" placeholder="e.g. Jane Doe" />
            </Field>
          )}
        />
        <Controller
          name="characterName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="characterName">Character Name</FieldLabel>
              <Input {...field} id="characterName" placeholder="e.g. Aelith" />
            </Field>
          )}
        />
      </FieldSet>
      <Button className="w-full">
        <IconPeopleAdd />
        Create Player
      </Button>
    </form>
  );
}

function PartyMemberItem({
  member,
}: {
  member: z.infer<typeof partyMembersSchema>;
}) {
  return (
    <li
      className="text-sm flex items-center justify-between px-4 py-2"
      key={member.id}
    >
      <div>
        <p className="font-bold">{member.characterName}</p>
        <p className="text-muted-foreground">{member.playerName}</p>
      </div>
      <Button variant="ghost" size="icon">
        <IconCrossMedium />
      </Button>
    </li>
  );
}
