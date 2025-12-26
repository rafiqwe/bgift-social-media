"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, MessageCircle, Heart, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/app/hooks/use-notifications";

export default function NotificationList() {
  const { notifications, isLoading, markAsRead } = useNotifications();

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Bell className="w-10 h-10 text-gray-400 mb-3 animate-pulse" />
        <p className="text-lg font-medium">Loading notifications...</p>
      </div>
    );

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Bell className="w-10 h-10 text-gray-400 mb-3" />
        <p className="text-lg font-medium">No notifications yet</p>
        <p className="text-sm text-gray-400">
          Stay tuned for updates <Bell className="w-4 h-4" />
        </p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <ul className="space-y-3">
      {notifications.map((n) => (
        <li
          key={n.id}
          className={`flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 hover:shadow-sm ${
            n.isRead ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200"
          }`}
        >
          {/*  Profile image */}
          <div className="relative flex-shrink-0">
            <Image
              src={n.fromUser?.image || "/default-avatar.png"}
              alt={n.fromUser?.name || "User"}
              width={44}
              height={44}
              className="rounded-full border border-gray-200 object-cover"
            />
            <div className="absolute right-0 bottom-0 bg-gray-100 rounded-full p-1 shadow-sm">
              {getIcon(n.type.toLowerCase())}
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-800 leading-snug">
              <span className="font-semibold">{n.fromUser?.name}</span>{" "}
              {n.message}{" "}
              {n.post?.content && (
                <span className="text-gray-500">“{n.post.content}”</span>
              )}
            </p>

            {n.link && (
              <Link
                href={n.link}
                onClick={() => markAsRead(n.id)}
                className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block"
              >
                View {n.post ? "details" : "Profile"} →
              </Link>
            )}

            <p className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
