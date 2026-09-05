"use client";

import { useState } from "react";
import { useProject } from "@/lib/context";
import { DPREntry } from "@/data/dpr";
import {
  BadgeCheck,
  CheckCircle2,
  Lock,
  Calendar,
  Camera,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck,
  CheckCheck,
  AlertTriangle,
  FileSignature,
  X,
} from "lucide-react";

export default function CertificationPage() {
  const { activeProject, dprEntries, certifyEntry, certifyAllEntries } = useProject();
  const [toastMsg, setToastMsg] = useState("");

  // Flagged certification modal / inline state
  const [justifyingEntryId, setJustifyingEntryId] = useState<string | null>(null);
  const [justificationReason, setJustificationReason] = useState<string>("");

  const projectEntries = dprEntries.filter((e) => e.projectId === activeProject.id);
  const pendingEntries = projectEntries.filter((e) => !e.certified);
  const standardPending = pendingEntries.filter((e) => !e.flag);
  const flaggedPending = pendingEntries.filter((e) => !!e.flag);
  const certifiedEntries = projectEntries.filter((e) => e.certified);

  const handleCertifySingleStandard = (entry: DPREntry) => {
    certifyEntry(entry.id);
    setToastMsg(
      `DPR Item "${entry.boqItemDesc}" certified and forwarded to Digital Measurement Book.`
    );
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleOpenJustificationModal = (entry: DPREntry) => {
    setJustifyingEntryId(entry.id);
    setJustificationReason("");
  };

  const handleConfirmCertifyFlagged = (entryId: string) => {
    if (!justificationReason.trim()) return;

    const target = pendingEntries.find((e) => e.id === entryId);
    certifyEntry(entryId, justificationReason.trim());
    setJustifyingEntryId(null);
    setJustificationReason("");
    setToastMsg(
      `Flagged entry "${target?.boqItemDesc}" certified with engineer acknowledgement: "${justificationReason.trim()}".`
    );
    setTimeout(() => setToastMsg(""), 4500);
  };

  const handleCertifyAllStandard = () => {
    if (standardPending.length === 0) return;
    certifyAllEntries();
    setToastMsg(
      `All ${standardPending.length} standard site entries certified! ${
        flaggedPending.length > 0
          ? `${flaggedPending.length} flagged entries remain queued for individual review.`
          : ""
      }`
    );
    setTimeout(() => setToastMsg(""), 4500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Header Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">
              Engineer Certification & Quantity Sign-off
            </h2>
            <span className="badge badge-accent">Resident Engineer Review</span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Validation workflow before locking measurements into the official Digital Measurement Book (MB).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {standardPending.length > 0 ? (
            <button
              onClick={handleCertifyAllStandard}
              id="certify-all-btn"
              className="flex items-center gap-2 bg-success hover:bg-success/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <CheckCheck size={15} />
              Certify All Standard ({standardPending.length})
            </button>
          ) : (
            <div className="text-xs text-muted italic">
              {flaggedPending.length > 0
                ? "Flagged entries require individual sign-off"
                : "No pending standard entries"}
            </div>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rust/40 shadow-sm-warm bg-rust/[0.03]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rust font-semibold">
              Flagged For Review
            </span>
            <AlertTriangle size={16} className="text-rust" />
          </div>
          <div className="text-2xl font-bold text-rust mt-2">
            {flaggedPending.length} Entries
          </div>
          <div className="text-2xs text-muted mt-1">
            Unplanned or unassigned work needing justification
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink font-medium">
              Standard Pending
            </span>
            <Clock size={16} className="text-muted" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">
            {standardPending.length} Entries
          </div>
          <div className="text-2xs text-muted mt-1">
            Matches supervisor daily work orders
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-success font-medium">
              Certified & Locked to MB
            </span>
            <Lock size={16} className="text-success" />
          </div>
          <div className="text-2xl font-semibold text-success mt-2">
            {certifiedEntries.length} Records
          </div>
          <div className="text-2xs text-muted mt-1">
            Signed by Er. Dipendra Shrestha (NEC: 14209)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">
              Audit Compliance
            </span>
            <ShieldCheck size={16} className="text-accent" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">
            100% Traceable
          </div>
          <div className="text-2xs text-muted mt-1">
            Geotagged site photos & daily timestamps
          </div>
        </div>
      </div>

      {/* SECTION 1: FLAGGED ENTRIES REQUIRING INDIVIDUAL ACKNOWLEDGEMENT */}
      {flaggedPending.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-rust/40 shadow-sm-warm overflow-hidden bg-rust/[0.01]">
          <div className="px-5 py-4 border-b border-rust/20 bg-rust/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rust animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-rust flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  Flagged & Unplanned Entries Requiring Conscious Acknowledgement
                </h3>
                <p className="text-2xs text-muted mt-0.5">
                  Entries logged without morning assignments or deviating from gang plans cannot be bulk-certified. A mandatory justification is required.
                </p>
              </div>
            </div>
            <span className="badge badge-rust text-2xs font-semibold">
              {flaggedPending.length} require reason
            </span>
          </div>

          <div className="divide-y divide-border/80">
            {flaggedPending.map((entry) => {
              const isJustifying = justifyingEntryId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="p-5 hover:bg-surface/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-ink">
                          {entry.boqItemDesc}
                        </span>
                        <span className="badge badge-muted text-2xs font-mono">
                          {entry.id}
                        </span>

                        {entry.flag === "no-assignment" && (
                          <span className="badge badge-rust text-2xs font-semibold flex items-center gap-1">
                            <AlertTriangle size={10} />
                            No assignment on file
                          </span>
                        )}
                        {entry.flag === "unplanned-work" && (
                          <span className="badge badge-rust text-2xs font-semibold flex items-center gap-1">
                            <AlertTriangle size={10} />
                            Unplanned work
                          </span>
                        )}
                      </div>

                      {entry.flagReason && (
                        <div className="text-xs text-rust font-medium bg-rust/10 border border-rust/20 rounded-md px-3 py-1.5 inline-block">
                          ⚠️ Site Discrepancy Note: {entry.flagReason}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-2xs text-muted pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>Date: {entry.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={12} />
                          <span>Gang: {entry.gang}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} />
                          <span>{entry.geotag}</span>
                        </div>
                      </div>

                      {entry.remarks && (
                        <div className="text-xs text-muted bg-surface/70 border border-border/60 rounded-md p-2.5">
                          <span className="font-medium text-ink">
                            Site Supervisor Remarks:
                          </span>{" "}
                          {entry.remarks}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1 text-2xs text-muted">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded">
                          <Camera size={11} /> Photo Geotagged
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded">
                          <Clock size={11} /> Logged{" "}
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {/* Right side: Quantity & Justify Action */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-ink tabular-nums">
                          {entry.quantityToday}{" "}
                          <span className="text-xs font-normal text-muted">
                            {entry.unit}
                          </span>
                        </div>
                        <div className="text-2xs text-rust font-medium">
                          Requires Justification
                        </div>
                      </div>

                      {!isJustifying ? (
                        <button
                          onClick={() => handleOpenJustificationModal(entry)}
                          id={`certify-flagged-${entry.id}`}
                          className="flex items-center gap-1.5 bg-rust hover:bg-rust/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                          <FileSignature size={13} />
                          Acknowledge & Certify
                        </button>
                      ) : (
                        <button
                          onClick={() => setJustifyingEntryId(null)}
                          className="text-xs text-muted hover:text-ink flex items-center gap-1"
                        >
                          <X size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mandatory Justification Input Drawer (mirrors edit-after-lock UI pattern) */}
                  {isJustifying && (
                    <div className="mt-4 pt-3 border-t border-rust/30 bg-rust/[0.04] p-4 rounded-lg border border-rust/30 count-up space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-rust">
                          <FileSignature size={14} />
                          Mandatory Justification / Engineer Reason
                        </div>
                        <span className="text-2xs text-rust font-medium">
                          Required for Audit Log
                        </span>
                      </div>

                      <p className="text-2xs text-muted">
                        State why this unassigned or unplanned execution is accepted for official Measurement Book locking (e.g. urgent evening verbal approval, bad weather adjustment, overtime concrete pour).
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          required
                          autoFocus
                          value={justificationReason}
                          onChange={(e) => setJustificationReason(e.target.value)}
                          placeholder="Enter reason for authorizing flagged entry... (Required)"
                          className="flex-1 text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-rust"
                        />
                        <button
                          disabled={!justificationReason.trim()}
                          onClick={() => handleConfirmCertifyFlagged(entry.id)}
                          id={`confirm-certify-${entry.id}`}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
                            justificationReason.trim()
                              ? "bg-rust hover:bg-rust/90 text-white cursor-pointer"
                              : "bg-surface text-muted/60 border border-border cursor-not-allowed"
                          }`}
                        >
                          <BadgeCheck size={14} />
                          Authorize & Certify
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: STANDARD ASSIGNED PENDING ENTRIES */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-surface/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-success" />
            <h3 className="text-sm font-semibold text-ink">
              Standard Assigned Entries (Planned Scope)
            </h3>
          </div>
          <span className="badge badge-accent">
            {standardPending.length} items to verify
          </span>
        </div>

        {standardPending.length > 0 ? (
          <div className="divide-y divide-border">
            {standardPending.map((entry) => (
              <div
                key={entry.id}
                className="p-5 hover:bg-surface/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-ink">
                        {entry.boqItemDesc}
                      </span>
                      <span className="badge badge-muted text-2xs font-mono">
                        {entry.id}
                      </span>
                      <span className="badge badge-accent text-2xs">
                        Planned Scope
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-2xs text-muted pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>Date: {entry.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserCheck size={12} />
                        <span>Gang: {entry.gang}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        <span>{entry.geotag}</span>
                      </div>
                    </div>

                    {entry.remarks && (
                      <div className="text-xs text-muted bg-surface/70 border border-border/60 rounded-md p-2.5">
                        <span className="font-medium text-ink">Site Notes:</span>{" "}
                        {entry.remarks}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-2xs text-muted">
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded">
                        <Camera size={11} /> Site photo attached
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded">
                        <Clock size={11} /> Logged{" "}
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-ink tabular-nums">
                        {entry.quantityToday}{" "}
                        <span className="text-xs font-normal text-muted">
                          {entry.unit}
                        </span>
                      </div>
                      <div className="text-2xs text-muted">Claimed by site</div>
                    </div>

                    <button
                      onClick={() => handleCertifySingleStandard(entry)}
                      id={`certify-${entry.id}`}
                      className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      <BadgeCheck size={14} />
                      Verify & Certify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-muted">
            <CheckCircle2 size={28} className="mx-auto text-success/60 mb-2" />
            <div className="text-sm font-medium text-ink">
              All standard planned entries certified!
            </div>
            <div className="text-xs text-muted mt-0.5">
              {flaggedPending.length > 0
                ? "Flagged entries remain in the attention queue above."
                : "No pending measurements awaiting engineer sign-off."}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: CERTIFIED & LOCKED RECORDS (MB REFERENCE LOG) */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-surface/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-success" />
            <h3 className="text-sm font-semibold text-ink">
              Certified & Locked Records (MB Reference Log)
            </h3>
          </div>
          <span className="badge badge-success">
            {certifiedEntries.length} locked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>MB Reference</th>
                <th>Activity Description</th>
                <th>Date</th>
                <th>Gang / Naike</th>
                <th className="text-right">Certified Qty</th>
                <th>Audit / Justification Note</th>
                <th>Certified By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {certifiedEntries.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono text-2xs text-accent font-semibold">
                    {c.mbRef || "MB-SRC-2024-048"}
                  </td>
                  <td className="font-medium text-ink">
                    <div>{c.boqItemDesc}</div>
                    {c.flag && (
                      <span className="badge badge-rust text-2xs mt-0.5">
                        {c.flag === "no-assignment" ? "No assignment" : "Unplanned"}
                      </span>
                    )}
                  </td>
                  <td className="text-2xs text-muted whitespace-nowrap">
                    {c.date}
                  </td>
                  <td className="text-2xs text-muted">{c.gang}</td>
                  <td className="text-right font-semibold text-ink tabular-nums">
                    {c.quantityToday} {c.unit}
                  </td>
                  <td>
                    {c.certificationReason ? (
                      <div className="text-2xs text-rust font-medium bg-rust/[0.08] p-1.5 rounded">
                        <span className="font-semibold">Reason:</span> {c.certificationReason}
                      </div>
                    ) : (
                      <div className="text-2xs text-muted">
                        Standard supervisor work order
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="text-xs font-medium text-ink">
                      {c.certifiedBy || "Er. Dipendra Shrestha"}
                    </div>
                    <div className="text-2xs text-muted">
                      {c.certifiedAt
                        ? new Date(c.certifiedAt).toLocaleDateString()
                        : "Digital Sig Verified"}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success flex items-center gap-1">
                      <Lock size={10} /> Locked to MB
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
