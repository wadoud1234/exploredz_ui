import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/constants";
import type { Place, ResponseType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

export default function DeletePlaceDialog({ place }: { place: Place }) {
  const queryClient = useQueryClient();
  const { mutate: deletePlace } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/places/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as ResponseType<void>;
      if (data.success) return data.data;
      throw new Error(data.error);
    },
    onSuccess: async (_, vars) => {
      await queryClient.cancelQueries({ queryKey: ["places"] });

      // Optimistically update the cache
      queryClient.setQueryData<Place[]>(["places"], (oldData) => {
        if (!oldData) {
          return [];
        }
        return oldData.filter((place) => place.id !== vars);
      });

      // Invalidate to ensure fresh data is eventually fetched from server
      queryClient.invalidateQueries({ queryKey: ["places"] });
      toast.success("Place deleted successfully");
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-destructive-foreground"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            place "{place.name}" and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={() => deletePlace(place.id)}>
            <Button variant="destructive" className="dark:text-white ">
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
