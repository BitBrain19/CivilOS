"use client";

import { useState, useEffect } from "react";
import { useProject } from "@/lib/context";
import { getBOQByProject } from "@/data/boq";
import { getLaborByProject } from "@/data/labor";
import { getAssignmentByProjectAndDate } from "@/data/assignments";
import { DPREntry } from "@/data/dpr";
import {
  Smartphone,
  MapPin,
  Camera,
  Clock,
  CheckCircle2,
  Plus,
  AlertTriangle,
  Calendar,
  Layers,
  Users,
  Info,
} from "lucide-react";

export default function DPRPage() {
  const { activeProject, assignments, dprEntries, addDPREntry } = useProject();
  const boqItems = getBOQByProject(activeProject.id);
  const laborGangs = getLaborByProject(activeProject.id);

  const availableGangs =
    laborGangs.length > 0
      ? laborGangs.map((g) => g.gangName)
      : [
          "Ram Bahadur Naike's Mason Gang",
          "Hari Tamang's Bar Benders",
          "Mohan Carpenter Gang",
          "Excavation Gang — Sita Rai",
        ];

  const [selectedDate, setSelectedDate] = useState("2024-10-01");
  const publishedAssignment = getAssignmentByProjectAndDate(
    assignments,
    activeProject.id,
    selectedDate
  );

  // Assigned items list (if assignment exists)
  const assignedActivityMap = new Map(
    publishedAssignment?.activities.map((a) => [a.boqItemId, a]) || []
  );
  const assignedBOQItems = boqItems.filter((b) =>
    assignedActivityMap.has(b.id)
  );

  // Dropdown states
  const [selectedBOQ, setSelectedBOQ] = useState<string>("");
  const [isOtherActivity, setIsOtherActivity] = useState(false);
  const [customBOQId, setCustomBOQId] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [gang, setGang] = useState(availableGangs[0] || "");
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Initialize selected BOQ item based on assignment existence
  useEffect(() => {
    if (publishedAssignment && assignedBOQItems.length > 0) {
      // Default to first assigned item
      setSelectedBOQ(assignedBOQItems[0].id);
      setIsOtherActivity(false);
      const assignedGang = assignedActivityMap.get(assignedBOQItems[0].id)?.assignedGang;
      if (assignedGang) setGang(assignedGang);
    } else {
      // Fallback to first available BOQ item
      setSelectedBOQ(boqItems[0]?.id || "");
      setIsOtherActivity(false);
      setGang(availableGangs[0] || "");
    }
  }, [publishedAssignment?.id, selectedDate, activeProject.id]);

  // Determine effective BOQ item
  const effectiveBOQId = isOtherActivity ? customBOQId || boqItems[0]?.id : selectedBOQ;
  const selectedItem = boqItems.find((b) => b.id === effectiveBOQId);

  // Gang change helper: if selecting an assigned activity, suggest the assigned gang
  const handleActivityChange = (value: string) => {
    if (value === "__OTHER__") {
      setIsOtherActivity(true);
      const firstUnassigned = boqItems.find((b) => !assignedActivityMap.has(b.id)) || boqItems[0];
      setCustomBOQId(firstUnassigned?.id || "");
    } else {
      setIsOtherActivity(false);
      setSelectedBOQ(value);
      const assignedGang = assignedActivityMap.get(value)?.assignedGang;
      if (assignedGang) {
        setGang(assignedGang);
      }
    }
  };

  // Determine prospective flag preview
  let previewFlag: 'no-assignment' | 'unplanned-work' | null = null;
  let previewFlagReason = "";

  if (!publishedAssignment) {
    previewFlag = 'no-assignment';
    previewFlagReason = `No supervisor assignment published on file for ${selectedDate}`;
  } else if (isOtherActivity) {
    previewFlag = 'unplanned-work';
    previewFlagReason = `Activity is not on today's published assignment for ${selectedDate}`;
  } else {
    const act = assignedActivityMap.get(selectedBOQ);
    if (act?.assignedGang && act.assignedGang !== gang) {
      previewFlag = 'unplanned-work';
      previewFlagReason = `Gang mismatch: assigned to ${act.assignedGang}`;
    }
  }

  // Filter entries for active project
  const projectEntries = dprEntries.filter((e) => e.projectId === activeProject.id);
  const activeDateEntries = projectEntries.filter((e) => e.date === selectedDate);
  const otherDateEntries = projectEntries.filter((e) => e.date !== selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qty = parseFloat(quantity) || 1;
    let finalFlag: 'no-assignment' | 'unplanned-work' | undefined = undefined;
    let finalFlagReason: string | undefined = undefined;

    if (!publishedAssignment) {
      finalFlag = 'no-assignment';
      finalFlagReason = `No supervisor assignment on file for ${selectedDate}`;
    } else if (isOtherActivity) {
      finalFlag = 'unplanned-work';
      finalFlagReason = `Activity was logged via "Other / Not on assignment list"`;
    } else {
      const act = assignedActivityMap.get(selectedBOQ);
      if (act?.assignedGang && act.assignedGang !== gang) {
        finalFlag = 'unplanned-work';
        finalFlagReason = `Gang mismatch: logged with ${gang} (assigned to ${act.assignedGang})`;
      }
    }

    const newEntry: DPREntry = {
      id: `dpr-${Date.now().toString().slice(-4)}`,
      projectId: activeProject.id,
      date: selectedDate,
      boqItemId: selectedItem.id,
      boqItemDesc: selectedItem.description,
      unit: selectedItem.unit,
      quantityToday: qty,
      cumulativeQty: (selectedItem.completedQty || 0) + qty,
      gang,
      remarks:
        remarks ||
        (finalFlag === 'unplanned-work'
          ? "Site adjustment: work executed outside daily planned schedule."
          : finalFlag === 'no-assignment'
          ? "Logged without published morning work assignment."
          : "Work completed as planned."),
      photoRef: "/photos/dpr-site.jpg",
      geotag:
        activeProject.type === "bridge"
          ? "Thapagaun, 27.6870° N, 85.3430° E"
          : "Shantinagar, 27.7041° N, 85.3381° E",
      timestamp: new Date().toISOString(),
      certified: false,
      flag: finalFlag,
      flagReason: finalFlagReason,
    };

    addDPREntry(newEntry);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setQuantity("");
    setRemarks("");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl">
      {/* Date Navigation & Context Bar */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm-warm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-ink">
              Daily Progress Report (DPR) Entry
            </h1>
            <span className="badge badge-accent">Field Staff Logging</span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Log physical daily quantities executed on site. Activities synchronize with morning supervisor work orders.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5 flex-shrink-0">
          <Calendar size={13} className="text-accent flex-shrink-0" />
          <span className="text-2xs text-muted uppercase font-medium">Log Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-semibold text-ink focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: context / today's log list */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-ink">
                  Site Log for {selectedDate}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {publishedAssignment
                    ? `Assignment Published (${publishedAssignment.activities.length} activities scheduled)`
                    : "⚠️ No published assignment on file for this date"}
                </p>
              </div>
              <span className="badge badge-accent">
                {activeDateEntries.length} entries
              </span>
            </div>

            {activeDateEntries.length > 0 ? (
              <div className="divide-y divide-border">
                {activeDateEntries.map((entry) => (
                  <div key={entry.id} className="px-5 py-4 hover:bg-surface/20 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-ink">
                            {entry.boqItemDesc}
                          </span>
                          {/* Flag Badges in Rust Styling */}
                          {entry.flag === "no-assignment" && (
                            <span className="badge badge-rust flex items-center gap-1 text-2xs font-semibold">
                              <AlertTriangle size={10} />
                              No assignment on file
                            </span>
                          )}
                          {entry.flag === "unplanned-work" && (
                            <span className="badge badge-rust flex items-center gap-1 text-2xs font-semibold">
                              <AlertTriangle size={10} />
                              Unplanned work
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted mt-0.5 flex items-center gap-2">
                          <Users size={11} />
                          <span>{entry.gang}</span>
                        </div>

                        {entry.flagReason && (
                          <div className="mt-1 text-2xs text-rust font-medium bg-rust/[0.07] px-2 py-0.5 rounded inline-block">
                            {entry.flagReason}
                          </div>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-semibold text-ink tabular-nums">
                          {entry.quantityToday}{" "}
                          <span className="text-muted font-normal text-xs">
                            {entry.unit}
                          </span>
                        </div>
                        {entry.certified ? (
                          <span className="badge badge-success text-2xs mt-1">
                            Certified
                          </span>
                        ) : (
                          <span className="badge badge-muted text-2xs mt-1">
                            Pending Review
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-3 text-2xs text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> {entry.geotag.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />{" "}
                        {new Date(entry.timestamp).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="font-mono text-muted/60">{entry.id}</span>
                    </div>

                    {entry.remarks && (
                      <div className="mt-2 text-xs text-muted bg-surface rounded px-2.5 py-1.5 italic">
                        {entry.remarks}
                      </div>
                    )}

                    {/* Site Photo Thumbnail */}
                    <div className="mt-3 flex gap-2">
                      <div className="w-16 h-12 rounded-md bg-surface border border-border flex items-center justify-center">
                        <Camera size={14} className="text-muted" />
                      </div>
                      <div className="w-16 h-12 rounded-md bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center">
                        <span className="text-2xs text-accent font-medium">
                          Geotagged
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted text-xs space-y-1">
                <Layers size={24} className="mx-auto text-muted/50 mb-2" />
                <div className="font-medium text-ink">No entries recorded for {selectedDate}</div>
                <p>Use the field mobile form on the right to log work executed today.</p>
              </div>
            )}
          </div>

          {/* Other dates log / previous records */}
          {otherDateEntries.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border bg-surface/20">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Other Recorded Days ({otherDateEntries.length})
                </h3>
              </div>
              <div className="divide-y divide-border">
                {otherDateEntries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="px-5 py-3 flex items-center justify-between hover:bg-surface/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {entry.certified ? (
                        <CheckCircle2
                          size={14}
                          className="text-success flex-shrink-0"
                        />
                      ) : (
                        <Clock size={14} className="text-rust flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-ink">
                            {entry.boqItemDesc}
                          </span>
                          {entry.flag === "no-assignment" && (
                            <span className="badge badge-rust text-2xs">No assignment</span>
                          )}
                          {entry.flag === "unplanned-work" && (
                            <span className="badge badge-rust text-2xs">Unplanned</span>
                          )}
                        </div>
                        <div className="text-2xs text-muted">
                          {entry.date} · {entry.gang}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-ink tabular-nums">
                        {entry.quantityToday} {entry.unit}
                      </div>
                      <div className="text-2xs text-muted">
                        {entry.certified ? "Certified" : "Pending Sign-off"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Mobile-styled DPR Entry Form */}
        <div className="flex-shrink-0 w-full lg:w-[350px] flex justify-center">
          <div className="w-full max-w-[350px] bg-white rounded-2xl overflow-hidden shadow-lg-warm border border-border">
            {/* Phone status bar */}
            <div className="bg-ink px-4 pt-3 pb-1 flex justify-between items-center">
              <span className="text-white/50 text-2xs">09:41</span>
              <div className="flex items-center gap-2">
                <Smartphone size={10} className="text-white/30" />
                <span className="text-white/30 text-2xs">CivilOS Field 4G</span>
              </div>
            </div>

            {/* App header */}
            <div className="bg-accent px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-2xs">
                  PJ
                </div>
                <div>
                  <div className="text-xs font-medium leading-tight">
                    Daily Progress Entry
                  </div>
                  <div className="text-white/70 text-2xs truncate max-w-[170px]">
                    {activeProject.name}
                  </div>
                </div>
              </div>
              <span className="text-2xs font-mono bg-white/15 px-2 py-0.5 rounded">
                {selectedDate}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-base p-4 space-y-3">
              {submitted && (
                <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/20 rounded-lg px-3 py-2 count-up">
                  <CheckCircle2 size={14} className="flex-shrink-0" />
                  <span>Entry saved & queued for certification!</span>
                </div>
              )}

              {/* Assignment State Indicator / Notice */}
              {publishedAssignment ? (
                <div className="bg-accent/8 border border-accent/20 rounded-lg p-2.5 text-2xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-accent">
                    <CheckCircle2 size={12} /> Work Order Active ({assignedBOQItems.length} items)
                  </div>
                  <div className="text-muted">
                    Pulling from today&apos;s supervisor assignment.
                  </div>
                </div>
              ) : (
                <div className="bg-rust/10 border border-rust/30 rounded-lg p-2.5 text-2xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-rust">
                    <AlertTriangle size={12} /> No Assignment on File
                  </div>
                  <div className="text-muted">
                    No morning work order published for {selectedDate}. Full BOQ unlocked; entry will carry &ldquo;No assignment on file&rdquo; flag.
                  </div>
                </div>
              )}

              {/* BOQ Activity Selector */}
              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  BOQ Activity
                </label>

                {publishedAssignment ? (
                  <div className="space-y-2">
                    <select
                      value={isOtherActivity ? "__OTHER__" : selectedBOQ}
                      onChange={(e) => handleActivityChange(e.target.value)}
                      className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <optgroup label="📋 Today's Assigned Activities">
                        {assignedBOQItems.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.itemNo} — {b.description}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="⚠️ Other Unplanned Scope">
                        <option value="__OTHER__">
                          — Other / Not on assignment list... —
                        </option>
                      </optgroup>
                    </select>

                    {/* Secondary selector for "Other / Not on list" */}
                    {isOtherActivity && (
                      <div className="p-2.5 bg-rust/10 border border-rust/30 rounded-lg space-y-1.5 count-up">
                        <div className="flex items-center gap-1 text-2xs text-rust font-semibold">
                          <AlertTriangle size={11} /> Unplanned Activity Selection
                        </div>
                        <label className="text-2xs text-muted block">
                          Select from full open BOQ:
                        </label>
                        <select
                          value={customBOQId}
                          onChange={(e) => setCustomBOQId(e.target.value)}
                          className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white text-ink focus:outline-none"
                        >
                          {boqItems.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.itemNo} — {b.description}
                            </option>
                          ))}
                        </select>
                        <p className="text-2xs text-muted italic">
                          This entry will be flagged as &ldquo;Unplanned work&rdquo; for engineer review.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <select
                    value={selectedBOQ}
                    onChange={(e) => setSelectedBOQ(e.target.value)}
                    className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {boqItems.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.itemNo} — {b.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Remaining quantity indicator */}
              {selectedItem && (
                <div className="bg-surface border border-border rounded-lg px-3 py-1.5 flex justify-between text-2xs">
                  <span className="text-muted">Total BOQ Balance</span>
                  <span className="font-semibold text-ink font-mono">
                    {(selectedItem.quantity - selectedItem.completedQty).toFixed(1)}{" "}
                    {selectedItem.unit}
                  </span>
                </div>
              )}

              {/* Quantity and Labor Gang */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Qty Today
                  </label>
                  <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                    <input
                      type="number"
                      step="any"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-2 text-ink focus:outline-none"
                      placeholder="0.00"
                    />
                    <span className="px-2 text-2xs text-muted border-l border-border bg-surface">
                      {selectedItem?.unit || "units"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Gang / Naike
                  </label>
                  <select
                    value={gang}
                    onChange={(e) => setGang(e.target.value)}
                    className="w-full text-2xs border border-border rounded-lg px-2 py-2 bg-white text-ink focus:outline-none"
                  >
                    {availableGangs.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prospective Flag Warning Preview */}
              {previewFlag && (
                <div className="bg-rust/10 border border-rust/30 rounded-lg p-2 text-2xs text-rust flex items-start gap-1.5">
                  <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      Flag: {previewFlag === "no-assignment" ? "No assignment on file" : "Unplanned work"}
                    </span>
                    <p className="text-muted text-2xs mt-0.5">{previewFlagReason}</p>
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Field Remarks / Observations
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white text-ink focus:outline-none resize-none"
                  placeholder="Record work details, pour conditions, or reason..."
                />
              </div>

              {/* Geotag display */}
              <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-1.5 border border-border">
                <MapPin size={12} className="text-success flex-shrink-0" />
                <div>
                  <div className="text-2xs text-ink">
                    {activeProject.type === "bridge"
                      ? "27.6870° N, 85.3430° E"
                      : "27.7041° N, 85.3381° E"}
                  </div>
                  <div className="text-2xs text-muted">
                    {activeProject.name.split(" ")[0]} · GPS Locked
                  </div>
                </div>
              </div>

              {/* Photo attach button */}
              <div className="border-2 border-dashed border-border rounded-lg p-2.5 flex flex-col items-center gap-1">
                <Camera size={16} className="text-muted" />
                <span className="text-2xs text-muted">
                  Tap to attach site photo evidence
                </span>
                <div className="flex gap-2 mt-0.5">
                  <div className="w-8 h-6 rounded bg-accent/15 border border-accent/20" />
                  <div className="w-8 h-6 rounded bg-success/15 border border-success/20" />
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                id="dpr-submit"
                className="w-full bg-accent hover:bg-accent-dark text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus size={13} />
                Save & Submit for Certification
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
