import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RankingTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 pb-2 border-b">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>

          {/* Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 items-center py-3">
              {/* Rank */}
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-8 rounded" />
              </div>

              {/* Player */}
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Score */}
              <div className="text-center">
                <Skeleton className="h-5 w-12 mx-auto" />
              </div>

              {/* Games */}
              <div className="text-center">
                <Skeleton className="h-4 w-8 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
