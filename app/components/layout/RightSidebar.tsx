import RightSideTrendingTopices from "./RightSideTrendingTopices";
import RightSideFriendsSu from "./RightSideFriendsSu";
import RightSideFriendRequest from "./RightSideFriendRequest";

export default function RightSidebar() {
  return (
    <div className="space-y-4">
      {/* Friend Requests */}
      <RightSideFriendRequest/>

      {/* People You May Know */}
      <RightSideFriendsSu/>

      {/* Trending Topics */}
      <RightSideTrendingTopices/>
    </div>
  );
}