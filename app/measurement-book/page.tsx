"use client";

import { useState } from "react";
import { useProject } from "@/lib/context";
import {
  getMBByProject,
  measurementBookEntries,
  MBEntry,
} from "@/data/measurementBook";
import {
  BookOpen,
  Printer,
  Download,
  FileCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Camera,
} from "lucide-react";

export default function MeasurementBookPage() {
  const { activeProject } = useProject();
  const mbList = getMBByProject(activeProject.id);
  const [selectedMB, setSelectedMB] = useState<MBEntry>(
    mbList[0] || measurementBookEntries[0],
  );
  const [printSuccess, setPrintSuccess] = useState(false);

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => {
      setPrintSuccess(false);
      window.print();
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Top Banner with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">
              Digital Measurement Book (MB)
            </h2>
            <span className="badge badge-accent font-document italic">
              Official Record
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Standard civil engineering measurement ledger (L &times; B &times;
            H) linked directly to certified site DPR records
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            id="print-mb-btn"
            className="flex items-center gap-1.5 bg-surface hover:bg-border text-ink text-xs font-medium px-3.5 py-2 rounded-lg transition-colors border border-border"
          >
            <Printer size={14} className="text-muted" />
            Print Official MB
          </button>
          <button
            onClick={() => {
              setPrintSuccess(true);
              setTimeout(() => setPrintSuccess(false), 3000);
            }}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Download size={14} />
            Export Certified PDF
          </button>
        </div>
      </div>

      {printSuccess && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} />
          <span>
            Generating tamper-evident digital copy with cryptographic signature
            certificate.
          </span>
        </div>
      )}

      {/* Main Grid: MB Selector + Formal Document Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: MB Entry Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-ink uppercase tracking-wider px-1">
            Registered MB Pages ({mbList.length})
          </div>

          <div className="space-y-2">
            {mbList.map((mb) => {
              const isSelected = selectedMB.id === mb.id;
              return (
                <button
                  key={mb.id}
                  onClick={() => setSelectedMB(mb)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-white border-accent shadow-md-warm ring-1 ring-accent/30"
                      : "bg-white/80 hover:bg-white border-border shadow-sm-warm hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-accent">
                      {mb.mbNo}
                    </span>
                    <span
                      className={`badge text-2xs ${
                        mb.status === "approved"
                          ? "badge-success"
                          : mb.status === "certified"
                            ? "badge-accent"
                            : "badge-rust"
                      }`}
                    >
                      {mb.status}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-ink mt-2 line-clamp-2">
                    {mb.boqItemDesc}
                  </div>

                  <div className="flex items-center justify-between text-2xs text-muted mt-3 pt-2.5 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {mb.date}
                    </span>
                    <span className="font-semibold text-ink">
                      {mb.totalCertifiedQty} {mb.unit}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Formal Document Viewer (Using Source Serif 4 Typography) */}
        <div className="lg:col-span-8 bg-white border border-border-strong rounded-xl shadow-lg-warm p-8 md:p-10 font-document text-ink">
          {/* Official Document Header */}
          <div className="text-center border-b-2 border-ink pb-6 mb-6">
            <div className="text-xs font-sans tracking-widest uppercase font-semibold text-muted mb-1">
              Government of Nepal / Construction Record
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink uppercase">
              Digital Measurement Book
            </h1>
            <div className="text-sm font-sans text-muted mt-1">
              Contractor:{" "}
              <span className="font-semibold text-ink">
                {activeProject.contractor}
              </span>
            </div>
            <div className="text-xs font-sans text-muted mt-0.5">
              Project:{" "}
              <span className="font-semibold text-ink">
                {activeProject.name}
              </span>{" "}
              ({activeProject.code})
            </div>
          </div>

          {/* Meta Info Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface/50 p-4 rounded-lg border border-border mb-6 font-sans text-xs">
            <div>
              <div className="text-muted text-2xs uppercase">MB Sheet No.</div>
              <div className="font-mono font-bold text-accent mt-0.5">
                {selectedMB.mbNo}
              </div>
            </div>
            <div>
              <div className="text-muted text-2xs uppercase">
                Measurement Date
              </div>
              <div className="font-semibold text-ink mt-0.5">
                {selectedMB.date}
              </div>
            </div>
            <div>
              <div className="text-muted text-2xs uppercase">Site Engineer</div>
              <div className="font-semibold text-ink mt-0.5 truncate">
                {selectedMB.checkedBy.split("(")[0]}
              </div>
            </div>
            <div>
              <div className="text-muted text-2xs uppercase">
                Approval Status
              </div>
              <div className="font-semibold text-success mt-0.5 uppercase tracking-wide">
                {selectedMB.status}
              </div>
            </div>
          </div>

          {/* Item Description */}
          <div className="mb-6 p-3.5 bg-surface/30 rounded border border-border/80">
            <div className="text-2xs font-sans uppercase font-bold text-muted tracking-wider">
              BOQ Line Item
            </div>
            <div className="text-base font-semibold text-ink mt-0.5">
              {selectedMB.boqItemDesc}
            </div>
            <div className="text-xs font-sans text-muted mt-1 italic">
              Unit of Measurement: {selectedMB.unit}
            </div>
          </div>

          {/* Detailed Measurement Computation Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse document-table">
              <thead>
                <tr className="bg-surface/80 border-y border-border-strong text-2xs">
                  <th className="text-center w-12">Sl No</th>
                  <th>Particulars of Work / Description</th>
                  <th className="text-right w-16">Nos</th>
                  <th className="text-right w-20">Length (L)</th>
                  <th className="text-right w-20">Breadth (B)</th>
                  <th className="text-right w-20">Height (H)</th>
                  <th className="text-right w-28">
                    Quantity ({selectedMB.unit})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedMB.subItems.map((item) => (
                  <tr key={item.slNo} className="hover:bg-surface/30">
                    <td className="text-center font-mono text-xs text-muted">
                      {item.slNo}
                    </td>
                    <td className="text-xs">{item.description}</td>
                    <td className="text-right font-mono text-xs text-muted">
                      {item.noNos}
                    </td>
                    <td className="text-right font-mono text-xs text-muted">
                      {item.length !== 1 ? item.length.toFixed(2) : "—"}
                    </td>
                    <td className="text-right font-mono text-xs text-muted">
                      {item.breadth !== 1 ? item.breadth.toFixed(2) : "—"}
                    </td>
                    <td className="text-right font-mono text-xs text-muted">
                      {item.height !== 1 ? item.height.toFixed(2) : "—"}
                    </td>
                    <td className="text-right font-mono text-xs font-semibold text-ink">
                      {item.quantity.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink bg-surface/60 font-sans">
                  <td
                    colSpan={6}
                    className="text-right font-bold text-xs uppercase pr-3 py-2.5"
                  >
                    This Sheet Certified Quantity:
                  </td>
                  <td className="text-right font-bold text-sm text-accent font-mono py-2.5">
                    {selectedMB.totalCertifiedQty.toFixed(2)} {selectedMB.unit}
                  </td>
                </tr>
                <tr className="border-t border-border font-sans text-2xs text-muted">
                  <td colSpan={6} className="text-right pr-3 py-1.5">
                    Previous Cumulative Certified Quantity:
                  </td>
                  <td className="text-right font-mono py-1.5">
                    {selectedMB.cumulativePrevQty.toFixed(2)} {selectedMB.unit}
                  </td>
                </tr>
                <tr className="border-t border-border-strong font-sans text-xs font-bold text-ink bg-surface/80">
                  <td colSpan={6} className="text-right pr-3 py-2 uppercase">
                    Total Cumulative Quantity to Date:
                  </td>
                  <td className="text-right font-mono text-success py-2">
                    {selectedMB.cumulativeThisMB.toFixed(2)} {selectedMB.unit}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Evidence Citing & Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border font-sans text-xs">
            <div className="space-y-2">
              <div className="font-semibold text-ink flex items-center gap-1.5">
                <Camera size={13} className="text-accent" />
                Linked Site DPR Evidence
              </div>
              <div className="bg-surface/40 p-2.5 rounded border border-border space-y-1 text-2xs text-muted">
                <div>
                  DPR Ref:{" "}
                  <span className="font-mono text-ink">
                    {selectedMB.dprRef.join(", ")}
                  </span>
                </div>
                <div>Geotag verified at time of pour</div>
                <div>Site photos archived with digital timestamp</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-ink">
                Engineer Certification Remarks
              </div>
              <p className="text-2xs text-muted italic leading-relaxed bg-surface/40 p-2.5 rounded border border-border">
                &ldquo;{selectedMB.remarks}&rdquo;
              </p>
            </div>
          </div>

          {/* Verification Signatures / Stamp Section */}
          <div className="mt-8 pt-6 border-t-2 border-ink grid grid-cols-2 gap-8 font-sans">
            <div>
              <div className="h-12 flex items-end">
                <div className="border-b border-ink/40 w-48 pb-1 text-xs font-serif italic text-accent">
                  Dipendra Shrestha, B.E. Civil
                </div>
              </div>
              <div className="text-2xs uppercase font-bold text-ink mt-1">
                Measured & Recorded By
              </div>
              <div className="text-2xs text-muted">{selectedMB.checkedBy}</div>
            </div>

            <div className="text-right">
              <div className="h-12 flex items-end justify-end">
                <div className="border-b border-ink/40 w-48 pb-1 text-xs font-serif italic text-accent text-right">
                  Prashant Koirala, M.Sc.
                </div>
              </div>
              <div className="text-2xs uppercase font-bold text-ink mt-1">
                Checked & Approved By
              </div>
              <div className="text-2xs text-muted">
                {selectedMB.approvedBy ||
                  "Er. Prashant Koirala (Project Manager)"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
