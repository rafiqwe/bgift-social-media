"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSocket } from "@/app/hooks/use-socket";
import { useOnlineStatus } from "@/app/hooks/use-online-status";
import { useRealtimeMessages } from "@/app/hooks/use-realtime-messages";
import OnlineIndicator from "@/app/components/messages/online-indicator";
import TypingIndicator from "@/app/components/messages/typing-indicator";
import RealtimeMessageInput from "@/app/components/messages/realtime-message-input";
import MessageBubble from "@/app/components/messages/message-bubble";
import ConversationList from "@/app/components/messages/conversation-list";
import useUser from "@/app/hooks/use-user";
import useLocalStore from "@/app/hooks/use-localStore";

export default function RealtimeConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { currentUserId } = useUser();

  const { socket, isConnected } = useSocket(currentUserId);
  const { isUserOnline } = useOnlineStatus(socket);

  const { localMessages } = useLocalStore();
  const {
    messages,
    isLoading,
    isSending,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
  } = useRealtimeMessages(socket, conversationId, currentUserId);

  const [otherUser, setOtherUser] = useState<any>(null);

  // Fetch conversation details
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/messages/conversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId: conversationId }),
        });
        const data = await res.json();
        setOtherUser(data.participant);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Conversations List - Hidden on mobile */}
      <div className="hidden md:block w-96 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-600">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
        <ConversationList currentConversationId={conversationId} />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={() => router.push("/messages")}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {otherUser && (
            <>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {otherUser.image ? (
                    <Image
                      src={otherUser.image}
                      alt={otherUser.name}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {otherUser.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0">
                  <OnlineIndicator isOnline={isUserOnline(otherUser.id)} />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {otherUser.name}
                </h2>
                <p className="text-xs text-gray-500">
                  {isUserOnline(otherUser.id) ? "Online" : "Offline"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            localMessages && (
              <>
                {localMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={message.senderId === currentUserId}
                  />
                ))}
              </>
            )
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={message.senderId === currentUserId}
                />
              ))}

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <TypingIndicator />
                  <span className="text-xs text-gray-500">typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <RealtimeMessageInput
          onSend={sendMessage}
          isSending={isSending}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
        />
      </div>
    </div>
  );
}
