import { Stopwatch } from "~/components/stopwatch";
import { cn } from "~/lib/utils";

export function TimeAgo({
  date,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { date: Date }) {
  return (
    <div
      className={cn(
        "text-sm text-muted-foreground tabular-nums",
        props.className
      )}
      {...props}
    >
      <Stopwatch />
    </div>
  );
}
