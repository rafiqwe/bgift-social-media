import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
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

    const conversationId = params.conversationId;

    // Verify user is part of conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: currentUser.id,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not authorized to view this conversation" },
        { status: 403 }
      );
    }

    // Get pagination params
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: { conversationId },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    let hasMore = false;
    if (messages.length > limit) {
      hasMore = true;
      messages.pop();
    }

    const nextCursor = hasMore ? messages[messages.length - 1].id : null;

    // Reverse to show oldest first
    messages.reverse();

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      sender: msg.sender,
      isOwnMessage: msg.senderId === currentUser.id,
    }));

    const OpositeUser = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        NOT: { userId: currentUser.id },
      },
      include: { user: true },
    });

    return NextResponse.json({
      messages: formattedMessages,
      nextCursor,
      oppositeUser: OpositeUser?.user,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
