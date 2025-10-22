"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import PostCard from "@/app/components/post/PostCard";
import EditProfileModal from "@/app/components/profile/edit-profile-modal";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
  createdAt: string;
  friendsCount: number;
  isOwnProfile: boolean;
  friendshipStatus: string;
  _count: { posts: number };
}

interface PostI {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLikedByUser: boolean;
  isOwnPost: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/profile/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data.user);
      setPosts(data.posts);
      console.log(data.posts);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleAddFriend = async () => {
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });

      // if (res.ok)
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        User not found 👀
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-40 sm:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 pb-6 sm:pb-8">
          {/* Avatar */}
          <div className="">
            <div className="w-28 absolute top-0 -translate-y-1/2 sm:left-1/2 left-20 transform -translate-x-1/2 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="w-full  h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-3xl sm:text-4xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Name + Username */}
          <div className=" pt-20 sm:ml-36 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {profile.name}
            </h1>
            <p className="text-gray-500">@{profile.username}</p>
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            {profile.isOwnProfile ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Edit Profile
              </button>
            ) : (
              <>
                {profile.friendshipStatus === "none" && (
                  <button
                    onClick={handleAddFriend}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
                  >
                    Add Friend
                  </button>
                )}
                {profile.friendshipStatus === "pending" && (
                  <button
                    disabled
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed text-sm sm:text-base"
                  >
                    Request Sent
                  </button>
                )}
                {profile.friendshipStatus === "accepted" && (
                  <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm sm:text-base">
                    Friends
                  </button>
                )}
              </>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-gray-700 max-w-full sm:max-w-xl text-center sm:text-left">
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap  justify-center sm:justify-start gap-6 mt-6 text-center sm:text-left md:text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {profile._count.posts}
              </p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {profile.friendsCount}
              </p>
              <p className="text-sm text-gray-500">Friends</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatDistanceToNow(new Date(profile.createdAt))}
              </p>
              <p className="text-sm text-gray-500">On BGIFT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="flex border-b overflow-x-auto">
          {["posts", "about"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "posts" | "about")}
              className={`flex-1 py-3 sm:py-4 px-4 text-sm sm:text-lg font-medium transition relative whitespace-nowrap ${
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
                <p className="text-center text-gray-500 py-10">
                  No posts yet ✨
                </p>
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
                <p className="text-gray-600 break-words">{profile.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Username</h3>
                <p className="text-gray-600">@{profile.username}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Joined BGIFT</h3>
                <p className="text-gray-600">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchProfile}
        />
      )}
    </div>
  );
}
