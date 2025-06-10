import SubmitButton from "@/components/custom/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloudUploadIcon, EditIcon, PlusIcon, XIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { wilayaCodeSchema, type WilayaCode } from "@/schemas";
import type { Place, ResponseType } from "@/types";
import { API_URL, IMAGEKIT_URL_ENDPOINT, wilayas } from "@/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Image,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { createContext, useContext, useState, type ReactNode } from "react";

const MAX_IMAGES = 2;
const MB = 1024 * 1024;
const IMAGE_SIZE = 1 * MB;

const editPlaceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name is at least 3 characters"),
  description: z.string(),
  wilayaCode: wilayaCodeSchema,
  images: z
    .array(z.custom<File>())
    .max(MAX_IMAGES, `Please select up to ${MAX_IMAGES} files`)
    .refine((files) => files.every((file) => file.size <= IMAGE_SIZE), {
      message: "File size must be less than 5MB",
      path: ["files"],
    }),
});

type EditPlaceSchema = z.infer<typeof editPlaceSchema>;

interface EditPlaceContext {
  place: Place;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oldImages: { id: string; image: string }[];
  deleteOldImage: (id: string) => void;
}

const editPlaceContext = createContext<EditPlaceContext | null>(null);

function useEditPlace() {
  const {
    oldImages,
    place,
    onOpenChange: setDialogOpen,
  } = useEditPlaceContext();

  const router = useRouter();
  const form = useForm<EditPlaceSchema>({
    resolver: zodResolver(editPlaceSchema),
    defaultValues: {
      name: place.name,
      description: place.description,
      wilayaCode: place.wilayaCode as WilayaCode,
      images: [],
    },
  });
  const queryClient = useQueryClient();
  const { uploadImages } = useUploadImages();
  const { mutate } = useMutation({
    mutationFn: async (formData: EditPlaceSchema) => {
      const newImages = await uploadImages(formData.images);
      const images = [...oldImages.map((i) => i.image), ...newImages];
      console.log({
        ...formData,
        placeId: place.id,
        createdById: place.createdById,
        images,
      });
      const response = await fetch(`${API_URL}/places/${place.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          placeId: place.id,
          createdById: place.createdById,
          images,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await response.json()) as ResponseType<Place>;
      if (data.success) return data.data;
      throw new Error(data.error);
    },
    onSuccess: async (data) => {
      toast.success("Place Updated", {
        description: `${data.name} has been updated.`,
      });
      form.reset();
      await queryClient.cancelQueries({ queryKey: ["places"] });

      // Optimistically update the cache
      queryClient.setQueryData<Place[]>(["places"], (oldData) => {
        if (!oldData) {
          return [data];
        }
        return oldData.map((place) => {
          if (place.id === data.id) {
            return data;
          }
          return place;
        });
      });

      // Invalidate to ensure fresh data is eventually fetched from server
      queryClient.invalidateQueries({ queryKey: ["places"] });
      setDialogOpen(false);

      router.invalidate();
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    },
  });

  function onSubmit(formData: EditPlaceSchema) {
    mutate(formData);
  }

  return { form, onSubmit, isPending: form.formState.isSubmitting };
}

export function EditPlaceDialogProvider({
  children,
  place,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  place: Place;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [oldImages, setOldImages] = useState<{ id: string; image: string }[]>(
    place.images.map((image) => ({
      id: crypto.randomUUID(),
      image,
    }))
  );

  function deleteOldImage(id: string) {
    setOldImages(oldImages.filter((image) => image.id !== id));
  }

  return (
    <editPlaceContext.Provider
      value={{
        place,
        open,
        onOpenChange,
        oldImages,
        deleteOldImage,
      }}
    >
      {children}
    </editPlaceContext.Provider>
  );
}

function useEditPlaceContext() {
  const value = useContext(editPlaceContext);
  if (!value)
    throw new Error(
      "useEditPlaceContext must be used within a EditPlaceDialogProvider"
    );
  return value;
}

export default function EditPlaceDialog1() {
  const { open, onOpenChange } = useEditPlaceContext();
  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={false}>
      <DialogContent className="max-w-full">
        <DialogHeader>
          <DialogTitle>Edit place</DialogTitle>
        </DialogHeader>
        <EditPlaceFormWrapper />
      </DialogContent>
    </Dialog>
  );
}

export function EditPlaceFormWrapper() {
  const { form, onSubmit, isPending } = useEditPlace();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <EditPlaceForm form={form} />
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
            Edit
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}

function EditPlaceForm({ form }: { form: UseFormReturn<EditPlaceSchema> }) {
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
  form: UseFormReturn<EditPlaceSchema>;
}) {
  const { oldImages, deleteOldImage } = useEditPlaceContext();
  return (
    <>
      <div className="pb-2 space-y-2">
        <FormLabel>Old Images</FormLabel>
        <div className="flex items-center justify-between flex-nowrap">
          {oldImages.map((oldImage) => (
            <div key={oldImage.id} className="relative">
              {/* <AspectRatio ratio={1}> */}
              <Image
                urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                src={oldImage.image}
                className="w-20 h-20 rounded-sm object-cover object-center"
              />
              {/* </AspectRatio> */}
              <XIcon
                onClick={() => deleteOldImage(oldImage.id)}
                className="absolute top-2 right-2 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem className="max-w-full">
            <FormLabel>Add new Images</FormLabel>
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

export function EditPlaceDialog({ place }: { place: Place }) {
  const [open, setOpen] = useState(false);
  return (
    <EditPlaceDialogProvider open={open} onOpenChange={setOpen} place={place}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <EditIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-full">
          <DialogHeader>
            <DialogTitle>Edit place</DialogTitle>
          </DialogHeader>
          <EditPlaceFormWrapper />
        </DialogContent>
      </Dialog>
    </EditPlaceDialogProvider>
  );
}
