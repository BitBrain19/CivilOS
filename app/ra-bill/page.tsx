"use client";

import { useState } from "react";
import { useProject } from "@/lib/context";
import { getRABillsByProject, raBills, RABill } from "@/data/raBills";
import {
  FileText,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Calendar,
  Building,
  User,
  ShieldCheck,
  CreditCard,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function RABillPage() {
  const { activeProject } = useProject();
  const projectBills = getRABillsByProject(activeProject.id);
  const [bills, setBills] = useState<RABill[]>(
    projectBills.length > 0 ? projectBills : raBills,
  );
  const [selectedBill, setSelectedBill] = useState<RABill>(
    bills[0] || raBills[0],
  );
  const [toastMsg, setToastMsg] = useState("");

  const formatNPR = (val: number) =>
    `₨ ${val.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const handleUpdateStatus = (newStatus: "submitted" | "approved" | "paid") => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === selectedBill.id) {
          const updated = { ...b, status: newStatus };
          setSelectedBill(updated);
          return updated;
        }
        return b;
      }),
    );
    setToastMsg(
      `Bill #${selectedBill.billNo} status updated to "${newStatus.toUpperCase()}".`,
    );
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Action Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">
              Running Account (RA) Billing
            </h2>
            <span className="badge badge-accent font-document italic">
              Interim Payment Certificate
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Claim generation directly computed from verified Digital MB records
            with standard statutory deductions
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            id="print-ra-bill"
            className="flex items-center gap-1.5 bg-surface hover:bg-border text-ink text-xs font-medium px-3.5 py-2 rounded-lg transition-colors border border-border"
          >
            <Printer size={14} className="text-muted" />
            Print Bill Statement
          </button>
          <button
            onClick={() => {
              setToastMsg(
                `Bill #${selectedBill.billNo} exported as signed PDF statement.`,
              );
              setTimeout(() => setToastMsg(""), 3000);
            }}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Download size={14} />
            Export Formal RA Bill
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Layout: Bill List Sidebar + Formal Statement Page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Bill Switcher */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-ink uppercase tracking-wider px-1">
            Project Billing History ({bills.length})
          </div>

          <div className="space-y-2">
            {bills.map((bill) => {
              const isSelected = selectedBill.id === bill.id;
              return (
                <button
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-white border-accent shadow-md-warm ring-1 ring-accent/30"
                      : "bg-white/80 hover:bg-white border-border shadow-sm-warm hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-accent">
                      {bill.billNo}
                    </span>
                    <span
                      className={`badge text-2xs ${
                        bill.status === "paid"
                          ? "badge-success"
                          : bill.status === "approved"
                            ? "badge-accent"
                            : bill.status === "submitted"
                              ? "badge-rust"
                              : "badge-muted"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <div className="text-sm font-bold text-ink">
                      {formatNPR(bill.netPayable)}
                    </div>
                    <div className="text-2xs text-muted">Net Claim</div>
                  </div>

                  <div className="flex items-center justify-between text-2xs text-muted mt-3 pt-2.5 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {bill.billDate}
                    </span>
                    <span className="font-mono text-2xs text-muted">
                      {bill.mbRefs.join(", ")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Workflow Action Box */}
          <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm space-y-3">
            <div className="text-xs font-semibold text-ink">
              Bill Approval Workflow
            </div>
            <div className="text-2xs text-muted leading-relaxed">
              Current stage:{" "}
              <span className="font-bold text-ink uppercase">
                {selectedBill.status}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              {selectedBill.status === "draft" && (
                <button
                  onClick={() => handleUpdateStatus("submitted")}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  <Send size={13} />
                  Submit Bill to Client
                </button>
              )}
              {selectedBill.status === "submitted" && (
                <button
                  onClick={() => handleUpdateStatus("approved")}
                  className="w-full flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  <CheckCircle2 size={13} />
                  Approve by Client Engineer
                </button>
              )}
              {selectedBill.status === "approved" && (
                <button
                  onClick={() => handleUpdateStatus("paid")}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  <CreditCard size={13} />
                  Mark Payment Received
                </button>
              )}
              {selectedBill.status === "paid" && (
                <div className="text-center text-xs text-success font-medium py-1 bg-success/10 rounded border border-success/20">
                  Payment Cleared & Settled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Formal Document Sheet (Source Serif 4) */}
        <div className="lg:col-span-8 bg-white border border-border-strong rounded-xl shadow-lg-warm p-8 md:p-10 font-document text-ink">
          {/* Document Heading */}
          <div className="border-b-2 border-ink pb-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="text-xs font-sans tracking-widest uppercase font-semibold text-muted mb-1">
                  Contractor Interim Payment Certificate
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-ink uppercase">
                  Running Account Bill
                </h1>
                <div className="text-sm font-sans text-muted mt-1">
                  Bill No:{" "}
                  <span className="font-mono font-bold text-accent">
                    {selectedBill.billNo}
                  </span>
                </div>
              </div>
              <div className="text-right sm:text-right font-sans text-xs">
                <span
                  className={`badge uppercase font-bold text-xs tracking-wider px-3 py-1 ${
                    selectedBill.status === "paid"
                      ? "badge-success"
                      : selectedBill.status === "approved"
                        ? "badge-accent"
                        : "badge-rust"
                  }`}
                >
                  {selectedBill.status}
                </span>
                <div className="text-2xs text-muted mt-1.5">
                  Date: {selectedBill.billDate}
                </div>
              </div>
            </div>
          </div>

          {/* Contract Parties Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface/50 p-4 rounded-lg border border-border mb-6 font-sans text-xs">
            <div>
              <div className="text-muted text-2xs uppercase font-bold">
                Employer / Client
              </div>
              <div className="font-semibold text-ink mt-0.5">
                {selectedBill.client}
              </div>
            </div>
            <div>
              <div className="text-muted text-2xs uppercase font-bold">
                Contractor
              </div>
              <div className="font-semibold text-ink mt-0.5">
                {selectedBill.contractor}
              </div>
            </div>
            <div>
              <div className="text-muted text-2xs uppercase font-bold">
                MB Cross-References
              </div>
              <div className="font-mono font-semibold text-accent mt-0.5">
                {selectedBill.mbRefs.join(", ")}
              </div>
            </div>
          </div>

          {/* Line Items Billing Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse document-table">
              <thead>
                <tr className="bg-surface/80 border-y border-border-strong text-2xs">
                  <th className="w-12">Item</th>
                  <th>Description of BOQ Work</th>
                  <th>Unit</th>
                  <th className="text-right">Prev Qty</th>
                  <th className="text-right">This Bill</th>
                  <th className="text-right">Total Qty</th>
                  <th className="text-right">Rate (NPR)</th>
                  <th className="text-right">Amount (NPR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedBill.lineItems.map((item) => (
                  <tr key={item.itemNo} className="hover:bg-surface/30">
                    <td className="font-mono text-xs text-muted">
                      {item.itemNo}
                    </td>
                    <td className="text-xs font-medium">{item.description}</td>
                    <td className="text-2xs text-muted">{item.unit}</td>
                    <td className="text-right font-mono text-xs text-muted">
                      {item.prevCertifiedQty.toFixed(2)}
                    </td>
                    <td className="text-right font-mono text-xs font-semibold text-ink">
                      {item.thisBillQty.toFixed(2)}
                    </td>
                    <td className="text-right font-mono text-xs text-muted">
                      {item.totalQty.toFixed(2)}
                    </td>
                    <td className="text-right font-mono text-xs text-muted">
                      ₨ {item.rate.toLocaleString()}
                    </td>
                    <td className="text-right font-mono text-xs font-bold text-ink">
                      ₨ {item.thisBillAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Billing Computations & Statutory Deductions */}
          <div className="border-t-2 border-ink pt-4 mb-6 font-sans">
            <div className="max-w-xs ml-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border text-muted">
                <span>Gross Work Claim (This Bill):</span>
                <span className="font-bold text-ink font-mono">
                  {formatNPR(selectedBill.grossAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border text-muted">
                <span>Less: Retention ({selectedBill.retentionPct}%):</span>
                <span className="font-mono text-rust">
                  - {formatNPR(selectedBill.retentionAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border text-muted">
                <span>Less: Mob. Advance Recovery (10%):</span>
                <span className="font-mono text-rust">
                  - {formatNPR(selectedBill.mobilizationAdvanceDeduction)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-y-2 border-ink text-sm font-bold bg-surface/60 px-2 rounded">
                <span className="uppercase text-ink">
                  Net Payable to Contractor:
                </span>
                <span className="font-mono text-accent">
                  {formatNPR(selectedBill.netPayable)}
                </span>
              </div>
            </div>
          </div>

          {/* Remarks & Notes */}
          <div className="bg-surface/30 p-3 rounded border border-border font-sans text-xs mb-8">
            <div className="text-2xs uppercase font-bold text-muted tracking-wider">
              Bill Notes
            </div>
            <p className="text-2xs text-muted italic mt-0.5">
              &ldquo;{selectedBill.remarks}&rdquo;
            </p>
          </div>

          {/* Signatures & Certification Endorsement */}
          <div className="pt-4 border-t-2 border-ink grid grid-cols-2 md:grid-cols-3 gap-6 font-sans">
            <div>
              <div className="h-10 flex items-end">
                <div className="border-b border-ink/40 w-36 pb-1 text-xs font-serif italic text-accent">
                  Prashant Shrestha
                </div>
              </div>
              <div className="text-2xs uppercase font-bold text-ink mt-1">
                Prepared By (Contractor)
              </div>
              <div className="text-2xs text-muted">Site Billing Engineer</div>
            </div>

            <div>
              <div className="h-10 flex items-end">
                <div className="border-b border-ink/40 w-36 pb-1 text-xs font-serif italic text-accent">
                  Er. Dipendra Shrestha
                </div>
              </div>
              <div className="text-2xs uppercase font-bold text-ink mt-1">
                Verified By (Site Eng.)
              </div>
              <div className="text-2xs text-muted">NEC Reg: 14209/Civil</div>
            </div>

            <div className="text-right md:text-left">
              <div className="h-10 flex items-end">
                <div className="border-b border-ink/40 w-36 pb-1 text-xs font-serif italic text-accent">
                  Er. Sanjaya Adhikari
                </div>
              </div>
              <div className="text-2xs uppercase font-bold text-ink mt-1">
                Certified By (Client)
              </div>
              <div className="text-2xs text-muted">
                Project Manager / Resident Eng.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
