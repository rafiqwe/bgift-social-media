import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

export function useOnlineStatus(socket: Socket | null) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) return;

    const handleUserStatus = (data: { userId: string; status: string }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (data.status === "online") {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    };

    socket.on("user:status", handleUserStatus);

    return () => {
      socket.off("user:status", handleUserStatus);
    };
  }, [socket]);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return { onlineUsers: Array.from(onlineUsers), isUserOnline };
}
