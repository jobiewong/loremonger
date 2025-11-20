import { createFileRoute } from "@tanstack/react-router";
import "~/styles/globals.css";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper">
        <h1>Loremonger</h1>
      </div>
    </main>
  );
}
