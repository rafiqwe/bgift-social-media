import { useState, useEffect, useCallback } from "react";

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
    };
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unReadCount, setUnReadCount] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/messages/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");

      const data = await res.json();
      localStorage.setItem("conversations", JSON.stringify(data.conversations));
      setConversations(data.conversations);
      console.log("from  conversation hook:", data);

      // data.conversations.map((data) => {
      //   setUnReadCount(data.unreadCount);
      // });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refresh: fetchConversations,
  };
}
