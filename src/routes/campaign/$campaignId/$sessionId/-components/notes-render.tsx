import { useLoaderData } from "@tanstack/react-router";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import AutoSizer from "react-virtualized-auto-sizer";
import { ScrollArea } from "~/components/ui/scroll-area";
import { formatFilePath } from "~/lib/utils";
import { Route } from "~/routes/campaign/$campaignId/$sessionId";

export function NotesRender() {
  const [notes, setNotes] = useState<string | undefined>(undefined);
  console.log("🚀 ~ NotesRender ~ notes:", notes);
  const { session } = useLoaderData({ from: Route.id });

  useEffect(() => {
    async function loadNotes() {
      const notesPath = session?.filePath;
      if (!notesPath) return;
      const notes = await readFile(formatFilePath(notesPath));
      const text = new TextDecoder().decode(notes);
      setNotes(text);
    }
    loadNotes();
  }, [session?.filePath]);

  return (
    <div className="flex-1">
      <AutoSizer>
        {({ height, width }) => (
          <ScrollArea
            style={{ height, width }}
            className="prose prose-neutral prose-sm max-w-none px-4 dark:prose-invert"
          >
            <Markdown>{notes}</Markdown>
          </ScrollArea>
        )}
      </AutoSizer>
    </div>
  );
}
