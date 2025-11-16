import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper">Help Page!</div>
    </main>
  );
}
