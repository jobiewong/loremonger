import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { initStronghold, insertRecord } from "~/lib/stronghold";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
});

const { client } = await initStronghold();

function RouteComponent() {
  const [value, setValue] = useState("");
  const store = client.getStore();

  function handleSave() {
    insertRecord(store, "api-key", value);
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="border-x border-border-muted size-full flex-1 max-w-lg lg:max-w-2xl flex flex-col items-center justify-center bg-muted">
        <Label>API Key</Label>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button onClick={handleSave}>Save</Button>
      </div>
    </main>
  );
}
