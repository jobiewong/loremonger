import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { NotesRender } from "~/routes/campaign/$campaignId/$sessionId/-components/notes-render";
import { TranscriptRender } from "~/routes/campaign/$campaignId/$sessionId/-components/transcript-render";

export function SessionContent() {
  return (
    <Tabs className="mt-4 flex-1 gap-0" defaultValue="transcript">
      <TabsList className="offset-border">
        <TabsTrigger value="transcript">Transcript</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="transcript" className="size-full flex">
        <TranscriptRender />
      </TabsContent>
      <TabsContent value="notes" className="size-full flex">
        <NotesRender />
      </TabsContent>
    </Tabs>
  );
}
