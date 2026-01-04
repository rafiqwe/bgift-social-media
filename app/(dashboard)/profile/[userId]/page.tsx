"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import PostCard from "@/app/components/post/PostCard";
import ProfileCard from "@/app/components/profile/ProfileCard";
import EditProfileModal from "@/app/components/profile/edit-profile-modal";
import MessageButton from "@/app/components/messages/message-button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ProfileTaps from "@/app/components/profile/ProfileTaps";
import ProfileCardSkeleton from "@/app/components/Loadings/ProfileCardSkeleton";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [posts, setPosts] = useState<PostI[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/profile/${userId}`);
      const data = await res.data;
      setPosts(data.posts);
      return data?.user;
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: fetchProfile,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handlePostDelete = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  if (profileLoading) {
    return <ProfileCardSkeleton />;
  }

  if (!profileData) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        User not found 👀
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Card */}
      <ProfileCard
        profileData={profileData}
        setIsEditModalOpen={setIsEditModalOpen}
      />

      {/* Tabs */}
      <ProfileTaps
        posts={posts}
        handlePostDeleteFromProfile={handlePostDelete}
        profileData={profileData}
        setPosts={setPosts}
      />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profileData}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchProfile}
        />
      )}
    </div>
  );
}
