import SubmitButton from "@/components/custom/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API_URL, wilayas } from "@/constants";
import { wilayaCodeSchema } from "@/schemas";
import type { Place, ResponseType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { CloudUploadIcon, PlusIcon, XIcon } from "lucide-react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const MAX_IMAGES = 2;
const MB = 1024 * 1024;
const IMAGE_SIZE = 1 * MB;

export const createPlaceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name is at least 3 characters"),
  description: z.string(),
  wilayaCode: wilayaCodeSchema,
  images: z
    .array(z.custom<File>())
    .min(1, "Please select at least one file")
    .max(MAX_IMAGES, `Please select up to ${MAX_IMAGES} files`)
    .refine((files) => files.every((file) => file.size <= IMAGE_SIZE), {
      message: "File size must be less than 5MB",
      path: ["files"],
    }),
  // createdById: z.string().cuid(), // assuming you use Prisma cuid() for user ID
  // userId: z.string().cuid().optional(), // optional secondary user association
});

type CreatePlaceSchema = z.infer<typeof createPlaceSchema>;

function useCreatePlace() {
  const router = useRouter();
  const form = useForm<CreatePlaceSchema>({
    resolver: zodResolver(createPlaceSchema),
    defaultValues: {
      name: "",
      description: "",
      wilayaCode: 1,
      images: [],
      // createdById: "",
      // userId: "",
    },
  });

  async function onSubmit(formData: CreatePlaceSchema) {
    const response = await fetch(`${API_URL}/places`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as ResponseType<Place>;
    if (data.success) {
      toast.success("Place Created");
      router.invalidate();
    } else {
      toast.error("Error", { description: data.error });
    }
  }
  return { form, onSubmit, isPending: form.formState.isSubmitting };
}

export default function CreatePlaceDialog() {
  const { form, onSubmit, isPending } = useCreatePlace();
  console.log({ form, state: form.formState });
  console.log({ isPending });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full">
        <DialogHeader>
          <DialogTitle>Add new place</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CreatePlaceForm form={form} />
            <DialogFooter className="sm:justify-between flex items-center">
              <DialogClose asChild>
                <Button variant="destructive" className="ml-auto">
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton
                onClick={form.handleSubmit(onSubmit)}
                isPending={isPending}
              >
                <PlusIcon />
                Add
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreatePlaceForm({ form }: { form: UseFormReturn<CreatePlaceSchema> }) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Place's name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Place's description"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <div className="w-full flex items-center gap-6"> */}
      <FormField
        name="wilayaCode"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wilaya</FormLabel>
            <Select
              onValueChange={(v) => field.onChange(Number(v))}
              defaultValue={`${field.value}`}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a wilaya" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Wilaya</SelectLabel>
                  {wilayas.map((wilaya) => (
                    <SelectItem key={wilaya.code} value={`${wilaya.code}`}>
                      {wilaya.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="max-w-full w-full">
        <UploadImagesFormField form={form} />
      </div>
    </>
  );
}

function UploadImagesFormField({
  form,
}: {
  form: UseFormReturn<CreatePlaceSchema>;
}) {
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem className="max-w-full">
          <FormLabel>Images</FormLabel>
          <FormControl>
            <FileUpload
              value={field.value}
              onValueChange={field.onChange}
              accept="image/*"
              maxFiles={2}
              maxSize={5 * 1024 * 1024}
              onFileReject={(_, message) => {
                form.setError("images", {
                  message,
                });
              }}
              multiple
            >
              <FileUploadDropzone className="flex-row border-dotted">
                <CloudUploadIcon className="size-4" />
                Drag and drop or
                <FileUploadTrigger asChild>
                  <Button variant="link" size="sm" className="p-0">
                    choose files
                  </Button>
                </FileUploadTrigger>
                to upload
              </FileUploadDropzone>
              {field.value.length > 0 && (
                <ScrollArea className="h-20 w-full rounded-md border">
                  <FileUploadList className="flex-1 max-w-full">
                    {field.value.map((file, index) => (
                      <FileUploadItem
                        className="flex-1 max-w-full"
                        key={index}
                        value={file}
                      >
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            <XIcon />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </ScrollArea>
              )}
            </FileUpload>
          </FormControl>
          <FormDescription>Upload up to 4 images max.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
