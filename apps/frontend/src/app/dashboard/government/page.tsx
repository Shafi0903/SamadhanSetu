"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Tabs,
  Modal,
  Textarea,
  Select,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import {
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  FunnelIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface TriageProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "UNDER_INVESTIGATION" | "SOLUTION_PROPOSED" | "RESOLVED" | "REJECTED";
  city?: string;
  address?: string;
  mediaUrls?: string[];
  createdAt: string;
  reporter?: {
    id: string;
    fullName: string;
    phone?: string;
    email?: string;
  };
  _count: {
    upvotes: number;
    solutions: number;
  };
}

interface PendingInstitution {
  id: string;
  fullName: string;
  email: string;
  role: "GOVERNMENT" | "UNIVERSITY" | "INDUSTRY";
  organizationName?: string;
  designation?: string;
  createdAt: string;
}

const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "WATER", label: "Water Supply" },
  { value: "ROADS_INFRASTRUCTURE", label: "Roads & Infrastructure" },
  { value: "WASTE_MANAGEMENT", label: "Waste Management" },
  { value: "ELECTRICITY_ENERGY", label: "Electricity & Energy" },
  { value: "HEALTH_SANITATION", label: "Health & Sanitation" },
  { value: "ENVIRONMENT", label: "Environment" },
];

export default function GovernmentDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("triage");

  // Triage state
  const [triageProblems, setTriageProblems] = React.useState<TriageProblem[]>([]);
  const [loadingTriage, setLoadingTriage] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>("PENDING_VERIFICATION");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("");

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [selectedProblemId, setSelectedProblemId] = React.useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [rejecting, setRejecting] = React.useState(false);

  // Institution state
  const [pendingInstitutions, setPendingInstitutions] = React.useState<PendingInstitution[]>([]);
  const [loadingInst, setLoadingInst] = React.useState(false);
  const [actionMsg, setActionMsg] = React.useState<string | null>(null);

  const fetchTriage = React.useCallback(async () => {
    setLoadingTriage(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.set("status", statusFilter);
      if (categoryFilter) query.set("category", categoryFilter);

      const res = await apiRequest<TriageProblem[]>(`/api/problems/triage?${query.toString()}`);
      if (res.data) {
        setTriageProblems(res.data);
      }
    } catch {
      // User might be unauthorized in preview
    } finally {
      setLoadingTriage(false);
    }
  }, [statusFilter, categoryFilter]);

  const fetchPendingInstitutions = React.useCallback(async () => {
    setLoadingInst(true);
    try {
      const res = await apiRequest<PendingInstitution[]>("/api/auth/pending-institutions");
      if (res.data) {
        setPendingInstitutions(res.data);
      }
    } catch {
      // error handled gracefully
    } finally {
      setLoadingInst(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === "triage") {
      fetchTriage();
    } else if (activeTab === "institutions") {
      fetchPendingInstitutions();
    }
  }, [activeTab, fetchTriage, fetchPendingInstitutions]);

  const handleVerifyProblem = async (id: string) => {
    try {
      await apiRequest(`/api/problems/${id}/verify`, { method: "PATCH" });
      setActionMsg("Problem verified and published to Challenge Board!");
      fetchTriage();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Verification failed");
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedProblemId(id);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedProblemId || !rejectionReason.trim()) return;
    setRejecting(true);
    try {
      await apiRequest(`/api/problems/${selectedProblemId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ rejectionReason }),
      });
      setRejectModalOpen(false);
      setActionMsg("Problem report rejected with official note.");
      fetchTriage();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setRejecting(false);
    }
  };

  const handleApproveInstitution = async (id: string) => {
    try {
      await apiRequest(`/api/auth/approve-institution/${id}`, { method: "PATCH" });
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
            { id: "triage", label: "Civic Issue Triage", badge: triageProblems.length },
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
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <FunnelIcon className="w-3.5 h-3.5" /> Filter Status:
                </span>
                {["PENDING_VERIFICATION", "VERIFIED", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                      statusFilter === st
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-64">
                <Select
                  options={CATEGORY_FILTER_OPTIONS}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
              </div>
            </div>

            {loadingTriage ? (
              <Card className="p-12 text-center text-sm text-gray-500">
                Loading triage queue...
              </Card>
            ) : triageProblems.length === 0 ? (
              <Card className="p-12 text-center">
                <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Triage queue is clear</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  No issues matching the selected filters.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {triageProblems.map((problem) => (
                  <Card key={problem.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                      {problem.mediaUrls && problem.mediaUrls.length > 0 && (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={problem.mediaUrls[0]}
                            alt={problem.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              problem.status === "PENDING_VERIFICATION"
                                ? "pending"
                                : problem.status === "VERIFIED"
                                ? "resolved"
                                : "urgent"
                            }
                          >
                            {problem.status.replace("_", " ")}
                          </Badge>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                            {problem.category}
                          </span>
                          {problem.city && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPinIcon className="w-3.5 h-3.5" />
                              {problem.address || problem.city}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-semibold text-gray-900">{problem.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{problem.description}</p>

                        <div className="text-xs text-gray-400 pt-1">
                          Reported by: <span className="font-medium text-gray-700">{problem.reporter?.fullName || "Citizen"}</span> (
                          {problem.reporter?.phone || "Mobile verified"})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Link href={`/challenge/${problem.id}`}>
                        <Button size="sm" variant="secondary" className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          Inspect
                        </Button>
                      </Link>

                      {problem.status === "PENDING_VERIFICATION" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleVerifyProblem(problem.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 text-white shadow-xs"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Verify & Publish
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openRejectModal(problem.id)}
                            className="flex items-center gap-1"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
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

                    <Button
                      size="sm"
                      onClick={() => handleApproveInstitution(inst.id)}
                      className="flex items-center gap-1 bg-indigo-600 text-white shadow-xs"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Approve Account
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Civic Grievance"
        description="Provide an official justification for why this report is rejected or cannot be forwarded."
      >
        <div className="space-y-4 pt-2">
          <Textarea
            label="Rejection Reason"
            required
            rows={4}
            placeholder="e.g. Duplicate issue already under municipal repair, or insufficient location details..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={rejectionReason.trim().length < 5}
              isLoading={rejecting}
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
