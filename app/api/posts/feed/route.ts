import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const t1 = Date.now();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Query 1: Fetch paginated posts (no likes array needed)
    const t2 = Date.now();
    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    let hasMore = false;
    if (posts.length > limit) {
      hasMore = true;
      posts.pop();
    }

    const nextCursor = hasMore ? posts[posts.length - 1].id : null;
    const postIds = posts.map((post) => post.id);

    // Query 2: Only fetch likes WHERE postId IN [...] AND userId = currentUser
    // This is WAY faster than fetching all likes for all posts
    const t3 = Date.now();
    const userLikes = await prisma.like.findMany({
      where: {
        postId: { in: postIds },
        userId: currentUserId,
      },
      select: {
        postId: true,
      },
    });

    // Build a Set for O(1) lookup instead of .some() on every post
    const t4 = Date.now();
    const likedPostIds = new Set(userLikes.map((like) => like.postId));
    console.log("likedPostIds:", Date.now() - t4, "ms");
    const t5 = Date.now();
    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      isLikedByUser: likedPostIds.has(post.id), // O(1) lookup
      isOwnPost: post.author.id === currentUserId,
    }));


    return NextResponse.json({
      posts: postsWithLikeStatus,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
