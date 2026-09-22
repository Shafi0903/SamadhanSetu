"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { apiRequest } from "@/lib/api";
import {
  BuildingOffice2Icon,
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = React.useState<"CITIZEN" | "GOVERNMENT" | "UNIVERSITY" | "INDUSTRY">("GOVERNMENT");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [organizationName, setOrganizationName] = React.useState("");
  const [designation, setDesignation] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await apiRequest<{
        user: { id: string; fullName: string; role: string; isVerified: boolean };
        message: string;
      }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          organizationName,
          designation,
        }),
      });

      setSuccess(
        res.message ||
          "Registration successful! Your account has been registered and is queued for verification."
      );
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F9FAFB]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            सं
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Samadhan<span className="text-indigo-600">Setu</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Role</CardTitle>
            <CardDescription>
              Select how you will participate in the civic problem-solving ecosystem.
            </CardDescription>

            {/* Role Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRole("CITIZEN")}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                  role === "CITIZEN"
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold shadow-xs"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <UserGroupIcon className="w-5 h-5" />
                <span className="text-xs">Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("GOVERNMENT")}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                  role === "GOVERNMENT"
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold shadow-xs"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <BuildingOffice2Icon className="w-5 h-5" />
                <span className="text-xs">Government</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("UNIVERSITY")}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                  role === "UNIVERSITY"
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold shadow-xs"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <AcademicCapIcon className="w-5 h-5" />
                <span className="text-xs">University</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("INDUSTRY")}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                  role === "INDUSTRY"
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold shadow-xs"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <BriefcaseIcon className="w-5 h-5" />
                <span className="text-xs">Industry</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                {success}
              </div>
            )}

            {role === "CITIZEN" ? (
              <div className="text-center py-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Citizens log in seamlessly using their mobile number and a One-Time Password (OTP). No password registration required!
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  Go to Citizen OTP Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="Dr. Anita Sharma / Officer Rajesh Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                  label="Official Email Address"
                  type="email"
                  required
                  placeholder="name@organization.gov.in / name@univ.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  label={
                    role === "GOVERNMENT"
                      ? "Department / Municipal Corporation"
                      : role === "UNIVERSITY"
                      ? "University / College Name"
                      : "Company / CSR Foundation"
                  }
                  required
                  placeholder={
                    role === "GOVERNMENT"
                      ? "e.g. Pune Municipal Corporation (PMC)"
                      : role === "UNIVERSITY"
                      ? "e.g. Indian Institute of Technology Bombay"
                      : "e.g. Tata Consultancy Services CSR"
                  }
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />

                <Input
                  label="Designation / Title"
                  required
                  placeholder={
                    role === "GOVERNMENT"
                      ? "e.g. Zonal Officer, Ward 4"
                      : role === "UNIVERSITY"
                      ? "e.g. Associate Professor / Student Lead"
                      : "e.g. CSR Director / Lead Mentor"
                  }
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />

                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                  <strong>Notice:</strong> Institutional registrations ({role.toLowerCase()}) undergo review and approval by designated authorities before full permissions are granted.
                </div>

                <Button type="submit" className="w-full" isLoading={loading}>
                  Register Institutional Account
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
