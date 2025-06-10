// import LoadingComponent from "@/components/custom/loading-component";
import { PlacesGridSkeleton } from "@/components/place-card-skeleton";
import { PlacesGrid } from "@/components/places-grid";
import { SiteHeader } from "@/components/site-header";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { IMAGEKIT_URL_ENDPOINT } from "@/constants";
import { getPlacesQueryOptions } from "@/data/queries";
import CreatePlaceDialog from "@/forms/places/create-place.form";
// import EditPlaceDialog from "@/forms/places/edit-place.form";
import type { Place } from "@/types";
// import { Image } from "@imagekit/react";
// import type { Place } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { toast } from "sonner";
// import { PlusIcon } from "lucide-react";
// import { toast } from "sonner";

// const placesQueryOptions = usePlacesQueryOptions();
export const Route = createFileRoute("/_dashboard/places/")({
  component: RouteComponent,
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
      <div className="flex flex-col w-full h-full gap-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Places</h1>
            <p className="text-muted-foreground">
              manage and view your added places
            </p>
          </div>
          {/* <Button className="font-semibold">
            <PlusIcon className="mr-2 h-4 w-4" />
            New
          </Button> */}
          <CreatePlaceDialog />
        </div>
        <Suspense fallback={<PlacesGridSkeleton />}>
          <PlacesGridParent />
        </Suspense>
      </div>
    </>
  );
}

function PlacesGridParent() {
  const { data: places, error } = useSuspenseQuery(getPlacesQueryOptions());
  if (error) {
    toast.error("Places Fetching Failed", { description: error.message });
    return <p>Places Fetching Failed</p>;
  }

  const handleEdit = (place: Place) => {
    console.log("Editing place:", place);
    // Implement your edit logic here
    alert(`Editing place: ${place.name}`);
  };

  const handleDelete = (place: Place) => {
    console.log("Deleting place:", place);
    // Implement your delete logic here
    if (confirm(`Are you sure you want to delete "${place.name}"?`)) {
      // setPlaces((prev) => prev.filter((p) => p.id !== place.id));
    }
  };

  return (
    <PlacesGrid places={places} onEdit={handleEdit} onDelete={handleDelete} />
  );
}

// function PlacesGrid() {
//   const { data: places, error } = useSuspenseQuery(getPlacesQueryOptions());
//   if (error) {
//     toast.error("Places Fetching Failed", { description: error.message });
//     return <p>Places Fetching Failed</p>;
//   }

//   const handleEdit = (place: Place) => {
//     console.log("Editing place:", place);
//     // Implement your edit logic here
//     alert(`Editing place: ${place.name}`);
//   };

//   const handleDelete = (place: Place) => {
//     console.log("Deleting place:", place);
//     // Implement your delete logic here
//     if (confirm(`Are you sure you want to delete "${place.name}"?`)) {
//       // setPlaces((prev) => prev.filter((p) => p.id !== place.id));
//     }
//   };
//   return (
//     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//       <PlacesGrid
//         places={places}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         loading={loading}
//       />

//       {/* {Array.isArray(places) && places.length > 0 ? (
//         places.map((place) => (
//           <Card
//             key={place.id}
//             className="pt-0 flex-col flex flex-1 bg-blue-100"
//           >
//             <AspectRatio ratio={16 / 9}>
//               <Image
//                 urlEndpoint={IMAGEKIT_URL_ENDPOINT} //"https://ik.imagekit.io/your_imagekit_id"
//                 src={place.images[0]}
//                 fill
//                 className="object-cover object-center h-full w-full border-b"
//                 alt={place.name}
//                 // transformation={[{ width: 400, height: 300 }, { rotation: 90 }]}
//               />
//             </AspectRatio>
//             <CardHeader className="bg-red-600 flex-1 flex flex-col">
//               <div className="flex items-start justify-between flex-1">
//                 <div className="flex flex-col bg-green-600 space-y-1 flex-1">
//                   <div className="flex items-center justify-between gap-2 flex-1">
//                     <span className="flex text-lg flex-1">
//                       {place.name.split(" ").slice(0, 30).join(" ")}
//                     </span>
//                     <div className="shrink-0">
//                       <EditPlaceDialog place={place} />
//                     </div>
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     <span>{place.wilayaCode}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="">
//               <CardDescription className="text-sm ine-clamp-2">
//                 {place.description}
//               </CardDescription>
//             </CardContent>
//           </Card>
//         ))
//       ) : (
//         <>No places found</>
//       )}*/}
//     </div>
//   );
// }
