"use client";

interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
}

export default function OnlineIndicator({
  isOnline,
  size = "sm",
}: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      } border-2 border-white`}
    />
  );
}