import React from "react";

interface UsetDetailsProps {
  profileData: {
    name: string;
    username: string;
    bio: string | null;
    createdAt: string;
  };
}

const Userdetails = ({ profileData }: UsetDetailsProps) => {
  return (
    <>
      <div className=" pt-20 flex items-center justify-center flex-col text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {profileData.name}
        </h1>
        <p className="text-gray-500">@{profileData.username}</p>
      </div>

      <div className="flex items-center justify-center w-full">
        {/* Bio */}
        {profileData.bio && (
          <p className="mt-4 text-gray-700 max-w-full md:text-center sm:max-w-xl text-center sm:text-left">
            {profileData.bio}
          </p>
        )}
      </div>
    </>
  );
};

export default Userdetails;
