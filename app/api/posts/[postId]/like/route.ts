// api/posts/[postId]/like/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const postId = await context.params.postId;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike - delete the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId: postId },
      });

      return NextResponse.json({
        message: "Post unliked",
        isLiked: false,
        likeCount,
      });
    } else {
      // Like - create new like
      await prisma.like.create({
        data: {
          postId: postId,
          userId: user.id,
        },
      });

      if (post.authorId !== user.id) {
        await createNotification({
          userId: post.authorId,
          fromUserId: user.id,
          type: "LIKE",
          message: `liked your post.`,
          link: `/post/${post.id}`,
          postId: post.id,
        });
      }

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { postId: postId },
      });

      return NextResponse.json({
        message: "Post liked",
        isLiked: true,
        likeCount,
      });
    }
  } catch (error) {
    console.error("Error from like route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const postId = await context.params.postId;

    // ✅ Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ✅ Fetch likes with user info (optional)
    const postLikes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json(
      { count: postLikes.length, likes: postLikes },
      { status: 200 }
    );
  } catch (error) {
    console.error("error from get like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
