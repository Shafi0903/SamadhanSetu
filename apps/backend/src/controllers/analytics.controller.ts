import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytics.service";

export class AnalyticsController {
  /**
   * GET /api/analytics/global - Public metrics for dashboard and homepage
   */
  static async getGlobal(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getGlobalMetrics();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
