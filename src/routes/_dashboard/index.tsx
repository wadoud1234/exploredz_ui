import { createFileRoute } from "@tanstack/react-router";

// import { AppSidebar } from "@/components/app-sidebar";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// const DataTable = lazy(() =>
// import("@/components/data-table").then((r) => ({ default: r.DataTable }))
// );

// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  SectionCards,
  SelectionCardSkeleton,
} from "@/components/section-cards";
import { getDashboardStatsQueryOptions } from "@/data/queries";
import { Suspense } from "react";

const statsQueryOptions = getDashboardStatsQueryOptions();
export const Route = createFileRoute("/_dashboard/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(statsQueryOptions);
  },
});

function RouteComponent() {
  return (
    <>
      <SiteHeader>Dashboard</SiteHeader>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense fallback={<SelectionCardSkeleton />}>
              <SectionCards />
            </Suspense>
            {/* <div className="px-4 lg:px-6"> */}
            {/* <ChartAreaInteractive /> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
