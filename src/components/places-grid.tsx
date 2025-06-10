import { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { Image } from "@imagekit/react";
import { fromCodeToWilaya, IMAGEKIT_URL_ENDPOINT } from "@/constants";
import { AspectRatio } from "./ui/aspect-ratio";
import DeletePlaceDialog from "@/forms/places/delete-place.form";
import { EditPlaceDialog } from "@/forms/places/edit-place.form";

export type Place = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  description: string;
  wilayaCode: number;
  images: string[];
  createdById: string;
};

interface PlacesGridProps {
  places: Place[];
  onEdit: (place: Place) => void;
  onDelete: (place: Place) => void;
  loading?: boolean;
}

export function PlacesGrid({ places, onEdit, onDelete }: PlacesGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("all");

  // Get unique wilaya codes for filter dropdown
  const wilayaCodes = useMemo(() => {
    const codes = Array.from(
      new Set(places.map((place) => place.wilayaCode))
    ).sort((a, b) => a - b);
    return codes;
  }, [places]);

  // Filter places based on search and wilaya filter
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWilaya =
        selectedWilaya === "all" ||
        place.wilayaCode.toString() === selectedWilaya;
      return matchesSearch && matchesWilaya;
    });
  }, [places, searchTerm, selectedWilaya]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
          <SelectTrigger className="w-full sm:w-48">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by Wilaya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wilayas</SelectItem>
            {wilayaCodes.map((code) => (
              <SelectItem key={code} value={code.toString()}>
                {fromCodeToWilaya(code)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredPlaces.length}{" "}
        {filteredPlaces.length === 1 ? "place" : "places"} found
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No places found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}

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

function PlaceCard({
  place,
}: {
  place: Place;
  onEdit: (place: Place) => void;
  onDelete: (place: Place) => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    // e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === place.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    // e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? place.images.length - 1 : prev - 1
    );
  };

  const relativeTime = getRelativeTime(place.createdAt);

  return (
    <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow pt-0">
      <div className="relative w-full ">
        {place.images.length > 0 ? (
          <>
            <AspectRatio ratio={16 / 12}>
              <Image
                urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                src={place.images[currentImageIndex]}
                alt={place.name}
                fill
                className="object-cover object-center w-full h-full rounded-t-lg border-b"
              />
            </AspectRatio>
            {place.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8"
                  onClick={prevImage}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8"
                  onClick={nextImage}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded-md text-xs">
                  {currentImageIndex + 1}/{place.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            No image available
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to="/places/$id"
                params={{ id: place.id }}
                className="font-semibold text-lg truncate break-all max-w-40 sm:max-w-48"
              >
                {place.name}
              </Link>
            </div>
            <Badge variant="outline" className="mt-1 w-fit">
              {fromCodeToWilaya(place.wilayaCode) ?? place.wilayaCode}{" "}
              {place.wilayaCode}
            </Badge>
          </div>
          <EditPlaceDialog place={place} />
          <DeletePlaceDialog place={place} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p
          className="text-muted-foreground text-sm line-clamp-3"
          title={place.description}
        >
          {place.description}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Added {relativeTime}</p>
        </div>
      </CardContent>
    </Card>
  );
}
