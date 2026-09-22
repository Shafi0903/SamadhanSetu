import bcrypt from "bcrypt";
import { UserRole } from "@samadhansetu/types";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";

// In-memory OTP storage for development & MVP demo
// Key: phone number, Value: { code: string, expiresAt: number, fullName?: string }
const otpStore = new Map<string, { code: string; expiresAt: number; fullName?: string }>();

export class AuthService {
  /**
   * Generates and dispatches a 6-digit OTP to citizen's mobile number
   */
  static async sendOtp(phone: string, fullName?: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
    // Generate 6-digit OTP (for dev, fallback to 123456 or random)
    const code = "123456";
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    otpStore.set(phone, { code, expiresAt, fullName });

    console.log(`[OTP Service] Generated OTP for ${phone}: ${code}`);

    return {
      success: true,
      message: "OTP sent successfully to " + phone + ". (Demo code: 123456)",
      demoOtp: "123456",
    };
  }

  /**
   * Verifies OTP and logs in or creates Citizen account
   */
  static async verifyOtp(phone: string, code: string, fullName?: string) {
    const record = otpStore.get(phone);

    const isMasterOtp = code === "123456";
    if (!isMasterOtp && (!record || record.expiresAt < Date.now() || record.code !== code)) {
      throw new Error("Invalid or expired OTP. Please enter demo OTP: 123456");
    }

    if (record) {
      otpStore.delete(phone);
    }

    // Find existing citizen or register new one
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          fullName: fullName || record?.fullName || `Citizen ${phone.slice(-4)}`,
          role: "CITIZEN",
          isVerified: true, // Citizens auto-verified via OTP
        },
      });
    }

    const token = signToken({
      userId: user.id,
      role: user.role as UserRole,
      isVerified: user.isVerified,
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    };
  }

  /**
   * Registers institutional accounts (Government, University, Industry)
   */
  static async registerInstitution(data: {
    email: string;
    password: string;
    fullName: string;
    role: "GOVERNMENT" | "UNIVERSITY" | "INDUSTRY";
    organizationName: string;
    designation: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("An account with this official email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        role: data.role,
        organizationName: data.organizationName,
        designation: data.designation,
        isVerified: false, // Requires nodal/admin verification
      },
    });

    const token = signToken({
      userId: user.id,
      role: user.role as UserRole,
      isVerified: user.isVerified,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationName: user.organizationName,
        designation: user.designation,
        isVerified: user.isVerified,
      },
      token,
      message: "Registration successful. Institutional accounts require nodal verification before full access.",
    };
  }

  /**
   * Standard Email & Password Login for institutional users
   */
  static async loginWithPassword(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new Error("Invalid email or password credentials.");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password credentials.");
    }

    const token = signToken({
      userId: user.id,
      role: user.role as UserRole,
      isVerified: user.isVerified,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationName: user.organizationName,
        designation: user.designation,
        isVerified: user.isVerified,
      },
      token,
    };
  }

  /**
   * Fetches pending institutional accounts for admin review
   */
  static async getPendingInstitutions() {
    return prisma.user.findMany({
      where: {
        isVerified: false,
        role: { in: ["GOVERNMENT", "UNIVERSITY", "INDUSTRY"] },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        organizationName: true,
        designation: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Nodal Authority approves an institutional account
   */
  static async approveInstitution(targetUserId: string) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new Error("Institutional account not found.");
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { isVerified: true },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isVerified: true,
        organizationName: true,
      },
    });

    return updated;
  }
}
