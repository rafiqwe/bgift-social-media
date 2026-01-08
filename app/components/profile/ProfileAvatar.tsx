import Image from "next/image";
import React from "react";
interface ProfileAvaterProps {
  profileData: {
    image: string | null;
    name: string;
    id: string;
  };
}
const ProfileAvatar = ({ profileData }: ProfileAvaterProps) => {
  return (
    <div className="">
      <div className="w-28 absolute top-0 -translate-y-1/2 left-1/2  transform -translate-x-1/2 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
        {profileData.image ? (
          <Image
            src={profileData.image}
            alt={profileData.name}
            width={128}
            height={128}
            className="w-full  h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-3xl sm:text-4xl font-bold">
            {profileData.name.charAt(0)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
