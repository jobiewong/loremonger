import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getChatCompletion } from "~/lib/openai-utils";

export const Route = createFileRoute("/workbench")({
  component: RouteComponent,
});

function RouteComponent() {
  const [input, setInput] = useState("");
  async function handleSubmit() {
    try {
      const completion = await getChatCompletion([
        {
          role: "user",
          content: input,
        },
      ]);
      console.log("🚀 ~ handleSubmit ~ completion:", completion);
    } catch (error) {
      console.error("🚀 ~ handleSubmit ~ error:", error);
      toast.error("Error getting chat completion", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper">
        <Input
          className="offset-border"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </main>
  );
}
