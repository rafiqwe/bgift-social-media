import Image from "next/image";
import React from "react";

interface IFriend {
    id: string;
    name: string;
    image: string;
    username: string;
}

interface IFriendProps {
    friend: IFriend;
    removeFriend: (id: string) => void;
}


const FriendsList: React.FC<IFriendProps> = ({ friend, removeFriend }) => {
    
  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <Image
          src={friend.image || "/images/default-avatar.png"}
          alt={friend.name}
          width={50}
          height={50}
          className="rounded-full border"
        />
        <div>
          <h2 className="font-semibold">{friend.name}</h2>
          <p className="text-sm text-gray-500">@{friend.username}</p>
        </div>
      </div>
      <button
        onClick={() => removeFriend(friend.id)}
        className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Unfriend
      </button>
    </div>
  );
};

export default FriendsList;
