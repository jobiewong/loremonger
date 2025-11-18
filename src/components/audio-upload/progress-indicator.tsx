import { IconCircle, IconCircleCheck, IconCircleX } from "central-icons";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { Status, statusAtom } from "~/components/audio-upload/atoms";
import { Loader } from "~/components/loader";
import { Stopwatch } from "~/components/stopwatch";
import { cn } from "~/lib/utils";

export function ProgressIndicator() {
  const status = useAtomValue(statusAtom);

  return (
    <div className="border offset-border border-border divide-y [&>div]:p-2 [&>div]:text-sm">
      <div className="flex items-center gap-4 justify-between">
        Transcribing
        <ProgressIndicatorInfo status={status.transcribe} name="transcribe" />
      </div>
      <div
        className={cn(
          "opacity-30 transition-opacity duration-300 ease-snappy flex items-center gap-4 justify-between",
          status.generateNotes !== "idle" && "opacity-100"
        )}
      >
        Generating notes
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
        Cleaning up
        <ProgressIndicatorInfo status={status.cleanUp} name="cleanUp" />
      </div>
    </div>
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
            <IconCircleCheck className="text-green-500 size-4" />
          )}
          {status === "error" && (
            <IconCircleX className="text-red-500 size-4" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
