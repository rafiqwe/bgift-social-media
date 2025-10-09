"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface User {
  user: {
    id: string;
    name: string;
    username: string;
    image?: string | null;
  };
}

interface PostLikesModalProps {
  postId: string;
  onClose: () => void;
}

export default function PostLikesModal({
  postId,
  onClose,
}: PostLikesModalProps) {
  const [likes, setLikes] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/posts/${postId}/like`);
        setLikes(res.data.likes || []);
      } catch (err) {
        setError("Failed to load likes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikes();
  }, [postId]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-999 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Likes
          </h2>

          {/* Loading State (Skeletons) */}
          {isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-red-600 bg-red-50 rounded-lg p-3 text-sm mb-4">
              {error}
            </div>
          )}

          {/* Likes List */}
          {!isLoading && !error && (
            <div className="max-h-80 overflow-y-auto space-y-3">
              {likes.length > 0 ? (
                likes.map((user) => (
                  <Link
                    href={`/profile/${user.user.id}`}
                    key={user.user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {user.user.image ? (
                        <Image
                          src={user.user.image}
                          alt={user.user.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                          {user.user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {user.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{user.user.username}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No likes yet 😢
                </p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
