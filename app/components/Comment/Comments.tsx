"use client";

import { formatDistanceToNow } from "date-fns";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import CommentMenuOpen from "./CommentMenuOpen";
import CommentEditModal from "./CommentEditModel";
import CommentDeleteModal from "./CommentDeleteModel";

interface CommentProps {
  comment: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      image: string | null;
      username: string;
    };
    isOwnComment: boolean;
    createdAt: string;
  };
  handleUpdateComment: (commentId: string, newContent: string) => void;
  handleDeleteComment: (commentId: string) => void;
}

const Comments: React.FC<CommentProps> = ({
  comment,
  handleUpdateComment,
  handleDeleteComment,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // console.log(comment);

  return (
    <div
      key={comment.id}
      className="flex items-start justify-between px-2 py-2 hover:bg-gray-50 rounded-lg transition"
    >
      {/* Left: Avatar + Content */}
      <div className="flex">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200">
          <Link href={`/profile/${comment.author.id}`}>
            {comment.author.image ? (
              <Image
                src={comment.author.image}
                alt={comment.author.name}
                width={36}
                height={36}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold">
                {comment.author.name.charAt(0)}
              </div>
            )}
          </Link>
        </div>
        <div className="px-2 text-sm">
          <Link href={`/profile/${comment.author.id}`}>
            <p className="font-medium">{comment.author.name}</p>
            <span className="text-xs relative -top-1 text-gray-400">
              @{comment.author.username}
            </span>
          </Link>
          <div className="text-sm mt-1">
            <p>{comment.content}</p>
          </div>
        </div>
      </div>

      {/* Right: Time + 3-dot menu */}
      <div className="flex gap-3 items-center relative">
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </span>

        {/* Three Dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-1 rounded-full hover:bg-gray-200 transition"
          >
            <Ellipsis className="w-5 h-5 text-gray-600" />
          </button>

          {isMenuOpen && (
            <CommentMenuOpen
              onEditMenu={() => setShowEditModal(true)}
              onDeleteMenu={() => setShowDeleteModal(true)}
              isOwnComment={comment.isOwnComment}
              commentId={comment.id}
            />
          )}
          {showEditModal && (
            <CommentEditModal
              comment={{ id: comment.id, content: comment.content }}
              onClose={() => setShowEditModal(false)}
              onUpdate={handleUpdateComment}
            />
          )}

          {showDeleteModal && (
            <CommentDeleteModal
              commentId={comment.id}
              onClose={() => setShowDeleteModal(false)}
              onDelete={handleDeleteComment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
