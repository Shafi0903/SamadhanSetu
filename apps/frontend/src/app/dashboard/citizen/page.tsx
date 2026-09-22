"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { apiRequest } from "@/lib/api";
import {
  PlusIcon,
  MapPinIcon,
  CalendarIcon,
  ChevronRightIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

interface CitizenProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "UNDER_INVESTIGATION" | "SOLUTION_PROPOSED" | "RESOLVED" | "REJECTED";
  city?: string;
  address?: string;
  createdAt: string;
  mediaUrls: string[];
  _count: {
    upvotes: number;
    solutions: number;
    comments: number;
  };
}

export default function CitizenDashboardPage() {
  const [problems, setProblems] = React.useState<CitizenProblem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchMyProblems = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<CitizenProblem[]>("/api/problems/my");
      if (res.data) {
        setProblems(res.data);
      }
    } catch {
      // User might be viewing without active session
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMyProblems();
  }, [fetchMyProblems]);

  const pendingCount = problems.filter((p) => p.status === "PENDING_VERIFICATION").length;
  const activeCount = problems.filter(
    (p) => p.status === "VERIFIED" || p.status === "UNDER_INVESTIGATION" || p.status === "SOLUTION_PROPOSED"
  ).length;
  const resolvedCount = problems.filter((p) => p.status === "RESOLVED").length;

  const getStatusBadgeVariant = (status: CitizenProblem["status"]) => {
    switch (status) {
      case "PENDING_VERIFICATION":
        return "pending";
      case "VERIFIED":
      case "UNDER_INVESTIGATION":
      case "SOLUTION_PROPOSED":
        return "submitted";
      case "RESOLVED":
        return "resolved";
      case "REJECTED":
        return "urgent";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="Citizen Portal" roleLabel="Reporter" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner with Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Civic Grievances</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track real-time progress as your reported issues are verified, claimed by universities, and resolved.
            </p>
          </div>
          <Link href="/dashboard/citizen/new">
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Reported</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{problems.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              📋
            </div>
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Triage</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              ⏳
            </div>
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active in Solving</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">{activeCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              ⚙️
            </div>
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </Card>
        </div>

        {/* Tickets List */}
        {loading ? (
          <Card className="p-12 text-center text-sm text-gray-500">
            Loading your reported issues...
          </Card>
        ) : problems.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
              <MapPinIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No issues reported yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Experience a pothole, water leakage, or broken streetlight? Report it now and help universities prototype solutions.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/citizen/new">
                <Button>Report Your First Issue</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map((problem) => (
              <Link key={problem.id} href={`/challenge/${problem.id}`}>
                <Card className="h-full flex flex-col justify-between p-5 hover:border-indigo-300 transition cursor-pointer">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant={getStatusBadgeVariant(problem.status)}>
                        {problem.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {problem.category}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {problem.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      {problem.city && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {problem.city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <HandThumbUpIcon className="w-3.5 h-3.5" />
                        {problem._count.upvotes}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 font-medium text-indigo-600">
                      View Timeline
                      <ChevronRightIcon className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
