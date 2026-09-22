import { ProblemCategory, ProblemStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

export interface CreateProblemInput {
  title: string;
  description: string;
  category: ProblemCategory;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mediaUrls?: string[];
  reporterId: string;
}

export class ProblemService {
  /**
   * Citizen creates a new civic problem report
   */
  static async createProblem(input: CreateProblemInput) {
    const problem = await prisma.problem.create({
      data: {
        title: input.title,
        description: input.description,
        category: input.category,
        latitude: input.latitude,
        longitude: input.longitude,
        address: input.address,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        mediaUrls: input.mediaUrls || [],
        reporterId: input.reporterId,
        status: "PENDING_VERIFICATION",
        timelineEvents: {
          create: {
            eventType: "REPORTED",
            title: "Problem Reported",
            description: `Civic issue reported by citizen at ${input.address || input.city || "designated location"}.`,
            actorId: input.reporterId,
          },
        },
      },
      include: {
        reporter: {
          select: { id: true, fullName: true, role: true, phone: true },
        },
        timelineEvents: true,
      },
    });

    return problem;
  }

  /**
   * Citizen fetches their submitted civic problems
   */
  static async getCitizenProblems(reporterId: string) {
    return prisma.problem.findMany({
      where: { reporterId },
      include: {
        timelineEvents: {
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { upvotes: true, solutions: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Public Challenge Board: Fetches verified problems open for solving
   */
  static async getVerifiedProblems(filters: {
    category?: ProblemCategory;
    city?: string;
    search?: string;
  }) {
    const where: Record<string, unknown> = {
      status: { in: ["VERIFIED", "UNDER_INVESTIGATION", "SOLUTION_PROPOSED", "RESOLVED"] },
    };

    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.city) {
      where.city = { contains: filters.city, mode: "insensitive" };
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.problem.findMany({
      where,
      include: {
        claimedBy: {
          select: { id: true, fullName: true, organizationName: true },
        },
        solutions: {
          select: { id: true, title: true, stage: true },
        },
        _count: {
          select: { upvotes: true, solutions: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Government Nodal Officer fetches problems in triage queue with optional filtering
   */
  static async getTriageProblems(filters: {
    status?: ProblemStatus;
    category?: ProblemCategory;
    city?: string;
    search?: string;
  }) {
    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.city) {
      where.city = { contains: filters.city, mode: "insensitive" };
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.problem.findMany({
      where,
      include: {
        reporter: {
          select: { id: true, fullName: true, phone: true, email: true },
        },
        timelineEvents: {
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { upvotes: true, solutions: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get single problem by ID with full relations
   */
  static async getProblemById(id: string) {
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { id: true, fullName: true, phone: true, organizationName: true },
        },
        verifiedBy: {
          select: { id: true, fullName: true, organizationName: true, designation: true },
        },
        claimedBy: {
          select: { id: true, fullName: true, organizationName: true, designation: true },
        },
        timelineEvents: {
          orderBy: { createdAt: "asc" },
          include: {
            actor: { select: { id: true, fullName: true, role: true } },
          },
        },
        solutions: {
          include: {
            teamLead: { select: { id: true, fullName: true, organizationName: true } },
            pledges: true,
          },
        },
        _count: {
          select: { upvotes: true, comments: true },
        },
      },
    });

    if (!problem) {
      throw new Error("Problem record not found");
    }

    return problem;
  }

  /**
   * Government Nodal Authority approves/verifies problem onto Challenge Board
   */
  static async verifyProblem(id: string, verifierId: string) {
    const existing = await prisma.problem.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Problem record not found");
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: {
        status: "VERIFIED",
        verifiedById: verifierId,
        verifiedAt: new Date(),
        timelineEvents: {
          create: {
            eventType: "VERIFIED",
            title: "Verified by Nodal Authority",
            description: "Issue verified for authenticity and published to the University Challenge Board.",
            actorId: verifierId,
          },
        },
      },
      include: {
        timelineEvents: true,
        verifiedBy: { select: { id: true, fullName: true, designation: true } },
      },
    });

    return updated;
  }

  /**
   * Government Nodal Authority rejects a reported problem with justification
   */
  static async rejectProblem(id: string, verifierId: string, rejectionReason: string) {
    const existing = await prisma.problem.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Problem record not found");
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason,
        verifiedById: verifierId,
        verifiedAt: new Date(),
        timelineEvents: {
          create: {
            eventType: "REJECTED",
            title: "Problem Report Rejected",
            description: `Report rejected by authority: ${rejectionReason}`,
            actorId: verifierId,
          },
        },
      },
      include: {
        timelineEvents: true,
      },
    });

    return updated;
  }

  /**
   * Toggle or register upvote from citizen
   */
  static async toggleUpvote(problemId: string, userId: string) {
    const existing = await prisma.problemUpvote.findUnique({
      where: {
        problemId_userId: { problemId, userId },
      },
    });

    if (existing) {
      await prisma.problemUpvote.delete({
        where: { id: existing.id },
      });
      return { upvoted: false };
    } else {
      await prisma.problemUpvote.create({
        data: { problemId, userId },
      });
      return { upvoted: true };
    }
  }
}
