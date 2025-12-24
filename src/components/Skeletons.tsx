import { Skeleton } from '@/components/ui/skeleton';

export function MatchCardSkeleton() {
  return (
    <div className="score-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-16 h-4" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-32 h-5" />
          </div>
          <Skeleton className="w-8 h-8" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-28 h-5" />
          </div>
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}

export function MatchListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StandingsTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="flex-1 h-5" />
          <Skeleton className="w-8 h-5" />
          <Skeleton className="w-8 h-5" />
          <Skeleton className="w-8 h-5" />
        </div>
      ))}
    </div>
  );
}
