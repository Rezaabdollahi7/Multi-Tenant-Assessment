import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 5;

export function ListSkeleton({ filters }: { filters: number }) {
  return (
    <Card className="gap-4 rounded-3xl p-4 sm:p-6" aria-busy>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 rounded-full sm:max-w-xs sm:flex-1" />
        {Array.from({ length: filters }, (_, index) => (
          <Skeleton key={index} className="h-11 rounded-full sm:w-44" />
        ))}
      </div>
      <div className="space-y-4 py-2">
        {Array.from({ length: ROWS }, (_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
    </Card>
  );
}
