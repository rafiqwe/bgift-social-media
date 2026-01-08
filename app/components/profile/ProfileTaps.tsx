import React from "react";
import PostCard from "../post/PostCard";

interface ProfileTapsProps {
  posts: PostI[];
  setPosts: React.Dispatch<React.SetStateAction<PostI[]>>;
  handlePostDeleteFromProfile: (postId: string) => void;
  profileData: {
    email: string;
    username: string;
    createdAt: string;
  };
}

const ProfileTaps = ({
  posts,
  handlePostDeleteFromProfile,
  profileData,
  setPosts,
}: ProfileTapsProps) => {
  const taps = ["posts", "about"];
  const [activeTab, setActiveTab] = React.useState("posts");

  const handlePostDelete = (postId: string) => {
    handlePostDeleteFromProfile(postId);
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-8">
      <div className="flex border-b overflow-x-auto">
        {taps.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "posts" | "about")}
            className={`flex-1 py-3 sm:py-4 px-4 text-sm sm:text-lg font-medium transition relative whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? "text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === "posts" && (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No posts yet ✨</p>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  handlePostDeleteFromProfile={handlePostDelete}
                  isProfile={true}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6 text-center sm:text-left">
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600 break-words">{profileData.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Username</h3>
              <p className="text-gray-600">@{profileData.username}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Joined BGIFT</h3>
              <p className="text-gray-600">
                {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTaps;
