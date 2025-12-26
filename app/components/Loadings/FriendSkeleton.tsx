function FriendSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 animate-pulse">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-300" />

        {/* Name + username */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Action button */}
      <div className="h-8 w-20 bg-gray-300 rounded-md" />
    </div>
  );
}

export function FriendSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: count }).map((_, i) => (
        <FriendSkeleton key={i} />
      ))}
    </div>
  );
}
