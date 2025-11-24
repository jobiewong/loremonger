import { zodResolver } from "@hookform/resolvers/zod";
import { useMatches, useRouter } from "@tanstack/react-router";
import { documentDir } from "@tauri-apps/api/path";
import { IconSquareInfo } from "central-icons";
import { useEffect } from "react";
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
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { campaignDetailsSchema } from "~/routes/campaign/new";
import campaignsCollection, {
  useCampaign,
} from "~/server/collections/campaigns";

export function EditCampaignDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const matches = useMatches();
  const isOnCampaignPage = matches.find(
    (match) => match.routeId === "/campaign/$campaignId/"
  );
  const isOnSessionPage = matches.find(
    (match) => match.routeId === "/campaign/$campaignId/$sessionId/"
  );
  const campaign = isOnCampaignPage?.loaderData?.campaign;
  const session = isOnSessionPage?.loaderData?.session;
  const { data: sessionCampaign } = useCampaign(session?.campaignId ?? "");
  const router = useRouter();

  const form = useForm<z.infer<typeof campaignDetailsSchema>>({
    resolver: zodResolver(campaignDetailsSchema),
    defaultValues: {
      name: campaign?.name,
      dmName: campaign?.dmName,
      description: campaign?.description ?? undefined,
      outputDirectory: campaign?.outputDirectory ?? undefined,
      namingConvention: campaign?.namingConvention ?? undefined,
    },
  });

  useEffect(() => {
    const campaignData = campaign ?? sessionCampaign;
    if (campaignData) {
      form.reset({
        name: campaignData.name ?? "",
        dmName: campaignData.dmName,
        description: campaignData.description ?? "",
        outputDirectory: campaignData.outputDirectory ?? "",
        namingConvention: campaignData.namingConvention ?? "",
      });
    }
  }, [campaign, sessionCampaign]);

  function onSubmit(values: z.infer<typeof campaignDetailsSchema>) {
    const campaignId = campaign?.id ?? sessionCampaign?.id;
    if (!campaignId) {
      toast.error("Campaign not found");
      return;
    }

    campaignsCollection.update(campaignId, (draft) => {
      draft.name = values.name;
      draft.dmName = values.dmName;
      draft.description = values.description || null;
      draft.outputDirectory = values.outputDirectory || null;
      draft.namingConvention =
        values.namingConvention ?? "{currentDate}-{currentTime}_notes.md";
      draft.updatedAt = new Date().toISOString();
    });

    toast.success("Campaign updated", {
      description: values.name,
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
            Update the details for {campaign?.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet className="mb-4 px-6">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-name">Campaign Name</FieldLabel>
                  <Input
                    {...field}
                    id="edit-name"
                    placeholder="e.g. Waterdeep Heist"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    id="edit-description"
                    className="min-h-[5em] resize-none"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="dmName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-dmName">Dungeon Master</FieldLabel>
                  <Input
                    {...field}
                    id="edit-dmName"
                    placeholder="e.g. John Doe"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="outputDirectory"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-outputDirectory"
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      Output Directory{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <IconSquareInfo className="size-4 opacity-60 hover:opacity-100" />
                        </TooltipTrigger>
                        <TooltipContent
                          className="max-w-xs space-y-2"
                          classNames={{
                            arrow: "translate-y-[calc(50%-2px)]",
                          }}
                        >
                          Determines the directory where session notes will be
                          saved. If undefined, you will be prompted to select a
                          directory every time you generate notes.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <button
                      type="button"
                      className="hover:underline text-xs text-muted-foreground cursor-pointer"
                      onClick={async () => {
                        const defaultDir = await documentDir();
                        form.setValue("outputDirectory", defaultDir);
                      }}
                    >
                      Default
                    </button>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="edit-outputDirectory"
                    placeholder="e.g. /path/to/output"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="namingConvention"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="edit-namingConvention"
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      Naming Convention{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <IconSquareInfo className="size-4 opacity-60 hover:opacity-100" />
                        </TooltipTrigger>
                        <TooltipContent
                          className="max-w-xs space-y-2"
                          classNames={{
                            arrow: "translate-y-[calc(50%-2px)]",
                          }}
                        >
                          <p>
                            Determines the generated file name for each session
                            note. The following variables are available:
                          </p>
                          <ul className="list-disc list-inside marker:text-accent-500">
                            <li>{`{campaignName}`}</li>
                            <li>{`{sessionNumber}`}</li>
                            <li>{`{sessionName}`}</li>
                            <li>{`{currentDate}`}</li>
                            <li>{`{currentTime}`}</li>
                          </ul>
                          <p>
                            If undefined, the default is{" "}
                            <b>{`{currentDate}-{currentTime}_notes.md`}</b>.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <button
                      type="button"
                      className="hover:underline text-xs text-muted-foreground cursor-pointer"
                      onClick={() =>
                        form.setValue(
                          "namingConvention",
                          "{currentDate}-{currentTime}_notes.md"
                        )
                      }
                    >
                      Default
                    </button>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="edit-namingConvention"
                    placeholder="e.g. {campaignName}-{sessionNumber}"
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
