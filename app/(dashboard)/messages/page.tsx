"use client";

import ConversationList from "@/app/components/messages/conversation-list";
import NewMessageModal from "@/app/components/messages/new-message-modal";
import { useState } from "react";

export default function MessagesPage() {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Conversations List */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <button
            onClick={() => setIsNewMessageOpen(true)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            title="New Message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        <ConversationList />
      </div>

      {/* Empty State */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select a conversation
          </h2>
          <p className="text-gray-600 mb-4">
            Choose a conversation to start messaging
          </p>
          <button
            onClick={() => setIsNewMessageOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Start New Chat
          </button>
        </div>
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={isNewMessageOpen}
        onClose={() => setIsNewMessageOpen(false)}
      />
    </div>
  );
}