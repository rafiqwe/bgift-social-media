'use client'
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
  };
  likes: { userId: string }[];
  comments: any[];
  _count: {
    likes: number;
    comments: number;
  };
  isLikedByUser: boolean;
}

interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  const loadInitialPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await axios.get("/api/posts/feed?limit=10");
      if (res.status === 400) throw new Error("Failed to fetch posts");
      
      const data: FeedResponse = res.data;
      
      setPosts(data.posts);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load more posts (infinite scroll)
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/posts/feed?limit=10&cursor=${cursor}`);
      if (res.status === 400) throw new Error("Failed to fetch posts");
      
      const data: FeedResponse = res.data;
      
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more posts");
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading]);

  // Add new post to feed
  const addPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Update post in feed
  const updatePost = (postId: string, updatedData: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, ...updatedData } : post
      )
    );
  };

  // Remove post from feed
  const removePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  return {
    posts,
    isLoading,
    hasMore,
    error,
    loadMorePosts,
    addPost,
    updatePost,
    removePost,
    refresh: loadInitialPosts,
  };
}