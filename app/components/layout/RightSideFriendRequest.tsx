"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RightSideFriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    // Fetch friend requests
    fetch("/api/friends/requests")
      .then((res) => res.json())
      .then((data) => setFriendRequests(data.received.slice(0, 3)))
      .catch(console.error);
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      await fetch("/api/friends/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await fetch("/api/friends/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };
  return (
    <div>
      {friendRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Friend Requests</h2>
            <Link
              href="/friends"
              className="text-sm text-blue-600 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div key={request.id} className="flex items-center gap-3">
                <Link
                  href={`/profile/${request.requester.id}`}
                  className="w-12 h-12 rounded-full overflow-hidden bg-gray-200"
                >
                  {request.requester.image ? (
                    <Image
                      src={request.requester.image}
                      alt={request.requester.name}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {request.requester.name.charAt(0)}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${request.requester.id}`}
                    className="font-medium text-gray-800 hover:underline block truncate"
                  >
                    {request.requester.name}
                  </Link>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSideFriendRequest;
