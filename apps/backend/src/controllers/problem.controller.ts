import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ProblemService } from "../services/problem.service";
import { AuthenticatedRequest } from "../middlewares/auth";
import { ProblemCategory, ProblemStatus } from "@prisma/client";

const createProblemSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(15, "Description must be at least 15 characters"),
  category: z.nativeEnum(ProblemCategory, {
    errorMap: () => ({ message: "Invalid problem category" }),
  }),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
});

const rejectProblemSchema = z.object({
  rejectionReason: z.string().min(5, "Rejection reason must be at least 5 characters"),
});

export class ProblemController {
  /**
   * POST /api/problems - Citizen submits new problem
   */
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const validated = createProblemSchema.parse(req.body);
      const problem = await ProblemService.createProblem({
        ...validated,
        reporterId: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: "Problem reported successfully. Queued for government triage.",
        data: problem,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      next(err);
    }
  }

  /**
   * GET /api/problems - Public verified challenge board
   */
  static async getVerified(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, city, search } = req.query;
      const problems = await ProblemService.getVerifiedProblems({
        category: category as ProblemCategory | undefined,
        city: city as string | undefined,
        search: search as string | undefined,
      });

      res.status(200).json({
        success: true,
        data: problems,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/problems/my - Citizen fetches their reported issues
   */
  static async getMyProblems(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const problems = await ProblemService.getCitizenProblems(req.user.id);
      res.status(200).json({
        success: true,
        data: problems,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/problems/triage - Government triage queue
   */
  static async getTriage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, category, city, search } = req.query;

      const problems = await ProblemService.getTriageProblems({
        status: status as ProblemStatus | undefined,
        category: category as ProblemCategory | undefined,
        city: city as string | undefined,
        search: search as string | undefined,
      });

      res.status(200).json({
        success: true,
        data: problems,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/problems/:id - Single problem detail view
   */
  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: "Problem ID is required" });
        return;
      }

      const problem = await ProblemService.getProblemById(id);
      res.status(200).json({
        success: true,
        data: problem,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Problem not found";
      res.status(404).json({ success: false, error: message });
    }
  }

  /**
   * PATCH /api/problems/:id/verify - Government approves problem
   */
  static async verify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: "Problem ID is required" });
        return;
      }

      const problem = await ProblemService.verifyProblem(id, req.user.id);
      res.status(200).json({
        success: true,
        message: "Problem verified and published to Challenge Board",
        data: problem,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * PATCH /api/problems/:id/reject - Government rejects problem
   */
  static async reject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: "Problem ID is required" });
        return;
      }

      const validated = rejectProblemSchema.parse(req.body);
      const problem = await ProblemService.rejectProblem(id, req.user.id, validated.rejectionReason);

      res.status(200).json({
        success: true,
        message: "Problem report rejected",
        data: problem,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      const message = err instanceof Error ? err.message : "Rejection failed";
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * POST /api/problems/:id/upvote - Upvote a problem
   */
  static async upvote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: "Problem ID is required" });
        return;
      }

      const result = await ProblemService.toggleUpvote(id, req.user.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
