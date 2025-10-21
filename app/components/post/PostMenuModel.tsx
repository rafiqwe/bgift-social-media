"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface PostMenuModalProps {
  postId: string;
  onEdit?: (id: string) => void;
  onReportOpen?: () => void;
  onDeleteModalOpen?: () => void;
  onDelete?: (id: string) => void;
  onCopyLink?: (id: string) => void;
  isOwner?: boolean; // if true, show Edit/Delete
}


export default function PostMenuModal({
  postId,
  onEdit,
  onDelete,
  onCopyLink,
  onReportOpen,
  onDeleteModalOpen,
  isOwner = false,
}: PostMenuModalProps) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    if (onCopyLink) onCopyLink(postId);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Three-dot button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden z-50"
          >
            {isOwner ? (
              <>
                <button
                  onClick={() => {
                    onEdit?.(postId);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                >
                  ✏️ Edit Post
                </button>
                <button
                  onClick={() => {
                    onDeleteModalOpen()
                    // onDelete?.(postId);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition"
                >
                  🗑️ Delete Post
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onReportOpen();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
              >
                🚩 Report Post
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
            >
              🔗 Copy Link
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
