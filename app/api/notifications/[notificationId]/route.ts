import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ notificationId: string }> }
) {
  try {
    const session = await auth();
    const { notificationId } = await context.params;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: "Notification ID is required" },
        { status: 400 }
      );
    }

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Notification not found or access denied" },
        { status: 404 }
      );
    }

    // ✅ Update only if unread
    if (!notification.isRead) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json(
      { success: true, message: "Notification marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
