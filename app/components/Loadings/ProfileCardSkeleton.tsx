"use client";

import FeedSkeleton from "./FeedSkeleton";

const ProfileCardSkeleton = () => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden animate-pulse">
        {/* Cover Photo Skeleton */}
        <div className="h-40 sm:h-48 bg-gray-300" />

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 pb-6 sm:pb-8">
          {/* Avatar Skeleton */}
          <div className="absolute -top-12 left-4 sm:left-6">
            <div className="h-24 w-24 rounded-full bg-gray-300 border-4 border-white" />
          </div>

          {/* Content */}
          <div className="pt-14 space-y-4">
            {/* Name */}
            <div className="h-5 w-40 bg-gray-300 rounded" />

            {/* Username */}
            <div className="h-4 w-28 bg-gray-200 rounded" />

            {/* Bio */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Status + Actions */}
            <div className="flex flex-col md:flex-row xl:flex-col gap-4 mt-6">
              {/* Status */}
              <div className="h-4 w-32 bg-gray-200 rounded" />

              {/* Buttons */}
              <div className="flex gap-3">
                <div className="h-9 w-28 bg-gray-300 rounded-md" />
                <div className="h-9 w-28 bg-gray-300 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeedSkeleton count={5} />
    </>
  );
};

export default ProfileCardSkeleton;
