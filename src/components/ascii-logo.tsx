import { type Ref } from "react";
import { fraktur, useAsciiText } from "react-ascii-text";
import { cn } from "~/lib/utils";

export function AsciiLogo({ ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    font: fraktur,
    text: "Loremonger",
  });

  return (
    <pre
      ref={asciiTextRef as Ref<HTMLPreElement>}
      className={cn("leading-none!", props.className)}
      {...props}
    />
  );
}
