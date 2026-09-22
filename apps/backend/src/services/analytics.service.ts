import { prisma } from "../lib/prisma";

export class AnalyticsService {
  /**
   * Aggregates global ecosystem impact metrics
   */
  static async getGlobalMetrics() {
    const [
      totalReported,
      totalVerified,
      totalResolved,
      totalSolutions,
      pledgesAgg,
      totalUniversities,
      totalIndustryPartners,
      recentTimeline,
    ] = await Promise.all([
      prisma.problem.count(),
      prisma.problem.count({ where: { status: { in: ["VERIFIED", "UNDER_INVESTIGATION", "SOLUTION_PROPOSED", "RESOLVED"] } } }),
      prisma.problem.count({ where: { status: "RESOLVED" } }),
      prisma.solutionProposal.count(),
      prisma.supportPledge.aggregate({
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.user.count({ where: { role: "UNIVERSITY", isVerified: true } }),
      prisma.user.count({ where: { role: "INDUSTRY", isVerified: true } }),
      prisma.timelineEvent.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          problem: { select: { id: true, title: true, city: true } },
          actor: { select: { fullName: true, role: true, organizationName: true } },
        },
      }),
    ]);

    const totalCsrPledged = pledgesAgg._sum.amount || 0;
    const totalPledgesCount = pledgesAgg._count.id || 0;
    const resolutionRate = totalReported > 0 ? Math.round((totalResolved / totalReported) * 100) : 0;

    return {
      overview: {
        totalReported,
        totalVerified,
        totalResolved,
        totalSolutions,
        totalCsrPledged,
        totalPledgesCount,
        totalUniversities,
        totalIndustryPartners,
        resolutionRate,
      },
      recentActivity: recentTimeline,
    };
  }
}
