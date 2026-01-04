"use client";

import axios from "axios";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";

interface FeedResponse {
  posts: any[];
  nextCursor: string | null;
  hasMore: boolean;
}

const fetchFeed = async ({ pageParam }: { pageParam?: string }) => {
  const cursor = pageParam ? `&cursor=${pageParam}` : "";
  const { data } = await axios.get<FeedResponse>(
    `/api/posts/feed?limit=10${cursor}`
  );
  return data;
};

export function useFeed() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 180, // 3 min cache
    refetchOnWindowFocus: false,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const removePost = (postId: string) => {
    queryClient.setQueryData<InfiniteData<FeedResponse>>(
      ["feed"],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post.id !== postId),
          })),
        };
      }
    );
  };

  const addPost = (newPost: any) => {
    queryClient.setQueryData<InfiniteData<FeedResponse>>(
      ["feed"],
      (oldData) => {
        if (!oldData) return oldData;

        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            posts: [newPost, ...newPages[0].posts],
          };
        }

        return {
          ...oldData,
          pages: newPages,
        };
      }
    );
  };

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    hasMore: hasNextPage,
    error,
    loadMorePosts: fetchNextPage,
    removePost,
    addPost,
  };
}
