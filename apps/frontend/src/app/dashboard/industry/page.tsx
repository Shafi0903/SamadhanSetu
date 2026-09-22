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
  BriefcaseIcon,
  SparklesIcon,
  CurrencyRupeeIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

interface CatalogSolution {
  id: string;
  title: string;
  description: string;
  stage: string;
  repoUrl?: string;
  createdAt: string;
  teamLead: {
    id: string;
    fullName: string;
    organizationName?: string;
  };
  problem: {
    id: string;
    title: string;
    category: string;
    city?: string;
    status: string;
  };
  pledges: Array<{
    id: string;
    pledgeType: string;
    amount?: number;
  }>;
}

interface MyPledge {
  id: string;
  pledgeType: string;
  description: string;
  amount?: number;
  status: string;
  createdAt: string;
  solution: {
    id: string;
    title: string;
    teamLead: {
      fullName: string;
      organizationName?: string;
    };
    problem: {
      id: string;
      title: string;
    };
  };
}

export default function IndustryDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("discover");
  const [solutions, setSolutions] = React.useState<CatalogSolution[]>([]);
  const [myPledges, setMyPledges] = React.useState<MyPledge[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionMsg, setActionMsg] = React.useState<string | null>(null);

  // Pledge modal state
  const [pledgeModalOpen, setPledgeModalOpen] = React.useState(false);
  const [selectedSolution, setSelectedSolution] = React.useState<CatalogSolution | null>(null);
  const [pledgeType, setPledgeType] = React.useState("CSR_FUNDING");
  const [pledgeAmount, setPledgeAmount] = React.useState("50000");
  const [pledgeDesc, setPledgeDesc] = React.useState("");
  const [pledging, setPledging] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [catalogRes, pledgesRes] = await Promise.all([
        apiRequest<CatalogSolution[]>("/api/solutions/industry/catalog"),
        apiRequest<MyPledge[]>("/api/solutions/industry/my-pledges"),
      ]);

      if (catalogRes.data) setSolutions(catalogRes.data);
      if (pledgesRes.data) setMyPledges(pledgesRes.data);
    } catch {
      // preview fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openPledgeModal = (sol: CatalogSolution) => {
    setSelectedSolution(sol);
    setPledgeType("CSR_FUNDING");
    setPledgeAmount("50000");
    setPledgeDesc("");
    setPledgeModalOpen(true);
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolution) return;
    setPledging(true);

    try {
      await apiRequest("/api/solutions/pledge", {
        method: "POST",
        body: JSON.stringify({
          solutionId: selectedSolution.id,
          pledgeType,
          amount: pledgeType === "CSR_FUNDING" ? Number(pledgeAmount) : undefined,
          description: pledgeDesc,
        }),
      });

      setPledgeModalOpen(false);
      setActionMsg(`Support pledge recorded for "${selectedSolution.title}". Thank you for empowering civic innovators!`);
      fetchData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Pledge submission failed");
    } finally {
      setPledging(false);
    }
  };

  const totalCommitted = myPledges.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <DashboardHeader title="Industry & CSR Portal" roleLabel="The Enablers" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Industry Sponsorship & CSR Portal</h1>
            <p className="text-sm text-gray-600 mt-1">
              Empower university student innovations with CSR micro-grants, technical mentorship, and laboratory hardware.
            </p>
          </div>
          <Link href="/challenge">
            <Button variant="secondary" className="flex items-center gap-2">
              Explore All Challenges
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
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Active Pledges</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{myPledges.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              💼
            </div>
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">CSR Funds Committed</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalCommitted.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Student Teams Backed</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{myPledges.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              🎓
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          tabs={[
            { id: "discover", label: "Discover Student Proposals", badge: solutions.length },
            { id: "my-pledges", label: "Our Company Pledges", badge: myPledges.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab 1: Discover Proposals */}
        {activeTab === "discover" && (
          <div className="space-y-4">
            {loading ? (
              <Card className="p-12 text-center text-sm text-gray-500">
                Loading student solution proposals...
              </Card>
            ) : solutions.length === 0 ? (
              <Card className="p-12 text-center">
                <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">No student proposals currently seeking sponsorship</h3>
                <p className="text-sm text-gray-500 mt-1">
                  As university teams upload prototypes for verified civic issues, they will appear here for CSR pledging.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutions.map((sol) => (
                  <Card key={sol.id} className="p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="resolved">Stage: {sol.stage}</Badge>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {sol.problem.category.replace("_", " ")}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900">{sol.title}</h3>
                      <p className="text-xs text-gray-500">
                        By {sol.teamLead.fullName} • <strong>{sol.teamLead.organizationName || "University Team"}</strong>
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-3">{sol.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <Link href={`/challenge/${sol.problem.id}`}>
                        <Button size="sm" variant="ghost">
                          View Challenge →
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => openPledgeModal(sol)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        Pledge Support
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Pledges */}
        {activeTab === "my-pledges" && (
          <div className="space-y-4">
            {myPledges.length === 0 ? (
              <Card className="p-12 text-center">
                <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">No active CSR pledges yet</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Browse student proposals to sponsor laboratory hardware, mentorship, or CSR seed capital.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myPledges.map((pledge) => (
                  <Card key={pledge.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="resolved">{pledge.pledgeType.replace("_", " ")}</Badge>
                        {pledge.amount && (
                          <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            ₹{pledge.amount.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(pledge.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-gray-900 mt-1">
                        Pledged to: {pledge.solution.title}
                      </h4>
                      <p className="text-xs text-indigo-600 font-medium">
                        Team: {pledge.solution.teamLead.fullName} ({pledge.solution.teamLead.organizationName})
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{pledge.description}</p>
                    </div>

                    <Link href={`/challenge/${pledge.solution.problem.id}`}>
                      <Button size="sm" variant="secondary">
                        View Challenge Timeline
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Support Pledge Modal */}
      <Modal
        isOpen={pledgeModalOpen}
        onClose={() => setPledgeModalOpen(false)}
        title={selectedSolution ? `Pledge Support: ${selectedSolution.title}` : "Pledge Industry Support"}
        description="Empower this university team with CSR micro-grants, technical mentorship, or hardware equipment."
      >
        <form onSubmit={handlePledgeSubmit} className="space-y-4 pt-2">
          <Select
            label="Support Contribution Type"
            options={[
              { value: "CSR_FUNDING", label: "CSR Micro-Grant / Seed Capital" },
              { value: "MENTORSHIP", label: "Technical Mentorship & Industry Advisory" },
              { value: "EQUIPMENT", label: "Lab Equipment & Testing Hardware" },
              { value: "INCUBATION", label: "Incubation & Field Acceleration" },
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
            label="Pledge Terms & Mentorship Scope"
            required
            rows={3}
            placeholder="Describe how your corporate team will collaborate with these student researchers..."
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
    </div>
  );
}
