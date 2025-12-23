"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FriendRequest } from "@prisma/client";

type Tab = "friends" | "requests" | "sent";

export type Friend = {
  id: string;
  name: string;
  username: string;
  image: string;
  bio?: string;
};

export type ExtendedFriendRequest = FriendRequest & {
  requester?: Friend;
  receiver?: Friend;
};

export function useFriend({ tab }: { tab: Tab }) {
  const queryClient = useQueryClient();

  // =========================
  // Fetcher
  // =========================
  const fetchFriendsByTab = async (): Promise<
    Friend[] | ExtendedFriendRequest[]
  > => {
    if (tab === "friends") {
      const { data } = await axios.get("/api/friends/list");
      return (data.friends as Friend[]) ?? [];
    }

    if (tab === "requests") {
      const { data } = await axios.get("/api/friends/requests");
      return (data.received as ExtendedFriendRequest[]) ?? [];
    }

    if (tab === "sent") {
      const { data } = await axios.get("/api/friends/requests");
      return (data.sent as ExtendedFriendRequest[]) ?? [];
    }

    return [];
  };

  // =========================
  // Query
  // =========================
  const {
    data: friendData = [],
    isLoading,
    isError,
    error,
  } = useQuery<Friend[] | ExtendedFriendRequest[]>({
    queryKey: ["friends", tab],
    queryFn: fetchFriendsByTab,
    staleTime: 1000 * 60 * 2,
  });

  // =========================
  // Accept Request
  // =========================
  const acceptRequest = useMutation({
    mutationFn: (id: string) =>
      axios.post("/api/friends/accept", { requestId: id }),

    onSuccess: (_, requestId) => {
      // remove from requests instantly
      queryClient.setQueryData<FriendRequest[]>(
        ["friends", "requests"],
        (old) => old?.filter((r) => r.id !== requestId) ?? []
      );

      // refetch friends list (new friend added)
      queryClient.invalidateQueries({ queryKey: ["friends", "friends"] });
    },
  });

  // =========================
  // Reject Request
  // =========================
  const rejectRequest = useMutation({
    mutationFn: (id: string) =>
      axios.post("/api/friend-requests/reject", { requestId: id }),

    onSuccess: (_, requestId) => {
      queryClient.setQueryData<FriendRequest[]>(
        ["friends", "requests"],
        (old) => old?.filter((r) => r.id !== requestId) ?? []
      );
    },
  });

  // =========================
  // Remove Friend
  // =========================
  const removeFriend = useMutation({
    mutationFn: (friendId: string) =>
      axios.delete("/api/friends/unfriend", {
        data: { friendId },
      }),

    onSuccess: (_, friendId) => {
      queryClient.setQueryData<FriendRequest[]>(
        ["friends", "friends"],
        (old) => old?.filter((f) => f.id !== friendId) ?? []
      );
    },
  });

  return {
    friendData,
    isLoading,
    isError,
    error,

    acceptRequest: acceptRequest.mutate,
    rejectRequest: rejectRequest.mutate,
    removeFriend: removeFriend.mutate,

    isAccepting: acceptRequest.isPending,
    isRejecting: rejectRequest.isPending,
    isRemoving: removeFriend.isPending,
  };
}
