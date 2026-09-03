"use client";

import { usePathname } from "next/navigation";
import { useProject } from "@/lib/context";
import { Bell, MapPin, Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Executive Dashboard",
  "/dpr": "Daily Progress Report",
  "/materials": "Material Ledger",
  "/labor": "Labor Gang Log",
  "/equipment": "Equipment Log",
  "/certification": "Certification & Approval",
  "/measurement-book": "Digital Measurement Book",
  "/ra-bill": "RA Bill",
  "/retention": "Retention & Payment Aging",
};

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { activeProject } = useProject();

  if (pathname === "/login" || pathname === "/") return null;

  const title = pageTitles[pathname] ?? "CivilOS";

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-base/95 backdrop-blur-sm border-b border-border z-30 flex items-center px-4 sm:px-6 justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="p-1.5 -ml-1 rounded-md hover:bg-surface transition-colors lg:hidden"
        >
          <Menu size={18} className="text-muted" />
        </button>
        <h1 className="text-sm font-semibold text-ink">{title}</h1>
        <div className="hidden sm:block h-3.5 w-px bg-border-strong" />
        <div className="hidden sm:flex items-center gap-1 text-muted text-xs truncate">
          <MapPin size={11} />
          <span>{activeProject.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              activeProject.status === "on-track"
                ? "bg-success"
                : activeProject.status === "delayed"
                  ? "bg-rust"
                  : "bg-critical"
            }`}
          />
          <span className="text-xs text-muted capitalize">
            {activeProject.status.replace("-", " ")}
          </span>
        </div>

        <div className="h-3.5 w-px bg-border" />

        <button className="relative p-1.5 rounded-md hover:bg-surface transition-colors">
          <Bell size={15} className="text-muted" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-critical rounded-full border-2 border-base" />
        </button>

        <div
          className="hidden md:block text-xs text-muted"
          suppressHydrationWarning
        >
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </header>
  );
}
