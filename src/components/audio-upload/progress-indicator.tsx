import { IconCircleCheck, IconCircleX } from "central-icons";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import {
  processingFileAtom,
  Status,
  statusAtom,
  transcriptStatsAtom,
} from "~/components/audio-upload/atoms";
import { Loader } from "~/components/loader";
import { Stopwatch } from "~/components/stopwatch";
import { cn } from "~/lib/utils";

export function ProgressIndicator({ isLoading }: { isLoading: boolean }) {
  const status = useAtomValue(statusAtom);
  const processingFile = useAtomValue(processingFileAtom);
  const transcriptStats = useAtomValue(transcriptStatsAtom);
  return (
    <AnimatePresence mode="popLayout">
      {isLoading ? (
        <motion.div
          key="progress-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="border offset-border border-border divide-y [&>div]:p-2 [&>div]:text-sm"
        >
          <div className="flex items-center gap-4 justify-between">
            Transcribing
            <AnimatePresence>
              {processingFile ? (
                <motion.div
                  key={processingFile}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "text-sm text-muted-foreground truncate flex-1",
                    status.transcribe === "error" &&
                      "text-red-600 dark:text-red-500"
                  )}
                >
                  {processingFile}
                </motion.div>
              ) : null}
            </AnimatePresence>
            <ProgressIndicatorInfo
              status={status.transcribe}
              name="transcribe"
            />
          </div>
          <div
            className={cn(
              "opacity-30 transition-opacity duration-300 ease-snappy flex items-center gap-4 justify-between",
              status.generateNotes !== "idle" && "opacity-100"
            )}
          >
            Generating notes
            {transcriptStats ? (
              <motion.div
                key={transcriptStats.wordCount}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "text-sm text-muted-foreground truncate flex-1",
                  status.transcribe === "error" &&
                    "text-red-600 dark:text-red-500"
                )}
              >
                <span>{transcriptStats.wordCount} words</span>,{" "}
                <span>{transcriptStats.tokens} tokens</span>,{" "}
                <span>${transcriptStats.cost.toFixed(6)}</span>
              </motion.div>
            ) : null}
            <ProgressIndicatorInfo
              status={status.generateNotes}
              name="generateNotes"
            />
          </div>
          <div
            className={cn(
              "opacity-30 transition-opacity duration-300 ease-snappy flex items-center gap-4 justify-between",
              status.cleanUp !== "idle" && "opacity-100"
            )}
          >
            Exporting
            <ProgressIndicatorInfo status={status.cleanUp} name="cleanUp" />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ProgressIndicatorInfo({
  status,
  name,
}: {
  status: Status;
  name: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {status !== "idle" && (
        <Stopwatch isPaused={status === "success" || status === "error"} />
      )}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${status}-${name}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="inline-flex items-center justify-center border border-transparent"
        >
          {status === "loading" && <Loader />}
          {status === "success" && (
            <IconCircleCheck className="text-green-500 size-4 dark:text-green-600" />
          )}
          {status === "error" && (
            <IconCircleX className="text-red-600 size-4 dark:text-red-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
