import { useLoaderData } from "@tanstack/react-router";
import { appDataDir } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Route } from "~/routes/campaign/$campaignId/$sessionId";

export function TranscriptRender() {
  const { session } = useLoaderData({ from: Route.id });
  const [transcript, setTranscript] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadTranscript() {
      const appPath = await appDataDir();
      const transcriptPath = `${appPath}/sessions/${session?.id}/transcript.txt`;
      const transcript = await readFile(transcriptPath);
      const text = new TextDecoder().decode(transcript);
      setTranscript(text);
    }
    loadTranscript();
  }, [session?.id]);

  return (
    <div className="flex-1">
      <AutoSizer>
        {({ height, width }) => (
          <ScrollArea style={{ height, width }}>
            <pre className="whitespace-pre-wrap w-full text-sm p-4 pb-4">
              {transcript ?? (
                <span className="text-center text-destructive">
                  Failed to load transcript
                </span>
              )}
            </pre>
          </ScrollArea>
        )}
      </AutoSizer>
    </div>
  );
}
