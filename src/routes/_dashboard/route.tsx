import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app-sidebar";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// const DataTable = lazy(() =>
// import("@/components/data-table").then((r) => ({ default: r.DataTable }))
// );

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const data = await context.queryClient.getQueryData(["user"]);
    console.log({ data });
    if (!data) throw redirect({ to: "/auth/login" });
  },
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
