import React from "react";
import MessageButton from "../messages/message-button";

interface ProfileActionProps {
  profileData: {
    friendshipStatus: string;
    isOwnProfile: boolean;
    id: string;
    name: string;
  };
  handleAddFriend: () => void;
  setIsEditModalOpen: (open: boolean) => void;
}

const ProfileAction = ({
  profileData,
  handleAddFriend,
  setIsEditModalOpen,
}: ProfileActionProps) => {
  return (
    <div className="relative">
      <div className=" flex flex-wrap gap-3 mt-6 justify-center sm:justify-start">
        {profileData.isOwnProfile ? (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
          >
            Edit Profile
          </button>
        ) : (
          <>
            {profileData.friendshipStatus === "none" && (
              <button
                onClick={handleAddFriend}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Add Friend
              </button>
            )}
            {profileData.friendshipStatus === "pending" && (
              <button
                disabled
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed text-sm sm:text-base"
              >
                Request Sent
              </button>
            )}
            {profileData.friendshipStatus === "accepted" && (
              <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm sm:text-base">
                Friends
              </button>
            )}
          </>
        )}
        {!profileData.isOwnProfile && (
          <MessageButton userId={profileData.id} userName={profileData.name} />
        )}
      </div>
    </div>
  );
};

export default ProfileAction;
