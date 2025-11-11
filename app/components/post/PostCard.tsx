"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";
import Comments from "../Comment/Comments";
import CommentForm from "../Comment/CommentForm";
import PostLikesModal from "./PostLikesModal";
import { DotIcon, Ellipsis } from "lucide-react";
import PostMenuModal from "./PostMenuModel";
import PostUpdateModal from "./PostUpdateModel";
import PostImageModal from "./PostImageModel";
import Link from "next/link";
import ReportModal from "../Reports/PostReportModel";
import PostSuccessModal from "../Notification/NotificationModal2";
import { useFeed } from "@/app/hooks/use-feed";
import PostDeleteModal from "./PostDeleteModal";

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image: string | null;
    username: string;
  };
  createdAt: string;
}

interface PostCardProps {
  post: {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    author: {
      id: string;
      name: string;
      username: string;
      image: string | null;
    };
    _count: {
      likes: number;
      comments: number;
    };
    isLikedByUser: boolean;
    isOwnPost: boolean;
    isUpdated: boolean;
  };
  handlePostDeleteFromProfile?: (postId: string) => void;
  isProfile?: boolean;
}

export default function PostCard({
  post,
  handlePostDeleteFromProfile,
  isProfile = false,
}: PostCardProps) {
  // Likes
  const [isLiked, setIsLiked] = useState(post.isLikedByUser);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isPostEdit, setIsPostEdit] = useState(false);
  const [isPostImageOpen, setIsPostImageOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPostSuccessOpen, setIsPostSuccessOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPostSuccessMessage, setIsPostSuccessMessage] = useState("");
  const [updatedPost, setUpdatedPost] = useState(post);

  // Comments
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const { removePost, setPosts } = useFeed();

  // useEffect for fetching comments can be implemented if needed

  const handleLike = async () => {
    if (isLiking) return;

    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiking(true);

    try {
      const res = await fetch(`/api/posts/${updatedPost.id}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to like post");

      const data = await res.json();
      setIsLiked(data.isLiked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error(error);
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleComments = async () => {
    setIsCommentsOpen(!isCommentsOpen);

    if (!isCommentsOpen) {
      setIsLoadingComments(true);
      try {
        const res = await axios.get(`/api/posts/${updatedPost.id}/comment`);
        setComments(res.data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  // ✅ Post Update
  const handlePostUpdate = async (formData: FormData) => {
    try {
      const res = await axios.put("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        // ✅ Instantly update UI (optimistic update)
        setUpdatedPost({
          ...post,
          content: res.data.content,
          imageUrl: res.data.imageUrl,
        });

        setIsPostEdit(false); // Close modal
        setIsPostSuccessOpen(true); // Open success modal
        setIsPostSuccessMessage("Your post has been updated successfully!");
      }
    } catch (error) {
      console.error("❌ Error from post update:", error);
    }
  };

  // ✏️ Update Comment
  const handleUpdateComment = (commentId: string, newContent: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content: newContent } : c))
    );
  };

  // ❌ Delete Comment
  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    try {
      const res = await axios.post("/api/report", {
        reason,
        details,
        postId: post.id,
      });
      if (res.status === 201) {
        const data = res.data;
        console.log(data);
      }
    } catch (error) {
      console.log("Error from report submit ", error);
    }
  };

  // Delete post
  const handlePostDelete = async (postId: string) => {
    try {
      const res = await axios.delete(`/api/posts?postId=${postId}`);
      if (res.status === 200) {
        // const data = res.data;
        setIsPostSuccessMessage("Your post has been deleted successfully!");
        setIsPostSuccessOpen(true);
        if (isProfile) {
          handlePostDeleteFromProfile(updatedPost.id);
        }
        removePost(updatedPost.id);
      }
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      setIsPostSuccessMessage("Failed to delete post. Please try again.");
      setIsPostSuccessOpen(true);
    }
  };

  return (
    <div className="bg-white md:rounded-lg shadow md:p-6 px-4 py-5">
      {/* Author */}
      <div className="flex items-center gap-3 justify-between">
        <Link href={`/profile/${post.author.id}`}>
          <div className="flex items-center gap-[8px] md:gap-3 mb-4">
            <div className="w-10 h-10 basis-12 md:basis-none rounded-full overflow-hidden bg-gray-200">
              {updatedPost.author.image ? (
                <Image
                  src={updatedPost.author.image}
                  alt={updatedPost.author.name}
                  width={40}
                  height={40}
                  className=" w-10 h-10"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
                  {updatedPost.author.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="w-full">
              <p className="font-semibold text-md">{updatedPost.author.name}</p>
              <p className="md:text-sm text-xs text-gray-500 text-wrap">
                @{updatedPost.author.username} •{" "}
                <span className="inline-block md:inline">
                  {formatDistanceToNow(new Date(updatedPost.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <span>
                  {updatedPost.isUpdated && (
                    <span className="text-xs text-gray-400 italic">
                      (Edited)
                    </span>
                  )}
                </span>
              </p>
            </div>
          </div>
        </Link>
        <PostMenuModal
          onReportOpen={() => setIsReportOpen(true)}
          onDeleteModalOpen={() => setShowDeleteModal(true)}
          postId={updatedPost.id}
          isOwner={updatedPost.isOwnPost}
          onEdit={() => setIsPostEdit(true)}
          onDelete={handlePostDelete}
          onCopyLink={(id) => console.log("Link copied for:", id)}
        />
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">
        {updatedPost.content}
      </p>
      {updatedPost.imageUrl && (
        <div
          onClick={() => setIsPostImageOpen(true)}
          className="mb-4 rounded-lg overflow-hidden"
        >
          <Image
            src={updatedPost.imageUrl!}
            alt="Post image"
            width={600}
            height={400}
            className="w-full object-cover bg-center max-h-[600px] "
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center border-b border-gray-200  gap-4 text-sm text-gray-600 mb-3 pb-3 ">
        <span
          className="cursor-pointer"
          onClick={() => setIsLikesModalOpen(true)}
        >
          {likeCount} likes
        </span>
        <span>{updatedPost._count.comments} comments</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 py-2 cursor-pointer rounded-lg font-medium transition ${
            isLiked
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isLiked ? "❤️ Liked" : "🤍 Like"}
        </button>
        <button
          onClick={toggleComments}
          className="flex-1 py-2 cursor-pointer rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          💬 Comment
        </button>
      </div>

      {/* Comments Section */}
      {isCommentsOpen && (
        <div className="mt-4  pt-4 space-y-4">
          {/* Comment Input */}
          <CommentForm postId={updatedPost.id} setComments={setComments} />

          {/* Comment List */}
          {isLoadingComments ? (
            <p className="text-gray-500 text-sm">Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment, idx) => (
              <Comments
                key={comment?.id || idx}
                comment={comment}
                handleUpdateComment={handleUpdateComment}
                handleDeleteComment={handleDeleteComment}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet</p>
          )}
        </div>
      )}

      {isLikesModalOpen && (
        <PostLikesModal
          postId={updatedPost.id}
          onClose={() => setIsLikesModalOpen(false)}
        />
      )}
      {isPostEdit && (
        <PostUpdateModal
          isOpen={isPostEdit}
          onClose={() => setIsPostEdit(false)}
          initialContent={updatedPost.content}
          initialImage={updatedPost.imageUrl}
          onUpdate={handlePostUpdate}
          postId={post.id}
        />
      )}

      <PostImageModal
        src={updatedPost.imageUrl!}
        isOpen={isPostImageOpen}
        onClose={() => setIsPostImageOpen(false)}
      />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
      <PostSuccessModal
        message={isPostSuccessMessage}
        show={isPostSuccessOpen}
        onClose={() => setIsPostSuccessOpen(false)}
      />

      {showDeleteModal && (
        <PostDeleteModal
          postId={post.id}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handlePostDelete}
        />
      )}
    </div>
  );
}
