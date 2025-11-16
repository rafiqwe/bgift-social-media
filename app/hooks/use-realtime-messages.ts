import { useState, useEffect, useCallback } from "react";
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

export function useRealtimeMessages(
  socket: Socket | null,
  conversationId: string | null,
  currentUserId: string
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [oppositeUser, setOppositeUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/messages/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      localStorage.setItem(
        `messages_${conversationId}`,
        JSON.stringify(data.messages, data.oppositeUser)
      );
      setMessages(data.messages);
      setOppositeUser(data.oppositeUser);

      // Mark messages as read
      await fetch("/api/messages/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      // Notify others via socket
      socket?.emit("messages:read", { conversationId, userId: currentUserId });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, socket, currentUserId]);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim() || !socket) return false;

      try {
        setIsSending(true);
        const res = await fetch("/api/messages/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, content }),
        });

        if (!res.ok) throw new Error("Failed to send message");

        const data = await res.json();
        const newMessage = data.message;
        setMessages((prev) => [...prev, newMessage]);

        // Add to local state

        // Emit to other users via socket
        socket.emit("message:send", { conversationId, message: newMessage });
        socket.emit("message:sendNotification", {
          conversationId,
          message: newMessage,
        });
        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, socket]
  );

  // Start typing
  const startTyping = useCallback(() => {
    if (!conversationId || !socket) return;

    socket.emit("typing:start", {
      conversationId,
      user: { id: currentUserId },
    });
  }, [conversationId, socket, currentUserId]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!conversationId || !socket) return;

    socket.emit("typing:stop", {
      conversationId,
      user: { id: currentUserId },
    });
  }, [conversationId, socket, currentUserId]);

  // Join conversation room
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", conversationId);
    fetchMessages();

    return () => {
      socket.emit("conversation:leave", conversationId);
    };
  }, [socket, conversationId, fetchMessages]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);

      // Mark as read if conversation is open
      if (conversationId) {
        fetch("/api/messages/read", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId }),
        });

        socket.emit("messages:read", { conversationId, userId: currentUserId });
      }
    };

    const handleTypingStart = (user: { id: string }) => {
      if (user.id !== currentUserId) {
        setTypingUsers((prev) => new Set(prev).add(user.id));
      }
    };

    const handleTypingStop = (user: { id: string }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user.id);
        return newSet;
      });
    };

    socket.on("message:new", handleNewMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, conversationId, currentUserId]);

  return {
    messages,
    oppositeUser,
    isLoading,
    isSending,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    startTyping,
    stopTyping,
    refresh: fetchMessages,
  };
}
