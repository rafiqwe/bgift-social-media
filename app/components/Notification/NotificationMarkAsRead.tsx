"use client";
import { useNotifications } from "@/app/hooks/use-notifications";
import React from "react";

const NotificationMarkAsRead = () => {
  const { markAllAsRead } = useNotifications();
  return (
    <button
      onClick={markAllAsRead}
      className="text-sm text-blue-500 hover:underline"
    >
      Mark all as read
    </button>
  );
};

export default NotificationMarkAsRead;
