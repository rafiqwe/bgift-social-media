import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import ProfileAction from "./ProfileAction";
import ProfileStatus from "./ProfileStatus";
import ProfileAvatar from "./ProfileAvatar";
import Userdetails from "./Userdetails";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
  createdAt: string;
  friendsCount: number;
  _count: { posts: number };
  friendshipStatus: string;
  isOwnProfile: boolean;
}

interface ProfileCardProps {
  profileData: UserProfile;
  setIsEditModalOpen: (open: boolean) => void;
}

const ProfileCard = ({ profileData, setIsEditModalOpen }: ProfileCardProps) => {
  const handleAddFriend = async () => {
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: profileData.id }),
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-40 sm:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 pb-6 sm:pb-8">
        <div>
          {/* Avatar */}
          <ProfileAvatar profileData={profileData} />
          {/* Name + Username & Bio */}
          <Userdetails profileData={profileData} />
          {/* Action & Status */}
          <div className="flex items-center flex-col md:flex-row xl:flex-col justify-between">
            {/* Status */}
            <ProfileStatus profileData={profileData} />
            {/* Actions */}
            <ProfileAction
              profileData={profileData}
              handleAddFriend={handleAddFriend}
              setIsEditModalOpen={setIsEditModalOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
