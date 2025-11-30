import { useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Field, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Route } from "~/routes/campaign/$campaignId/$sessionId";

export function DeleteContentDialog() {
  const [open, setOpen] = useState(false);
  const { session } = useLoaderData({ from: Route.id });
  const [inputValue, setInputValue] = useState<string>("");

  async function handleDelete() {
    toast.info("This is where the deletion logic will go");
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Delete Session Content
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete all session metadata, transcripts, and audio files.
            Any exported notes will <b className="text-foreground">not</b> be
            deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <FieldSet>
          <Field>
            <FieldLabel>Type the session name below to confirm</FieldLabel>
            <Input readOnly value={session?.name ?? "-"} disabled />
          </Field>
          <Field>
            <FieldLabel>Session Name</FieldLabel>
            <Input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Into the Mines of Moria"
            />
          </Field>
        </FieldSet>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setOpen(false);
              setInputValue("");
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleDelete}>
            <Button
              variant="destructive"
              className="text-foreground"
              disabled={inputValue !== session?.name}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
