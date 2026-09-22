"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Tabs } from "@/components/ui";
import { apiRequest } from "@/lib/api";
import {
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

interface PendingInstitution {
  id: string;
  fullName: string;
  email: string;
  role: "GOVERNMENT" | "UNIVERSITY" | "INDUSTRY";
  organizationName?: string;
  designation?: string;
  createdAt: string;
}

export default function GovernmentDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("triage");
  const [pendingInstitutions, setPendingInstitutions] = React.useState<PendingInstitution[]>([]);
  const [loadingInst, setLoadingInst] = React.useState(false);
  const [actionMsg, setActionMsg] = React.useState<string | null>(null);

  const fetchPendingInstitutions = React.useCallback(async () => {
    setLoadingInst(true);
    try {
      const res = await apiRequest<PendingInstitution[]>("/api/auth/pending-institutions");
      if (res.data) {
        setPendingInstitutions(res.data);
      }
    } catch {
      // User might not have token or be non-admin in preview
    } finally {
      setLoadingInst(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === "institutions") {
      fetchPendingInstitutions();
    }
  }, [activeTab, fetchPendingInstitutions]);

  const handleApprove = async (id: string) => {
    try {
      await apiRequest(`/api/auth/approve-institution/${id}`, {
        method: "PATCH",
      });
      setActionMsg("Institution approved successfully");
      fetchPendingInstitutions();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Approval failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="Government Nodal Portal" roleLabel="Verifier & Admin" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nodal Authority Console</h1>
          <p className="text-sm text-gray-600 mt-1">
            Validate citizen reports for the public Challenge Board and verify institutional partner credentials.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          tabs={[
            { id: "triage", label: "Civic Issue Triage", badge: 0 },
            { id: "institutions", label: "Institutional Verification", badge: pendingInstitutions.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {actionMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm">
            {actionMsg}
          </div>
        )}

        {/* Tab 1: Civic Issue Triage */}
        {activeTab === "triage" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase">Pending Triage</p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1">0</h3>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase">Approved / Verified</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1">0</h3>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase">Claimed by Universities</p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-1">0</h3>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase">Duplicates Merged</p>
                <h3 className="text-2xl font-bold text-gray-700 mt-1">0</h3>
              </Card>
            </div>

            <Card className="p-12 text-center">
              <ShieldCheckIcon className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Triage queue is clear</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                No civic issues pending verification in your designated municipal ward.
              </p>
            </Card>
          </div>
        )}

        {/* Tab 2: Institutional Verification */}
        {activeTab === "institutions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Institutional Accounts</h2>
              <Button size="sm" variant="secondary" onClick={fetchPendingInstitutions} isLoading={loadingInst}>
                Refresh
              </Button>
            </div>

            {pendingInstitutions.length === 0 ? (
              <Card className="p-12 text-center">
                <BuildingOffice2Icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">No pending institutional requests</h3>
                <p className="text-sm text-gray-500 mt-1">
                  All university faculty and corporate partner registrations are currently verified.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingInstitutions.map((inst) => (
                  <Card key={inst.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{inst.fullName}</h4>
                        <Badge variant="pending">{inst.role}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {inst.designation} at <strong>{inst.organizationName}</strong>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Email: {inst.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(inst.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
