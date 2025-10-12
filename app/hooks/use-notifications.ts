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

  // 📥 Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data;
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error("❌ Notification fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PUT" });
      if (!res.ok) throw new Error("Failed to mark notifications as read");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: any) {
      console.error("❌ Mark as read error:", err);
      setError(err.message);
    }
  };

  // ✅ Mark single notification as read (updates unreadCount immediately)
  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to mark as read");

      // 🧠 Optimistic update — no refetch needed
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      console.error("❌ Single mark as read error:", err);
      setError(err.message);
    }
  };

  // 🔢 Derived unread count
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
