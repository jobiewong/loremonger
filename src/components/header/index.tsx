import { Link, useMatches } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import packageJson from "~/../package.json";
import { TimeAgo } from "~/components/time-ago";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCampaigns } from "~/server/collections/campaigns";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { data: campaigns } = useCampaigns();
  const matches = useMatches();
  const isOnSessionPage = matches.some(
    (match) => match.routeId === "/campaign/$campaignId/$sessionId/"
  );

  return (
    <header className="h-(--header-height) sticky top-0 z-10 flex items-center justify-between border-b border-muted-border px-4 bg-background">
      <div>
        <div className="flex items-center gap-1 -ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:bg-muted px-2 py-0.5">
              File
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" sideOffset={5} align="start">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>New</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Session</DropdownMenuItem>
                  <Link to="/campaign/new">
                    <DropdownMenuItem>Campaign</DropdownMenuItem>
                  </Link>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {campaigns && campaigns.length > 0 && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Open</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {campaigns.map((campaign) => {
                      const updatedAt = new Date(
                        campaign.updatedAt ?? new Date()
                      );
                      return (
                        <Link
                          to="/campaign/$campaignId"
                          params={{ campaignId: campaign.id }}
                          key={campaign.id}
                        >
                          <DropdownMenuItem>
                            <span className="flex-1">{campaign.name}</span>
                            {campaign.updatedAt && (
                              <TimeAgo
                                date={updatedAt}
                                className="inline-block"
                              />
                            )}
                          </DropdownMenuItem>
                        </Link>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              <Link to="/settings">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              {/* <Link to="/workbench">
                <DropdownMenuItem>Workbench</DropdownMenuItem>
              </Link> */}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:bg-muted px-2 py-0.5">
              Edit
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" sideOffset={5} align="start">
              {isOnSessionPage && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Edit Session</DropdownMenuItem>
                    <DropdownMenuItem>Delete Session</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuGroup>
                <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                <DropdownMenuItem>Delete Campaign</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:bg-muted px-2 py-0.5">
              View
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" sideOffset={5} align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(e) => {
                    setTheme(e as "system" | "dark" | "light");
                  }}
                >
                  <DropdownMenuRadioItem value="system">
                    System
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/help"
            className="text-sm font-medium hover:bg-muted px-2 py-0.5 cursor-pointer"
          >
            Help
          </Link>
        </div>
      </div>
      <Link to="/">
        <p className="font-semibold text-pink-500 select-none">
          Loremonger{" "}
          <span className="text-muted-foreground font-normal">
            {packageJson.version}
          </span>
        </p>
      </Link>
    </header>
  );
}
