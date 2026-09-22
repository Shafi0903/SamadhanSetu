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
  Input,
  Textarea,
  Select,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import {
  AcademicCapIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BriefcaseIcon,
  MapPinIcon,
  CheckCircleIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface ClaimedProblem {
  id: string;
  title: string;
  category: string;
  status: string;
  city?: string;
  address?: string;
  claimedAt?: string;
  solutions: Array<{
    id: string;
    title: string;
    stage: string;
    pledges: Array<{ id: string; amount?: number }>;
  }>;
}

interface UniversitySolution {
  id: string;
  title: string;
  description: string;
  stage: string;
  repoUrl?: string;
  createdAt: string;
  problem: {
    id: string;
    title: string;
    status: string;
    city?: string;
  };
  pledges: Array<{
    id: string;
    pledgeType: string;
    amount?: number;
    description: string;
    sponsor?: {
      fullName: string;
      organizationName?: string;
    };
  }>;
}

export default function UniversityDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("claimed");
  const [claimedProblems, setClaimedProblems] = React.useState<ClaimedProblem[]>([]);
  const [solutions, setSolutions] = React.useState<UniversitySolution[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionMsg, setActionMsg] = React.useState<string | null>(null);

  // Proposal modal state
  const [proposalModalOpen, setProposalModalOpen] = React.useState(false);
  const [selectedProblemId, setSelectedProblemId] = React.useState<string>("");
  const [propTitle, setPropTitle] = React.useState("");
  const [propDesc, setPropDesc] = React.useState("");
  const [propStage, setPropStage] = React.useState("PROTOTYPE");
  const [propRepo, setPropRepo] = React.useState("");
  const [submittingProp, setSubmittingProp] = React.useState(false);

  const fetchWorkspace = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{
        claimedProblems: ClaimedProblem[];
        solutions: UniversitySolution[];
      }>("/api/solutions/university/my");

      if (res.data) {
        setClaimedProblems(res.data.claimedProblems || []);
        setSolutions(res.data.solutions || []);
      }
    } catch {
      // preview fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const openProposalModal = (probId: string) => {
    setSelectedProblemId(probId);
    setPropTitle("");
    setPropDesc("");
    setPropStage("PROTOTYPE");
    setPropRepo("");
    setProposalModalOpen(true);
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemId) return;
    setSubmittingProp(true);

    try {
      await apiRequest("/api/solutions", {
        method: "POST",
        body: JSON.stringify({
          problemId: selectedProblemId,
          title: propTitle,
          description: propDesc,
          stage: propStage,
          repoUrl: propRepo || undefined,
        }),
      });

      setProposalModalOpen(false);
      setActionMsg("Solution proposal submitted successfully! Visible to industry partners.");
      fetchWorkspace();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to submit proposal");
    } finally {
      setSubmittingProp(false);
    }
  };

  const totalPledgesCount = solutions.reduce((acc, s) => acc + (s.pledges?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="University Innovation Hub" roleLabel="The Solvers" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner with Action */}
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

        {actionMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium">
            {actionMsg}
          </div>
        )}

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Claimed Challenges</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{claimedProblems.length}</h3>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Active Prototypes</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{solutions.length}</h3>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Industry CSR Pledges</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{totalPledgesCount}</h3>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { id: "claimed", label: "Claimed Challenges", badge: claimedProblems.length },
            { id: "solutions", label: "Our Solution Prototypes", badge: solutions.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab 1: Claimed Challenges */}
        {activeTab === "claimed" && (
          <div className="space-y-4">
            {loading ? (
              <Card className="p-12 text-center text-sm text-gray-500">
                Loading claimed challenges...
              </Card>
            ) : claimedProblems.length === 0 ? (
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
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {claimedProblems.map((prob) => (
                  <Card key={prob.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="submitted">{prob.status.replace("_", " ")}</Badge>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {prob.category.replace("_", " ")}
                        </span>
                        {prob.city && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            {prob.address || prob.city}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-gray-900">{prob.title}</h3>

                      <div className="text-xs text-gray-500 flex items-center gap-3">
                        <span>Proposals uploaded: {prob.solutions?.length || 0}</span>
                        {prob.claimedAt && <span>Claimed on: {new Date(prob.claimedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/challenge/${prob.id}`}>
                        <Button size="sm" variant="secondary">
                          View Problem
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => openProposalModal(prob.id)}
                        className="flex items-center gap-1.5 bg-indigo-600 text-white"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Submit Proposal
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Solution Prototypes */}
        {activeTab === "solutions" && (
          <div className="space-y-4">
            {solutions.length === 0 ? (
              <Card className="p-12 text-center">
                <RocketLaunchIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">No proposals uploaded yet</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Submit a solution proposal for one of your claimed challenges to start receiving industry CSR pledges.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solutions.map((sol) => (
                  <Card key={sol.id} className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="resolved">Stage: {sol.stage}</Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(sol.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mt-2">{sol.title}</h4>
                      <p className="text-xs text-indigo-600 font-medium">For: {sol.problem.title}</p>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">{sol.description}</p>

                    {sol.repoUrl && (
                      <div className="text-xs flex items-center gap-1.5 text-indigo-600">
                        <CodeBracketIcon className="w-4 h-4" />
                        <a href={sol.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          Repository
                        </a>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800 flex items-center gap-1">
                        <BriefcaseIcon className="w-4 h-4" />
                        {sol.pledges?.length || 0} Industry Pledges
                      </span>
                      <Link href={`/challenge/${sol.problem.id}`}>
                        <Button size="sm" variant="ghost">
                          View Challenge →
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Submit Proposal Modal */}
      <Modal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        title="Submit Innovation Solution Proposal"
        description="Share your engineering architecture, prototype timeline, and design repository with industry CSR partners."
      >
        <form onSubmit={handleProposalSubmit} className="space-y-4 pt-2">
          <Input
            label="Proposal / Prototype Title"
            required
            placeholder="e.g. IoT Smart Sump Drainage & Water Quality Sensor"
            value={propTitle}
            onChange={(e) => setPropTitle(e.target.value)}
          />

          <Select
            label="Development Stage"
            options={[
              { value: "PROPOSED", label: "Proposed (Concept & Design)" },
              { value: "PROTOTYPE", label: "Prototype (Lab Tested)" },
              { value: "TESTING", label: "Testing (Field Pilot Ready)" },
              { value: "DEPLOYED", label: "Deployed (Implemented on-ground)" },
            ]}
            value={propStage}
            onChange={(e) => setPropStage(e.target.value)}
          />

          <Textarea
            label="Solution Description & Impact Strategy"
            required
            rows={4}
            placeholder="Explain the technical solution, components required, estimated budget, and how it directly solves the civic problem..."
            value={propDesc}
            onChange={(e) => setPropDesc(e.target.value)}
          />

          <Input
            label="GitHub / CAD / Project Link (Optional)"
            type="url"
            placeholder="https://github.com/my-team/civic-iot"
            value={propRepo}
            onChange={(e) => setPropRepo(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setProposalModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submittingProp} className="bg-indigo-600 text-white">
              Submit Proposal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
