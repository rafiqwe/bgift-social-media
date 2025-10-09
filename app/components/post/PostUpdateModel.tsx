"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface PostUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (formData: FormData) => Promise<void>;
  initialContent: string;
  initialImage?: string | null;
  postId: string;
}

export default function PostUpdateModal({
  isOpen,
  onClose,
  onUpdate,
  postId,
  initialContent,
  initialImage,
}: PostUpdateModalProps) {
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialImage || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContent(initialContent);
    setPreview(initialImage || "");
  }, [initialContent, initialImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", content);
      formData.append("postId", postId);

      // ✅ append actual file, not preview URL
      if (image) {
        formData.append("image", image);
      }

      await onUpdate(formData);

      onClose();
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
            className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl w-full max-w-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Edit Post
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Image Preview */}
              {preview && (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={500}
                    height={300}
                    className="rounded-xl object-cover w-full h-56"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Add image button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  Change Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-neutral-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || content.trim() === ""}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
