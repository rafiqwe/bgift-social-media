"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewMessageModal({
  isOpen,
  onClose,
}: NewMessageModalProps) {
  const router = useRouter();
  const [friends, setFriends] = useState<
    { id: string; name: string; image: string | null; username: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends/list");
      const data = await res.json();
      setFriends(data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleSelectFriend = async (friendId: string) => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/messages/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: friendId }),
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const data = await res.json();
      router.push(`/messages/${data.conversationId}`);
      onClose();
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFriends = friends?.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border-gray-300 border rounded-lg max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">New Message</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredFriends?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {searchQuery ? "No friends found" : "No friends yet"}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredFriends?.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleSelectFriend(friend.id)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {friend.image ? (
                      <Image
                        src={friend.image}
                        alt={friend.name}
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {friend.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">{friend.name}</p>
                    <p className="text-sm text-gray-600">@{friend.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
