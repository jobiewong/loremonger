import { IconLoader } from "central-icons";
import { cn } from "~/lib/utils";
export function Loader({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <IconLoader
      className={cn("size-4 animate-spin", props.className)}
      {...props}
    />
  );
}
