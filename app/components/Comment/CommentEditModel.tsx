import axios from "axios";
import { useState } from "react";

interface CommentEditModalProps {
  comment: {
    id: string;
    content: string;
  };
  onClose: () => void;
  onUpdate: (commentId: string, newContent: string) => void;
}

export default function CommentEditModal({
  comment,
  onClose,
  onUpdate,
}: CommentEditModalProps) {
  const [content, setContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const res = await axios.put(`/api/comment/${comment.id}`, {
        content: content.trim(),
      });

      // success
      if (res.status === 200) {
        onUpdate(comment.id, content.trim());
        onClose();
      }
    } catch (err) {
      console.error("❌ Error updating comment:", err);
      const message =
        err.response?.data?.error || err.message || "Failed to update comment";
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Comment</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Write your comment..."
            disabled={isUpdating}
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">{content.length} characters</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !content.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
