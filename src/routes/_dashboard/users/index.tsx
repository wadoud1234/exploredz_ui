import UsersTable from "@/components/custom/users-data-table";
import { SiteHeader } from "@/components/site-header";
import { getUsersQueryOptions } from "@/data/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

const getUsersQuery = getUsersQueryOptions();
export const Route = createFileRoute("/_dashboard/users/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(getUsersQuery);
  },
});

function RouteComponent() {
  return (
    <>
      <SiteHeader>Users</SiteHeader>
      <div className="flex flex-col gap-6 p-6 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">manage and view all users</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <UsersTable />
        </Suspense>
      </div>
    </>
  );
}
