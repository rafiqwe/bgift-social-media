import PostForm from "@/app/components/form/posts/PostForm";
import PostFeed from "@/app/components/feed/PostFeed";
import { auth } from "@/lib/auth";

export default async function FeedPage() {
  const session = await auth();
  
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Create Post Form */}
      <div className="mb-6">
        <PostForm image={session?.user.image} />
      </div>
      {/* Posts Feed */}
      <PostFeed/>
    </div>
  );
}