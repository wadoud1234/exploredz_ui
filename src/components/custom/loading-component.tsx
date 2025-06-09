import { Loader2Icon } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className="h-screen mx-auto flex flex-col items-center justify-center">
      <Loader2Icon className="animate-spin" />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
