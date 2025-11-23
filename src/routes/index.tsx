import { createFileRoute } from "@tanstack/react-router";
import { AsciiLogo } from "~/components/ascii-logo";
import { CampaignListTable } from "~/routes/-components/session-list-table";
import "~/styles/globals.css";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrapper flex flex-col items-center">
      <div className="content-wrapper space-y-6">
        <div className="flex flex-col items-center">
          <AsciiLogo className="text-[6px] md:text-[8px] leading-1.5 md:leading-2 text-accent-500" />
          <p className="text-sm text-muted-foreground">By Jobie Wong</p>
        </div>
        <CampaignListTable />
      </div>
    </main>
  );
}
