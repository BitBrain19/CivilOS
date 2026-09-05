"use client";

import { useState, useEffect } from "react";
import { useProject } from "@/lib/context";
import { getBOQByProject, BOQItem } from "@/data/boq";
import { getLaborByProject } from "@/data/labor";
import {
  DailyAssignment,
  AssignedActivity,
  getAssignmentByProjectAndDate,
  getAssignmentsHistoryByProject,
} from "@/data/assignments";
import {
  CalendarCheck,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  History,
  AlertCircle,
  FileCheck2,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function DailyAssignmentPage() {
  const { activeProject, assignments, publishAssignment } = useProject();
  const boqItems = getBOQByProject(activeProject.id);
  const laborGangs = getLaborByProject(activeProject.id);

  // Fallback gangs for projects that don't have dedicated labor log entries
  const availableGangs =
    laborGangs.length > 0
      ? laborGangs.map((g) => g.gangName)
      : [
          "Core Wall Specialist Gang",
          "Façade Specialist Gang",
          "General Finishing Gang",
          "Steel Reinforcement Crew",
        ];

  const [selectedDate, setSelectedDate] = useState("2024-10-01");
  const [toastMsg, setToastMsg] = useState("");

  // Local state of assigned activities for the selected date
  const [currentActivities, setCurrentActivities] = useState<AssignedActivity[]>([]);

  // Sync with published assignment whenever activeProject or selectedDate changes
  useEffect(() => {
    const existing = getAssignmentByProjectAndDate(assignments, activeProject.id, selectedDate);
    if (existing) {
      setCurrentActivities([...existing.activities]);
    } else {
      setCurrentActivities([]);
    }
  }, [assignments, activeProject.id, selectedDate]);

  const existingAssignment = getAssignmentByProjectAndDate(
    assignments,
    activeProject.id,
    selectedDate
  );
  const historyAssignments = getAssignmentsHistoryByProject(assignments, activeProject.id);

  const isAssigned = (boqItemId: string) =>
    currentActivities.some((a) => a.boqItemId === boqItemId);

  const getActivityData = (boqItemId: string): AssignedActivity => {
    return (
      currentActivities.find((a) => a.boqItemId === boqItemId) || {
        boqItemId,
        assignedGang: availableGangs[0] || "",
        locationChainage: "",
        targetQty: undefined,
        notes: "",
      }
    );
  };

  const handleToggleActivity = (boqItem: BOQItem) => {
    if (isAssigned(boqItem.id)) {
      setCurrentActivities((prev) => prev.filter((a) => a.boqItemId !== boqItem.id));
    } else {
      // Default location heuristic based on project
      const defaultLoc =
        activeProject.type === "bridge"
          ? "Abutment Ch 0+150"
          : "6th Floor, Work Zone A";

      setCurrentActivities((prev) => [
        ...prev,
        {
          boqItemId: boqItem.id,
          assignedGang: availableGangs[0] || "",
          locationChainage: defaultLoc,
          targetQty: undefined,
          notes: "",
        },
      ]);
    }
  };

  const handleUpdateActivityField = (
    boqItemId: string,
    field: keyof AssignedActivity,
    value: string | number
  ) => {
    setCurrentActivities((prev) =>
      prev.map((item) => {
        if (item.boqItemId === boqItemId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handlePublish = () => {
    if (currentActivities.length === 0) {
      alert("Please mark at least one BOQ activity before publishing.");
      return;
    }

    const newAssignment: DailyAssignment = {
      id: `asgn-${activeProject.id}-${selectedDate.replace(/-/g, "")}`,
      projectId: activeProject.id,
      date: selectedDate,
      status: "published",
      publishedBy: "Pushkar Jha (Project Manager)",
      publishedAt: new Date().toISOString(),
      activities: currentActivities,
    };

    publishAssignment(newAssignment);
    setToastMsg(
      `Daily work assignment for ${selectedDate} published successfully! DPR entries on site will now enforce these ${currentActivities.length} assigned activities.`
    );
    setTimeout(() => setToastMsg(""), 4500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Top Banner with Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-ink">
              Daily Work Assignment (Site Work Order)
            </h2>
            <span className="badge badge-accent">Supervisor / PM View</span>
          </div>
          <p className="text-xs text-muted mt-1">
            Pre-assign today&apos;s approved BOQ activities, designated labor gangs, and target locations before site engineers log DPR entries.
          </p>
        </div>

        {/* Date Selector & Publish Action */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5">
            <Calendar size={14} className="text-accent flex-shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-medium text-ink focus:outline-none"
            />
          </div>

          <button
            onClick={handlePublish}
            id="publish-assignment-btn"
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Send size={13} />
            Publish for {selectedDate === "2024-10-01" ? "Today" : selectedDate}
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid: Activity Assignment Workspace + Sidebar Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Activity Selection Table / Checklist */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-surface/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  BOQ / WBS Activities for {activeProject.name}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Check activities approved for execution on{" "}
                  <span className="font-semibold text-ink">{selectedDate}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {existingAssignment ? (
                  <span className="badge badge-success flex items-center gap-1 text-2xs">
                    <CheckCircle2 size={11} /> Published on File
                  </span>
                ) : (
                  <span className="badge badge-rust flex items-center gap-1 text-2xs">
                    <Clock size={11} /> No Published Assignment
                  </span>
                )}
                <span className="badge badge-muted text-2xs">
                  {currentActivities.length} of {boqItems.length} selected
                </span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {boqItems.map((boq) => {
                const assigned = isAssigned(boq.id);
                const actData = getActivityData(boq.id);
                const remaining = (boq.quantity - boq.completedQty).toFixed(1);

                return (
                  <div
                    key={boq.id}
                    className={`p-4 transition-colors ${
                      assigned ? "bg-accent/[0.03]" : "hover:bg-surface/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={assigned}
                        onChange={() => handleToggleActivity(boq)}
                        id={`checkbox-${boq.id}`}
                        className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <label
                            htmlFor={`checkbox-${boq.id}`}
                            className="font-medium text-xs sm:text-sm text-ink cursor-pointer hover:text-accent"
                          >
                            <span className="font-mono text-accent mr-2">
                              {boq.itemNo}
                            </span>
                            {boq.description}
                          </label>
                          <div className="text-2xs text-muted">
                            Scope: <span className="font-mono">{boq.quantity} {boq.unit}</span> · Bal:{" "}
                            <span className="font-semibold text-ink font-mono">
                              {remaining} {boq.unit}
                            </span>
                          </div>
                        </div>

                        {/* Expanded details when assigned */}
                        {assigned && (
                          <div className="mt-3.5 pt-3 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface/50 p-3 rounded-lg">
                            {/* Labor Gang Selector */}
                            <div>
                              <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1 flex items-center gap-1">
                                <Users size={11} className="text-accent" /> Assigned Labor Gang
                              </label>
                              <select
                                value={actData.assignedGang || ""}
                                onChange={(e) =>
                                  handleUpdateActivityField(
                                    boq.id,
                                    "assignedGang",
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs border border-border rounded-md px-2.5 py-1.5 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                              >
                                {availableGangs.map((gangName) => (
                                  <option key={gangName} value={gangName}>
                                    {gangName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Location / Chainage Input */}
                            <div>
                              <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1 flex items-center gap-1">
                                <MapPin size={11} className="text-accent" /> Location / Chainage / Grid
                              </label>
                              <input
                                type="text"
                                value={actData.locationChainage || ""}
                                onChange={(e) =>
                                  handleUpdateActivityField(
                                    boq.id,
                                    "locationChainage",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. 6th Floor, Grid C6-C18"
                                className="w-full text-xs border border-border rounded-md px-2.5 py-1.5 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                            </div>

                            {/* Target Qty and Notes */}
                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                              <div>
                                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                                  Target Qty Today ({boq.unit})
                                </label>
                                <input
                                  type="number"
                                  value={actData.targetQty ?? ""}
                                  onChange={(e) =>
                                    handleUpdateActivityField(
                                      boq.id,
                                      "targetQty",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full text-xs border border-border rounded-md px-2 py-1 bg-white text-ink focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                                  Supervisor Notes / Spec Instructions
                                </label>
                                <input
                                  type="text"
                                  value={actData.notes || ""}
                                  onChange={(e) =>
                                    handleUpdateActivityField(
                                      boq.id,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. Slump test 120mm, check cover blocks before pour"
                                  className="w-full text-xs border border-border rounded-md px-2 py-1 bg-white text-ink focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 cols: Current Order Summary & Historical Feed */}
        <div className="lg:col-span-4 space-y-4">
          {/* Today's Published Summary Box */}
          <div className="bg-white rounded-xl border border-border shadow-sm-warm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 size={16} className="text-accent" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Assignment Status
                </h3>
              </div>
              <span className="text-xs font-mono text-muted">{selectedDate}</span>
            </div>

            {existingAssignment ? (
              <div className="space-y-3 pt-1">
                <div className="bg-success/10 border border-success/25 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-success text-xs font-semibold">
                    <CheckCircle2 size={13} /> Active Work Order Published
                  </div>
                  <div className="text-2xs text-muted mt-1">
                    Published by {existingAssignment.publishedBy} at{" "}
                    {new Date(existingAssignment.publishedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-1">
                  <div className="text-2xs uppercase text-muted font-medium tracking-wide">
                    Assigned for Field Logging:
                  </div>
                  {existingAssignment.activities.map((act) => {
                    const item = boqItems.find((b) => b.id === act.boqItemId);
                    return (
                      <div
                        key={act.boqItemId}
                        className="bg-surface rounded-md p-2 text-2xs flex flex-col gap-0.5"
                      >
                        <div className="font-semibold text-ink">
                          {item?.itemNo} — {item?.description}
                        </div>
                        {act.assignedGang && (
                          <div className="text-muted flex items-center gap-1">
                            <Users size={10} /> {act.assignedGang}
                          </div>
                        )}
                        {act.locationChainage && (
                          <div className="text-muted flex items-center gap-1">
                            <MapPin size={10} /> {act.locationChainage}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-rust/10 border border-rust/25 rounded-lg p-3 text-xs text-ink space-y-1">
                <div className="flex items-center gap-1 text-rust font-semibold">
                  <AlertCircle size={13} /> No Published Assignment
                </div>
                <p className="text-2xs text-muted">
                  Field staff logging DPR entries on this date will see a fallback to the open BOQ list, and all entries will be flagged with &ldquo;No assignment on file&rdquo;.
                </p>
              </div>
            )}
          </div>

          {/* Previous Assignments Feed (Audit Trail) */}
          <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border bg-surface/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={14} className="text-muted" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Recent Work Orders ({historyAssignments.length})
                </h3>
              </div>
              <span className="text-2xs text-muted">Last 7 Days</span>
            </div>

            <div className="divide-y divide-border">
              {historyAssignments.map((h) => {
                const isCurrent = h.date === selectedDate;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedDate(h.date)}
                    className={`w-full text-left p-3.5 transition-colors flex items-center justify-between gap-3 ${
                      isCurrent
                        ? "bg-accent/10 border-l-2 border-accent"
                        : "hover:bg-surface/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink font-mono">
                          {h.date}
                        </span>
                        {h.date === "2024-10-01" && (
                          <span className="badge badge-accent text-2xs">Today</span>
                        )}
                      </div>
                      <div className="text-2xs text-muted mt-0.5">
                        {h.activities.length} activities assigned · {h.publishedBy.split(" ")[0]}
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className={isCurrent ? "text-accent" : "text-muted/60"}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
