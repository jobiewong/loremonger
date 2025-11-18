import { createRootRoute, Outlet } from "@tanstack/react-router";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { ThemeProvider } from "next-themes";
import { AppBackground } from "~/components/app-background";
import { Header } from "~/components/header";
import { Toaster } from "~/components/ui/sonner";
TimeAgo.addDefaultLocale(en);

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
