import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/providers/theme.provider";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";

export function SiteHeader({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {router.history.canGoBack() && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.history.back()}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </>
        )}
        <h1 className="text-base font-medium">{children}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
