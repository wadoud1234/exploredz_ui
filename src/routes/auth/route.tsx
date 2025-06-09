import { createFileRoute, Outlet } from "@tanstack/react-router";

// const userQueryOptions = getUserQueryOptions();
export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  // beforeLoad: async ({ context }) => {
  //   const data = await context.queryClient.ensureQueryData(userQueryOptions);
  //   if (data.success) throw redirect({ to: "/" });
  // },
});

function RouteComponent() {
  return <Outlet />;
}
