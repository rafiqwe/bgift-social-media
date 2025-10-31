"use client";

import { useState, FormEvent, useEffect, useRef } from "react";

interface RealtimeMessageInputProps {
  onSend: (content: string) => Promise<boolean>;
  isSending: boolean;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export default function RealtimeMessageInput({
  onSend,
  isSending,
  onTypingStart,
  onTypingStop,
}: RealtimeMessageInputProps) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const handleChange = (value: string) => {
    setMessage(value);

    // Start typing indicator
    if (!isTypingRef.current && value.trim()) {
      onTypingStart();
      isTypingRef.current = true;
    }

    // Reset timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        onTypingStop();
        isTypingRef.current = false;
      }
    }, 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    // Stop typing indicator
    if (isTypingRef.current) {
      onTypingStop();
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const success = await onSend(message);
    if (success) {
      setMessage("");
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        onTypingStop();
      }
    };
  }, [onTypingStop]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
