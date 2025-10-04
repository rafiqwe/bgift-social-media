"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import PostCard from "@/app/components/form/posts/PostCard";
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

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
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
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (res.ok) fetchProfile();
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
    <div className="max-w-5xl mx-auto px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-4xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Name + Username */}
          <div className="mt-20 sm:ml-36 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.name}
            </h1>
            <p className="text-gray-500">@{profile.username}</p>
          </div>

          {/* Actions */}
          <div className="absolute right-6 top-6">
            {profile.isOwnProfile ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                {profile.friendshipStatus === "none" && (
                  <button
                    onClick={handleAddFriend}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Add Friend
                  </button>
                )}
                {profile.friendshipStatus === "pending" && (
                  <button
                    disabled
                    className="px-5 py-2.5 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                  >
                    Request Sent
                  </button>
                )}
                {profile.friendshipStatus === "accepted" && (
                  <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium">
                    Friends
                  </button>
                )}
              </>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-gray-700 max-w-xl">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6 text-center sm:text-left">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {profile._count.posts}
              </p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {profile.friendsCount}
              </p>
              <p className="text-sm text-gray-500">Friends</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatDistanceToNow(new Date(profile.createdAt))}
              </p>
              <p className="text-sm text-gray-500">On BGIFT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="flex border-b">
          {["posts", "about"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "posts" | "about")}
              className={`flex-1 py-4 text-lg font-medium transition relative ${
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

        <div className="p-6">
          {activeTab === "posts" && (
            <div className="space-y-6">
              {posts.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  No posts yet ✨
                </p>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600">{profile.email}</p>
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
