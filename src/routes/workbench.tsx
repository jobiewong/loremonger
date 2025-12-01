import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { IconAudio, IconSquareInfo } from "central-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "~/components/ui/file-upload";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getCachedOpenaiApiKey } from "~/lib/openai-utils";
import { generateFileName } from "~/lib/utils";
import { Campaign, Session } from "~/types";

export const Route = createFileRoute("/workbench")({
  component: RouteComponent,
});

function RouteComponent() {
  const [files, setFiles] = useState<File[]>([]);

  async function handleSubmit() {
    try {
      if (files.length === 0) {
        console.error("No file selected");
        return;
      }
      const apiKey = await getCachedOpenaiApiKey();
      // Convert File to ArrayBuffer, then to Uint8Array for Tauri
      const arrayBuffer = await files[0].arrayBuffer();
      const audioData = Array.from(new Uint8Array(arrayBuffer));
      const transcription = await invoke<{ text: string }>("transcribe_audio", {
        request: {
          audio_data: audioData,
          api_key: apiKey,
        },
      });
      console.log("🚀 ~ handleSubmit ~ transcription:", transcription);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper w-full flex flex-col gap-4">
        <FileUpload value={files} onValueChange={setFiles}>
          <FileUploadDropzone>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <IconAudio className="text-accent-600" />
              </div>
            </div>
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file) => (
              <FileUploadItem key={file.name} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </main>
  );
}
