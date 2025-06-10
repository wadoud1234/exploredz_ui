import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlaceCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <Skeleton className="h-5 w-20 mt-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PlacesGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search and Filter Skeletons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>

      {/* Results count skeleton */}
      <Skeleton className="h-4 w-32" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
