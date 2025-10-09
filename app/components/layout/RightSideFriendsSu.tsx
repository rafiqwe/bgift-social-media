"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UserPlus2, Loader2 } from "lucide-react";

const RightSideFriendsSu = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/users/suggestions");
        const data = await res.json();
        setSuggestions(data.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="bg-white  border border-gray-200  rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <h2 className="font-semibold text-gray-900  mb-4 text-sm uppercase tracking-wide">
        People You May Know
      </h2>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No suggestions available right now 🙌
        </p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${user.id}`}
                  className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 ring-1 ring-gray-100 "
                >
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <Link
                    href={`/profile/${user.id}`}
                    className="font-medium text-gray-900  hover:underline block truncate"
                  >
                    {user.name}
                  </Link>
                  <p className="text-xs text-gray-500 truncate">
                    {user.mutualFriendsCount > 0
                      ? `${user.mutualFriendsCount} mutual friends`
                      : `${user.totalFriends || 0} friends`}
                  </p>
                </div>
              </div>

              <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all active:scale-95">
                <UserPlus2 className="w-4 h-4" />
                Add friend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSideFriendsSu;
