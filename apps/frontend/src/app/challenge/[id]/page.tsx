"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Modal,
  Input,
  Textarea,
  Select,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowLeftIcon,
  MapPinIcon,
  HandThumbUpIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface ProblemDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "PENDING_VERIFICATION" | "VERIFIED" | "UNDER_INVESTIGATION" | "SOLUTION_PROPOSED" | "RESOLVED" | "REJECTED";
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mediaUrls: string[];
  createdAt: string;
  reporter?: {
    id: string;
    fullName: string;
    phone?: string;
    organizationName?: string;
  };
  verifiedBy?: {
    id: string;
    fullName: string;
    organizationName?: string;
    designation?: string;
  };
  claimedBy?: {
    id: string;
    fullName: string;
    organizationName?: string;
  };
  timelineEvents: Array<{
    id: string;
    eventType: string;
    title: string;
    description: string;
    createdAt: string;
    actor?: {
      id: string;
      fullName: string;
      role: string;
    };
  }>;
  solutions: Array<{
    id: string;
    title: string;
    description: string;
    stage: string;
    repoUrl?: string;
    documentUrls: string[];
    teamLead: {
      id?: string;
      fullName: string;
      organizationName?: string;
    };
    pledges: Array<{
      id: string;
      pledgeType: string;
      description: string;
      amount?: number;
      status: string;
      sponsor?: {
        fullName: string;
        organizationName?: string;
      };
    }>;
  }>;
  _count: {
    upvotes: number;
    comments: number;
  };
}

