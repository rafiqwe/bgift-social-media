import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { postId, details, reason } = await req.json();

    // 🧠 1. Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧠 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🧠 3. Validate required fields
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }

    // 🧠 4. Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 🧠 5. Prevent duplicate report by same user on same post
    const existingReport = await prisma.reports.findFirst({
      where: {
        postId,
        userId: user.id,
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this post" },
        { status: 400 }
      );
    }

    // ✅ 6. Create report
    const report = await prisma.reports.create({
      data: {
        reason,
        details,
        postId,
        userId: user.id,
      },
    });

    // ✅ 7. Return success
    return NextResponse.json(
      { message: "Report submitted successfully", report },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error from post report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


