import useAddFriend from "@/app/hooks/use-addFriend";
import { Loader2, UserPlus2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface UserProps {
  user: {
    id: string;
    image: string;
    name: string;
    mutualFriendsCount: number;
    totalFriends: number;
  };
}
const FriendSuggestions = ({ user }: UserProps) => {
  const { handleAddFriend, isLoading, isFriendRqSent } = useAddFriend({
    userId: user.id,
  });
  return (
    <div key={user.id} className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <Link
          href={`/profile/${user.id}`}
          className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 ring-1 ring-gray-100 "
        >
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0">
          <Link
            href={`/profile/${user.id}`}
            className="font-medium text-gray-900  hover:underline block truncate"
          >
            {user.name}
          </Link>
          <p className="text-xs text-gray-500 truncate">
            {user.mutualFriendsCount > 0
              ? `${user.mutualFriendsCount} mutual friends`
              : `${user.totalFriends || 0} friends`}
          </p>
        </div>
      </div>

      <button
        onClick={handleAddFriend}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all active:scale-95 ${
          isFriendRqSent && "bg-gray-300"
        }`}
        disabled={isLoading || isFriendRqSent}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus2 className="w-4 h-4" />
        )}
        {isFriendRqSent ? "Request Sent" : "Add friend"}
      </button>
    </div>
  );
};

export default FriendSuggestions;
