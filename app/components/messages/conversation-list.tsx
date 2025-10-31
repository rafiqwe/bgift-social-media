"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useConversations } from "@/app/hooks/use-conversations";
import useLocalStore from "@/app/hooks/use-localStore";

interface ConversationListProps {
  currentConversationId?: string;
}

export default function ConversationList({
  currentConversationId,
}: ConversationListProps) {
  const { conversations, isLoading } = useConversations();
  const { localConversation } = useLocalStore();
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-200">
        {localConversation.map((conversation: any) => (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className={`block p-4 hover:bg-gray-50 transition ${
              currentConversationId === conversation.id ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {conversation.participant?.image ? (
                    <Image
                      src={conversation.participant.image}
                      alt={conversation.participant.name}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {conversation.participant?.name.charAt(0)}
                    </div>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800 truncate">
                    {conversation.participant?.name}
                  </p>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(
                        new Date(conversation.lastMessage.createdAt),
                        { addSuffix: true }
                      )}
                    </span>
                  )}
                </div>
                {conversation.lastMessage ? (
                  <p
                    className={`text-sm truncate ${
                      conversation.unreadCount > 0
                        ? "font-semibold text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {conversation.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">No messages yet</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Start chatting with your friends!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`/messages/${conversation.id}`}
          className={`block p-4 hover:bg-gray-50 transition ${
            currentConversationId === conversation.id ? "bg-blue-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {conversation.participant?.image ? (
                  <Image
                    src={conversation.participant.image}
                    alt={conversation.participant.name}
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {conversation.participant?.name.charAt(0)}
                  </div>
                )}
              </div>
              {conversation.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {conversation.unreadCount}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800 truncate">
                  {conversation.participant?.name}
                </p>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(
                      new Date(conversation.lastMessage.createdAt),
                      { addSuffix: true }
                    )}
                  </span>
                )}
              </div>
              {conversation.lastMessage ? (
                <p
                  className={`text-sm truncate ${
                    conversation.unreadCount > 0
                      ? "font-semibold text-gray-800"
                      : "text-gray-600"
                  }`}
                >
                  {conversation.lastMessage.content}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No messages yet</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
