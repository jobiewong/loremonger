import ReactTimeAgo from "react-time-ago";
import { cn } from "~/lib/utils";

export function TimeAgo({
  date,
  ...props
}: React.HTMLAttributes<HTMLTimeElement> & { date: Date }) {
  return (
    <ReactTimeAgo
      date={date}
      className={cn(
        "text-sm text-muted-foreground tabular-nums",
        props.className
      )}
      timeStyle="twitter"
      {...props}
    />
  );
}
