import { IconArrowOutOfBox, IconCrossSmall, IconScript } from "central-icons";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "~/components/ui/file-upload";
import { test } from "~/lib/audio";

export function AudioUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const onFileReject = useCallback((_file: File, message: string) => {
    toast.error(message, {
      description: "Only audio and video files are allowed",
    });
  }, []);

  async function onSubmit() {
    try {
      const text = await test("What is love?", "gpt-3.5-turbo");
      toast.success(text);
    } catch (error) {
      toast.error("Error getting chat completion", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <motion.div layout="position">
        <FileUpload
          value={files}
          onValueChange={setFiles}
          onFileReject={onFileReject}
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
              <MotionFileUploadItem
                key={index}
                value={file}
                className="offset-border"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0 }}
              >
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <IconCrossSmall />
                  </Button>
                </FileUploadItemDelete>
              </MotionFileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      </motion.div>
      <Button onClick={onSubmit} disabled={files.length === 0}>
        <IconScript />
        Transcribe
      </Button>
    </div>
  );
}

const MotionFileUploadItem = motion.create(FileUploadItem);
