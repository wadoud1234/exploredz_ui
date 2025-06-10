import { SiteHeader } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getSingleUserQueryOptions } from "@/data/queries";
// import { getCurrentUserQueryOptions } from "@/data/queries";
import { UserRole } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDaysIcon,
  MailIcon,
  // SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Suspense } from "react";
import { toast } from "sonner";

// const singleUserQuery = getSingleUserQueryOptions();
export const Route = createFileRoute("/_dashboard/users/$id")({
  component: RouteComponent,
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(getSingleUserQueryOptions(params.id));
  },
});

// const sampleUser: User = {
//   id: "usr_123456789",
//   name: "Sarah Johnson",
//   email: "sarah.johnson@example.com",
//   avatar: "/placeholder.svg?height=120&width=120",
//   role: UserRole.USER,
//   createdAt: "2023-01-15T10:30:00Z",
//   updatedAt: "2024-12-09T14:22:00Z",
// };

function RouteComponent() {
  return (
    <>
      <SiteHeader>User Page</SiteHeader>
      <div className="flex flex-col gap-6 p-6">
        <Suspense fallback={<UserProfileSkeleton />}>
          <UserProfile />
        </Suspense>
      </div>
    </>
  );
}

function UserProfileSkeleton() {
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <CardTitle className="text-xl">
              <Skeleton className="h-8 w-32 mx-auto" />
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              {/* <MailIcon className="h-4 w-4" /> */}
              <Skeleton className="h-6 w-44" />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-6 w-20 mx-auto" />
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Details
            </CardTitle>
            <CardDescription>Account information and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                User ID
              </label>
              {/* <div className="font-mono text-sm bg-muted p-2 rounded"> */}
              <Skeleton className="h-10 w-full rounded-sm" />
              {/* </div> */}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  {/* <div className="p-2 bg-muted rounded"> */}
                  <Skeleton className="h-10 w-full rounded-sm" />
                  {/* </div> */}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  {/* <div className="p-2 bg-muted rounded"> */}
                  <Skeleton className="h-10 w-full rounded-sm" />
                  {/* </div> */}
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Activity */}
            <div className="space-y-4">
              <h3 className="font-semibold">Account Activity</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    Account Created
                  </label>
                  {/* <div className="p-2 bg-muted rounded text-sm"> */}
                  {/* {formatDate(user.createdAt)} */}
                  <Skeleton className="h-10 w-full rounded-sm" />
                  {/* </div> */}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    Last Updated
                  </label>
                  {/* <div className="p-2 bg-muted rounded text-sm"> */}
                  {/* {formatDate(user.updatedAt)} */}
                  <Skeleton className="h-10 w-full rounded-sm" />
                  {/* </div> */}
                </div>
              </div>
            </div>

            {/* Role Information */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                User Role
              </label>
              <div className="flex items-center gap-2">
                {/* <Badge className={getRoleColor(user.role)} variant="secondary"> */}
                {/* {user.role.charAt(0).toUpperCase() + user.role.slice(1)} */}

                {/* </Badge> */}
                <Skeleton className="h-6 w-10" />
                {/* <span className="text-sm text-muted-foreground"> */}
                {/* {user.role === UserRole.ADMIN &&
                    "Full system access and user management"} */}
                {/* {user.role === "moderator" &&
                    "Content moderation and user support"} */}
                {/* {user.role === "editor" &&
                    "Content creation and editing permissions"} */}
                {/* {user.role === UserRole.USER && "Standard user access"} */}
                <Skeleton className="h-6 w-30" />
                {/* </span> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getRoleColor(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-red-100 text-red-800 hover:bg-red-200";
    // case "moderator":
    //   return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    // case "editor":
    //   return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserProfile() {
  const { id } = Route.useParams();
  const { data, error } = useSuspenseQuery(getSingleUserQueryOptions(id));
  const user = data.data;
  if (error) {
    toast.error("Fetch User Failed", { description: error.message });
    return <p>{error.message}</p>;
  }
  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-lg sm:text-xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <MailIcon className="h-4 w-4" />
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge className={getRoleColor(user.role)} variant="secondary">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              {/* <Separator className="my-4" />
              <Button className="w-full" variant="outline">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </Button> */}
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                User Details
              </CardTitle>
              <CardDescription>
                Account information and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  User ID
                </label>
                <div className="font-mono text-xs sm:text-sm bg-muted p-2 rounded">
                  {user.id}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <div className="p-2 bg-muted rounded">{user.name}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <div className="p-2 bg-muted rounded">{user.email}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold">Account Activity</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4" />
                      Account Created
                    </label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4" />
                      Last Updated
                    </label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {formatDate(user.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Information */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  User Role
                </label>
                <div className="flex items-center gap-2">
                  <Badge
                    className={getRoleColor(user.role)}
                    variant="secondary"
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {user.role === UserRole.ADMIN &&
                      "Full system access and user management"}
                    {/* {user.role === "moderator" &&
                    "Content moderation and user support"} */}
                    {/* {user.role === "editor" &&
                    "Content creation and editing permissions"} */}
                    {user.role === UserRole.USER && "Standard user access"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Action Buttons */}
        {/* <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline">
              <MailIcon className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline">View Activity Log</Button>
            {user.role !== UserRole.ADMIN && (
              <Button variant="destructive" className="ml-auto">
                Deactivate Account
              </Button>
            )}
          </div>
        </CardContent>
      </Card> */}
        {/* //{" "} */}
      </div>
    </>
  );
}
