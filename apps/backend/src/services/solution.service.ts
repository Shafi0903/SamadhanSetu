import { SolutionStage, PledgeType } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class SolutionService {
  /**
   * University Faculty / Team Lead claims a verified problem
   */
  static async claimProblem(problemId: string, universityUserId: string) {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { claimedBy: true },
    });

    if (!problem) {
      throw new Error("Problem not found");
    }

    if (problem.status !== "VERIFIED") {
      throw new Error(`Problem cannot be claimed. Current status is ${problem.status}`);
    }

    if (problem.claimedById) {
      throw new Error("This challenge has already been claimed by another academic team.");
    }

    const claimer = await prisma.user.findUnique({
      where: { id: universityUserId },
    });

    if (!claimer) {
      throw new Error("University account not found");
    }

    const updated = await prisma.problem.update({
      where: { id: problemId },
      data: {
        claimedById: universityUserId,
        claimedAt: new Date(),
        status: "UNDER_INVESTIGATION",
        timelineEvents: {
          create: {
            eventType: "CLAIMED",
            title: "Claimed by Academic Innovators",
            description: `Challenge claimed by ${claimer.fullName} (${claimer.organizationName || "University Team"}) for research and prototyping.`,
            actorId: universityUserId,
          },
        },
      },
      include: {
        claimedBy: {
          select: { id: true, fullName: true, organizationName: true, designation: true },
        },
        timelineEvents: true,
      },
    });

    return updated;
  }

  /**
   * University team submits a Solution Proposal
   */
  static async createSolutionProposal(input: {
    problemId: string;
    teamLeadId: string;
    title: string;
    description: string;
    stage?: SolutionStage;
    repoUrl?: string;
    documentUrls?: string[];
  }) {
    const problem = await prisma.problem.findUnique({
      where: { id: input.problemId },
    });

    if (!problem) {
      throw new Error("Problem record not found");
    }

    const teamLead = await prisma.user.findUnique({
      where: { id: input.teamLeadId },
    });

    const proposal = await prisma.solutionProposal.create({
      data: {
        problemId: input.problemId,
        teamLeadId: input.teamLeadId,
        title: input.title,
        description: input.description,
        stage: input.stage || "PROPOSED",
        repoUrl: input.repoUrl,
        documentUrls: input.documentUrls || [],
      },
      include: {
        teamLead: {
          select: { id: true, fullName: true, organizationName: true },
        },
        problem: {
          select: { id: true, title: true },
        },
      },
    });

    // Advance problem status to SOLUTION_PROPOSED if still UNDER_INVESTIGATION
    if (problem.status === "UNDER_INVESTIGATION" || problem.status === "VERIFIED") {
      await prisma.problem.update({
        where: { id: input.problemId },
        data: {
          status: "SOLUTION_PROPOSED",
          timelineEvents: {
            create: {
              eventType: "SOLUTION_PROPOSED",
              title: "Solution Prototype Proposed",
              description: `Solution proposal "${input.title}" uploaded by ${teamLead?.fullName || "student innovators"}.`,
              actorId: input.teamLeadId,
            },
          },
        },
      });
    }

    return proposal;
  }

  /**
   * Fetch all proposals and claimed problems for a university user
   */
  static async getUniversityWorkspace(universityUserId: string) {
    const claimedProblems = await prisma.problem.findMany({
      where: { claimedById: universityUserId },
      include: {
        solutions: {
          include: {
            pledges: true,
          },
        },
        _count: {
          select: { upvotes: true, comments: true },
        },
      },
      orderBy: { claimedAt: "desc" },
    });

    const solutions = await prisma.solutionProposal.findMany({
      where: { teamLeadId: universityUserId },
      include: {
        problem: {
          select: { id: true, title: true, status: true, city: true },
        },
        pledges: {
          include: {
            sponsor: {
              select: { id: true, fullName: true, organizationName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { claimedProblems, solutions };
  }

  /**
   * Industry partner pledges CSR support, equipment, or mentorship
   */
  static async pledgeSupport(input: {
    solutionId: string;
    sponsorId: string;
    pledgeType: PledgeType;
    description: string;
    amount?: number;
  }) {
    const solution = await prisma.solutionProposal.findUnique({
      where: { id: input.solutionId },
      include: { problem: true },
    });

    if (!solution) {
      throw new Error("Solution proposal not found");
    }

    const sponsor = await prisma.user.findUnique({
      where: { id: input.sponsorId },
    });

    if (!sponsor) {
      throw new Error("Industry sponsor account not found");
    }

    const pledge = await prisma.supportPledge.create({
      data: {
        solutionId: input.solutionId,
        sponsorId: input.sponsorId,
        pledgeType: input.pledgeType,
        description: input.description,
        amount: input.amount,
        status: "ACCEPTED",
      },
      include: {
        solution: {
          include: { problem: true },
        },
        sponsor: {
          select: { id: true, fullName: true, organizationName: true },
        },
      },
    });

    // Record Support TimelineEvent on the problem
    await prisma.timelineEvent.create({
      data: {
        problemId: solution.problemId,
        actorId: input.sponsorId,
        eventType: "SUPPORT_PLEDGED",
        title: "Industry Partner Support Pledged",
        description: `${sponsor.organizationName || sponsor.fullName} pledged ${input.pledgeType.replace("_", " ")}${input.amount ? ` (₹${input.amount.toLocaleString()})` : ""} towards solution "${solution.title}".`,
      },
    });

    return pledge;
  }

  /**
   * Fetch all solutions open for Industry sponsorship
   */
  static async getSolutionsForIndustry() {
    return prisma.solutionProposal.findMany({
      include: {
        teamLead: {
          select: { id: true, fullName: true, organizationName: true },
        },
        problem: {
          select: { id: true, title: true, category: true, city: true, status: true },
        },
        pledges: {
          include: {
            sponsor: {
              select: { id: true, fullName: true, organizationName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Fetch all pledges made by an Industry partner
   */
  static async getIndustryPledges(sponsorId: string) {
    return prisma.supportPledge.findMany({
      where: { sponsorId },
      include: {
        solution: {
          include: {
            problem: true,
            teamLead: {
              select: { id: true, fullName: true, organizationName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mark Problem and Solution as fully deployed/RESOLVED
   */
  static async resolveProblem(problemId: string, actorId: string, notes?: string) {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new Error("Problem not found");
    }

    const actor = await prisma.user.findUnique({
      where: { id: actorId },
    });

    const updatedProblem = await prisma.problem.update({
      where: { id: problemId },
      data: {
        status: "RESOLVED",
        timelineEvents: {
          create: {
            eventType: "RESOLVED",
            title: "Solution Deployed & Verified",
            description: notes || `Field solution successfully deployed and community verification confirmed by ${actor?.fullName || "nodal authority"}.`,
            actorId,
          },
        },
      },
    });

    // Update associated solutions to DEPLOYED
    await prisma.solutionProposal.updateMany({
      where: { problemId },
      data: { stage: "DEPLOYED" },
    });

    return updatedProblem;
  }
}
