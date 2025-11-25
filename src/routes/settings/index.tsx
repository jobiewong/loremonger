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
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useStronghold } from "~/hooks/use-stronghold";
import { insertRecord } from "~/lib/stronghold";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

const formSchema = z.object({
  openaiApiKey: z.string().min(1),
  elevenLabsApiKey: z.string().min(1),
});

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openaiApiKey: "",
      elevenLabsApiKey: "",
    },
  });
  const { client, stronghold, isLoading, error } = useStronghold();

  async function handleSave(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Saving API keys...");
    try {
      if (!client || !stronghold) {
        throw new Error("Client or stronghold not found");
      }
      const store = client.getStore();
      insertRecord(store, "openai-api-key", values.openaiApiKey);
      insertRecord(store, "elevenlabs-api-key", values.elevenLabsApiKey);
      await stronghold.save();
      toast.success("API keys saved", { id: toastId });
    } catch (error) {
      console.error("🚀 ~ handleSave ~ error:", error);
      toast.error("Failed to save API keys", { id: toastId });
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
            <FieldGroup>
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
