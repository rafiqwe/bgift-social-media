"use client";
import { useEffect, useState, useMemo } from "react";

export interface Notification {
  id: string;
  type: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  post: {
    content: string;
    id: string;
  };
  fromUser: {
    id: string;
    username: string;
    name: string;
    image: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📥 Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data;
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark one notification as read
  const markAsRead = async (id: string) => {
    try {
      // 🧠 Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      const res = await fetch(`/api/notifications/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to mark as read");
    } catch (err) {
      console.error("❌ Error marking as read:", err);
      setError(err.message);
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔢 Derived unread count (auto updates)
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAllAsRead,
    markAsRead,
    refetch: fetchNotifications,
  };
}
