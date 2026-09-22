"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { BriefcaseIcon, SparklesIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

export default function IndustryDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="Industry & CSR Portal" roleLabel="The Enablers" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Industry Sponsorship & CSR Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              Empower student innovation teams with CSR micro-grants, technical mentorship, and domain expertise.
            </p>
          </div>
          <Link href="/challenge">
            <Button className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Discover Solution Proposals
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Active Pledges</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">0</h3>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">CSR Funds Committed</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">₹0</h3>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Student Teams Mentored</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">0</h3>
          </Card>
        </div>

        {/* Empty State */}
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
            <BriefcaseIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No active CSR pledges yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Discover vetted student solution prototypes needing mentorship, laboratory testing equipment, or micro-grants.
          </p>
          <div className="mt-6">
            <Link href="/challenge">
              <Button>Browse Innovator Solutions</Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
