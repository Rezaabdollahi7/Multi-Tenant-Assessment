import { Skeleton } from "@/components/ui/skeleton";

export function DetailsSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-6" aria-busy aria-label={label}>
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-72" />
        <Skeleton className="h-4 w-full max-w-prose" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
