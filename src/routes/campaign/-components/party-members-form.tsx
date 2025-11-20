import { zodResolver } from "@hookform/resolvers/zod";
import { IconCrossMedium, IconPeopleAdd } from "central-icons";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
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
import { Setter } from "~/types";

export function PartyMembersForm({
  partyMembers,
  setPartyMembers,
}: {
  partyMembers: z.infer<typeof partyMembersSchema>[];
  setPartyMembers: Setter<z.infer<typeof partyMembersSchema>[]>;
}) {
  const form = useForm<z.infer<typeof partyMembersSchema>>({
    resolver: zodResolver(partyMembersSchema),
    defaultValues: {
      playerName: "",
      characterName: "",
    },
  });
  function handleSubmit(values: z.infer<typeof partyMembersSchema>) {
    setPartyMembers((prev) => [...prev, values]);
    form.reset({
      playerName: "",
      characterName: "",
    });
  }

  return (
    <form
      className="w-full mt-4 space-y-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <ul className="border-y -mx-4 w-[calc(100%+2rem)] space-y-2">
        {partyMembers.length > 0 ? (
          partyMembers.map((member) => (
            <PartyMemberItem
              key={member.id}
              member={member}
              setPartyMembers={setPartyMembers}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-2">
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
              <FieldError errors={[fieldState.error]} />
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
              <FieldError errors={[fieldState.error]} />
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
  setPartyMembers,
}: {
  member: z.infer<typeof partyMembersSchema>;
  setPartyMembers: Setter<z.infer<typeof partyMembersSchema>[]>;
}) {
  return (
    <li
      className="text-sm flex items-center justify-between px-4 py-2"
      key={member.id}
    >
      <div className="flex flex-col gap-1">
        <p className="font-bold">{member.characterName}</p>
        <Badge variant="outline">{member.playerName}</Badge>
      </div>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() =>
          setPartyMembers((prev) => prev.filter((m) => m.id !== member.id))
        }
      >
        <IconCrossMedium />
      </Button>
    </li>
  );
}
