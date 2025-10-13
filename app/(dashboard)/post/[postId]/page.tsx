"use client";

import { use, useEffect, useState } from "react";
import PostCard from "@/app/components/post/PostCard";

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

const Page = ({ params }: PageProps) => {
  const { postId } = use(params);
  const [postData, setPostData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ✅ Use environment-safe base URL
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

        const res = await fetch(`${baseUrl}/api/posts/${postId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch post (status: ${res.status})`);
        }

        const data = await res.json();
        setPostData(data);
      } catch (err) {
        console.error("❌ Error from single post page:", err);
        setError("Failed to load post 😢");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500 font-medium">{error || "Post not found 😢"}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 max-w-2xl mx-auto px-4">
      <PostCard post={postData} />
    </div>
  );
};

export default Page;
