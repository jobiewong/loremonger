import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import { cn } from "~/lib/utils";

interface StopwatchProps extends React.HTMLAttributes<HTMLDivElement> {
  isPaused?: boolean;
}

export function Stopwatch({ isPaused, ...props }: StopwatchProps) {
  const { seconds, minutes, pause } = useStopwatch();

  useEffect(() => {
    if (isPaused) {
      pause();
    }
  }, [isPaused]);

  return (
    <div
      className={cn(
        "text-sm text-muted-foreground tabular-nums",
        props.className
      )}
      {...props}
    >
      <AnimatePresence>
        <motion.span
          key="minutes"
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {" "}
          {minutes > 0 && `${minutes}m`}
        </motion.span>
        <motion.span
          key="seconds"
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {seconds}s
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
