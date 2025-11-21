import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import "~/styles/globals.css";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper space-y-6">
        <h1>Loremonger</h1>
        <Link to="/workbench">
          <Button>Workbench</Button>
        </Link>
      </div>
    </main>
  );
}
