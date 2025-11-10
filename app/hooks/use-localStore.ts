import React, { useEffect, useState } from "react";
interface OtherUserI {
  id: string;
  name: string;
  image: string | null;
}

interface LocalMessageI {
  id: string;
  isOwnMessage: boolean;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
}

const useLocalStore = ({ conversationId } = {}) => {
  const [localMessages, setLocalMessages] = useState<LocalMessageI[]>([]);
  const [localConversation, setLocalConversation] = useState<OtherUserI[]>([]);

  useEffect(() => {
    try {
      const conStored = localStorage.getItem("conversations");
      if (conStored) {
        setLocalConversation(JSON.parse(conStored));
      }
      if (!conversationId) return;
      const stored = localStorage.getItem(`messages_${conversationId}`);
      if (stored) {
        setLocalMessages(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error reading localStorage messages:", err);
    }
  }, []);

  return {
    localMessages,
    localConversation,
  };
};

export default useLocalStore;
