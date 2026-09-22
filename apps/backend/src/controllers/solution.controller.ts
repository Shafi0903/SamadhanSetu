import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { SolutionService } from "../services/solution.service";
import { AuthenticatedRequest } from "../middlewares/auth";
import { SolutionStage, PledgeType } from "@prisma/client";

const createProposalSchema = z.object({
  problemId: z.string().uuid("Invalid problem ID"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(15, "Description must be at least 15 characters"),
  stage: z.nativeEnum(SolutionStage).optional(),
  repoUrl: z.string().url("Invalid repository URL").optional().or(z.literal("")),
  documentUrls: z.array(z.string()).optional(),
});

const pledgeSchema = z.object({
  solutionId: z.string().uuid("Invalid solution ID"),
  pledgeType: z.nativeEnum(PledgeType, {
    errorMap: () => ({ message: "Pledge type must be MENTORSHIP, EQUIPMENT, CSR_FUNDING, or INCUBATION" }),
  }),
  description: z.string().min(5, "Description must be at least 5 characters"),
  amount: z.number().positive("Amount must be positive").optional(),
});

const resolveSchema = z.object({
  notes: z.string().optional(),
});

export class SolutionController {
  /**
   * PATCH /api/problems/:id/claim - University claims verified problem
   */
  static async claim(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

      const problem = await SolutionService.claimProblem(id, req.user.id);
      res.status(200).json({
        success: true,
        message: "Challenge successfully claimed by your academic team!",
        data: problem,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to claim problem";
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * POST /api/solutions - University submits solution proposal
   */
  static async createProposal(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const validated = createProposalSchema.parse(req.body);
      const proposal = await SolutionService.createSolutionProposal({
        ...validated,
        teamLeadId: req.user.id,
        repoUrl: validated.repoUrl || undefined,
      });

      res.status(201).json({
        success: true,
        message: "Solution proposal submitted successfully!",
        data: proposal,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      const message = err instanceof Error ? err.message : "Failed to submit proposal";
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * GET /api/solutions/university/my - Fetch claimed problems and proposals for university
   */
  static async getUniversityWorkspace(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const data = await SolutionService.getUniversityWorkspace(req.user.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/solutions/industry/catalog - Fetch all solution proposals open for CSR support
   */
  static async getIndustryCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      const solutions = await SolutionService.getSolutionsForIndustry();
      res.status(200).json({
        success: true,
        data: solutions,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/pledges - Industry partner pledges support
   */
  static async pledgeSupport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const validated = pledgeSchema.parse(req.body);
      const pledge = await SolutionService.pledgeSupport({
        ...validated,
        sponsorId: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: "Support pledge recorded successfully. Thank you for empowering student innovators!",
        data: pledge,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      const message = err instanceof Error ? err.message : "Failed to record pledge";
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * GET /api/pledges/my - Fetch pledges by current industry partner
   */
  static async getMyPledges(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const pledges = await SolutionService.getIndustryPledges(req.user.id);
      res.status(200).json({
        success: true,
        data: pledges,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/problems/:id/resolve - Mark problem and solution as resolved
   */
  static async resolve(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

      const validated = resolveSchema.parse(req.body);
      const result = await SolutionService.resolveProblem(id, req.user.id, validated.notes);

      res.status(200).json({
        success: true,
        message: "Problem marked as RESOLVED and successfully deployed!",
        data: result,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resolve problem";
      res.status(400).json({ success: false, error: message });
    }
  }
}
