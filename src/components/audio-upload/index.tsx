import { useLoaderData } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { appDataDir, tempDir } from "@tauri-apps/api/path";
import { mkdir, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { IconArrowOutOfBox, IconCrossSmall, IconScript } from "central-icons";
import { useAtom, useSetAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  isLoadingAtom,
  isSuccessAtom,
  Progress,
  progressLogsAtom,
} from "~/components/audio-upload/atoms";
import { ProgressIndicator } from "~/components/audio-upload/progress-indicator";
import { DotsPattern } from "~/components/patterns/dots";
import { Stopwatch } from "~/components/stopwatch";
import { Badge } from "~/components/ui/badge";
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
import { generateNotes } from "~/lib/openai-utils";
import {
  generateFileName,
  generateFilePath,
  getGpt5NanoCost,
  getTokenCount,
  saveFileWithPrompt,
} from "~/lib/utils";
import { Route } from "~/routes/campaign/$campaignId/$sessionId";
import sessionsCollection from "~/server/collections/sessions";

export function AudioUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [progressLogs, setProgressLogs] = useAtom(progressLogsAtom);
  const setIsSuccess = useSetAtom(isSuccessAtom);
  const { session, campaign } = useLoaderData({ from: Route.id });

  const onFileReject = useCallback((_file: File, message: string) => {
    toast.error(message, {
      description: "Only audio and video files are allowed",
    });
  }, []);

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.addEventListener("loadedmetadata", () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      });

      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load audio metadata"));
      });

      audio.src = url;
    });
  };

  function updateLogs(log: Progress) {
    setProgressLogs((prev) => [...prev, log]);
  }

  async function handleTranscribe() {
    setProgressLogs([]);
    if (!session) {
      updateLogs({
        timestamp: new Date(),
        message: "Session not found",
        tag: "init",
        status: "error",
      });
      return;
    }
    if (!campaign) {
      updateLogs({
        timestamp: new Date(),
        message: "Campaign not found",
        tag: "init",
        status: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      updateLogs({
        timestamp: new Date(),
        message: "Preparing files",
        tag: "prepare",
      });
      const tempDirPath = await tempDir();
      const filePaths: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tempPath = `${tempDirPath}/${session.id}_${i}_${file.name.slice(0, 10)}`;
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(tempPath, new Uint8Array(arrayBuffer));
        updateLogs({
          timestamp: new Date(),
          message: `Saved ${file.name} to temp directory`,
          tag: "prepare",
        });
        filePaths.push(tempPath);
      }

      setProgressLogs((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          message: `Pre-processing uploaded files: ${files.length} files`,
          tag: "pre-process",
        },
      ]);

      const outputPath = await invoke<string>("process_audio_files", {
        request: {
          file_paths: filePaths,
          output_filename: `/audio.mp3`,
          session_id: session.id,
        },
      });

      setProgressLogs((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          message: `Processed files saved to ${outputPath}`,
          tag: "pre-process",
        },
      ]);

      const fileData = await readFile(outputPath);
      const file = new File([fileData], "audio.mp3", { type: "audio/mpeg" });

      const duration = await getAudioDuration(file);

      updateLogs({
        timestamp: new Date(),
        message: `Transcribing audio: ${file.name}: ${duration.toFixed(2)}s`,
        tag: "transcribe",
      });

      const transcription = await transcribeAudio(file, (error) => {
        updateLogs({
          timestamp: new Date(),
          message: `Error transcribing ${file.name}`,
          tag: "transcribe",
          status: "error",
        });
        throw error;
      });
      updateLogs({
        timestamp: new Date(),
        message: `Transcribed finished: ${transcription?.text.length} characters`,
        tag: "transcribe",
      });
      if (transcription) {
        updateLogs({
          timestamp: new Date(),
          message: `Saving transcript to disk`,
          tag: "transcribe",
        });
        const appPath = await appDataDir();
        await writeFile(
          `${appPath}/sessions/${session.id}/transcript.txt`,
          new TextEncoder().encode(transcription.text)
        );
        updateLogs({
          timestamp: new Date(),
          message: `Transcript saved to disk: ${appPath}/sessions/${session.id}/transcript.txt`,
          tag: "transcribe",
        });

        const tokens = getTokenCount("gpt-5-nano", transcription.text);
        const wordCount = transcription.text.split(" ").length;
        const cost = getGpt5NanoCost(tokens);
        updateLogs({
          timestamp: new Date(),
          message: `Generating notes: ${tokens} tokens: ${wordCount} words: ~${cost.toFixed(6)} USD`,
          tag: "generate",
        });
        const notes = await generateNotes(
          transcription.text,
          campaign?.dmName ?? "Unknown DM",
          campaign?.players ?? [],
          true // debug
        );

        if (notes) {
          updateLogs({
            timestamp: new Date(),
            message: `Notes generated: ${notes.length} characters`,
            tag: "generate",
          });

          updateLogs({
            timestamp: new Date(),
            message: `Saving notes to disk`,
            tag: "clean-up",
          });
          const fileName = generateFileName({
            name: session.name,
            number: session.number,
            campaign,
          });
          const outputDirectory = await generateFilePath({
            name: session.name,
            number: session.number,
            campaign,
          });

          let notesPath: string | undefined;

          if (!outputDirectory) {
            notesPath = await saveFileWithPrompt(new File([notes], fileName));
          } else {
            await mkdir(outputDirectory, { recursive: true });
            notesPath = `${outputDirectory}/${fileName}`;
            await writeFile(notesPath, new TextEncoder().encode(notes));
          }

          updateLogs({
            timestamp: new Date(),
            message: `Notes saved to disk: ${notesPath}`,
            tag: "clean-up",
          });
          updateLogs({
            timestamp: new Date(),
            message: `Updating session in database`,
            tag: "clean-up",
          });

          sessionsCollection.update(session.id, (draft) => {
            ((draft.duration = duration),
              (draft.wordCount = wordCount),
              (draft.noteWordCount = notes.length),
              (draft.filePath = notesPath ?? ""),
              (draft.updatedAt = new Date().toISOString()));
          });

          updateLogs({
            timestamp: new Date(),
            message: `Session updated in database`,
            tag: "done",
          });
          setIsLoading(false);
          setIsSuccess(true);
        } else {
          setIsLoading(false);
          setIsSuccess(false);
          updateLogs({
            timestamp: new Date(),
            message: `Error generating notes`,
            tag: "generate-notes",
            status: "error",
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      updateLogs({
        timestamp: new Date(),
        message:
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : "An unexpected error occurred",
        tag: "error",
        status: "error",
      });
      console.log("🚀 ~ handleTranscribe ~ error:", error);
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
          <FileUploadDropzone className="border border-border border-solid bg-background">
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
      <motion.div layout="position" className="w-full">
        <Button
          onClick={handleTranscribe}
          disabled={files.length === 0 || isLoading}
          className="w-full"
        >
          <IconScript />
          Transcribe
          {progressLogs.length > 0 && <Stopwatch isPaused={!isLoading} />}
        </Button>
      </motion.div>
      <ProgressIndicator />
      <AnimatePresence mode="popLayout">
        {!isLoading &&
        progressLogs.length > 0 &&
        progressLogs[progressLogs.length - 1].tag === "done" ? (
          <motion.div
            key="done-message"
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            exit={{ y: -30 }}
            className="offset-border relative flex items-center gap-2 justify-center border text-center text-sm p-2 border-border h-30"
          >
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-green-700 text-white">Success</Badge>
            </div>
            <DotsPattern />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const MotionFileUploadItem = motion.create(FileUploadItem);
