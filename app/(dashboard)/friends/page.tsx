"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EmptyState from "@/app/components/friend/EmptyState";
import FriendsList from "@/app/components/friend/FriendsList";
import ReceivedFriends from "@/app/components/friend/ReceivedFriends";

type Friend = {
  id: string;
  name: string;
  username: string;
  image: string;
  bio?: string;
};

type FriendRequest = {
  id: string;
  requester?: Friend;
  receiver?: Friend;
};

export default function FriendsPage() {
  const [tab, setTab] = useState<"friends" | "requests" | "sent">("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [received, setReceived] = useState<FriendRequest[]>([]);
  const [sent, setSent] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch friends/requests
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        if (tab === "friends") {
          const res = await fetch("/api/friends/list");
          const data = await res.json();
          setFriends(data.friends || []);
        } else if (tab === "requests") {
          const res = await fetch("/api/friends/requests");
          const data = await res.json();
          setReceived(data.received || []);
        } else if (tab === "sent") {
          const res = await fetch("/api/friends/requests");
          const data = await res.json();
          setSent(data.sent || []);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [tab]);

  // Actions
  const acceptRequest = async (id: string) => {
    await fetch("/api/friends/accept", {
      method: "POST",
      body: JSON.stringify({ requestId: id }),
    });
    setReceived((prev) => prev.filter((r) => r.id !== id));
  };

  const rejectRequest = async (id: string) => {
    await fetch("/api/friend-requests/reject", {
      method: "POST",
      body: JSON.stringify({ requestId: id }),
    });
    setReceived((prev) => prev.filter((r) => r.id !== id));
  };

  const removeFriend = async (id: string) => {
    console.log("the id:", id);
    try {
      await fetch("/api/friends/unfriend", {
        method: "DELETE",
        body: JSON.stringify({ friendId: id }),
      });
      setFriends((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.log("Error form unfriend:", err);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Friends</h1>
        <div className="flex gap-3">
          <button
            className={`px-3 py-1 cursor-pointer rounded-md text-sm ${
              tab === "friends" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("friends")}
          >
            All Friends
          </button>
          <button
            className={`px-3 py-1 cursor-pointer rounded-md text-sm ${
              tab === "requests" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("requests")}
          >
            Requests
          </button>
          <button
            className={`px-3 py-1 cursor-pointer rounded-md text-sm ${
              tab === "sent" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("sent")}
          >
            Sent
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Friends list */}
      {!loading && tab === "friends" && (
        <div className="divide-y divide-gray-200">
          {friends.length === 0 ? (
            <EmptyState message="You don’t have any friends yet." />
          ) : (
            friends.map((friend) => (
              <FriendsList
                key={friend.id}
                friend={friend}
                removeFriend={removeFriend}
              />
            ))
          )}
        </div>
      )}

      {/* Received requests */}
      {!loading && tab === "requests" && (
        <div className="divide-y divide-gray-200">
          {received.length === 0 ? (
            <EmptyState message="No friend requests received." />
          ) : (
            received.map((req) => (
              <ReceivedFriends
                key={req.id}
                req={req}
                acceptRequest={acceptRequest}
                rejectRequest={rejectRequest}
              />
            ))
          )}
        </div>
      )}

      {/* Sent requests */}
      {!loading && tab === "sent" && (
        <div className="divide-y divide-gray-200">
          {sent.length === 0 ? (
            <EmptyState message="No friend requests sent." />
          ) : (
            sent.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={req.receiver?.image || "/images/default-avatar.png"}
                    alt={req.receiver?.name || "user"}
                    width={50}
                    height={50}
                    className="rounded-full border"
                  />
                  <div>
                    <h2 className="font-semibold">{req.receiver?.name}</h2>
                    <p className="text-sm text-gray-500">
                      @{req.receiver?.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFriend(req.receiver?.id || "")}
                  className="px-3 py-1 text-sm bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
