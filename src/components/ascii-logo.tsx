import { type Ref } from "react";
import { fraktur, useAsciiText } from "react-ascii-text";
import { cn } from "~/lib/utils";

interface Props {
  isAnimated?: boolean;
}

export function AsciiLogo({
  isAnimated = true,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & Props) {
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationSpeed: 40,
    font: fraktur,
    text: "Loremonger",
    isAnimated,
  });

  return (
    <pre
      ref={asciiTextRef as Ref<HTMLPreElement>}
      className={cn("leading-none!", props.className)}
      {...props}
    />
  );
}
