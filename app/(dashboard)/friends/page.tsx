"use client";

import { useState } from "react";
import Image from "next/image";
import EmptyState from "@/app/components/friend/EmptyState";
import FriendsList from "@/app/components/friend/FriendsList";
import ReceivedFriends from "@/app/components/friend/ReceivedFriends";
import {
  useFriend,
  Friend,
  ExtendedFriendRequest,
} from "@/app/hooks/use-Friend";
import { FriendSkeletonList } from "@/app/components/Loadings/FriendSkeleton";

export default function FriendsPage() {
  const [tab, setTab] = useState<"friends" | "requests" | "sent">("friends");
  const { isLoading, friendData, acceptRequest, rejectRequest, removeFriend } =
    useFriend({ tab });

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
      {isLoading && <FriendSkeletonList />}

      {/* Friends list */}
      {!isLoading && tab === "friends" && (
        <div className="divide-y divide-gray-200">
          {friendData?.length === 0 ? (
            <EmptyState message="You don’t have any friends yet." />
          ) : (
            (friendData as Friend[])?.map((friend) => (
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
      {!isLoading && tab === "requests" && (
        <div className="divide-y divide-gray-200">
          {friendData?.length === 0 ? (
            <EmptyState message="No friend requests received." />
          ) : (
            (friendData as ExtendedFriendRequest[])?.map((req) => (
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
      {!isLoading && tab === "sent" && (
        <div className="divide-y divide-gray-200">
          {friendData?.length === 0 ? (
            <EmptyState message="No friend requests sent." />
          ) : (
            (friendData as ExtendedFriendRequest[])?.map((req) => (
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
