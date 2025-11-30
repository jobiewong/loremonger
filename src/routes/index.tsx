import { createFileRoute, Link } from "@tanstack/react-router";
import { AsciiLogo } from "~/components/ascii-logo";
import { Button } from "~/components/ui/button";
import { CampaignListTable } from "~/routes/-components/session-list-table";
import "~/styles/globals.css";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper">
        <div className="flex flex-col items-center mb-6">
          <AsciiLogo className="text-[6px] md:text-[8px] leading-1.5 md:leading-2 text-accent-500" />
          <p className="text-sm text-muted-foreground">By Jobie Wong</p>
        </div>
        <CampaignListTable />
        <Link to="/campaign/new" className="w-full mt-4">
          <Button size="sm" className="w-full">
            Create Campaign
          </Button>
        </Link>
        <Link to="/workbench">Workbench</Link>
      </div>
    </main>
  );
}
