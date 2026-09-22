import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "submitted" | "pending" | "urgent" | "resolved" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    submitted: "bg-blue-100 text-blue-800",
    pending: "bg-amber-100 text-amber-800",
    urgent: "bg-red-100 text-red-800",
    resolved: "bg-emerald-100 text-emerald-800",
    outline: "border border-gray-300 text-gray-700 bg-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
