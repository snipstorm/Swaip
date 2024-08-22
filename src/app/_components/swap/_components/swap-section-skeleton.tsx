import { Skeleton } from "~components/ui/skeleton";

export default function SwapSectionSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-24" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
