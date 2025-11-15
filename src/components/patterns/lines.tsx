export function LinesPattern({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="100%" height="100%" {...props}>
      <defs>
        <pattern
          viewBox="0 0 10 10"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          id=":S1:"
        >
          <line
            x1="0"
            y1="10"
            x2="10"
            y2="0"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          ></line>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#:S1:)"></rect>
    </svg>
  );
}
