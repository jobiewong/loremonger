import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import campaignsCollection from "~/server/collections/campaigns";

export const Route = createFileRoute("/workbench")({
  component: RouteComponent,
});

function RouteComponent() {
  const [name, setName] = useState("");
  // async function handleCreateCampaign() {
  //   const id = Number(uuidv7());
  //   campaignsCollection.insert({
  //     id,
  //     name,
  //     description: "This is a test campaign",
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   });
  // }

  const { data } = useLiveQuery((q) =>
    q.from({ campaigns: campaignsCollection })
  );

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper">
        <ul>
          {data.map((campaign) => (
            <li key={campaign.id}>
              <h2>{campaign.name}</h2>
              <p className="text-sm text-muted-foreground">
                {campaign.description}
              </p>
            </li>
          ))}
        </ul>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <Button>Create Campaign</Button>
      </div>
    </main>
  );
}
