import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import campaignsCollection from "~/server/collections/campaigns";

export const Route = createFileRoute("/campaign/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const campaign = await campaignsCollection.get(params.id);
    return { campaign };
  },
});

function RouteComponent() {
  const { campaign } = useLoaderData({ from: Route.id });
  return <div>{campaign?.name}</div>;
}
