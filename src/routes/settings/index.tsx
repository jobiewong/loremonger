import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconArrowLeft,
  IconFloppyDisk1 as IconFloppyDisk,
} from "central-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useStronghold } from "~/hooks/use-stronghold";
import { insertRecord } from "~/lib/stronghold";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [openaiValue, setOpenaiValue] = useState("");
  const [elevenLabsValue, setElevenLabsValue] = useState(""); // TODO change this to react hook form
  const { client, stronghold, isLoading, error } = useStronghold();

  async function handleSave() {
    const toastId = toast.loading("Saving API key...");
    try {
      if (!client || !stronghold) {
        throw new Error("Client or stronghold not found");
      }
      const store = client.getStore();
      insertRecord(store, "openai-api-key", openaiValue);
      insertRecord(store, "elevenlabs-api-key", elevenLabsValue);
      await stronghold.save();
      toast.success("API key saved", { id: toastId });
    } catch (error) {
      console.error("🚀 ~ handleSave ~ error:", error);
      toast.error("Failed to save API key", { id: toastId });
    }
  }

  if (error) {
    return (
      <main className="page-wrapper flex flex-col items-center">
        <div className="content-wrapper">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      {isLoading ? (
        <div className="content-wrapper preview">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="content-wrapper gap-4 relative">
          <Link
            className="absolute top-4 left-4 flex items-center gap-2"
            to="/"
          >
            <IconArrowLeft className="size-4" />
            Back
          </Link>
          <div className="w-full gap-2 flex flex-col">
            <Label>OpenAI API Key</Label>
            <Input
              value={openaiValue}
              onChange={(e) => setOpenaiValue(e.target.value)}
              className="offset-border"
            />
          </div>
          <div className="w-full  gap-2 flex flex-col">
            <Label>ElevenLabs API Key</Label>
            <Input
              value={elevenLabsValue}
              onChange={(e) => setElevenLabsValue(e.target.value)}
              className="offset-border"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            <IconFloppyDisk />
            Save Changes
          </Button>
        </div>
      )}
    </main>
  );
}
