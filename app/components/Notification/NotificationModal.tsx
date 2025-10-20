"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { X, CheckCircle2 } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  sender?: {
    name: string;
    image?: string;
  };
  link?: string;
  isRead?: boolean;
  createdAt: Date;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead?: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end md:justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              <div className="flex items-center gap-3">
                {notifications.some((n) => !n.isRead) && onMarkAllRead && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-16 text-center text-gray-500 dark:text-gray-400">
                  No notifications yet
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {notifications.map((n) => (
                    <motion.li
                      key={n.id}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 flex gap-4 cursor-pointer transition ${
                        n.isRead
                          ? "bg-white dark:bg-neutral-900"
                          : "bg-blue-50 dark:bg-blue-950/30"
                      }`}
                      onClick={() => onMarkRead(n.id)}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <Image
                          src={n.sender?.image || "/default-avatar.png"}
                          alt={n.sender?.name || "User"}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-semibold">
                            {n.sender?.name || "Someone"}
                          </span>{" "}
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(n.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                        {n.link && (
                          <Link
                            href={n.link}
                            className="text-blue-600 text-xs mt-2 inline-block font-medium hover:underline"
                          >
                            View details →
                          </Link>
                        )}
                      </div>

                      {/* Read Icon */}
                      {n.isRead && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 self-center" />
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
