import Image from "next/image";
import React from "react";

type ReceivedFriendsProps = {
  req: {
    id: string;
    requester?: {
      image?: string;
      name?: string;
      username?: string;
    };
  };
  rejectRequest: (id: string) => void;
  acceptRequest: (id: string) => void;
};

const ReceivedFriends: React.FC<ReceivedFriendsProps> = ({req, rejectRequest, acceptRequest}) => {
  return (
    <div
      key={req.id}
      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <Image
          src={req.requester?.image || "/images/default-avatar.png"}
          alt={req.requester?.name || "user"}
          width={50}
          height={50}
          className="rounded-full border"
        />
        <div>
          <h2 className="font-semibold">{req.requester?.name}</h2>
          <p className="text-sm text-gray-500">@{req.requester?.username}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => acceptRequest(req.id)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Accept
        </button>
        <button
          onClick={() => rejectRequest(req.id)}
          className="px-3 py-1 text-sm bg-gray-300 rounded-full hover:bg-gray-400"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ReceivedFriends;