export default function ProblemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { user } = useAuthStore();
  const [problem, setProblem] = React.useState<ProblemDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [upvotes, setUpvotes] = React.useState(0);
  const [upvoted, setUpvoted] = React.useState(false);
  const [actionMsg, setActionMsg] = React.useState<string | null>(null);

  // Claim state
  const [claiming, setClaiming] = React.useState(false);

  // Pledge modal state
  const [pledgeModalOpen, setPledgeModalOpen] = React.useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = React.useState<string | null>(null);
  const [pledgeType, setPledgeType] = React.useState("CSR_FUNDING");
  const [pledgeAmount, setPledgeAmount] = React.useState("50000");
  const [pledgeDesc, setPledgeDesc] = React.useState("");
  const [pledging, setPledging] = React.useState(false);

  // Resolve modal state
  const [resolveModalOpen, setResolveModalOpen] = React.useState(false);
  const [resolveNotes, setResolveNotes] = React.useState("");
  const [resolving, setResolving] = React.useState(false);

  const loadProblem = React.useCallback(async () => {
    if (!id) return;
    try {
      const res = await apiRequest<ProblemDetails>(`/api/problems/${id}`);
      if (res.data) {
        setProblem(res.data);
        setUpvotes(res.data._count?.upvotes || 0);
      }
    } catch (err) {
      console.error("Failed to load problem:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadProblem();
  }, [loadProblem]);

  const handleUpvote = async () => {
    if (!id) return;
    try {
      const res = await apiRequest<{ upvoted: boolean }>(`/api/problems/${id}/upvote`, {
        method: "POST",
      });
      if (res.data) {
        setUpvoted(res.data.upvoted);
        setUpvotes((prev) => (res.data?.upvoted ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch {
      alert("Please sign in as a citizen to upvote this civic issue.");
    }
  };

  const handleClaim = async () => {
    if (!id) return;
    setClaiming(true);
    try {
      await apiRequest(`/api/solutions/claim/${id}`, { method: "PATCH" });
      setActionMsg("Challenge claimed successfully for your university team!");
      loadProblem();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to claim challenge");
    } finally {
      setClaiming(false);
    }
  };

  const openPledgeModal = (solutionId: string) => {
    setSelectedSolutionId(solutionId);
    setPledgeModalOpen(true);
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutionId) return;
    setPledging(true);
    try {
      await apiRequest("/api/solutions/pledge", {
        method: "POST",
        body: JSON.stringify({
          solutionId: selectedSolutionId,
          pledgeType,
          amount: pledgeType === "CSR_FUNDING" ? Number(pledgeAmount) : undefined,
          description: pledgeDesc,
        }),
      });
      setPledgeModalOpen(false);
      setActionMsg("Support pledge confirmed! Thank you for backing student innovators.");
      loadProblem();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Pledge failed");
    } finally {
      setPledging(false);
    }
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setResolving(true);
    try {
      await apiRequest(`/api/solutions/resolve/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes: resolveNotes }),
      });
      setResolveModalOpen(false);
      setActionMsg("Challenge officially marked as RESOLVED and deployed!");
      loadProblem();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Resolution failed");
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-sm text-gray-500">
        Loading challenge details and timeline...
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Challenge Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">The requested challenge record could not be loaded.</p>
        <Link href="/challenge">
          <Button variant="secondary">Back to Challenge Board</Button>
        </Link>
      </div>
    );
  }

  // 5-Stage Setu Timeline status progression calculation
  const isReported = true;
  const isVerified = problem.status !== "PENDING_VERIFICATION" && problem.status !== "REJECTED";
  const isClaimed = !!problem.claimedBy || problem.status === "UNDER_INVESTIGATION" || problem.status === "SOLUTION_PROPOSED" || problem.status === "RESOLVED";
  const isSupported = problem.solutions?.some((s) => s.pledges?.length > 0) || problem.status === "RESOLVED";
  const isResolved = problem.status === "RESOLVED";

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/challenge" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Challenge Board
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant={upvoted ? "primary" : "secondary"}
              size="sm"
              onClick={handleUpvote}
              className="flex items-center gap-1.5"
            >
              <HandThumbUpIcon className="w-4 h-4" />
              <span>{upvotes} Upvotes</span>
            </Button>

            {/* University Claim Button */}
            {user?.role === "UNIVERSITY" && problem.status === "VERIFIED" && !problem.claimedBy && (
              <Button
                size="sm"
                onClick={handleClaim}
                isLoading={claiming}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
              >
                <AcademicCapIcon className="w-4 h-4" />
                Claim for University
              </Button>
            )}

            {/* Resolve Button */}
            {(user?.role === "GOVERNMENT" || user?.id === problem.claimedBy?.id) &&
              problem.status !== "RESOLVED" &&
              isClaimed && (
                <Button
                  size="sm"
                  onClick={() => setResolveModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Mark Resolved
                </Button>
              )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {actionMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium shadow-xs">
            {actionMsg}
          </div>
        )}

        {/* Title & Metadata Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                problem.status === "PENDING_VERIFICATION"
                  ? "pending"
                  : problem.status === "RESOLVED"
                  ? "resolved"
                  : "submitted"
              }
            >
              {problem.status.replace("_", " ")}
            </Badge>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
              {problem.category.replace("_", " ")}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
              <ClockIcon className="w-3.5 h-3.5" />
              {new Date(problem.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {problem.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 pt-1">
            <span className="flex items-center gap-1 font-medium text-gray-800">
              <MapPinIcon className="w-4 h-4 text-indigo-600 shrink-0" />
              {problem.address || problem.city}, {problem.state} ({problem.pincode})
            </span>
            <span className="text-gray-300">•</span>
            <span>GPS: {problem.latitude.toFixed(4)}, {problem.longitude.toFixed(4)}</span>
          </div>
        </div>

        {/* The 5-Stage "Setu" Transparent Lifecycle Tracker */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900">The "Setu" Problem Lifecycle</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            A transparent, audit-verified path connecting citizen grievances with university solvers and CSR sponsors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4">
            {/* Step 1: Reported */}
            <div className={`p-4 rounded-xl border transition ${isReported ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mb-2 ${isReported ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                1
              </span>
              <h4 className="text-sm font-semibold text-gray-900">1. Reported</h4>
              <p className="text-xs text-gray-600 mt-1">
                Citizen submitted geotagged grievance.
              </p>
            </div>

            {/* Step 2: Verified */}
            <div className={`p-4 rounded-xl border transition ${isVerified ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mb-2 ${isVerified ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                2
              </span>
              <h4 className="text-sm font-semibold text-gray-900">2. Verified</h4>
              <p className="text-xs text-gray-600 mt-1">
                {isVerified ? `Validated by nodal authority.` : "Awaiting triage."}
              </p>
            </div>

            {/* Step 3: Claimed */}
            <div className={`p-4 rounded-xl border transition ${isClaimed ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-200"}`}>
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mb-2 ${isClaimed ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                3
              </span>
              <h4 className="text-sm font-semibold text-gray-900">3. Claimed</h4>
              <p className="text-xs text-gray-600 mt-1">
                {isClaimed ? `Adopted by academic team.` : "Open on Challenge Board."}
              </p>
            </div>

            {/* Step 4: Supported */}
            <div className={`p-4 rounded-xl border transition ${isSupported ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mb-2 ${isSupported ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                4
              </span>
              <h4 className="text-sm font-semibold text-gray-900">4. Supported</h4>
              <p className="text-xs text-gray-600 mt-1">
                {isSupported ? "Industry mentorship or CSR pledged." : "Awaiting industry partner."}
              </p>
            </div>

            {/* Step 5: Resolved */}
            <div className={`p-4 rounded-xl border transition ${isResolved ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 border-gray-200"}`}>
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mb-2 ${isResolved ? "bg-white text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                ✓
              </span>
              <h4 className={`text-sm font-semibold ${isResolved ? "text-white" : "text-gray-900"}`}>5. Resolved</h4>
              <p className={`text-xs mt-1 ${isResolved ? "text-emerald-100" : "text-gray-600"}`}>
                {isResolved ? "Prototype deployed in community." : "In development."}
              </p>
            </div>
          </div>
        </div>

        {/* Content & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Issue Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {problem.description}
              </p>
            </Card>

            {/* University Solutions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
                  Proposed Solutions & Prototypes ({problem.solutions?.length || 0})
                </h3>
                {user?.role === "UNIVERSITY" && isClaimed && (
                  <Link href="/dashboard/university">
                    <Button size="sm" variant="secondary">
                      Manage in Hub
                    </Button>
                  </Link>
                )}
              </div>

              {problem.solutions?.length === 0 ? (
                <Card className="p-6 text-center text-sm text-gray-500">
                  No prototype proposals uploaded for this challenge yet.
                </Card>
              ) : (
                problem.solutions.map((sol) => (
                  <Card key={sol.id} className="p-6 space-y-4 border border-indigo-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          Stage: {sol.stage}
                        </span>
                        <h4 className="text-base font-bold text-gray-900 mt-1">{sol.title}</h4>
                        <p className="text-xs text-gray-500">
                          Led by {sol.teamLead.fullName} ({sol.teamLead.organizationName || "Research Team"})
                        </p>
                      </div>

                      {user?.role === "INDUSTRY" && (
                        <Button
                          size="sm"
                          onClick={() => openPledgeModal(sol.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
                        >
                          <SparklesIcon className="w-4 h-4" />
                          Pledge CSR / Mentorship
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">{sol.description}</p>

                    {sol.repoUrl && (
                      <div className="text-xs flex items-center gap-1.5 text-indigo-600">
                        <CodeBracketIcon className="w-4 h-4" />
                        <a href={sol.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          View Code Repository
                        </a>
                      </div>
                    )}

                    {/* Pledges Attached to Solution */}
                    {sol.pledges?.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 space-y-2">
                        <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1">
                          <BriefcaseIcon className="w-3.5 h-3.5 text-emerald-600" />
                          Industry Backing ({sol.pledges.length})
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sol.pledges.map((p) => (
                            <div key={p.id} className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs">
                              <span className="font-semibold text-emerald-900">
                                {p.pledgeType.replace("_", " ")}
                                {p.amount ? ` (₹${p.amount.toLocaleString()})` : ""}
                              </span>
                              <p className="text-emerald-700 mt-0.5 line-clamp-1">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>

            {/* Media Evidence Gallery */}
            {problem.mediaUrls?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Photographic Evidence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {problem.mediaUrls.map((url, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-48">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="Civic evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Timeline Events Log */}
            <Card className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Audit Trail & Action Log</h3>
              <div className="relative pl-6 space-y-6 border-l-2 border-indigo-200">
                {problem.timelineEvents?.map((event) => (
                  <div key={event.id} className="relative">
                    <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Government Verifier Card */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckBadgeIcon className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-sm text-gray-900">Nodal Verification</h4>
              </div>
              {problem.verifiedBy ? (
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Officer: <strong className="text-gray-900">{problem.verifiedBy.fullName}</strong></p>
                  <p>Designation: {problem.verifiedBy.designation || "Municipal Authority"}</p>
                  <p>Body: {problem.verifiedBy.organizationName || "Municipal Corporation"}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Pending review by local municipal nodal officer.
                </p>
              )}
            </Card>

            {/* University Solver Card */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-sm text-gray-900">University Solver</h4>
              </div>
              {problem.claimedBy ? (
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Lead Faculty: <strong className="text-gray-900">{problem.claimedBy.fullName}</strong></p>
                  <p>Institution: {problem.claimedBy.organizationName || "Partner University"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    This verified problem is available for faculty and student engineering/research teams to claim.
                  </p>
                  {user?.role === "UNIVERSITY" ? (
                    <Button size="sm" className="w-full" onClick={handleClaim} isLoading={claiming}>
                      Claim Problem Now
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button size="sm" variant="secondary" className="w-full">
                        Sign In as University
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Industry Support Pledge Modal */}
      <Modal
        isOpen={pledgeModalOpen}
        onClose={() => setPledgeModalOpen(false)}
        title="Pledge Industry & CSR Support"
        description="Offer corporate sponsorship, testing equipment, or domain mentorship to this student prototype team."
      >
        <form onSubmit={handlePledgeSubmit} className="space-y-4 pt-2">
          <Select
            label="Support Contribution Type"
            options={[
              { value: "CSR_FUNDING", label: "CSR Micro-Grant / Seed Funding" },
              { value: "MENTORSHIP", label: "Technical Mentorship & Advisory" },
              { value: "EQUIPMENT", label: "Laboratory / Testing Hardware & Equipment" },
              { value: "INCUBATION", label: "Incubation & Acceleration Pipeline" },
            ]}
            value={pledgeType}
            onChange={(e) => setPledgeType(e.target.value)}
          />

          {pledgeType === "CSR_FUNDING" && (
            <Input
              label="Funding Commitment (in INR ₹)"
              type="number"
              required
              min={1000}
              step={1000}
              value={pledgeAmount}
              onChange={(e) => setPledgeAmount(e.target.value)}
            />
          )}

          <Textarea
            label="Pledge Details & Mentorship Scope"
            required
            rows={3}
            placeholder="Describe the resources, hardware, or expert time your corporate team can provide..."
            value={pledgeDesc}
            onChange={(e) => setPledgeDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setPledgeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={pledging} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Confirm Support Pledge
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mark Resolved Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Mark Challenge as Resolved"
        description="Verify that the student solution has been tested, deployed on-ground, and the civic issue is resolved."
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4 pt-2">
          <Textarea
            label="Field Deployment Notes"
            rows={3}
            placeholder="Describe the deployment results, community feedback, or maintenance handover..."
            value={resolveNotes}
            onChange={(e) => setResolveNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setResolveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={resolving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Confirm Resolution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
