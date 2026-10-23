import { ListSkeleton } from "@/components/shared/list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function FindingsLoading() {
  return (
    <div className="space-y-8" aria-label="در حال بارگذاری یافته‌ها">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <ListSkeleton filters={3} />
    </div>
  );
}
