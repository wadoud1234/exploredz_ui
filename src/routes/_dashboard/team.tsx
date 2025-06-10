import UnderConstruction from "@/components/custom/under-construction";
import { SiteHeader } from "@/components/site-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/team")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SiteHeader>Team</SiteHeader>
      <UnderConstruction />
    </>
  );
}
