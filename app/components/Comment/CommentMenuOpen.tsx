import React, { useState } from "react";
import CommentEditModal from "./CommentEditModel";
import CommentDeleteModal from "./CommentDeleteModel";

interface ICommentMenuProps {
  isOwnComment: boolean;
  commentId: string;
  onEditMenu: () => void;
  onCommentReportOpen: () => void;
  onDeleteMenu: () => void;
}

const CommentMenuOpen: React.FC<ICommentMenuProps> = ({
  isOwnComment,
  commentId,
  onEditMenu,
  onDeleteMenu,
  onCommentReportOpen,
}) => {
  const handleCommentEdit = () => {
    onEditMenu();
  };
  const handleCommentDelete = () => {
    onDeleteMenu();
  };
  return (
    <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg border border-gray-200 z-10 overflow-hidden">
      {isOwnComment && (
        <div>
          <button
            onClick={handleCommentEdit}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleCommentDelete}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
          >
            🗑️ Delete
          </button>
        </div>
      )}
      <button
        onClick={() => onCommentReportOpen()}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        🚩 Report
      </button>
    </div>
  );
};

export default CommentMenuOpen;
