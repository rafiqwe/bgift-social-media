import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    const { postId } = await context.params;

    if (!postId)
      return NextResponse.json(
        { error: "Post id is required" },
        { status: 400 }
      );

    // ✅ Check for authenticated user
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Find user in DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fetch single post with relations
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
          select: {
            userId: true,
          },
        },
        comments: {
          take: 3, // Only first 3 comments (newest first)
          orderBy: {
            createdAt: "desc",
          },
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

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ✅ Add custom fields
    const isLikedByUser = post.likes.some((like) => like.userId === user.id);
    const isOwnPost = post.author.id === user.id;

    return NextResponse.json({
      ...post,
      isLikedByUser,
      isOwnPost,
    });
  } catch (error) {
    console.error("❌ Error fetching single post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
