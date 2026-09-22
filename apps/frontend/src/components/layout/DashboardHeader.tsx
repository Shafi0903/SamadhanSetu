"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button, Badge } from "@/components/ui";
import { ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  title: string;
  roleLabel: string;
}

export function DashboardHeader({ title, roleLabel }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              सं
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:inline-block">
              Samadhan<span className="text-indigo-600">Setu</span>
            </span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          <Badge variant="outline" className="hidden md:inline-flex">
            {roleLabel}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <UserCircleIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium hidden sm:inline-block">
              {user?.fullName || "Guest User"}
            </span>
            {user && !user.isVerified && user.role !== "CITIZEN" && (
              <Badge variant="pending">Pending Approval</Badge>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline-block">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
