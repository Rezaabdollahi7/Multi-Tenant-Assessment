import { Skeleton } from "@/components/ui/skeleton";

export function BreakdownSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4" aria-busy>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
}
