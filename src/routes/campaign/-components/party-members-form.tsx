import { zodResolver } from "@hookform/resolvers/zod";
import { IconCrossMedium, IconPeopleAdd } from "central-icons";
import { useRef } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { generateId } from "~/lib/utils";
import { partyMembersSchema } from "~/routes/campaign/new";
import { Setter } from "~/types";

export function PartyMembersForm({
  partyMembers,
  setPartyMembers,
}: {
  partyMembers: z.infer<typeof partyMembersSchema>[];
  setPartyMembers: Setter<z.infer<typeof partyMembersSchema>[]>;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof partyMembersSchema>>({
    resolver: zodResolver(partyMembersSchema),
    defaultValues: {
      id: "",
      playerName: "",
      characterName: "",
    },
  });
  function handleSubmit(values: z.infer<typeof partyMembersSchema>) {
    const id = generateId();
    setPartyMembers((prev) => [...prev, { ...values, id }]);
    form.reset({
      id: "",
      playerName: "",
      characterName: "",
    });
    nameRef.current?.focus();
  }

  return (
    <form
      className="w-full mt-4 space-y-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Character</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {partyMembers.length > 0 ? (
            partyMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.playerName}</TableCell>
                <TableCell>{member.characterName}</TableCell>
                <TableCell className="w-6 px-0 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="size-6"
                    onClick={() =>
                      setPartyMembers((prev) =>
                        prev.filter((m) => m.id !== member.id)
                      )
                    }
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
                No party members added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
              <Input
                {...field}
                ref={nameRef}
                id="playerName"
                placeholder="e.g. Jane Doe"
              />
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
      <Button className="w-full" type="submit">
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
      className="text-sm flex items-center justify-between pl-4"
      key={member.id}
    >
      <div className="flex flex-col gap-1">
        <p className="font-bold">
          {member.characterName}
          <Badge variant="outline" className="ml-2 text-xs">
            {member.playerName}
          </Badge>
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-fit p-2"
        onClick={() =>
          setPartyMembers((prev) => prev.filter((m) => m.id !== member.id))
        }
      >
        <IconCrossMedium />
      </Button>
    </li>
  );
}
