import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", service: "SamadhanSetu API" });
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
