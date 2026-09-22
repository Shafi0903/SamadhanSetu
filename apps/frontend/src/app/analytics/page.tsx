"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { apiRequest } from "@/lib/api";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface GlobalAnalyticsData {
  overview: {
    totalReported: number;
    totalVerified: number;
    totalResolved: number;
    totalSolutions: number;
    totalCsrPledged: number;
    totalPledgesCount: number;
    totalUniversities: number;
    totalIndustryPartners: number;
    resolutionRate: number;
  };
  recentActivity: Array<{
    id: string;
    eventType: string;
    title: string;
    description: string;
    createdAt: string;
    problem?: {
      id: string;
      title: string;
      city?: string;
    };
    actor?: {
      fullName: string;
      role: string;
      organizationName?: string;
    };
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<GlobalAnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await apiRequest<GlobalAnalyticsData>("/api/analytics/global");
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const overview = data?.overview || {
    totalReported: 0,
    totalVerified: 0,
    totalResolved: 0,
    totalSolutions: 0,
    totalCsrPledged: 0,
    totalPledgesCount: 0,
    totalUniversities: 0,
    totalIndustryPartners: 0,
    resolutionRate: 0,
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                सं
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Samadhan<span className="text-indigo-600">Setu</span>
              </span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800">Impact Analytics</span>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <Link href="/challenge">
              <Button size="sm">Challenge Board</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <ChartBarIcon className="w-4 h-4" />
            Ecosystem Transparency Metrics
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Platform-Wide Civic Impact
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Real-time public dashboard tracking grievances submitted by citizens, prototypes built by universities, and CSR commitments pledged by industry leaders.
          </p>
        </div>

        {/* High-Level Impact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reported</span>
            <h3 className="text-3xl font-bold text-gray-900">{overview.totalReported}</h3>
            <p className="text-xs text-gray-500">Citizen submissions logged</p>
          </Card>

          <Card className="p-6 space-y-2">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Verified Challenges</span>
            <h3 className="text-3xl font-bold text-amber-600">{overview.totalVerified}</h3>
            <p className="text-xs text-gray-500">Validated by municipal nodal officers</p>
          </Card>

          <Card className="p-6 space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Active Prototypes</span>
            <h3 className="text-3xl font-bold text-indigo-600">{overview.totalSolutions}</h3>
            <p className="text-xs text-gray-500">Engineering & capstone teams</p>
          </Card>

          <Card className="p-6 space-y-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total CSR Backing</span>
            <h3 className="text-3xl font-bold text-emerald-600">₹{overview.totalCsrPledged.toLocaleString()}</h3>
            <p className="text-xs text-gray-500">{overview.totalPledgesCount} corporate sponsor pledges</p>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Resolution Success Rate</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{overview.resolutionRate}%</h4>
              <p className="text-xs text-gray-500 mt-0.5">Problems deployed & verified</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              ✓
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Partner Universities</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{overview.totalUniversities || 1}</h4>
              <p className="text-xs text-gray-500 mt-0.5">Institutions with active solver labs</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Industry Partners</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{overview.totalIndustryPartners || 1}</h4>
              <p className="text-xs text-gray-500 mt-0.5">Enterprises sponsoring solutions</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Recent Activity Stream */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Transparent Activity Stream</h3>
            <Badge variant="outline">Live Feed</Badge>
          </div>

          {loading ? (
            <p className="text-xs text-gray-500 py-6 text-center">Loading activity stream...</p>
          ) : data?.recentActivity?.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">
              No recent lifecycle events logged yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {data?.recentActivity?.map((event) => (
                <div key={event.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {event.eventType.replace("_", " ")}
                      </span>
                      <h5 className="text-sm font-semibold text-gray-900">{event.title}</h5>
                    </div>
                    <p className="text-xs text-gray-600">{event.description}</p>
                    {event.problem && (
                      <p className="text-[11px] text-gray-400">
                        Problem: <Link href={`/challenge/${event.problem.id}`} className="text-indigo-600 hover:underline">{event.problem.title}</Link>
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
