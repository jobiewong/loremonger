import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { IconArrowLeft, IconTriangleExclamation } from "central-icons";
import { format } from "date-fns";
import React, { useState } from "react";
import { AudioUpload } from "~/components/audio-upload";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DeleteContentDialog } from "~/routes/campaign/$campaignId/$sessionId/-components/delete-content-dialog";
import { Info } from "~/routes/campaign/$campaignId/$sessionId/-components/info";
import { SessionContent } from "~/routes/campaign/$campaignId/$sessionId/-components/session-content";
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
  const [uploadNewAudio, setUploadNewAudio] = useState(false);
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper justify-start! pt-4 items-start!">
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
        <section className="w-full flex-1 flex my-6">
          {session?.filePath && session?.filePath !== "" ? (
            <React.Fragment>
              {uploadNewAudio ? (
                <div className="flex flex-col">
                  <div className="border p-2 flex items-center gap-2 text-sm mb-2 bg-yellow-500/10">
                    <IconTriangleExclamation className="text-yellow-500 size-4" />
                    Transcribing new audio will overwrite the previous
                    transcription and notes.
                  </div>
                  <div className="px-4 mt-2 mb-4 w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setUploadNewAudio(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <AudioUpload />
                </div>
              ) : (
                <div className="-mt-px flex-1 flex flex-col">
                  <Info />
                  <SessionContent />
                  <hr className="mb-4" />
                  <div className="grid grid-cols-2 gap-2 px-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setUploadNewAudio(true)}
                    >
                      Upload New Audio
                    </Button>
                    <DeleteContentDialog />
                  </div>
                </div>
              )}
            </React.Fragment>
          ) : (
            <AudioUpload />
          )}
        </section>
        <ScrollToBottom />
      </div>
    </main>
  );
}
