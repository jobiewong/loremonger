import { zodResolver } from "@hookform/resolvers/zod";
import { useMatches, useRouter } from "@tanstack/react-router";
import { documentDir } from "@tauri-apps/api/path";
import { IconPlusSmall, IconSquareInfo } from "central-icons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { LinesPattern } from "~/components/patterns/lines";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { generateId } from "~/lib/utils";
import { partyMembersSchema } from "~/routes/campaign/new";
import playersCollection from "~/server/collections/players";
import { Campaign } from "~/types";

export function CreatePartyMemberDialog({ campaign }: { campaign: Campaign }) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof partyMembersSchema>>({
    resolver: zodResolver(partyMembersSchema),
    defaultValues: {
      id: "",
      playerName: "",
      characterName: "",
    },
  });

  function onSubmit(values: z.infer<typeof partyMembersSchema>) {
    if (!campaign) {
      toast.error("Campaign not found");
      return;
    }
    const id = generateId();
    playersCollection.insert({
      ...values,
      id,
      campaignId: campaign.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast.success(`${values.playerName} added to campaign`);
    router.invalidate();
    setOpen(false);
    form.reset({
      id: "",
      playerName: "",
      characterName: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="mt-4 w-full">
          <IconPlusSmall /> Create Party Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto px-0 pb-0">
        <DialogHeader className="px-6">
          <DialogTitle>Create Party Member</DialogTitle>
          <DialogDescription>
            Create a new party member for {campaign?.name ?? "your campaign"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet className="mb-4 px-6">
            <Controller
              name="playerName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-playerName">Player Name</FieldLabel>
                  <Input
                    {...field}
                    id="edit-playerName"
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
                  <FieldLabel htmlFor="edit-characterName">
                    Character Name
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="edit-characterName"
                    placeholder="e.g. Aelith"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldSet>
          <DialogFooter className="sticky isolate px-6 bottom-0 left-0 w-full bg-background py-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
            <LinesPattern className="-z-1 pointer-events-none absolute inset-0 text-muted-foreground/10" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
