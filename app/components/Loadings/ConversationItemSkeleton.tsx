"use client";

function ConversationItemSkeleton() {
  return (
    <div className="block p-4 animate-pulse">
      <div className="flex items-center gap-3">
        {/* Avatar skeleton */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gray-300" />

          {/* Unread badge skeleton */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-300" />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name + time */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="h-3 w-16 bg-gray-300 rounded" />
          </div>

          {/* Last message */}
          <div className="h-4 w-full bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}
export function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 6 }).map((_, i) => (
        <ConversationItemSkeleton key={i} />
      ))}
    </div>
  );
}
