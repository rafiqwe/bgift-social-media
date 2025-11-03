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
    const postId = await context.params.postId;
    const comment = await req.json();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //? Check if comment not provided
    if (!comment || (typeof comment === "string" && comment.trim() === "")) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 }
      );
    }

    //? ✅ Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postComment = await prisma.comment.create({
      data: {
        content: comment.content,
        postId,
        authorId: user.id,
      },
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
      },
    });

    if (post.authorId !== user.id) {
      await createNotification({
        userId: post.authorId,
        fromUserId: user.id,
        type: "COMMENT",
        message: `Commented your post.`,
        link: `/post/${post.id}`,
        postId: post.id,
      });
    }

    return NextResponse.json(postComment, { status: 201 });
  } catch (error) {
    console.log("Error from Post comment", error);
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
    const session = await auth();
    const postId = await context.params.postId;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ✅ Fetch comments with author details
    const postComments = await prisma.comment.findMany({
      where: { postId },
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ✅ Add `isOwnComment` flag
    const commentsWithOwnership = postComments.map((comment) => ({
      ...comment,
      isOwnComment: comment.author.id === currentUser.id,
    }));

    return NextResponse.json(commentsWithOwnership, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
