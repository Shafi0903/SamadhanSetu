import { Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import { AuthenticatedRequest } from "../middlewares/auth";

export class NotificationController {
  /**
   * GET /api/notifications - Fetch user notifications
   */
  static async getMyNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const notifications = await NotificationService.getUserNotifications(req.user.id);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/notifications/:id/read - Mark notification as read
   */
  static async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: "Notification ID is required" });
        return;
      }

      await NotificationService.markAsRead(id, req.user.id);
      res.status(200).json({ success: true, message: "Marked as read" });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/notifications/read-all - Mark all user notifications as read
   */
  static async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      await NotificationService.markAllAsRead(req.user.id);
      res.status(200).json({ success: true, message: "All marked as read" });
    } catch (err) {
      next(err);
    }
  }
}
