import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import {
  isLoadingAtom,
  Progress,
  progressLogsAtom,
} from "~/components/audio-upload/atoms";
import { Loader } from "~/components/loader";
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
import { cn } from "~/lib/utils";

export function ProgressIndicator() {
  const isLoading = useAtomValue(isLoadingAtom);
  const progressLogs = useAtomValue(progressLogsAtom);

  return (
    <AnimatePresence mode="popLayout">
      {isLoading || progressLogs.length > 0 ? (
        <motion.div
          key="progress-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="offset-border"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-accent">
                <TableHead className="w-[100px]">Timestamp</TableHead>
                <TableHead className="w-[124px]">Tag</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressLogs.map((log) => (
                <LogRow
                  key={`${log.timestamp.toISOString()} ${log.message}`}
                  log={log}
                  isLoading={isLoading}
                  isLast={
                    progressLogs[progressLogs.length - 1].message ===
                    log.message
                  }
                />
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function LogRow({
  log,
  isLast,
  isLoading,
}: {
  log: Progress;
  isLast: boolean;
  isLoading: boolean;
}) {
  return (
    <MotionTableRow
      key={log.timestamp.toISOString()}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        type: "spring",
        bounce: 0,
      }}
      className="hover:bg-background/50"
    >
      <TableCell>{format(log.timestamp, "HH:mm:ss")}</TableCell>
      <TableCell
        className={cn(
          "uppercase",
          log.status === "error" && "text-red-500",
          log.tag === "done" && "text-green-500"
        )}
      >
        {log.tag}
      </TableCell>
      <Tooltip>
        <TooltipTrigger asChild>
          <TableCell className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span className="truncate flex-1">{log.message}</span>
              {isLast && isLoading && (
                <Loader className="size-3 animate-spin shrink-0" />
              )}
            </div>
          </TableCell>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" disabled={log.message.length < 40}>
          {log.message}
        </TooltipContent>
      </Tooltip>
    </MotionTableRow>
  );
}

const MotionTableRow = motion.create(TableRow);
