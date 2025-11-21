import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { IconPlusSmall } from "central-icons";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { generateId } from "~/lib/utils";
import { Route } from "~/routes/campaign/$campaignId";
import sessionsCollection, { useSessions } from "~/server/collections/sessions";
import { sessions } from "~/server/db/schema";

const formSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export function CreateSessionDialog() {
  const { campaign } = useLoaderData({ from: Route.id });
  console.log("🚀 ~ CreateSessionDialog ~ campaign:", campaign);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Session",
      date: new Date().toISOString(),
    },
  });
  const navigate = useNavigate();

  function handleCreateSession(values: z.infer<typeof formSchema>) {
    console.log("fire");
    if (!campaign) {
      toast.error("Current campaign not found");
      return;
    }
    const id = generateId();
    const session = sessionsCollection.insert({
      id,
      campaignId: campaign?.id,
      name: values.name,
      date: values.date,
      number: campaign.sessions.length + 1,
      duration: 0,
      filePath: "", // TODO: Implement file path
      wordCount: null,
      noteWordCount: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    navigate({
      to: "/campaign/$campaignId/$sessionId",
      params: { campaignId: campaign?.id, sessionId: id },
    });

    toast.success(`Session created`, {
      description: values.name,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="mt-4 w-full">
          <IconPlusSmall />
          Create Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={form.handleSubmit(handleCreateSession)}
          className="flex flex-col gap-4"
        >
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2">
              {campaign?.sessions && (
                <Badge variant="outline">#{campaign.sessions.length + 1}</Badge>
              )}
              Create Session
            </DialogTitle>
            <DialogDescription>
              Create a session for {campaign?.name ?? "your campaign"}.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FieldSet>
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Session Date</FieldLabel>
                    <Input {...field} type="date" />
                  </Field>
                )}
              />
            </FieldSet>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
