"use client";

import { useFeed } from "@/app/hooks/use-feed";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import PostSuccessModal from "../../Notification/NotificationModal2";

import { CameraIcon, SmileIcon } from "lucide-react";
import { log } from "console";
import EmojiPicker from "emoji-picker-react";
interface IImageprops {
  image: string;
}
export default function PostForm({ image }: IImageprops) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isPostSuccessOpen, setIsPostSuccessOpen] = useState(false);
  const [isPostSuccessMessage, setIsPostSuccessMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const { addPost } = useFeed();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (preview) formData.append("postImage", preview);

      const res = await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        const newPost = res.data;
        addPost(newPost);
        setContent("");
        setPreview(null);
        setIsPostSuccessOpen(true);
        setIsPostSuccessMessage("Your post has been created successfully!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-md  md:rounded-2xl  shadow-md border border-gray-200 
                 p-4 mb-5 transition hover:shadow-lg"
      >
        <div className="flex items-start gap-3">
          {/* User avatar */}
          <Image
            src={image}
            alt="Profile"
            width={42}
            height={42}
            className="rounded-full border shadow-sm"
          />

          {/* Textarea + actions */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onClick={() => setIsEmojiOpen(false)}
              placeholder="Share your thoughts..."
              className="w-full p-3 text-gray-700 border rounded-xl resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
              rows={3}
            />

            {/* Image preview */}
            {preview && (
              <div className="relative mt-3">
                <Image
                  src={preview}
                  alt="preview"
                  width={500}
                  height={300}
                  className="rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-3 text-gray-600">
                <label className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <CameraIcon size={18} /> Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setIsEmojiOpen(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg hover:bg-gray-100 transition"
                >
                  <SmileIcon size={18} /> Emoji
                </button>
                {isEmojiOpen && (
                  <div className="absolute z-10 mt-2">
                    <EmojiPicker
                      emojiStyle="facebook"
                      onEmojiClick={(emojiObject, event) => {
                        const selectedEmoji = emojiObject.emoji;
                        setContent(content + selectedEmoji);
                        setIsEmojiOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium 
                         hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
                         transition-all shadow-md"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.form>
      <PostSuccessModal
        message={isPostSuccessMessage}
        show={isPostSuccessOpen}
        onClose={() => setIsPostSuccessOpen(false)}
      />
    </>
  );
}
