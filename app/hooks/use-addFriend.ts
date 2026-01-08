"use client";
import axios from "axios";
import { useState } from "react";

const useAddFriend = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFriendRqSent, setIsFriendRqSent] = useState(false);

  const handleAddFriend = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/friends/request", {
        receiverId: userId,
      });
      if (res.data.success) {
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
