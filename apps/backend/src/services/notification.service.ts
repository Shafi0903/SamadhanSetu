import { prisma } from "../lib/prisma";

export class NotificationService {
  /**
   * System or action dispatches an in-app notification to a user
   */
  static async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    linkUrl?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        linkUrl: data.linkUrl,
      },
    });
  }

  /**
   * Fetch all notifications for a user, sorted newest first
   */
  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
