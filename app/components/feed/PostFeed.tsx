'use client'
import React, { useEffect, useRef } from 'react'
import PostCard from '../form/posts/PostCard'
import HasNoMorePost from './HasNoMorePost'
import { useFeed } from '@/app/hooks/use-feed';

const PostFeed = () => {
    const { posts, isLoading, hasMore, loadMorePosts } = useFeed();
    const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll using Intersection Observer
    useEffect(() => {
        if (!observerRef.current || !hasMore || isLoading) return;
    
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
              loadMorePosts();
            }
          },
          { threshold: 0.1 }
        );
    
        observer.observe(observerRef.current);
    
        return () => observer.disconnect();
    }, [hasMore, isLoading, loadMorePosts]);

  return (
    <div className="space-y-4">
        {posts.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">Be the first to share something!</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Intersection Observer Trigger */}
        {hasMore && <div ref={observerRef} className="h-20" />}

        {/* End of Feed Message */}
        <HasNoMorePost hasMore={hasMore} postLength={posts.length} />
      </div>
  )
}

export default PostFeed