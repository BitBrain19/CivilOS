"use client";

import { useState } from "react";
import { useProject } from "@/lib/context";
import { getDPRByProject } from "@/data/dpr";
import { getBOQByProject } from "@/data/boq";
import {
  Smartphone,
  MapPin,
  Camera,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";

export default function DPRPage() {
  const { activeProject } = useProject();
  const allEntries = getDPRByProject(activeProject.id);
  const boqItems = getBOQByProject(activeProject.id);

  const [selectedBOQ, setSelectedBOQ] = useState(boqItems[3]?.id ?? "");
  const [quantity, setQuantity] = useState("");
  const [gang, setGang] = useState("Ram Bahadur Naike's Mason Gang");
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedItem = boqItems.find((b) => b.id === selectedBOQ);

  const todayEntries = allEntries.filter((e) => e.date === "2024-10-01");
  const prevEntries = allEntries.filter((e) => e.date !== "2024-10-01");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setQuantity("");
    setRemarks("");
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
      {/* Left: context / today's log */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink">
                Today&apos;s Site Log
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Tuesday, 1 October 2024
              </p>
            </div>
            <span className="badge badge-accent">
              {todayEntries.length} entries
            </span>
          </div>

          {todayEntries.length > 0 ? (
            <div className="divide-y divide-border">
              {todayEntries.map((entry) => (
                <div key={entry.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink">
                        {entry.boqItemDesc}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {entry.gang}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-ink">
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
                          Pending
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
                  </div>
                  {entry.remarks && (
                    <div className="mt-2 text-xs text-muted bg-surface rounded px-2.5 py-1.5 italic">
                      {entry.remarks}
                    </div>
                  )}
                  {/* Photo placeholder */}
                  <div className="mt-3 flex gap-2">
                    <div className="w-16 h-12 rounded-md bg-surface border border-border flex items-center justify-center">
                      <Camera size={14} className="text-muted" />
                    </div>
                    <div className="w-16 h-12 rounded-md bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center">
                      <span className="text-2xs text-accent font-medium">
                        Site Photo
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted text-sm">
              No entries yet today
            </div>
          )}
        </div>

        {/* Previous day entries */}
        {prevEntries.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                30 September 2024 — Certified
              </h3>
            </div>
            <div className="divide-y divide-border">
              {prevEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      size={14}
                      className="text-success flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs font-medium text-ink">
                        {entry.boqItemDesc}
                      </div>
                      <div className="text-2xs text-muted">{entry.gang}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-ink">
                      {entry.quantityToday} {entry.unit}
                    </div>
                    {entry.mbRef && (
                      <div className="text-2xs text-accent mt-0.5">
                        {entry.mbRef}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Mobile-styled DPR form */}
      <div className="flex-shrink-0 flex self-start justify-center lg:justify-start">
        <div className="w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-lg-warm">
          {/* Phone status bar */}
          <div className="bg-ink px-4 pt-3 pb-1 flex justify-between items-center">
            <span className="text-white/50 text-2xs">9:41</span>
            <div className="flex items-center gap-2">
              <Smartphone size={10} className="text-white/30" />
              <span className="text-white/30 text-2xs">CivilOS Field</span>
            </div>
          </div>

          {/* App header */}
          <div className="bg-accent px-4 py-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-2xs font-bold">PS</span>
            </div>
            <div>
              <div className="text-white text-xs font-medium">
                Daily Progress Entry
              </div>
              <div className="text-white/60 text-2xs">
                Shantinagar Residency
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-base p-4 space-y-3">
            {submitted && (
              <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/20 rounded-lg px-3 py-2">
                <CheckCircle2 size={13} />
                Entry saved and submitted for certification
              </div>
            )}

            <div>
              <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                BOQ Activity
              </label>
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
            </div>

            {selectedItem && (
              <div className="bg-accent/8 border border-accent/15 rounded-lg px-3 py-2 flex justify-between text-2xs">
                <span className="text-muted">Remaining qty</span>
                <span className="font-semibold text-accent">
                  {(selectedItem.quantity - selectedItem.completedQty).toFixed(
                    1,
                  )}{" "}
                  {selectedItem.unit}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Qty Today
                </label>
                <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-2 text-ink focus:outline-none"
                    placeholder="0.00"
                  />
                  <span className="px-2 text-2xs text-muted border-l border-border bg-surface">
                    {selectedItem?.unit}
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
                  <option>Ram Bahadur Naike&apos;s Mason Gang</option>
                  <option>Hari Tamang&apos;s Bar Benders</option>
                  <option>Mohan Carpenter Gang</option>
                  <option>Excavation Gang — Sita Rai</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-white text-ink focus:outline-none resize-none"
                placeholder="Describe work done, any issues..."
              />
            </div>

            {/* Geotag display */}
            <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border">
              <MapPin size={12} className="text-success flex-shrink-0" />
              <div>
                <div className="text-2xs text-ink">27.7041° N, 85.3381° E</div>
                <div className="text-2xs text-muted">
                  Shantinagar, Kathmandu · GPS confirmed
                </div>
              </div>
            </div>

            {/* Photo attach */}
            <div className="border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center gap-1.5">
              <Camera size={18} className="text-muted" />
              <span className="text-2xs text-muted">
                Tap to attach site photo
              </span>
              <div className="flex gap-2 mt-1">
                <div className="w-10 h-8 rounded bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20" />
                <div className="w-10 h-8 rounded bg-gradient-to-br from-success/20 to-success/10 border border-success/20" />
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1.5 text-2xs text-muted">
              <Clock size={10} />
              <span>Auto-timestamped: 1 Oct 2024, 15:30 NPT</span>
            </div>

            <button
              onClick={handleSubmit}
              id="dpr-submit"
              className="w-full bg-accent hover:bg-accent-dark text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={13} />
              Save & Submit for Certification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
