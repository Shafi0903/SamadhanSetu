import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth";

const sendOtpSchema = z.object({
  phone: z.string().min(10, "Phone number must have at least 10 digits"),
  fullName: z.string().optional(),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Phone number must have at least 10 digits"),
  code: z.string().length(6, "OTP must be 6 digits"),
  fullName: z.string().optional(),
});

const registerInstitutionSchema = z.object({
  email: z.string().email("Invalid official email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  role: z.enum(["GOVERNMENT", "UNIVERSITY", "INDUSTRY"], {
    errorMap: () => ({ message: "Role must be GOVERNMENT, UNIVERSITY, or INDUSTRY" }),
  }),
  organizationName: z.string().min(2, "Organization name is required"),
  designation: z.string().min(2, "Official designation is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export class AuthController {
  /**
   * POST /api/auth/otp/send
   */
  static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = sendOtpSchema.parse(req.body);
      const result = await AuthService.sendOtp(validated.phone, validated.fullName);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      next(err);
    }
  }

  /**
   * POST /api/auth/otp/verify
   */
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = verifyOtpSchema.parse(req.body);
      const result = await AuthService.verifyOtp(validated.phone, validated.code, validated.fullName);
      res.status(200).json({
        success: true,
        message: "Authentication successful",
        data: result,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      const message = err instanceof Error ? err.message : "OTP verification failed";
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * POST /api/auth/register
   */
  static async registerInstitution(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerInstitutionSchema.parse(req.body);
      const result = await AuthService.registerInstitution(validated);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      const message = err instanceof Error ? err.message : "Registration failed";
      res.status(400).json({ success: false, error: message });
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.loginWithPassword(validated.email, validated.password);
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors[0].message });
        return;
      }
      const message = err instanceof Error ? err.message : "Login failed";
      res.status(401).json({ success: false, error: message });
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: AuthenticatedRequest, res: Response) {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }

  /**
   * GET /api/auth/pending-institutions (Gov/Admin only)
   */
  static async getPendingInstitutions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const institutions = await AuthService.getPendingInstitutions();
      res.status(200).json({
        success: true,
        data: institutions,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/auth/approve-institution/:id (Gov/Admin only)
   */
  static async approveInstitution(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({ success: false, error: "Account ID is required" });
        return;
      }
      const updated = await AuthService.approveInstitution(id);
      res.status(200).json({
        success: true,
        message: "Institutional account approved successfully",
        data: updated,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Approval failed";
      res.status(400).json({ success: false, error: message });
    }
  }
}
