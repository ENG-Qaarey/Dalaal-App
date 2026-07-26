"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminModalProps {
  /** Whether the modal is open / visible */
  open: boolean;
  /** Called when the modal should close (backdrop click, X button, Escape) */
  onClose: () => void;
  /** Modal title text */
  title: string;
  /** Optional Lucide icon rendered in the coloured circle next to the title */
  icon?: ReactNode;
  /** Extra CSS class applied to the modal panel */
  className?: string;
  /** Form / content rendered inside the modal body */
  children: ReactNode;
  /** Optional footer area (e.g. action buttons). When omitted, no border separator is shown. */
  footer?: ReactNode;
  /** Max width of the modal panel. Default: "lg" */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const maxWidthMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

export default function AdminModal({
  open,
  onClose,
  title,
  icon,
  className,
  children,
  footer,
  maxWidth = "lg",
}: AdminModalProps) {
  // ── Escape key ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className={cn(
          "relative bg-card border border-border rounded-2xl p-8 w-full shadow-2xl transform transition-all duration-300 scale-100",
          maxWidthMap[maxWidth],
          className
        )}
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={`Close ${title}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        <div className="space-y-5">{children}</div>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        {footer && (
          <div
            className={cn(
              "flex items-center justify-end gap-3 pt-6 mt-6",
              "border-t border-border"
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
