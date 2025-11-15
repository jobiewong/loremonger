import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import { AppBackground } from "~/components/app-background";
import { Header } from "~/components/header";
import { Toaster } from "~/components/ui/sonner";

const RootLayout = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <AppBackground />
    <Header />
    <Toaster position="bottom-center" />
    <Outlet />

    {/* <TanStackRouterDevtools /> */}
  </ThemeProvider>
);

export const Route = createRootRoute({ component: RootLayout });
