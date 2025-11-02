import React, { useEffect, useState } from "react";

const useLocalStore = ({ conversationId } = {}) => {
  const [localMessages, setLocalMessages] = useState([]);
  const [localConversation, setLocalConversation] = useState([]);

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
