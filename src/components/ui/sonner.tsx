import {
  IconCircleCheck,
  IconCircleX,
  IconSquareInfo,
  IconTriangleExclamation,
} from "central-icons";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Loader } from "~/components/loader";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-4 text-green-400" />,
        info: <IconSquareInfo className="size-4 text-blue-400" />,
        warning: <IconTriangleExclamation className="size-4 text-yellow-400" />,
        error: <IconCircleX className="size-4 text-red-500" />,
        loading: <Loader />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
