import LoadingComponent from "@/components/custom/loading-component";
import { SiteHeader } from "@/components/site-header";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlacesQueryOptions } from "@/data/queries";
import CreatePlaceDialog from "@/forms/places/create-place.form";
import type { Place } from "@/types";
// import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
// import { PlusIcon } from "lucide-react";
// import { toast } from "sonner";

const placesQueryOptions = usePlacesQueryOptions();
export const Route = createFileRoute("/_dashboard/places/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(placesQueryOptions);
  },
});

// const places = [
//   {
//     id: 1,
//     name: "Casbah of Algiers",
//     description:
//       "Historic citadel and UNESCO World Heritage site with traditional Ottoman architecture.",
//     location: "Algiers",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 2,
//     name: "Timgad Ruins",
//     description:
//       "Ancient Roman city ruins showcasing well-preserved Roman urban planning.",
//     location: "Batna",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 3,
//     name: "Sahara Desert",
//     description:
//       "Vast desert landscape with golden dunes and unique desert wildlife.",
//     location: "Tamanrasset",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 4,
//     name: "Djémila",
//     description:
//       "Roman ruins set in a mountainous region with spectacular ancient architecture.",
//     location: "Sétif",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 5,
//     name: "Tassili n'Ajjer",
//     description:
//       "National park famous for prehistoric rock art and unique geological formations.",
//     location: "Illizi",
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 6,
//     name: "Oran Waterfront",
//     description:
//       "Beautiful Mediterranean coastal city with vibrant culture and architecture.",
//     location: "Oran",
//     image: "/placeholder.svg?height=200&width=300",
//   },
// ];

function RouteComponent() {
  return (
    <>
      <SiteHeader>Places</SiteHeader>
      <div className="flex flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Places</h1>
            <p className="text-muted-foreground">
              Discover and manage beautiful places across Algeria
            </p>
          </div>
          {/* <Button className="font-semibold">
            <PlusIcon className="mr-2 h-4 w-4" />
            New
          </Button> */}
          <CreatePlaceDialog />
        </div>
        <Suspense fallback={<LoadingComponent />}>
          <PlacesGrid />
        </Suspense>
      </div>
    </>
  );
}

function PlacesGrid() {
  const places: Place[] = [];
  // const { error } = useSuspenseQuery(usePlacesQueryOptions());
  // if (error) {
  //   toast.error("Places Fetching Failed", { description: error.message });
  //   return <p>Places Fetching Failed</p>;
  // }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
      {Array.isArray(places) && places.length > 0 ? (
        places.map((place) => (
          <Card key={place.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={"https://placehold.co/400x300"}
                alt={place.name}
                // fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{place.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{place.wilayaCode}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {place.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))
      ) : (
        <>No places found</>
      )}
    </div>
  );
}
