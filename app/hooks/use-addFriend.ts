"use client";

import { useState } from "react";

const useAddFriend = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFriendRqSent, setIsFriendRqSent] = useState(false);

  const handleAddFriend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });
      if (res.ok) {
        setIsFriendRqSent(true);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return { handleAddFriend, isLoading, isFriendRqSent };
};

export default useAddFriend;
