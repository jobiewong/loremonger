import { type Style } from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import { cn } from "~/lib/utils";

export function TimeAgo({
  date,
  timeStyle = "twitter",
  ...props
}: React.HTMLAttributes<HTMLTimeElement> & {
  date: Date;
  timeStyle?: Style | string;
}) {
  return (
    <ReactTimeAgo
      date={date}
      className={cn(
        "text-sm text-muted-foreground tabular-nums",
        props.className
      )}
      timeStyle={timeStyle}
      {...props}
    />
  );
}
