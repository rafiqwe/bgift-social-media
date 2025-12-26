import React from "react";

interface IHasNoMore {
  hasMore: boolean;
  postLength: number;
}
const HasNoMorePost: React.FC<IHasNoMore> = ({ hasMore, postLength }) => {
  return (
    <div>
      {!hasMore && postLength > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{`You've`} reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default HasNoMorePost;
