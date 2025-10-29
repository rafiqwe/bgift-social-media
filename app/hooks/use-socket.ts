import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initSocket, getSocket, disconnectSocket } from "@/lib/socket";

export function useSocket(userId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = initSocket();
    setSocket(socketInstance);

    const onConnect = () => {
      setIsConnected(true);
      if (userId) {
        socketInstance.emit("user:online", userId);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);

    // Check if already connected
    if (socketInstance.connected) {
      onConnect();
    }

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
    };
  }, [userId]);

  return { socket, isConnected };
}
