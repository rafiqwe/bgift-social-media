"use client";

import React, { useEffect, useState } from "react";
import FriendSuggestions from "../friend/FriendSuggestions";
import { Loader2 } from "lucide-react";

const RightSideFriendsSu = () => {
  const [suggestions, setSuggestions] = useState([]);
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
          {suggestions.map((user) => {
            return <FriendSuggestions key={user.id} user={user} />;
          })}
        </div>
      )}
    </div>
  );
};

export default RightSideFriendsSu;
