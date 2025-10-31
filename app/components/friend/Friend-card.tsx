"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FriendCardProps {
  friend: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
  };
}

export default function FriendCard({ friend }: FriendCardProps) {
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handleStartChat = async () => {
    try {
      setIsCreatingChat(true);

      const res = await fetch("/api/messages/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: friend.id }),
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const data = await res.json();
      router.push(`/messages/${data.conversationId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${friend.id}`}>
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {friend.image ? (
              <Image
                src={friend.image}
                alt={friend.name}
                width={64}
                height={64}
              />
            ) : (
              <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                {friend.name.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1">
          <Link href={`/profile/${friend.id}`}>
            <h3 className="font-semibold text-gray-800 hover:text-blue-600">
              {friend.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600">@{friend.username}</p>
          {friend.bio && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {friend.bio}
            </p>
          )}
        </div>

        <button
          onClick={handleStartChat}
          disabled={isCreatingChat}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isCreatingChat ? "..." : "💬"}
        </button>
      </div>
    </div>
  );
}