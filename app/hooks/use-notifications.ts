"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

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

/* ---------------- QUERY KEY ---------------- */
const NOTIFICATIONS_KEY = ["notifications"];

/* ---------------- FETCHER ---------------- */
const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await axios.get("/api/notifications");
  const data = res.data;
  return Array.isArray(data) ? data : data.data;
};

export function useNotifications() {
  const queryClient = useQueryClient();

  /* ---------------- GET NOTIFICATIONS ---------------- */
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: fetchNotifications,
    staleTime: 1000 * 30, // 30s fresh
  });

  /* ---------------- MARK ONE AS READ ---------------- */
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) =>
      axios.put(`/api/notifications/${id}`),

    // 🧠 Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });

      const previous = queryClient.getQueryData<Notification[]>(
        NOTIFICATIONS_KEY
      );

      queryClient.setQueryData<Notification[]>(
        NOTIFICATIONS_KEY,
        (old = []) =>
          old.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          )
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          NOTIFICATIONS_KEY,
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_KEY,
      });
    },
  });

  /* ---------------- MARK ALL AS READ ---------------- */
  const markAllAsReadMutation = useMutation({
    mutationFn: () => axios.put("/api/notifications"),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });

      const previous = queryClient.getQueryData<Notification[]>(
        NOTIFICATIONS_KEY
      );

      queryClient.setQueryData<Notification[]>(
        NOTIFICATIONS_KEY,
        (old = []) => old.map((n) => ({ ...n, isRead: true }))
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          NOTIFICATIONS_KEY,
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_KEY,
      });
    },
  });

  /* ---------------- DERIVED UNREAD COUNT ---------------- */
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return {
    notifications,
    isLoading,
    error,
    unreadCount,

    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,

    isMarkingRead: markAsReadMutation.isPending,
    isMarkingAllRead: markAllAsReadMutation.isPending,

    refetch: () =>
      queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_KEY,
      }),
  };
}

