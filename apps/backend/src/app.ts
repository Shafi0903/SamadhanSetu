import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import problemRoutes from "./routes/problem.routes";
import solutionRoutes from "./routes/solution.routes";
import notificationRoutes from "./routes/notification.routes";
import analyticsRoutes from "./routes/analytics.routes";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health Check
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", service: "SamadhanSetu API" });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/problems", problemRoutes);
  app.use("/api/solutions", solutionRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/analytics", analyticsRoutes);

  // Centralized Error Handling Middleware (Rules.md requirement)
  app.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("[ServerError]:", err);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message:
          process.env.NODE_ENV === "production"
            ? undefined
            : err.message,
      });
    }
  );

  return app;
}
