"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { apiRequest } from "@/lib/api";
import { DevicePhoneMobileIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [authMode, setAuthMode] = React.useState<"citizen" | "institution">("citizen");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Citizen state
  const [phone, setPhone] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  // Institutional state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; message: string; demoOtp?: string }>(
        "/api/auth/otp/send",
        {
          method: "POST",
          body: JSON.stringify({ phone, fullName }),
        }
      );
      setOtpSent(true);
      const demoCode = (res as any).demoOtp || res.data?.demoOtp || "123456";
      setSuccessMsg(`OTP sent! Use demo code: ${demoCode}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{
        user: {
          id: string;
          phone: string;
          fullName: string;
          role: "CITIZEN";
          isVerified: boolean;
        };
        token: string;
      }>("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code: otp, fullName }),
      });

      if (res.data) {
        setAuth(res.data.user, res.data.token);
        router.push("/dashboard/citizen");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleInstitutionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<{
        user: {
          id: string;
          email: string;
          fullName: string;
          role: "GOVERNMENT" | "UNIVERSITY" | "INDUSTRY";
          organizationName?: string;
          designation?: string;
          isVerified: boolean;
        };
        token: string;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.data) {
        setAuth(res.data.user, res.data.token);
        const role = res.data.user.role.toLowerCase();
        router.push(`/dashboard/${role}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            register for a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card>
          <CardHeader className="pb-0">
            {/* Persona Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("citizen");
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
                  authMode === "citizen"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <DevicePhoneMobileIcon className="w-4 h-4" />
                Citizen (OTP)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("institution");
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
                  authMode === "institution"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BuildingOffice2Icon className="w-4 h-4" />
                Institutional
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                {successMsg}
              </div>
            )}

            {/* Citizen OTP Form */}
            {authMode === "citizen" && (
              <>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <Input
                      label="Full Name (Optional)"
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                      label="Mobile Number"
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Button type="submit" className="w-full" isLoading={loading}>
                      Get OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-xs text-gray-600">
                      Enter the 6-digit OTP sent to <strong className="text-gray-900">{phone}</strong>
                    </div>
                    <Input
                      label="Verification Code (OTP)"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button type="submit" className="w-full" isLoading={loading}>
                      Verify & Sign In
                    </Button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-xs text-center text-gray-500 hover:text-indigo-600 pt-2"
                    >
                      Change Mobile Number
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Institutional Form */}
            {authMode === "institution" && (
              <form onSubmit={handleInstitutionalLogin} className="space-y-4">
                <Input
                  label="Official Email Address"
                  type="email"
                  required
                  placeholder="officer@nic.in / faculty@iit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Government, University, or Industry</span>
                  <Link href="/register" className="text-indigo-600 hover:underline">
                    New Institution?
                  </Link>
                </div>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Institutional Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
