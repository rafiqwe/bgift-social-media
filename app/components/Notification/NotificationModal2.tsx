"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface PostSuccessModalProps {
  show: boolean;
  onClose: () => void;
  message?: string;
}

const PostSuccessModal: React.FC<PostSuccessModalProps> = ({
  show,
  onClose,
  message = "Your post has been published successfully!",
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // auto close after 2.5s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-8  z-50 flex items-center gap-3 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-2xl border border-gray-200 dark:border-neutral-700 rounded-xl px-5 py-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full">
            <CheckCircle2 className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="font-medium">{message}</p>
            <span className="text-xs text-gray-500">
              Visible to your followers
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostSuccessModal;
