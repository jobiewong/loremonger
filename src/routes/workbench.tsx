import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { saveFileWithPrompt } from "~/lib/utils";

export const Route = createFileRoute("/workbench")({
  component: RouteComponent,
});

function RouteComponent() {
  const [input, setInput] = useState("");
  async function handleSubmit() {
    const markdown = `# ${input}`;
    await saveFileWithPrompt(new File([markdown], "notes.md"));
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
