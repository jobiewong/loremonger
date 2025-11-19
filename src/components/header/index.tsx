import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import packageJson from "~/../package.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="h-(--header-height) flex items-center justify-between border-b border-muted-border px-4 bg-background">
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
              <Link to="/settings">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <Link to="/workbench">
                <DropdownMenuItem>Workbench</DropdownMenuItem>
              </Link>
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
      <p className="font-semibold text-pink-500 select-none">
        Loremonger{" "}
        <span className="text-muted-foreground font-normal">
          {packageJson.version}
        </span>
      </p>
    </header>
  );
}
