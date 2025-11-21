import { createFileRoute } from "@tanstack/react-router";
import { IconArrowOutOfBox, IconCrossSmall } from "central-icons";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { ComboboxComponent } from "~/components/ui/combobox";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "~/components/ui/file-upload";
import { useCampaigns } from "~/server/collections/campaigns";

import { invoke } from "@tauri-apps/api/core";
import { appDataDir, tempDir } from "@tauri-apps/api/path";
import { writeFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";

export const Route = createFileRoute("/workbench")({
  component: RouteComponent,
});

function RouteComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | undefined>(
    undefined
  );
  const { data: campaigns } = useCampaigns();

  const campaignOptions = useMemo(
    () =>
      campaigns.map((campaign) => ({
        groupLabel: campaign.name,
        options: campaign.sessions.map((session) => ({
          label: session.name ?? `Session ${session.number}`,
          value: session.id,
        })),
      })),
    [campaigns]
  );
  console.log("🚀 ~ RouteComponent ~ campaignOptions:", campaignOptions);

  async function handleSubmit() {
    const toastId = toast.loading("Processing files...");
    if (!selectedSession) {
      toast.error("Please select a session", { id: toastId });
      return;
    }

    try {
      const tempDirPath = await tempDir();
      const filePaths: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tempPath = `${tempDirPath}/${selectedSession}_${i}_${file.name.slice(0, 10)}`;
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(tempPath, new Uint8Array(arrayBuffer));
        filePaths.push(tempPath);
      }

      console.log("🚀 ~ handleSubmit ~ filePaths:", filePaths);
      const outputPath = await invoke<string>("process_audio_files", {
        request: {
          file_paths: filePaths,
          output_filename: `/audio.mp3`,
          session_id: selectedSession,
        },
      });

      toast.success("Files processed", {
        description: outputPath,
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to process files", { id: toastId });
      console.error("🚀 ~ handleSubmit ~ error:", error);
    }
  }

  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper w-full flex flex-col gap-4">
        <ComboboxComponent
          options={campaignOptions}
          className="w-full"
          onValueChange={(value) => {
            setSelectedSession(value as string);
          }}
        />
        <FileUpload
          value={files}
          onValueChange={setFiles}
          className="gap-0 w-full"
          accept="audio/*,video/*"
          multiple
        >
          <FileUploadDropzone className="border border-border offset-border border-solid bg-background">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <IconArrowOutOfBox className="text-accent-600" />
              </div>
              <p className="font-medium text-sm">
                Drag & drop audio files here
              </p>
              <p className="text-muted-foreground text-xs">
                Or click to browse (.mp3, .wav, .m4a)
              </p>
            </div>
            <FileUploadTrigger className="border text-sm px-3 py-1 mt-3 font-semibold hover:bg-accent hover:text-accent-foreground">
              Browse Files
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file, index) => (
              <FileUploadItem
                key={index}
                value={file}
                className="offset-border"
              >
                <FileUploadItemPreview />
                <FileUploadItemDelete asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <IconCrossSmall />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </main>
  );
}
