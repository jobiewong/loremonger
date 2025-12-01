import { DotsPattern } from "~/components/patterns/dots";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface Props {
  status: "success" | "error" | "warning" | "info";
}

export function StatusCard({
  status,
  ...props
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "relative size-full flex items-center justify-center text-center text-sm",
        props.className
      )}
    >
      <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {status === "success" && (
          <Badge className="bg-green-700 text-white">Success</Badge>
        )}
        {status === "error" && (
          <Badge className="bg-red-700 text-white">Error</Badge>
        )}
        {status === "warning" && (
          <Badge className="bg-yellow-700 text-white">Warning</Badge>
        )}
        {status === "info" && (
          <Badge className="bg-blue-700 text-white">Info</Badge>
        )}
      </div>
      <DotsPattern />
    </div>
  );
}
