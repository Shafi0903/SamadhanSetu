"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button, Badge } from "@/components/ui";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { apiRequest } from "@/lib/api";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BellIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  title: string;
  roleLabel: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export function DashboardHeader({ title, roleLabel }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout, initialize } = useAuthStore();

  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [notifOpen, setNotifOpen] = React.useState(false);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await apiRequest<NotificationItem[]>("/api/notifications");
      if (res.data) {
        setNotifications(res.data);
      }
    } catch {
      // preview fallback
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await apiRequest("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // preview
    }
  };

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

        <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                  <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <CheckIcon className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg text-xs transition ${
                          n.isRead ? "bg-gray-50 text-gray-600" : "bg-indigo-50/50 text-indigo-950 font-medium"
                        }`}
                      >
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-gray-600 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <UserCircleIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium hidden sm:inline-block max-w-[120px] truncate">
              {user?.fullName || "User"}
            </span>
          </div>

          {/* Logout */}
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
