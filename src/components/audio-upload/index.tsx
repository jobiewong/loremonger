import {
  IconArrowOutOfBox,
  IconCelebrate,
  IconCrossSmall,
  IconScript,
} from "central-icons";
import { useAtom, useSetAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { statusAtom } from "~/components/audio-upload/atoms";
import { ProgressIndicator } from "~/components/audio-upload/progress-indicator";
import { Loader } from "~/components/loader";
import { Stopwatch } from "~/components/stopwatch";
import { TimeAgo } from "~/components/time-ago";
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
import { transcribeAudio } from "~/lib/el-labs-utils";

export function AudioUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useAtom(statusAtom);
  const [step, setStep] = useState(0);

  const onFileReject = useCallback((_file: File, message: string) => {
    toast.error(message, {
      description: "Only audio and video files are allowed",
    });
  }, []);

  async function handleTranscribe() {
    setIsLoading(true);
    try {
      for (const file of files) {
        setStatus((prev) => ({ ...prev, transcribe: "loading" }));
        const transcription = await transcribeAudio(file);
        setStatus((prev) => ({ ...prev, transcribe: "success" }));
        console.log("🚀 ~ onSubmit ~ transcription:", transcription);
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, transcribe: "error" }));
      toast.error("Error transcribing audio", {
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
          className="gap-0"
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
      <Button
        onClick={handleTranscribe}
        disabled={files.length === 0 || isLoading}
      >
        <IconScript />
        Process
      </Button>
      <ProgressIndicator />
      <div className="h-[38px] w-full relative">
        <AnimatePresence>
          {status.cleanUp === "success" ? (
            <motion.div
              key="done-message"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="offset-border absolute flex items-center gap-2 justify-center top-0 left-0 border text-center text-sm p-2 border-border"
            >
              <IconCelebrate className="size-4 text-accent-foreground" /> Done
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

const MotionFileUploadItem = motion.create(FileUploadItem);
