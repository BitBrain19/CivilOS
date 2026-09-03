"use client";

import { useState } from "react";
import { useProject } from "@/lib/context";
import {
  getMaterialsByProject,
  grnEntries,
  MaterialRow,
  GRNEntry,
} from "@/data/materials";
import {
  Package,
  Plus,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";

export default function MaterialsPage() {
  const { activeProject } = useProject();
  const initialMaterials = getMaterialsByProject(activeProject.id);
  const [materials, setMaterials] = useState<MaterialRow[]>(initialMaterials);
  const [grnList, setGrnList] = useState<GRNEntry[]>(
    grnEntries.filter((g) => g.projectId === activeProject.id),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isGRNModalOpen, setIsGRNModalOpen] = useState(false);
  const [grnSuccessMsg, setGrnSuccessMsg] = useState("");

  // Form state for GRN Modal
  const [supplier, setSupplier] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [selectedMaterialCode, setSelectedMaterialCode] = useState("CEM-43");
  const [receivedQty, setReceivedQty] = useState("");
  const [unitRate, setUnitRate] = useState("");
  const [remarks, setRemarks] = useState("");

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.materialCode.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "over-consumed")
      return matchesSearch && m.status === "over-consumed";
    if (filterStatus === "low-stock")
      return matchesSearch && m.status === "low-stock";
    return matchesSearch;
  });

  const totalVarianceCost = materials.reduce((acc, curr) => {
    // Estimating cost of variance
    const rateApprox = curr.materialCode.includes("CEM")
      ? 820
      : curr.materialCode.includes("TMT")
        ? 115
        : 2000;
    return acc + (curr.variance > 0 ? curr.variance * rateApprox : 0);
  }, 0);

  const handleCreateGRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivedQty || !supplier) return;

    const targetMat = materials.find(
      (m) => m.materialCode === selectedMaterialCode,
    );
    const qtyNum = parseFloat(receivedQty);
    const rateNum =
      parseFloat(unitRate) || (selectedMaterialCode === "CEM-43" ? 820 : 115);

    const newGRN: GRNEntry = {
      id: `grn-${Date.now()}`,
      projectId: activeProject.id,
      grnNo: `GRN-${activeProject.code}-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      supplier,
      vehicleNo: vehicleNo || "Ba 2 Kha 9921",
      materialCode: selectedMaterialCode,
      material: targetMat?.material || "Material Stock",
      unit: targetMat?.unit || "units",
      orderedQty: qtyNum,
      receivedQty: qtyNum,
      rate: rateNum,
      amount: qtyNum * rateNum,
      receivedBy: "Prashant Shrestha (Site Engineer)",
      remarks:
        remarks || "Received in good condition and verified at site yard.",
    };

    setGrnList([newGRN, ...grnList]);

    // Update material ledger received & closing
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.materialCode === selectedMaterialCode) {
          const updatedRec = m.received + qtyNum;
          const updatedClosing = m.openingStock + updatedRec - m.consumed;
          return {
            ...m,
            received: updatedRec,
            closingStock: updatedClosing,
            status:
              updatedClosing < 300 && m.materialCode.includes("CEM")
                ? "low-stock"
                : m.variance > 200
                  ? "over-consumed"
                  : "ok",
          };
        }
        return m;
      }),
    );

    setIsGRNModalOpen(false);
    setGrnSuccessMsg(
      `GRN #${newGRN.grnNo} recorded successfully! Stock ledger updated.`,
    );
    setSupplier("");
    setVehicleNo("");
    setReceivedQty("");
    setUnitRate("");
    setRemarks("");
    setTimeout(() => setGrnSuccessMsg(""), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Header action banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Material Stock & Consumption Ledger
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Auto-reconciled material balance, site consumption variance, and
            Goods Received Notes (GRN)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGRNModalOpen(true)}
            id="open-grn-modal"
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={14} />
            Receive Stock (New GRN)
          </button>
        </div>
      </div>

      {grnSuccessMsg && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} />
          <span>{grnSuccessMsg}</span>
        </div>
      )}

      {/* Summary KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">
              Tracked Materials
            </span>
            <Package size={16} className="text-muted" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">
            {materials.length} Items
          </div>
          <div className="text-2xs text-muted mt-1">
            Across civil, structural & finishing
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rust/30 shadow-sm-warm bg-rust/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rust font-medium">
              Excess Consumption Alert
            </span>
            <AlertTriangle size={16} className="text-rust" />
          </div>
          <div className="text-2xl font-semibold text-rust mt-2">
            ₨ {totalVarianceCost.toLocaleString()}
          </div>
          <div className="text-2xs text-muted mt-1">
            Over-consumption cost impact on cement & steel
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">
              Recent GRN Entries
            </span>
            <FileCheck size={16} className="text-accent" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">
            {grnList.length} Notes
          </div>
          <div className="text-2xs text-muted mt-1">
            Direct from registered vendors
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        {/* Table toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface/40">
          <div className="flex items-center gap-2 w-full sm:w-72">
            <div className="relative w-full">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search material or code..."
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-border rounded-md bg-white text-ink placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter size={13} className="text-muted" />
            <span className="text-2xs text-muted uppercase tracking-wider">
              Status:
            </span>
            <div className="flex gap-1">
              {[
                { id: "all", label: "All Items" },
                { id: "over-consumed", label: "Over-Consumed" },
                { id: "low-stock", label: "Low Stock" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`text-2xs px-2.5 py-1 rounded-md transition-colors ${
                    filterStatus === tab.id
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
                <th>Code</th>
                <th>Material Description</th>
                <th>Unit</th>
                <th className="text-right">Opening</th>
                <th className="text-right">Received</th>
                <th className="text-right">Consumed</th>
                <th className="text-right">Closing</th>
                <th className="text-right">Est. Consumed</th>
                <th className="text-right">Variance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((row) => {
                const isOver = row.status === "over-consumed";
                const isLow = row.status === "low-stock";

                return (
                  <tr
                    key={row.id}
                    className={`${isOver ? "bg-rust/[0.04]" : isLow ? "bg-critical/[0.02]" : ""}`}
                  >
                    <td className="font-mono text-2xs text-muted font-medium">
                      {row.materialCode}
                    </td>
                    <td className="font-medium text-ink">
                      <div className="flex items-center gap-1.5">
                        <span>{row.material}</span>
                        {isOver && (
                          <span
                            title="Over estimated theoretical consumption!"
                            className="inline-flex items-center gap-0.5 text-rust text-2xs font-semibold"
                          >
                            <AlertTriangle size={12} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-muted text-2xs">{row.unit}</td>
                    <td className="text-right tabular-nums text-muted">
                      {row.openingStock.toLocaleString()}
                    </td>
                    <td className="text-right tabular-nums text-ink font-medium">
                      <span className="text-accent flex items-center justify-end gap-0.5">
                        <ArrowDownRight size={12} />
                        {row.received.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-right tabular-nums text-ink font-medium">
                      <span className="flex items-center justify-end gap-0.5">
                        <ArrowUpRight size={12} className="text-muted" />
                        {row.consumed.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-right tabular-nums font-semibold text-ink bg-surface/50">
                      {row.closingStock.toLocaleString()}
                    </td>
                    <td className="text-right tabular-nums text-muted">
                      {row.estimatedConsumption.toLocaleString()}
                    </td>
                    <td className="text-right tabular-nums">
                      <span
                        className={`font-medium ${
                          row.variance > 0
                            ? "text-rust font-semibold"
                            : row.variance < 0
                              ? "text-success"
                              : "text-muted"
                        }`}
                      >
                        {row.variance > 0
                          ? `+${row.variance.toLocaleString()}`
                          : row.variance.toLocaleString()}
                        <span className="text-2xs opacity-75 ml-1">
                          (
                          {row.variancePct > 0
                            ? `+${row.variancePct}%`
                            : `${row.variancePct}%`}
                          )
                        </span>
                      </span>
                    </td>
                    <td>
                      {row.status === "over-consumed" && (
                        <span className="badge badge-rust flex items-center gap-1">
                          <AlertTriangle size={10} /> Over-Consumed
                        </span>
                      )}
                      {row.status === "low-stock" && (
                        <span className="badge badge-critical flex items-center gap-1">
                          <AlertTriangle size={10} /> Low Stock
                        </span>
                      )}
                      {row.status === "ok" && (
                        <span className="badge badge-success">Normal</span>
                      )}
                      {row.status === "normal" && (
                        <span className="badge badge-muted">Adequate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goods Received Notes Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Recent Goods Received Notes (GRN)
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Verified gate entries and delivery challans
            </p>
          </div>
          <span className="text-2xs text-muted">
            Showing {grnList.length} recent delivery receipts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>GRN No</th>
                <th>Date</th>
                <th>Supplier / Vendor</th>
                <th>Vehicle No</th>
                <th>Item & Qty Received</th>
                <th className="text-right">Rate (NPR)</th>
                <th className="text-right">Total Amount</th>
                <th>Received By</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {grnList.map((grn) => (
                <tr key={grn.id}>
                  <td className="font-mono text-2xs text-accent font-semibold">
                    {grn.grnNo}
                  </td>
                  <td className="text-2xs text-muted whitespace-nowrap">
                    {grn.date}
                  </td>
                  <td className="font-medium text-ink">{grn.supplier}</td>
                  <td className="font-mono text-2xs text-muted">
                    {grn.vehicleNo}
                  </td>
                  <td>
                    <span className="font-semibold text-ink">
                      {grn.receivedQty.toLocaleString()} {grn.unit}
                    </span>
                    <span className="text-2xs text-muted ml-1">
                      ({grn.material})
                    </span>
                  </td>
                  <td className="text-right tabular-nums text-muted">
                    ₨ {grn.rate.toLocaleString()}
                  </td>
                  <td className="text-right tabular-nums font-semibold text-ink">
                    ₨ {grn.amount.toLocaleString()}
                  </td>
                  <td className="text-2xs text-muted">{grn.receivedBy}</td>
                  <td className="text-2xs text-muted italic max-w-xs truncate">
                    {grn.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRN Modal */}
      {isGRNModalOpen && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 bg-ink text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-accent-light" />
                <h3 className="text-sm font-semibold">
                  New Goods Received Note (GRN)
                </h3>
              </div>
              <button
                onClick={() => setIsGRNModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGRN} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Material Item *
                  </label>
                  <select
                    value={selectedMaterialCode}
                    onChange={(e) => setSelectedMaterialCode(e.target.value)}
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {materials.map((m) => (
                      <option key={m.id} value={m.materialCode}>
                        {m.materialCode} — {m.material} ({m.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Received Qty *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={receivedQty}
                    onChange={(e) => setReceivedQty(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Supplier / Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="e.g. Shivam Cements / Balaju Yard"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="e.g. Ba 3 Kha 1209"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Unit Rate (NPR)
                  </label>
                  <input
                    type="number"
                    value={unitRate}
                    onChange={(e) => setUnitRate(e.target.value)}
                    placeholder="e.g. 820"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Gate Inspector / Receiver
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Prashant Shrestha (Site Eng.)"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-surface text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Challan & Quality Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Verified 50kg bag weights, test certs checked, unloaded at Site Shed A"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsGRNModalOpen(false)}
                  className="px-4 py-2 text-xs text-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-grn-button"
                  className="bg-accent hover:bg-accent-dark text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Confirm & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
