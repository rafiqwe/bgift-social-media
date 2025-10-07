// src/app/api/users/suggestions/route.ts
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

    // Get IDs of users the current user is already friends with or has pending requests
    const existingConnections = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { requesterId: currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      select: {
        requesterId: true,
        receiverId: true,
      },
    });

    // Extract all connected user IDs
    const connectedUserIds = new Set<string>();
    existingConnections.forEach((conn) => {
      connectedUserIds.add(conn.requesterId);
      connectedUserIds.add(conn.receiverId);
    });

    // Remove current user's ID
    connectedUserIds.delete(currentUser.id);

    // Get users who are NOT already connected
    const suggestions = await prisma.user.findMany({
      where: {
        id: {
          not: currentUser.id,
          notIn: Array.from(connectedUserIds),
        },
        isActive: true, // Only suggest active users
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        _count: {
          select: {
            sentFriendRequests: {
              where: { status: "ACCEPTED" },
            },
            receivedFriendRequests: {
              where: { status: "ACCEPTED" },
            },
          },
        },
      },
      take: 20, // Get more than needed for filtering
    });

    // Calculate mutual friends for each suggestion
    const suggestionsWithMutuals = await Promise.all(
      suggestions.map(async (user) => {
        // Get this user's friends
        const userFriends = await prisma.friendRequest.findMany({
          where: {
            OR: [
              { requesterId: user.id, status: "ACCEPTED" },
              { receiverId: user.id, status: "ACCEPTED" },
            ],
          },
          select: {
            requesterId: true,
            receiverId: true,
          },
        });

        // Extract friend IDs
        const userFriendIds = new Set<string>();
        userFriends.forEach((friend) => {
          const friendId =
            friend.requesterId === user.id
              ? friend.receiverId
              : friend.requesterId;
          userFriendIds.add(friendId);
        });

        // Find mutual friends (intersection)
        const mutualFriends = Array.from(connectedUserIds).filter((id) =>
          userFriendIds.has(id)
        );

        return {
          ...user,
          mutualFriendsCount: mutualFriends.length,
          totalFriends:
            user._count.sentFriendRequests +
            user._count.receivedFriendRequests,
        };
      })
    );

    // Sort by mutual friends (prioritize users with mutual connections)
    const sortedSuggestions = suggestionsWithMutuals.sort(
      (a, b) => b.mutualFriendsCount - a.mutualFriendsCount
    );

    // Return top 10 suggestions
    const topSuggestions = sortedSuggestions.slice(0, 10).map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      mutualFriendsCount: user.mutualFriendsCount,
      totalFriends: user.totalFriends,
    }));

    return NextResponse.json(topSuggestions);
  } catch (error) {
    console.error("Error fetching friend suggestions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}