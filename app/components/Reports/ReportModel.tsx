"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, Loader2 } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => Promise<void> | void;
}

const reasons = [
  "Spam or misleading",
  "Hate speech or symbols",
  "Harassment or bullying",
  "Nudity or sexual content",
  "Violence or dangerous acts",
  "False information",
  "Other",
];

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return alert("Please select a reason.");
    setLoading(true);
    await onSubmit(selectedReason, details);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Report Post
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Select a reason why you want to report this post:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                      selectedReason === reason
                        ? "bg-red-100 border-red-400 text-red-600 dark:bg-red-500/20 dark:border-red-400"
                        : "border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:border-red-400"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Add more details (optional)..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full mt-3 resize-none rounded-lg border border-gray-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
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
                disabled={loading || !selectedReason}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
