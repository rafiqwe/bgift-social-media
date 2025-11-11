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

    const { receiverId } = await req.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    // Can't send request to yourself
    if (currentUser.id === receiverId) {
      return NextResponse.json(
        { error: "Cannot send friend request to yourself" },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Check if friend request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { requesterId: currentUser.id, receiverId: receiverId },
          { requesterId: receiverId, receiverId: currentUser.id },
        ],
      },
    });

    if (existingRequest) {
      if (existingRequest.status === "ACCEPTED") {
        return NextResponse.json({ error: "Already friends" }, { status: 400 });
      } else if (existingRequest.status === "PENDING") {
        return NextResponse.json(
          { error: "Friend request already sent" },
          { status: 400 }
        );
      }
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        requesterId: currentUser.id,
        receiverId: receiverId,
        status: "PENDING",
      },
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

    const sentNotification = await prisma.notification.create({
      data: {
        userId: receiverId,
        fromUserId: currentUser.id,
        type: "FRIEND_REQUEST",
        message: `sent you a friend request.`,
        link: `/profile/${currentUser.id}`,
      },
    });

    return NextResponse.json({
      message: "Friend request sent",
      friendRequest,
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
