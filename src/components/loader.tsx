import { IconLoader } from "central-icons";
import { cn } from "~/lib/utils";
export function Loader({ ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("animate-spin", props.className)} {...props}>
      <IconLoader />
    </span>
  );
}
