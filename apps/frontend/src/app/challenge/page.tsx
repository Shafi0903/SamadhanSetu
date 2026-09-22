"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Input, Select, Card, Badge } from "@/components/ui";
import { CivicMap } from "@/components/common/CivicMap";
import { apiRequest } from "@/lib/api";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  HandThumbUpIcon,
  AcademicCapIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "VERIFIED" | "UNDER_INVESTIGATION" | "SOLUTION_PROPOSED" | "RESOLVED";
  latitude: number;
  longitude: number;
  city?: string;
  address?: string;
  mediaUrls: string[];
  claimedBy?: {
    id: string;
    fullName: string;
    organizationName?: string;
  };
  _count: {
    upvotes: number;
    solutions: number;
    comments: number;
  };
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "WATER", label: "Water Supply" },
  { value: "ROADS_INFRASTRUCTURE", label: "Roads & Bridges" },
  { value: "WASTE_MANAGEMENT", label: "Waste & Sanitation" },
  { value: "ELECTRICITY_ENERGY", label: "Energy & Streetlights" },
  { value: "HEALTH_SANITATION", label: "Health & Hygiene" },
  { value: "ENVIRONMENT", label: "Environment & Green" },
];

export default function ChallengeBoardPage() {
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "map">("grid");

  const fetchChallenges = React.useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (category) query.set("category", category);

      const res = await apiRequest<Challenge[]>(`/api/problems?${query.toString()}`);
      if (res.data) {
        setChallenges(res.data);
      }
    } catch {
      // preview fallback
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  React.useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              सं
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Samadhan<span className="text-indigo-600">Setu</span>
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 hidden sm:inline-block">
                Challenge Board
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Involved</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero & Search Banner */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge variant="submitted">Public Innovation Repository</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Verified Civic Challenges
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            These grassroots civic issues have been verified by municipal nodal authorities and are ready for university research teams and industry CSR sponsors.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search challenges by keyword, ward, or city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-52">
              <Select
                options={CATEGORIES}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 p-0.5 bg-gray-50 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-indigo-600 shadow-2xs" : "text-gray-600"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer flex items-center gap-1 ${
                  viewMode === "map" ? "bg-white text-indigo-600 shadow-2xs" : "text-gray-600"
                }`}
              >
                <span>📍 Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid or Map */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500">
            Loading verified challenges...
          </div>
        ) : challenges.length === 0 ? (
          <Card className="p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
              <AcademicCapIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No verified challenges match</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search query or category filter. As nodal authorities verify new citizen submissions, they will be listed here immediately.
            </p>
          </Card>
        ) : viewMode === "map" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Showing <strong>{challenges.length}</strong> verified challenges on city map</span>
              <span>Click on any pin to view details</span>
            </div>
            <CivicMap
              height="550px"
              problems={challenges.map((c) => ({
                id: c.id,
                title: c.title,
                category: c.category,
                status: c.status,
                latitude: c.latitude,
                longitude: c.longitude,
                city: c.city,
                address: c.address,
              }))}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                <Card className="h-full flex flex-col justify-between p-5 hover:border-indigo-300 transition cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="resolved">Verified</Badge>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {challenge.category.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 space-y-2">
                    {challenge.claimedBy ? (
                      <div className="text-xs text-indigo-700 flex items-center gap-1 font-medium bg-indigo-50 p-2 rounded-lg">
                        <AcademicCapIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate">
                          Claimed by {challenge.claimedBy.organizationName || challenge.claimedBy.fullName}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-700 flex items-center gap-1 font-medium bg-amber-50 p-2 rounded-lg">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span>Open for University Claim</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      {challenge.city && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {challenge.city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <HandThumbUpIcon className="w-3.5 h-3.5" />
                        {challenge._count.upvotes} Upvotes
                      </span>
                    </div>
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
