interface SkeletonProps { className?: string }

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-zinc-800 ${className}`} />;
}

export function PostSkeleton() {
  return (
    <div className="flex gap-3 p-4 border-b border-zinc-800">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
