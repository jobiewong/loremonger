import { zodResolver } from "@hookform/resolvers/zod";
import { useMatches, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { LinesPattern } from "~/components/patterns/lines";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import sessionsCollection from "~/server/collections/sessions";

const formSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export function EditSessionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const matches = useMatches();
  const isOnSessionPage = matches.find(
    (match) => match.routeId === "/campaign/$campaignId/$sessionId/"
  );
  const session = isOnSessionPage?.loaderData?.session;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.name ?? "",
      date: session?.date ?? "",
    },
  });

  useEffect(() => {
    if (session) {
      form.reset({
        name: session.name ?? "",
        date: session.date ?? "",
      });
    }
  }, [session]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      toast.error("Session not found");
      return;
    }

    sessionsCollection.update(session.id, (draft) => {
      draft.name = values.name;
      draft.date = values.date;
      draft.updatedAt = new Date().toISOString();
    });

    toast.success("Session updated", {
      description: `${values.name}: ${values.date}`,
    });
    router.invalidate();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto px-0 pb-0">
        <DialogHeader className="px-6">
          <DialogTitle>Edit Campaign</DialogTitle>
          <DialogDescription>
            Update the details for {session?.name ?? "this session"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet className="mb-4 px-6">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-name">Session Name</FieldLabel>
                  <Input
                    {...field}
                    id="edit-name"
                    placeholder="e.g. Into the Mines of Moria"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-date">Date</FieldLabel>
                  <DatePicker
                    id="edit-date"
                    initialValue={
                      field.value ? new Date(field.value) : new Date()
                    }
                    onChange={(date) => {
                      const dateString = (
                        date as unknown as Date | undefined
                      )?.toISOString();
                      field.onChange(dateString ?? undefined);
                    }}
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
            <LinesPattern className="-z-1 pointer-events-none absolute inset-0 text-muted-foreground/10" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
