import { PlaceDetailsSkeleton } from "@/components/place-details-skeleton";
import { SiteHeader } from "@/components/site-header";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fromCodeToWilaya, IMAGEKIT_URL_ENDPOINT } from "@/constants";
import { getSinglePlaceQueryOptions } from "@/data/queries";
import DeletePlaceDialog from "@/forms/places/delete-place.form";
import { EditPlaceDialog } from "@/forms/places/edit-place.form";
import { Image } from "@imagekit/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import { Suspense, useState } from "react";

export const Route = createFileRoute("/_dashboard/places/$id")({
  component: PlaceDetailsPage,
  loader: async ({ context, params }) => {
    context.queryClient.ensureQueryData(getSinglePlaceQueryOptions(params.id));
  },
});

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

function PlaceDetailsPage() {
  const { id } = Route.useParams();

  return (
    <>
      <SiteHeader>Place Page</SiteHeader>
      <main className="flex flex-col items-start gap-6 p-6">
        {/* <main className="container mx-auto py-8 px-4"> */}
        <Suspense fallback={<PlaceDetailsSkeleton />}>
          <PlaceDetails id={id} />
        </Suspense>
      </main>
    </>
  );
}

function PlaceDetails({ id }: { id: string }) {
  const { data: place } = useSuspenseQuery(getSinglePlaceQueryOptions(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (place && place.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === place.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (place && place.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? place.images.length - 1 : prev - 1
      );
    }
  };

  if (!place) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">Place Not Found</h2>
          <p className="text-muted-foreground">
            The place you're looking for doesn't exist.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Images Section */}
        <div className="lg:col-span-2 space-y-4 ">
          {place.images.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden w-full">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                    src={place.images[currentImageIndex] || "/placeholder.svg"}
                    alt={place.name}
                    fill
                    className="object-cover object-center w-full rounded-md"
                  />
                </AspectRatio>
                {place.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full"
                      onClick={prevImage}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full"
                      onClick={nextImage}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-1 rounded-md text-sm">
                      {currentImageIndex + 1} / {place.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Image Thumbnails */}
              {place.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {place.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                        src={image || "/placeholder.svg"}
                        alt={`${place.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1 min-w-0">
                  <CardTitle className="text-2xl leading-tight break-all line-clamp-2">
                    {place.name}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    {fromCodeToWilaya(place.wilayaCode)} {place.wilayaCode}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Added:</span>
                  <span>{getRelativeTime(place.createdAt)}</span>
                </div>
                {place.updatedAt !== place.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{getRelativeTime(place.updatedAt)}</span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="space-y-2">
                {place.createdBy && (
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Added by:</span>
                    <span className="font-mono text-xs">
                      {place.createdBy.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <EditPlaceDialog place={place} />
                <DeletePlaceDialog place={place} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
