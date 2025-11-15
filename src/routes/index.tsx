import { createFileRoute } from "@tanstack/react-router";
import { AudioUpload } from "~/components/audio-upload";
import "~/styles/globals.css";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="border-x border-border-muted size-full flex-1 max-w-lg lg:max-w-2xl flex flex-col items-center justify-center bg-muted">
        <AudioUpload />
      </div>
    </main>
  );
}
