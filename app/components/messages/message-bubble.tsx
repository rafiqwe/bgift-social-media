"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  isOwnMessage: boolean;
}

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {message.sender.image ? (
          <Image
            src={message.sender.image}
            alt={message.sender.name}
            width={32}
            height={32}
          />
        ) : (
          <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
            {message.sender.name.charAt(0)}
          </div>
        )}
      </div>

      <div
        className={`max-w-xs lg:max-w-md ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          <p className="break-words">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
}
