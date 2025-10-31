"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface MessageButtonProps {
  userId: string;
  userName: string;
}

export default function MessageButton({ userId, userName }: MessageButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = async () => {
    try {
      setIsLoading(true);

      // Create or get existing conversation
      const res = await fetch("/api/messages/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: userId }),
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const data = await res.json();

      // Redirect to the conversation
      router.push(`/messages/${data.conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to start conversation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      disabled={isLoading}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
    >
      {isLoading ? "Loading..." : "💬 Message"}
    </button>
  );
}
