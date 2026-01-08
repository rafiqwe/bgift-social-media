"use client";

import { useQuery } from "@tanstack/react-query";

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

const fetchConversations = async (): Promise<Conversation[]> => {
  const res = await fetch("/api/messages/conversations");

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const data = await res.json();

  // optional localStorage cache
  localStorage.setItem("conversations", JSON.stringify(data.conversations));

  return data.conversations;
};

export function useConversations() {
  const {
    data: conversations = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,

    staleTime: 30 * 1000, // 30s no refetch
    gcTime: 5 * 60 * 1000, // 5 min cache
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    conversations,
    isLoading, // first load
    isFetching, // background refresh
    error: error ? (error as Error).message : null,
    refresh: refetch,
  };
}
