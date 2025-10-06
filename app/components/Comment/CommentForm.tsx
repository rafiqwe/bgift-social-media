import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Comment } from "../post/PostCard";

interface CommentFormProps {
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  postId: string | number;
}

const CommentForm: React.FC<CommentFormProps> = ({ setComments, postId }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // count words
  const wordCount = newComment.trim().split(/\s+/).filter(Boolean).length;
  const isLimitExceeded = wordCount > 300;

  // auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [newComment]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLimitExceeded) return;

    setIsSubmittingComment(true);
    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, {
        content: newComment,
      });

      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <form onSubmit={handleAddComment} className="w-full mb-4 relative h-auto">
      <textarea
        ref={textareaRef}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        className={`flex-1 border w-full rounded-lg px-3 py-4 text-sm outline-none focus:ring-2 resize-none transition
          ${
            isLimitExceeded
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-400 focus:ring-blue-500"
          }
        `}
      />

      {/* Show button only if user typed something */}
      {newComment.trim().length > 0 && (
        <button
          type="submit"
          disabled={isSubmittingComment || isLimitExceeded}
          className={`px-5 py-1 absolute right-5 bottom-4 text-white text-sm rounded-lg font-bold transition
            ${
              isLimitExceeded
                ? "bg-red-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            }
          `}
        >
          {isSubmittingComment ? "Commenting..." : "Comment"}
        </button>
      )}

      {/* Word counter */}
      <p
        className={`absolute bottom-[-20px] right-3 text-xs ${
          isLimitExceeded ? "text-red-500 font-semibold" : "text-gray-500"
        }`}
      >
        {wordCount}/300 words
      </p>
    </form>
  );
};

export default CommentForm;
