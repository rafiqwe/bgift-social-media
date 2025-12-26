import { formatDistanceToNow } from "date-fns";
interface ProfileStatusProps {
  profileData: {
    _count: { posts: number };
    friendsCount: number;
    createdAt: string;
  };
}
const ProfileStatus = ({ profileData }: ProfileStatusProps) => {
  return (
    <div className="flex flex-wrap  justify-center gap-6 md:mt-6 mt-2  sm:text-left md:text-center">
      <div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          {profileData._count.posts}
        </p>
        <p className="text-sm text-gray-500">Posts</p>
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          {profileData.friendsCount}
        </p>
        <p className="text-sm text-gray-500">Friends</p>
      </div>
      <div className="hidden md:block">
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          {formatDistanceToNow(new Date(profileData.createdAt))}
        </p>
        <p className="text-sm text-gray-500">On BGIFT</p>
      </div>
    </div>
  );
};

export default ProfileStatus;
