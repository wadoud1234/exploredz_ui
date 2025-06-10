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
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
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
import { getCurrentUserQueryOptions } from "@/data/queries";
import { wilayaCodeSchema } from "@/schemas";
import type { Place, ResponseType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { CloudUploadIcon, PlusIcon, XIcon } from "lucide-react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

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
});

type CreatePlaceSchema = z.infer<typeof createPlaceSchema>;

async function uploadImageAuthenticator() {
  const authRes = await fetch(`${API_URL}/images`);
  const { signature, expire, token, publicKey } = (await authRes.json()) as {
    token: string;
    expire: number;
    signature: string;
    publicKey: string;
  };
  return { signature, expire, token, publicKey };
}

function useCreatePlace() {
  const { uploadImages } = useUploadImages();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery(getCurrentUserQueryOptions());
  const createdById = data?.data.user.id;
  const router = useRouter();
  const form = useForm<CreatePlaceSchema>({
    resolver: zodResolver(createPlaceSchema),
    defaultValues: {
      name: "",
      description: "",
      wilayaCode: 1,
      images: [],
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (formData: CreatePlaceSchema) => {
      const images = (await uploadImages(formData.images)).filter((i) => i);
      console.log({ images });

      const response = await fetch(`${API_URL}/places`, {
        method: "POST",
        body: JSON.stringify({ ...formData, createdById, images }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as ResponseType<Place>;
      if (data.success) return data.data;
      throw new Error(data.error);
    },
    onSuccess: async (data) => {
      toast.success("Place Created", {
        description: `${data.name} has been added.`,
      });
      form.reset();
      await queryClient.cancelQueries({ queryKey: ["places"] });

      // Optimistically update the cache
      queryClient.setQueriesData<Place[]>(
        { queryKey: ["places"] },
        (oldData) => {
          return oldData ? [...oldData, data] : [data];
        }
      );

      // Invalidate to ensure fresh data is eventually fetched from server
      queryClient.invalidateQueries({ queryKey: ["places"] });

      setOpen(false);
      router.invalidate();
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    },
  });

  async function onSubmit(formData: CreatePlaceSchema) {
    mutate(formData);
  }
  return {
    form,
    onSubmit,
    isPending: form.formState.isSubmitting,
    open,
    setOpen,
  };
}

export default function CreatePlaceDialog() {
  const { form, onSubmit, isPending, open, setOpen } = useCreatePlace();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

function useUploadImages() {
  async function uploadImages(imagesFiles: File[]) {
    const authParams = await uploadImageAuthenticator();
    const images = await Promise.all(
      imagesFiles.map((file) => uploadSingleImage(file, authParams))
    );
    console.log({ images });
    return images;
  }

  async function uploadSingleImage(
    file: File,
    authParams: {
      token: string;
      expire: number;
      signature: string;
      publicKey: string;
    }
  ) {
    const { signature, expire, token, publicKey } = authParams;
    console.log({ signature, expire, token, publicKey });
    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
      });
      return uploadResponse.url;
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  }
  return { uploadSingleImage, uploadImages };
}

function UploadImagesFormField({
  form,
}: {
  form: UseFormReturn<CreatePlaceSchema>;
}) {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const [progress, setProgress] = useState(0);
  // const abortController = new AbortController();
  return (
    <>
      {/* File input element using React ref */}
      {/* <input type="file" multiple ref={fileInputRef} /> */}
      {/* Button to trigger the upload process */}
      {/* {fileInputRef.current &&
      fileInputRef.current.files &&
      fileInputRef.current.files.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            console.log({ files: fileInputRef?.current?.files });
            if (
              fileInputRef.current &&
              fileInputRef.current.files &&
              fileInputRef.current.files.length > 0
            )
              uploadImages(Array.from(fileInputRef.current.files));
          }}
        >
          Upload file
        </button>
      ) : null}
      <br />
      {/* Display the current upload progress */}
      {/* Upload progress: <progress value={progress} max={100}></progress> */}
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
    </>
  );
}
