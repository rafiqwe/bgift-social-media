import React, { useEffect, useState } from "react";

const useLocalStore = () => {
  const [localMessages, setLocalMessages] = useState([]);
  const [localConversation, setLocalConversation] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("messages");
      const conStored = localStorage.getItem("conversations");
      if (stored) {
        setLocalMessages(JSON.parse(stored));
      }
      if (conStored) {
        setLocalConversation(JSON.parse(conStored));
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
