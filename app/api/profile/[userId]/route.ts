import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = await context.params.userId;

    // Get user profile with stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            sentFriendRequests: {
              where: { status: "ACCEPTED" },
            },
            receivedFriendRequests: {
              where: { status: "ACCEPTED" },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total friends
    const totalFriends =
      user._count.sentFriendRequests + user._count.receivedFriendRequests;

    // Check friendship status with current user
    let friendshipStatus = "none";
    if (userId !== currentUser.id) {
      const sentRequest = await prisma.friendRequest.findFirst({
        where: {
          requesterId: currentUser.id,
          receiverId: userId,
        },
      });

      const receivedRequest = await prisma.friendRequest.findFirst({
        where: {
          requesterId: userId,
          receiverId: currentUser.id,
        },
      });

      if (sentRequest) {
        friendshipStatus = sentRequest.status.toLowerCase();
      } else if (receivedRequest) {
        friendshipStatus =
          receivedRequest.status === "PENDING"
            ? "received_request"
            : receivedRequest.status.toLowerCase();
      }
    }

    // Get user's posts
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      take: 10,
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
        likes: {
          select: { userId: true },
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

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      isLikedByUser: post.likes.some((like) => like.userId === currentUser.id),
      isOwnPost: post.author.id === currentUser.id,
    }));

    return NextResponse.json({
      user: {
        ...user,
        friendsCount: totalFriends,
        isOwnProfile: userId === currentUser.id,
        friendshipStatus,
      },
      posts: postsWithLikeStatus,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
