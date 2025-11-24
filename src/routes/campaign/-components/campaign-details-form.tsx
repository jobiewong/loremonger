import { IconFolder2, IconSquareInfo } from "central-icons";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod/v4";
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
import { MentionComponent } from "~/components/ui/mention";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { generateFileName } from "~/lib/utils";
import { campaignDetailsSchema } from "~/routes/campaign/new";

export function CampaignDetailsForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<z.infer<typeof campaignDetailsSchema>>;
  onSubmit: (values: z.infer<typeof campaignDetailsSchema>) => void;
}) {
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
              <FieldError errors={[fieldState.error]} />
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
                value={field.value ?? undefined}
                id="description"
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
              <FieldLabel htmlFor="dmName">Dungeon Master</FieldLabel>
              <Input {...field} id="dmName" placeholder="e.g. John Doe" />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="outputDirectory"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="outputDirectory">
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
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="outputDirectory"
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
                htmlFor="namingConvention"
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
                <div className="text-sm text-muted-foreground">
                  {generateFileName({
                    name: "Session Name",
                    number: 1,
                    campaign: {
                      name:
                        form.getValues().name === ""
                          ? "Campaign Name"
                          : form.getValues().name,
                      namingConvention: form.getValues().namingConvention,
                    },
                  })}
                </div>
              </FieldLabel>
              <MentionComponent
                trigger="{"
                inputValue={field.value ?? ""}
                onInputValueChange={(value) => {
                  form.setValue("namingConvention", value);
                }}
                options={[
                  { value: "campaignName}", label: "Campaign Name" },
                  { value: "sessionNumber}", label: "Session Number" },
                  { value: "sessionName}", label: "Session Name" },
                  { value: "currentDate}", label: "Current Date" },
                  { value: "currentTime}", label: "Current Time" },
                ]}
              />
              <FieldError errors={[fieldState.error]} />
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
