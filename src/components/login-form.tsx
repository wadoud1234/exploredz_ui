import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "./custom/submit-button";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import type { ResponseType, User } from "@/types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/constants";

const loginSchema = z.object({
  // name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().email().trim().min(1, { message: "Email is required" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password is at least 8 characters" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

function useLoginForm() {
  const router = useRouter();
  const navigate = useNavigate();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (formData: LoginSchema) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = (await response.json()) as ResponseType<{
        token: string;
        user: User;
      }>;
      if (data.success) return data;
      else throw new Error(data.error);
    },
    onSuccess: (data) => {
      toast.success("Logged In");
      queryClient.setQueryData(["user"], data);
      // localStorage.setItem("token", data.data.token);
      router.invalidate();
      navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    },
  });
  async function onSubmit(formData: LoginSchema) {
    mutate(formData);
  }
  return {
    form,
    onSubmit,
    isPending: form.formState.isSubmitting,
  };
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useLoginForm();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-3">
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SubmitButton isPending={isPending} className="w-full">
                  Login
                </SubmitButton>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/register"
                  className="underline underline-offset-4"
                >
                  Register
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
