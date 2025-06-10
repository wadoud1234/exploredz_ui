import Logo from "@/components/custom/logo";
import { RegisterForm } from "@/components/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 gap-4 md:p-10">
      <div className="w-full flex flex-col items-center justify-center">
        <Logo width={100} height={100} />
        <h3 className="text-2xl font-semibold">ExploreDZ</h3>
      </div>
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
