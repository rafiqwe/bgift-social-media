import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    // Get accepted friend requests where user is requester
    const sentFriendships = await prisma.friendRequest.findMany({
      where: {
        requesterId: currentUser.id,
        status: "ACCEPTED",
      },
      include: {
        receiver: {
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

    // Get accepted friend requests where user is receiver
    const receivedFriendships = await prisma.friendRequest.findMany({
      where: {
        receiverId: currentUser.id,
        status: "ACCEPTED",
      },
      include: {
        requester: {
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

    // Combine both lists
    const friends = [
      ...sentFriendships.map((f) => f.receiver),
      ...receivedFriendships.map((f) => f.requester),
    ];

    return NextResponse.json({ friends });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}