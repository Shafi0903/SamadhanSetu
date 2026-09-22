"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl transition-all border border-gray-200 z-10",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          aria-label="Close dialog"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {title && (
          <h3
            id="modal-title"
            className="text-lg font-semibold text-gray-900 pr-8"
          >
            {title}
          </h3>
        )}

        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
