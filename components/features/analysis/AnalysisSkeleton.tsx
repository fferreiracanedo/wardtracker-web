import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner, LoadingPulse } from "@/components/ui/loading-spinner";

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-80 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* WardScore Display */}
      <Card className="border-lol-gold/20 bg-gradient-to-br from-lol-gold/5 to-lol-blue/5">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-6 w-32 mx-auto" />
            <div className="relative">
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingPulse />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-20 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Maps and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Death Heatmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <LoadingSpinner size="sm" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-16 mx-auto" />
                  <Skeleton className="h-6 w-8 mx-auto" />
                </div>
                <div className="text-center space-y-1">
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-6 w-12 mx-auto" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ward Suggestions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </div>
              <LoadingSpinner size="sm" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-3 border rounded"
                  >
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <LoadingSpinner size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
            <Skeleton className="h-40 w-full rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
