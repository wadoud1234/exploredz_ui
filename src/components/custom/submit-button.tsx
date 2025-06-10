import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";

type Props = Omit<
  React.ComponentProps<typeof Button> & {
    isPending: boolean;
  },
  "disabled" | "type"
>;

export default function SubmitButton({ isPending, children, ...props }: Props) {
  return (
    <Button {...props} type="submit" disabled={isPending}>
      {isPending ? <Loader2Icon className="mr-2 animate-spin" /> : children}
    </Button>
  );
}
