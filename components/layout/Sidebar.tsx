"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProject } from "@/lib/context";
import {
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  Package,
  Users,
  Truck,
  BadgeCheck,
  BookOpen,
  FileText,
  PiggyBank,
  ChevronDown,
  Building2,
  Building,
  Construction,
  HardHat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assignment", label: "Daily Work Assignment", icon: CalendarCheck },
  { href: "/dpr", label: "Daily Progress Report", icon: ClipboardList },
  { href: "/materials", label: "Material Ledger", icon: Package },
  { href: "/labor", label: "Labor Gang Log", icon: Users },
  { href: "/equipment", label: "Equipment Log", icon: Truck },
  { href: "/certification", label: "Certification", icon: BadgeCheck },
  { href: "/measurement-book", label: "Measurement Book", icon: BookOpen },
  { href: "/ra-bill", label: "RA Bill", icon: FileText },
  { href: "/retention", label: "Retention & Aging", icon: PiggyBank },
];

const projectTypeIcon: Record<string, LucideIcon> = {
  residential: Building2,
  bridge: Construction,
  commercial: Building,
};

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { activeProject, setActiveProject, allProjects } = useProject();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (pathname === "/login" || pathname === "/") return null;

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 bg-ink/40 z-40 lg:hidden"
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 bg-ink flex flex-col z-50 select-none transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <HardHat size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight tracking-tight">
                CivilOS
              </div>
              <div className="text-white/40 text-2xs leading-tight">
                Civil Oasis Engineering
              </div>
            </div>
          </div>
        </div>

        {/* Project Switcher */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="text-white/30 text-2xs font-medium uppercase tracking-widest mb-1.5 px-1">
            Active Project
          </div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/8 transition-colors group"
          >
            {(() => {
              const ProjectIcon = projectTypeIcon[activeProject.type];
              return <ProjectIcon size={15} className="text-white/70" />;
            })()}
            <div className="flex-1 text-left min-w-0">
              <div className="text-white/90 text-xs font-medium leading-tight truncate">
                {activeProject.name}
              </div>
              <div className="text-white/35 text-2xs leading-tight">
                {activeProject.code}
              </div>
            </div>
            <ChevronDown
              size={12}
              className={`text-white/30 group-hover:text-white/50 transition-all duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="mt-1 bg-white/10 rounded-md overflow-hidden border border-white/10">
              {allProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/10 transition-colors text-left ${
                    p.id === activeProject.id ? "bg-accent/30" : ""
                  }`}
                >
                  {(() => {
                    const ProjectIcon = projectTypeIcon[p.type];
                    return <ProjectIcon size={15} className="text-white/70" />;
                  })()}
                  <div className="min-w-0">
                    <div
                      className={`text-xs leading-tight truncate ${p.id === activeProject.id ? "text-white" : "text-white/70"}`}
                    >
                      {p.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.status === "on-track"
                            ? "bg-success"
                            : p.status === "delayed"
                              ? "bg-rust"
                              : "bg-critical"
                        }`}
                      />
                      <span className="text-white/30 text-2xs">{p.code}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <div className="text-white/25 text-2xs font-medium uppercase tracking-widest mb-2 px-2">
            Modules
          </div>
          <div className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-white/55 hover:text-white/85 hover:bg-white/6"
                  }`}
                >
                  <Icon
                    size={15}
                    className={isActive ? "text-white" : "text-white/40"}
                  />
                  <span className="font-medium leading-tight text-xs">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-accent/60 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">PS</span>
            </div>
            <div>
              <div className="text-white/80 text-xs font-medium">
                COE, Pushkar Jha
              </div>
              <div className="text-white/30 text-2xs">Project Manager</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
