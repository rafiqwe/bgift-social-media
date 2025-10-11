import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
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

    const { friendId } = await req.json();

    if (!friendId) {
      return NextResponse.json(
        { error: "Friend ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the friendship
    const friendship = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { requesterId: currentUser.id, receiverId: friendId },
          { requesterId: friendId, receiverId: currentUser.id },
        ],
        status: "ACCEPTED",
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      );
    }

    await prisma.friendRequest.delete({
      where: { id: friendship.id },
    });

    return NextResponse.json({
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("Error removing friend:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}