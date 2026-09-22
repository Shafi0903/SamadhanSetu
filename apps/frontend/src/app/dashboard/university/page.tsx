"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { AcademicCapIcon, RocketLaunchIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function UniversityDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="University Innovation Hub" roleLabel="The Solvers" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Innovation Workspace</h1>
            <p className="text-sm text-gray-600 mt-1">
              Connect capstone projects and research prototypes directly to verified grassroots challenges.
            </p>
          </div>
          <Link href="/challenge">
            <Button className="flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5" />
              Browse Challenge Board
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Claimed Challenges</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">0</h3>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Active Prototypes</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">0</h3>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Industry CSR Pledges</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">0</h3>
          </Card>
        </div>

        {/* Claimed Projects Section */}
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <AcademicCapIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No challenges claimed yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Browse the Challenge Board to claim verified civic issues for your student engineering or design teams.
          </p>
          <div className="mt-6">
            <Link href="/challenge">
              <Button>Explore Verified Challenges</Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
