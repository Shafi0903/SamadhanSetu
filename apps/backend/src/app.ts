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

  // Root API Landing Endpoint
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      service: "SamadhanSetu API Server",
      version: "1.0.0",
      status: "online",
      message: "SamadhanSetu API is running. The web user interface is hosted on http://localhost:3000",
      frontendUrl: process.env.CLIENT_URL || "http://localhost:3000",
      endpoints: {
        health: "/health",
        analytics: "/api/analytics/global",
        challengeBoard: "/api/problems",
        auth: "/api/auth",
        solutions: "/api/solutions",
        notifications: "/api/notifications",
      },
    });
  });

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

  // 404 Catch-All Handler for undefined routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: "Not Found",
      message: `Cannot ${req.method} ${req.originalUrl}. For the web app UI, visit http://localhost:3000`,
    });
  });

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
