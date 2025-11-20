import { IconFolder2, IconSquareInfo } from "central-icons";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
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
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { campaignDetailsSchema } from "~/routes/campaign/new";

export function CampaignDetailsForm({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof campaignDetailsSchema>) => void;
}) {
  const form = useForm<z.infer<typeof campaignDetailsSchema>>();
  return (
    <form
      className="w-full mt-4 space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldSet>
        <FieldLegend>Campaign Details</FieldLegend>
        <FieldDescription>
          Enter the basic details about your campaign. This will determine where
          sessions notes are saved.
        </FieldDescription>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Campaign Name</FieldLabel>
              <Input {...field} id="name" placeholder="e.g. Waterdeep Heist" />
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                className="min-h-[5em] resize-none"
              />
            </Field>
          )}
        />
        <Controller
          name="dmName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="dmName">Dungeon Master</FieldLabel>
              <Input {...field} id="dmName" placeholder="e.g. John Doe" />
            </Field>
          )}
        />
        <Controller
          name="outputDirectory"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="outputDirectory">
                Output Directory
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="outputDirectory"
                placeholder="e.g. /path/to/output"
              />
            </Field>
          )}
        />
        <Controller
          name="namingConvention"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="namingConvention">
                Naming Convention{" "}
                <Tooltip>
                  <TooltipTrigger>
                    <IconSquareInfo className="size-4 opacity-60 hover:opacity-100" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs space-y-2">
                    <p>
                      Determines the generated file name for each session note.
                      The following variables are available:
                    </p>
                    <ul className="list-disc list-inside marker:text-accent-500">
                      <li>{`{campaignName}`}</li>
                      <li>{`{sessionNumber}`}</li>
                      <li>{`{currentDate}`}</li>
                      <li>{`{currentTime}`}</li>
                    </ul>
                    <p>
                      If undefined, the default is{" "}
                      <b>{`{currentDate}-{currentTime}_notes.md`}</b>.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="namingConvention"
                placeholder="e.g. {campaignName}-{sessionNumber}"
              />
            </Field>
          )}
        />
      </FieldSet>
      <Button type="submit" className="w-full">
        <IconFolder2 />
        Create Campaign
      </Button>
    </form>
  );
}
