import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { UserRole } from "@samadhansetu/types";
import { prisma } from "../lib/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email?: string | null;
    phone?: string | null;
    fullName: string;
    isVerified: boolean;
    organizationName?: string | null;
  };
}

/**
 * Authentication Middleware: Extracts Bearer token and validates user
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "No token provided or invalid format",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded: JwtPayload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        email: true,
        phone: true,
        fullName: true,
        isVerified: true,
        organizationName: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User associated with this token no longer exists",
      });
      return;
    }

    req.user = user as AuthenticatedRequest["user"];
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
}

/**
 * RBAC Authorization Middleware: Restricts access to specified UserRoles
 */
export function authorize(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: "Forbidden",
        message: `Access denied. Requires one of roles: [${allowedRoles.join(", ")}]`,
      });
      return;
    }

    next();
  };
}

/**
 * Requires verified status (e.g. for institutions)
 */
export function requireVerified(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Authentication required",
    });
    return;
  }

  // Citizens are auto-verified upon OTP login
  if (req.user.role !== "CITIZEN" && !req.user.isVerified) {
    res.status(403).json({
      success: false,
      error: "Forbidden",
      message: "Account pending administrative verification",
    });
    return;
  }

  next();
}
