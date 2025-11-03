import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
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

    // Get all conversations where user is a participant
    const conversations = await prisma.conversationParticipant.findMany({
      where: { userId: currentUser.id },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId: { not: currentUser.id } },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                messages: {
                  where: {
                    senderId: { not: currentUser.id },
                    isRead: false,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        conversation: {
          updatedAt: "desc",
        },
      },
    });

    // Format conversations
    const formattedConversations = conversations.map((conv) => ({
      id: conv.conversation.id,
      participant: conv.conversation.participants[0]?.user,
      lastMessage: conv.conversation.messages[0] || null,
      unreadCount: conv.conversation._count.messages,
      isOwnMessage: conv.conversation.messages[0]
        ? conv.conversation.messages[0].senderId === currentUser.id
        : false,
      updatedAt: conv.conversation.updatedAt,
    }));

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
