"use client";

import { useState } from "react";
import { useProject } from "@/lib/context";
import {
  getRetentionByProject,
  getAgingByProject,
  getAllAging,
  retentionRecords,
  agingRecords,
  AgingRecord,
} from "@/data/retention";
import {
  PiggyBank,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  CreditCard,
  DollarSign,
  TrendingDown,
  Filter,
  FileText,
  Building,
} from "lucide-react";

export default function RetentionPage() {
  const { activeProject } = useProject();
  const [viewScope, setViewScope] = useState<"project" | "all">("project");
  const [agingFilter, setAgingFilter] = useState<string>("all");

  const projectRetention = getRetentionByProject(activeProject.id);
  const currentAging =
    viewScope === "project"
      ? getAgingByProject(activeProject.id)
      : getAllAging();

  const totalRetentionHeld = projectRetention.reduce(
    (sum, r) => sum + r.balance,
    0,
  );
  const totalOutstanding = currentAging.reduce(
    (sum, a) => sum + a.outstandingAmount,
    0,
  );
  const overdueCount = currentAging.filter(
    (a) => a.status === "overdue",
  ).length;
  const overdueAmount = currentAging
    .filter((a) => a.status === "overdue")
    .reduce((sum, a) => sum + a.outstandingAmount, 0);

  const filteredAging = currentAging.filter((item) => {
    if (agingFilter === "all") return true;
    if (agingFilter === "overdue") return item.status === "overdue";
    if (agingFilter === "pending") return item.status === "pending";
    if (agingFilter === "paid") return item.status === "paid";
    return item.agingBucket === agingFilter;
  });

  const formatNPR = (val: number) => `₨ ${val.toLocaleString("en-IN")}`;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Top Banner with Scope Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Contract Retention & Payment Aging Schedule
          </h2>
          <p className="text-xs text-muted mt-0.5">
            5% security retention ledger per RA bill, Defects Liability Period
            (DLP) maturity, and 30/60/90+ day receivables aging
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
          <button
            onClick={() => setViewScope("project")}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewScope === "project"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {activeProject.name.split(" ")[0]} Scope
          </button>
          <button
            onClick={() => setViewScope("all")}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewScope === "all"
                ? "bg-white text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Company-Wide (All Projects)
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">
              Retention Deposit Held
            </span>
            <PiggyBank size={16} className="text-accent" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">
            {formatNPR(totalRetentionHeld)}
          </div>
          <div className="text-2xs text-muted mt-1">
            Held by client until DLP completion
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">
              Total Receivables Outstanding
            </span>
            <CreditCard size={16} className="text-muted" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">
            {formatNPR(totalOutstanding)}
          </div>
          <div className="text-2xs text-muted mt-1">
            Across {currentAging.length} submitted RA claims
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-critical/30 shadow-sm-warm bg-critical/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-critical font-medium">
              Overdue Receivables Alert
            </span>
            <AlertTriangle size={16} className="text-critical" />
          </div>
          <div className="text-2xl font-semibold text-critical mt-2">
            {formatNPR(overdueAmount)}
          </div>
          <div className="text-2xs text-muted mt-1">
            {overdueCount} bills past statutory payment term (&gt;30d)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">
              Defects Liability Period (DLP)
            </span>
            <Calendar size={16} className="text-accent" />
          </div>
          <div className="text-sm font-semibold text-ink mt-2">
            12 Months Post-Handover
          </div>
          <div className="text-2xs text-muted mt-1">
            First tranche release on Final Handover
          </div>
        </div>
      </div>

      {/* Section 1: Payment Aging Report (Table View with Overdue Color Flags) */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface/40">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Receivables Aging Report (30 / 60 / 90+ Days)
            </h3>
            <p className="text-2xs text-muted">
              Submitted contractor bills tracked against expected payment
              milestones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-muted" />
            <span className="text-2xs text-muted uppercase tracking-wider">
              Bucket:
            </span>
            <div className="flex gap-1 flex-wrap">
              {[
                { id: "all", label: "All Bills" },
                { id: "overdue", label: "Overdue Only" },
                { id: "0-30", label: "0–30d" },
                { id: "31-60", label: "31–60d" },
                { id: "61-90", label: "61–90d" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAgingFilter(tab.id)}
                  className={`text-2xs px-2.5 py-1 rounded-md transition-colors ${
                    agingFilter === tab.id
                      ? "bg-accent text-white font-medium"
                      : "text-muted hover:bg-surface border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill Reference</th>
                <th>Bill Date</th>
                <th>Submitted On</th>
                <th className="text-right">Gross Claim</th>
                <th className="text-right">Net Payable</th>
                <th className="text-right">Outstanding</th>
                <th className="text-right">Days Slipped</th>
                <th>Aging Bracket</th>
                <th>Status</th>
                <th>Remarks / Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filteredAging.map((item) => {
                const isOverdue = item.status === "overdue";
                const isCritical = item.daysSinceSubmission >= 60 && isOverdue;

                return (
                  <tr
                    key={item.id}
                    className={
                      isCritical
                        ? "bg-critical/[0.04]"
                        : isOverdue
                          ? "bg-rust/[0.03]"
                          : ""
                    }
                  >
                    <td className="font-mono text-2xs font-bold text-accent">
                      {item.billNo}
                    </td>
                    <td className="text-2xs text-muted whitespace-nowrap">
                      {item.billDate}
                    </td>
                    <td className="text-2xs text-muted whitespace-nowrap">
                      {item.submittedDate}
                    </td>
                    <td className="text-right tabular-nums text-muted">
                      {formatNPR(item.billAmount)}
                    </td>
                    <td className="text-right tabular-nums font-semibold text-ink">
                      {formatNPR(item.netPayable)}
                    </td>
                    <td className="text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          isCritical
                            ? "text-critical"
                            : isOverdue
                              ? "text-rust"
                              : item.outstandingAmount === 0
                                ? "text-muted"
                                : "text-ink"
                        }`}
                      >
                        {formatNPR(item.outstandingAmount)}
                      </span>
                    </td>
                    <td className="text-right tabular-nums">
                      <span
                        className={`font-semibold ${isCritical ? "text-critical" : isOverdue ? "text-rust" : "text-muted"}`}
                      >
                        {item.daysSinceSubmission} days
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge font-mono text-2xs ${
                          item.agingBucket === "61-90" ||
                          item.agingBucket === "90+"
                            ? "badge-critical"
                            : item.agingBucket === "31-60"
                              ? "badge-rust"
                              : "badge-muted"
                        }`}
                      >
                        {item.agingBucket} days
                      </span>
                    </td>
                    <td>
                      {item.status === "paid" && (
                        <span className="badge badge-success">Settled</span>
                      )}
                      {item.status === "partially-paid" && (
                        <span className="badge badge-rust">Partial</span>
                      )}
                      {item.status === "pending" && (
                        <span className="badge badge-accent">Under Review</span>
                      )}
                      {item.status === "overdue" && (
                        <span className="badge badge-critical flex items-center gap-1 font-bold">
                          <AlertTriangle size={10} /> OVERDUE
                        </span>
                      )}
                    </td>
                    <td className="text-2xs text-muted italic max-w-xs truncate">
                      {item.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Retention Ledger */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-surface/30 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Contract Retention Ledger (5% Withheld)
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Cumulative security retention deductions schedule and release
              timeline
            </p>
          </div>
          <span className="badge badge-accent">
            {projectRetention.length} Retention Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>RA Bill Ref</th>
                <th>Bill Date</th>
                <th className="text-right">Gross Bill (NPR)</th>
                <th className="text-center">Retention %</th>
                <th className="text-right">Retention Held (NPR)</th>
                <th className="text-right">Released Amount</th>
                <th className="text-right">Net Held Balance</th>
                <th>DLP Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projectRetention.map((ret) => (
                <tr key={ret.id}>
                  <td className="font-mono text-2xs font-semibold text-accent">
                    {ret.billNo}
                  </td>
                  <td className="text-2xs text-muted">{ret.billDate}</td>
                  <td className="text-right tabular-nums text-muted">
                    {formatNPR(ret.grossBillAmount)}
                  </td>
                  <td className="text-center font-mono text-xs">
                    {ret.retentionPct}%
                  </td>
                  <td className="text-right tabular-nums font-semibold text-ink">
                    {formatNPR(ret.retentionHeld)}
                  </td>
                  <td className="text-right tabular-nums text-success">
                    {ret.released > 0 ? formatNPR(ret.released) : "—"}
                  </td>
                  <td className="text-right tabular-nums font-bold text-accent bg-surface/50">
                    {formatNPR(ret.balance)}
                  </td>
                  <td className="text-2xs text-muted whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-muted" />
                      {ret.dlpDate}
                    </span>
                  </td>
                  <td>
                    {ret.status === "held" && (
                      <span className="badge badge-accent">Withheld</span>
                    )}
                    {ret.status === "partially-released" && (
                      <span className="badge badge-rust">50% Released</span>
                    )}
                    {ret.status === "released" && (
                      <span className="badge badge-success">Released</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink bg-surface/80 font-semibold text-xs text-ink">
                <td colSpan={4} className="text-right uppercase py-3 pr-4">
                  Total Security Retention Held:
                </td>
                <td className="text-right py-3 tabular-nums font-bold text-ink">
                  {formatNPR(totalRetentionHeld)}
                </td>
                <td className="text-right py-3 tabular-nums text-success">—</td>
                <td className="text-right py-3 tabular-nums font-bold text-accent text-sm">
                  {formatNPR(totalRetentionHeld)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
