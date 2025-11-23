import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { IconArrowLeft } from "central-icons";
import { format } from "date-fns";
import { AudioUpload } from "~/components/audio-upload";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollToBottom } from "~/routes/campaign/$campaignId/-components/scroll-to-bottom";
import campaignsCollection from "~/server/collections/campaigns";
import sessionsCollection from "~/server/collections/sessions";

export const Route = createFileRoute("/campaign/$campaignId/$sessionId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const session = await sessionsCollection.get(params.sessionId);
    const campaign = await campaignsCollection.get(params.campaignId);
    return { session, campaign };
  },
});

function RouteComponent() {
  const { campaign, session } = useLoaderData({ from: Route.id });
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper justify-start! pt-4 pb-8 items-start!">
        <Link
          to="/campaign/$campaignId"
          params={{
            campaignId: campaign?.id ?? "",
          }}
        >
          <Button variant="ghost" size="sm">
            <IconArrowLeft />
            Back
          </Button>
        </Link>
        <section className="border-b pb-4 px-4 w-full mt-6">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="bg-accent">
              {campaign?.name}
            </Badge>
            <Badge variant="outline">#{session?.number}</Badge>
            {session?.date && (
              <Badge variant="outline">
                {format(new Date(session?.date), "dd.MM.yy")}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {session?.name}
          </h1>
        </section>
        <section className="w-full offset-border">
          <AudioUpload />
        </section>
        <ScrollToBottom />
      </div>
    </main>
  );
}
