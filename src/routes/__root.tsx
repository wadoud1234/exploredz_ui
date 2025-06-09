import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme.provider";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// import Header from "../components/Header";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster richColors  />
      </ThemeProvider>
    ),
  }
);
