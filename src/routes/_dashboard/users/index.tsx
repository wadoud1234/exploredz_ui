import { SiteHeader } from "@/components/site-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SiteHeader>Users</SiteHeader>
    </>
  );
}
