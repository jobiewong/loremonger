import { useLoaderData } from "@tanstack/react-router";
import { appDataDir } from "@tauri-apps/api/path";
import {
  IconSquareBehindSquare4 as IconCopy,
  IconFolder1 as IconFolder,
} from "central-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { copyToClipboard, formatDuration, formatFilePath } from "~/lib/utils";
import { Route } from "~/routes/campaign/$campaignId/$sessionId";

export function Info() {
  const { session } = useLoaderData({ from: Route.id });
  const [transcriptPath, setTranscriptPath] = useState<string | undefined>(
    undefined
  );

  async function generateTranscriptionFilepath() {
    const appPath = await appDataDir();
    return `${appPath}/sessions/${session?.id}/transcript.txt`;
  }

  useEffect(() => {
    generateTranscriptionFilepath().then((path) => {
      setTranscriptPath(path);
    });
  }, [session?.id]);

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Transcription Date</TableCell>
            <TableCell>
              {session?.date
                ? format(new Date(session.updatedAt), "yyyy-MM-dd HH:mm")
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Session Duration</TableCell>
            <TableCell>
              {session?.duration ? formatDuration(session.duration) : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Transcript Word Count</TableCell>
            <TableCell>
              {session?.wordCount ? session.wordCount.toLocaleString() : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Transcript Path</TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 size-full hover:underline group cursor-pointer"
                    onClick={() => {
                      if (!transcriptPath) return;
                      copyToClipboard(transcriptPath);
                      toast.success("Transcript path copied to clipboard");
                    }}
                  >
                    <span className="truncate">
                      {transcriptPath ? formatFilePath(transcriptPath) : "-"}
                    </span>
                    <span className="relative">
                      <IconFolder className="shrink-0 text-muted-foreground size-4 group-hover:opacity-0" />
                      <IconCopy className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-accent-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs break-all">
                  {transcriptPath ? formatFilePath(transcriptPath) : "-"}
                </TooltipContent>
              </Tooltip>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Note Path</TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 size-full hover:underline group cursor-pointer"
                    onClick={() => {
                      if (!session?.filePath) return;
                      copyToClipboard(session.filePath);
                      toast.success("Note path copied to clipboard");
                    }}
                  >
                    <span className="truncate">
                      {session?.filePath
                        ? formatFilePath(session.filePath)
                        : "-"}
                    </span>
                    <span className="relative">
                      <IconFolder className="shrink-0 text-muted-foreground size-4 group-hover:opacity-0" />
                      <IconCopy className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-accent-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs break-all">
                  {session?.filePath ? formatFilePath(session.filePath) : "-"}
                </TooltipContent>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
