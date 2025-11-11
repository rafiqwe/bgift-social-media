import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const { requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Find the friend request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        requester: true,
        receiver: true,
      },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    // Only the receiver can accept the request
    if (friendRequest.receiverId !== currentUser.id) {
      return NextResponse.json(
        { error: "You can only accept requests sent to you" },
        { status: 403 }
      );
    }

    // Check if already accepted
    if (friendRequest.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Friend request already accepted" },
        { status: 400 }
      );
    }

    // Update friend request status to ACCEPTED
    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const AcceptedNotification = await prisma.notification.create({
      data: {
        userId: friendRequest.requesterId,
        fromUserId: currentUser.id,
        type: "FRIEND_ACCEPT",
        message: `accepted your friend request.`,
        link: `/profile/${currentUser.id}`,
      },
    });

    return NextResponse.json({
      message: "Friend request accepted",
      friendRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
