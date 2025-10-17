import { prisma } from "@/lib/db";

interface CreateNotificationProps {
  userId: string; // who receives the notification
  fromUserId?: string; // who triggered it (optional)
  type: "LIKE" | "COMMENT" | "FOLLOW" | "MENTION" | "REPORT" | "SYSTEM";
  message: string;
  link?: string;
  postId?: string;
}

export async function createNotification({
  userId,
  fromUserId,
  type,
  message,
  link,
  postId,
}: CreateNotificationProps) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        fromUserId,
        type,
        message,
        link,
        postId,
      },
    });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
  }
}
