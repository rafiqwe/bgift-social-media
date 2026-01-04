"use client";

import { useEffect, useRef } from "react";
import PostCard from "../post/PostCard";
import HasNoMorePost from "./HasNoMorePost";
import { useFeed } from "@/app/hooks/use-feed";
import FeedSkeleton from "../Loadings/FeedSkeleton";

const PostFeed = () => {
  const { posts, isLoading, isFetchingNextPage, hasMore, loadMorePosts } =
    useFeed();

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      { rootMargin: "200px" } // 🔥 prefetch earlier
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMorePosts]);

  return (
    <div className="space-y-4">
      {isLoading && <FeedSkeleton />}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {isFetchingNextPage && <FeedSkeleton count={5} />}

      {hasMore && <div ref={observerRef} className="h-10" />}

      <HasNoMorePost hasMore={hasMore} postLength={posts.length} />
    </div>
  );
};

export default PostFeed;
