import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { IconFloppyDisk1 as IconFloppyDisk } from "central-icons";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { Loader } from "~/components/loader";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useStronghold } from "~/hooks/use-stronghold";
import { insertRecord } from "~/lib/stronghold";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

const formSchema = z.object({
  transcriptionService: z.enum(["elevenlabs", "openai"]),
  transcriptionModel: z.string().optional(),
  noteGenerationProvider: z.enum(["openai", "anthropic"]),
  noteGenerationModel: z.string().optional(),
  elevenLabsApiKey: z.string().optional(),
  openaiApiKey: z.string(),
  anthropicApiKey: z.string().optional(),
});

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transcriptionService: "openai",
      transcriptionModel: "",
      noteGenerationProvider: "openai",
      noteGenerationModel: "",
      openaiApiKey: "",
      elevenLabsApiKey: "",
      anthropicApiKey: "",
    },
  });
  const { client, stronghold, isLoading, error } = useStronghold();

  async function handleSave(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Saving settings...");
    try {
      if (!client || !stronghold) {
        throw new Error("Client or stronghold not found");
      }
      const store = client.getStore();

      // Save API keys
      if (values.openaiApiKey !== "") {
        insertRecord(store, "openai-api-key", values.openaiApiKey);
      }
      if (values.elevenLabsApiKey !== "") {
        insertRecord(store, "elevenlabs-api-key", values.elevenLabsApiKey ?? "");
      }
      if (values.anthropicApiKey !== "") {
        insertRecord(store, "anthropic-api-key", values.anthropicApiKey ?? "");
      }

      // Save default providers and models
      insertRecord(store, "default-transcription-provider", values.transcriptionService);
      if (values.transcriptionModel) {
        insertRecord(store, "default-transcription-model", values.transcriptionModel);
      }
      insertRecord(store, "default-note-generation-provider", values.noteGenerationProvider);
      if (values.noteGenerationModel) {
        insertRecord(store, "default-note-generation-model", values.noteGenerationModel);
      }

      // Legacy field for backwards compatibility
      insertRecord(store, "transcription-service", values.transcriptionService);

      await stronghold.save();
      toast.success("Settings saved", { id: toastId });
    } catch (error) {
      console.error("🚀 ~ handleSave ~ error:", error);
      toast.error("Failed to save settings", { id: toastId });
    }
  }

  if (error) {
    return (
      <main className="page-wrapper flex flex-col items-center">
        <div className="content-wrapper px-4">
          <p className="text-red-500 text-center">Error: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      {isLoading ? (
        <div className="content-wrapper">
          <div className="flex items-center gap-2">
            <Loader />
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className="content-wrapper gap-4 relative">
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="px-4 w-full"
          >
            <FieldGroup className="gap-8">
              <FieldSet>
                <FieldLegend>Transcription Settings</FieldLegend>
                <FieldGroup className="gap-4">
                  <Controller
                    name="transcriptionService"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-transcription-service">
                          Default Transcription Provider
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="form-transcription-service">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldDescription>
                          ElevenLabs provides better transcription quality with diarization, but is more expensive.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="transcriptionModel"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-transcription-model">
                          Default Transcription Model (Optional)
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-transcription-model"
                          aria-invalid={fieldState.invalid}
                          placeholder={
                            form.watch("transcriptionService") === "elevenlabs"
                              ? "scribe_v1"
                              : "gpt-4o-transcribe"
                          }
                          autoComplete="off"
                        />
                        <FieldDescription>
                          Leave empty to use the provider's default model.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
              <FieldSeparator className="text-border-muted -mx-4" />
              <FieldSet>
                <FieldLegend>Note Generation Settings</FieldLegend>
                <FieldGroup className="gap-4">
                  <Controller
                    name="noteGenerationProvider"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-note-generation-provider">
                          Default Note Generation Provider
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="form-note-generation-provider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="anthropic">Anthropic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldDescription>
                          Choose which LLM provider to use for generating session notes.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="noteGenerationModel"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-note-generation-model">
                          Default Note Generation Model (Optional)
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-note-generation-model"
                          aria-invalid={fieldState.invalid}
                          placeholder={
                            form.watch("noteGenerationProvider") === "anthropic"
                              ? "claude-sonnet-4.5"
                              : "gpt-5-nano"
                          }
                          autoComplete="off"
                        />
                        <FieldDescription>
                          Leave empty to use the provider's default model.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
              <FieldSeparator className="text-border-muted -mx-4" />
              <FieldSet>
                <FieldLegend>API Keys</FieldLegend>
                <FieldDescription>
                  Enter your API keys for the services you use.
                </FieldDescription>
                <FieldGroup className="gap-4">
                  <Controller
                    name="openaiApiKey"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-openapi-key">
                          OpenAI API Key
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-openapi-key"
                          aria-invalid={fieldState.invalid}
                          placeholder="sk-1234..."
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="elevenLabsApiKey"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-elevenlabs-api-key">
                          ElevenLabs API Key
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-elevenlabs-api-key"
                          aria-invalid={fieldState.invalid}
                          placeholder="sk-1234..."
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="anthropicApiKey"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-anthropic-api-key">
                          Anthropic API Key
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-anthropic-api-key"
                          aria-invalid={fieldState.invalid}
                          placeholder="sk-ant-..."
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
            <Button type="submit" className="w-full mt-4">
              <IconFloppyDisk />
              Save Changes
            </Button>
          </form>
        </div>
      )}
    </main>
  );
}
