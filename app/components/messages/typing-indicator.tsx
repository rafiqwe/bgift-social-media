"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-2xl w-fit">
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
    </div>
  );
}
