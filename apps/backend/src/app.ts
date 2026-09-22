import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import problemRoutes from "./routes/problem.routes";
import solutionRoutes from "./routes/solution.routes";
import notificationRoutes from "./routes/notification.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { apiRateLimiter } from "./middlewares/rateLimiter";

export function createApp(): Express {
  const app = express();

  // Trust reverse proxy (Render cloud, Vercel edge) for accurate IP resolution in rate limiters
  app.set("trust proxy", 1);

  // 1. Helmet HTTP Security Headers (anti-sniffing, clickjacking defense, HSTS)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. Strict CORS Configuration
  const allowedOrigins = [
    "https://frontend-tpit.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];
  if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow server-to-server, curl, mobile, or missing Origin headers
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
        callback(new Error(`Security Alert: Request blocked by CORS policy for origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // 3. Body parser & API rate limiting
  app.use(express.json({ limit: "10mb" })); // Prevent body-parser buffer exhaustion
  app.use("/api/", apiRateLimiter);

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
        message: err.message || "An unexpected error occurred on the server.",
      });
    }
  );

  return app;
}
