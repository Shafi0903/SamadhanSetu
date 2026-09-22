"use client";

import * as React from "react";
import { apiRequest } from "@/lib/api";

/**
 * Silently pre-warms the backend API on page load to eliminate cold-start latency.
 */
export function ApiPrewarmer() {
  React.useEffect(() => {
    try {
      apiRequest("/health").catch(() => {});
    } catch {
      // Silently ignore prewarm network errors
    }
  }, []);

  return null;
}
