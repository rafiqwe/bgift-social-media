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

    const { participantId } = await req.json();

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID is required" },
        { status: 400 }
      );
    }

    // Check if participant exists
    const participant = await prisma.user.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        participants: {
          every: {
            userId: { in: [currentUser.id, participantId] },
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
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
        },
        participants: {
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
      },
    });

    if (existingConversation) {
      return NextResponse.json({
        conversationId: existingConversation.id,
        messages: existingConversation.messages,
        participant: existingConversation.participants.find(
          (p) => p.userId === participantId
        )?.user,
      });
    }

    // Create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        type: "DIRECT",
        participants: {
          create: [{ userId: currentUser.id }, { userId: participantId }],
        },
      },
      include: {
        participants: {
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
      },
    });

    return NextResponse.json({
      conversationId: newConversation.id,
      messages: [],
      participant: newConversation.participants.find(
        (p) => p.userId === participantId
      )?.user,
    });
  } catch (error) {
    console.error("Error creating/getting conversation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
