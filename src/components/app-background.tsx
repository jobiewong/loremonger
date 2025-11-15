import { LinesPattern } from "~/components/patterns/lines";

export function AppBackground() {
  return (
    <div className="-z-1 fixed inset-0 text-muted-foreground/10 bg-muted">
      <LinesPattern />
    </div>
  );
}
