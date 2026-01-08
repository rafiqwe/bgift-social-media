"use client";

import { useEffect, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
}

interface MessagesResponse {
  messages: Message[];
  oppositeUser: any;
}

export function useRealtimeMessages(
  socket: Socket | null,
  conversationId: string | null,
  currentUserId: string
) {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  /* -----------------------------
     Fetch messages (Query)
  ------------------------------ */
  const { data, isLoading } = useQuery<MessagesResponse>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!conversationId,
    staleTime: Infinity, // messages rarely go stale
  });

  /* -----------------------------
     Send message (Mutation)
  ------------------------------ */
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },

    // 🔥 Optimistic update
    onMutate: async (content) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });

      const previousData = queryClient.getQueryData<MessagesResponse>([
        "messages",
        conversationId,
      ]);

      if (previousData) {
        queryClient.setQueryData(["messages", conversationId], {
          ...previousData,
          messages: [
            ...previousData.messages,
            {
              id: `temp-${Date.now()}`,
              content,
              senderId: currentUserId,
              createdAt: new Date().toISOString(),
              isRead: true,
              sender: { id: currentUserId } as any,
            },
          ],
        });
      }

      return { previousData };
    },

    onError: (_err, _content, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["messages", conversationId],
          context.previousData
        );
      }
    },

    onSuccess: (data) => {
      const message = data.message;

      queryClient.setQueryData<MessagesResponse>(
        ["messages", conversationId],
        (old) => (old ? { ...old, messages: [...old.messages, message] } : old)
      );

      socket?.emit("message:send", {
        conversationId,
        message,
      });
    },
  });

  /* -----------------------------
     Typing handlers
  ------------------------------ */
  const startTyping = useCallback(() => {
    socket?.emit("typing:start", {
      conversationId,
      user: { id: currentUserId },
    });
  }, [socket, conversationId, currentUserId]);

  const stopTyping = useCallback(() => {
    socket?.emit("typing:stop", {
      conversationId,
      user: { id: currentUserId },
    });
  }, [socket, conversationId, currentUserId]);

  /* -----------------------------
     Socket listeners
  ------------------------------ */
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", conversationId);

    const onNewMessage = (message: Message) => {
      queryClient.setQueryData<MessagesResponse>(
        ["messages", conversationId],
        (old) =>
          old
            ? { ...old, messages: [...old.messages, message] }
            : { messages: [message], oppositeUser: null }
      );

      socket.emit("messages:read", {
        conversationId,
        userId: currentUserId,
      });
    };

    const onTypingStart = (user: { id: string }) => {
      if (user.id !== currentUserId) {
        setTypingUsers((prev) => new Set(prev).add(user.id));
      }
    };

    const onTypingStop = (user: { id: string }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    };

    socket.on("message:new", onNewMessage);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);

    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("message:new", onNewMessage);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
    };
  }, [socket, conversationId, currentUserId, queryClient]);

  return {
    messages: data?.messages ?? [],
    oppositeUser: data?.oppositeUser,
    isLoading,
    isSending: sendMessageMutation.isPending,
    typingUsers: Array.from(typingUsers),
    sendMessage: sendMessageMutation.mutateAsync,
    startTyping,
    stopTyping,
  };
}
