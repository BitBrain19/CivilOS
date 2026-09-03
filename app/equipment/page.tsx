'use client';

import { useState } from 'react';
import { useProject } from '@/lib/context';
import { getEquipmentByProject, equipmentLog, EquipmentEntry } from '@/data/equipment';
import {
  Truck,
  AlertTriangle,
  Clock,
  Fuel,
  Gauge,
  CheckCircle2,
  Filter,
  Plus,
  X,
  Play,
  Pause,
} from 'lucide-react';

export default function EquipmentPage() {
  const { activeProject } = useProject();
  const initialEquip = getEquipmentByProject(activeProject.id);
  const [equipmentList, setEquipmentList] = useState<EquipmentEntry[]>(initialEquip);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Equipment Form State
  const [eqName, setEqName] = useState('');
  const [eqMake, setEqMake] = useState('');
  const [operator, setOperator] = useState('');
  const [activity, setActivity] = useState('');
  const [status, setStatus] = useState<'active' | 'idle' | 'standby'>('active');

  const filtered = equipmentList.filter((e) => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  const totalIdleDays = equipmentList.reduce((acc, curr) => acc + curr.idleDaysThisMonth, 0);
  const activeCount = equipmentList.filter((e) => e.status === 'active').length;
  const idleCount = equipmentList.filter((e) => e.status === 'idle').length;
  const avgUtilization = Math.round(
    equipmentList.reduce((acc, curr) => acc + curr.utilizationPct, 0) / (equipmentList.length || 1)
  );

  const toggleStatus = (id: string) => {
    setEquipmentList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'active' ? 'idle' : 'active';
          return {
            ...item,
            status: nextStatus,
            utilizationPct: nextStatus === 'active' ? 75 : 0,
            hoursWorked: nextStatus === 'active' ? 6 : 0,
            hoursIdle: nextStatus === 'active' ? 2 : 8,
          };
        }
        return item;
      })
    );
    setToastMsg('Equipment operational state updated.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqName) return;

    const newEntry: EquipmentEntry = {
      id: `eq-${Date.now()}`,
      projectId: activeProject.id,
      equipmentId: `EQ-${Date.now().toString().slice(-4)}`,
      name: eqName,
      make: eqMake || 'Standard Make',
      operator: operator || 'Assigned Operator',
      date: new Date().toISOString().split('T')[0],
      checkIn: status === 'active' ? '08:00' : '—',
      checkOut: null,
      hoursWorked: status === 'active' ? 8 : 0,
      hoursIdle: status === 'active' ? 1 : 9,
      utilizationPct: status === 'active' ? 88 : 0,
      idleDaysThisMonth: status === 'idle' ? 1 : 0,
      status: status,
      activity: activity || 'Site civil works',
      fuelConsumed: status === 'active' ? 25 : 0,
      remarks: 'Added to live machinery roster.',
    };

    setEquipmentList([newEntry, ...equipmentList]);
    setIsModalOpen(false);
    setToastMsg(`${newEntry.name} successfully registered in fleet roster.`);
    setEqName('');
    setEqMake('');
    setOperator('');
    setActivity('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Header action banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <h2 className="text-base font-semibold text-ink">Heavy Plant & Equipment Log</h2>
          <p className="text-xs text-muted mt-0.5">
            Machinery check-in/out, runtime hours, diesel consumption, and idle asset variance alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            id="register-equipment"
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={14} />
            Register / Log Plant
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Active Fleet Assets</span>
            <Truck size={16} className="text-accent" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">{activeCount} Running</div>
          <div className="text-2xs text-muted mt-1">Out of {equipmentList.length} total machinery on site</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Average Utilization</span>
            <Gauge size={16} className="text-muted" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">{avgUtilization}%</div>
          <div className="text-2xs text-muted mt-1">Target benchmark &ge; 75% runtime</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rust/30 shadow-sm-warm bg-rust/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rust font-medium">Idle Plant Warning</span>
            <AlertTriangle size={16} className="text-rust" />
          </div>
          <div className="text-2xl font-semibold text-rust mt-2">{idleCount} Assets Idle</div>
          <div className="text-2xs text-muted mt-1">{totalIdleDays} cumulative idle days this month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Diesel Consumed Today</span>
            <Fuel size={16} className="text-muted" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">
            {equipmentList.reduce((acc, curr) => acc + curr.fuelConsumed, 0)} L
          </div>
          <div className="text-2xs text-muted mt-1">HSD logged via fuel indent book</div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        {/* Table filter bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface/40">
          <div className="text-xs font-semibold text-ink">Plant & Machinery Operations Sheet</div>
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-muted" />
            <span className="text-2xs text-muted uppercase tracking-wider">Filter:</span>
            <div className="flex gap-1">
              {[
                { id: 'all', label: 'All Equipment' },
                { id: 'active', label: 'Active Working' },
                { id: 'idle', label: 'Idle / Flagged' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`text-2xs px-2.5 py-1 rounded-md transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-accent text-white font-medium'
                      : 'text-muted hover:bg-surface border border-transparent'
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
                <th>Plant ID</th>
                <th>Equipment Name & Model</th>
                <th>Operator</th>
                <th>Check In / Out</th>
                <th className="text-right">Worked (Hrs)</th>
                <th className="text-right">Utilization</th>
                <th className="text-right">Idle Days (Mo)</th>
                <th className="text-right">Diesel (L)</th>
                <th>Status</th>
                <th>Assigned Task & Remarks</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isIdle = item.status === 'idle';
                const hasHighIdleDays = item.idleDaysThisMonth >= 5;

                return (
                  <tr key={item.id} className={isIdle ? 'bg-rust/[0.03]' : ''}>
                    <td className="font-mono text-2xs text-accent font-semibold">{item.equipmentId}</td>
                    <td>
                      <div className="font-medium text-ink">{item.name}</div>
                      <div className="text-2xs text-muted">{item.make}</div>
                    </td>
                    <td className="text-2xs text-ink font-medium">{item.operator}</td>
                    <td className="text-2xs text-muted tabular-nums">
                      {item.checkIn} {item.checkOut ? `→ ${item.checkOut}` : '→ Active'}
                    </td>
                    <td className="text-right tabular-nums font-semibold text-ink">
                      {item.hoursWorked} hrs
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-surface rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.utilizationPct >= 75
                                ? 'bg-success'
                                : item.utilizationPct > 0
                                ? 'bg-rust'
                                : 'bg-border-strong'
                            }`}
                            style={{ width: `${item.utilizationPct}%` }}
                          />
                        </div>
                        <span className="text-2xs font-medium tabular-nums">{item.utilizationPct}%</span>
                      </div>
                    </td>
                    <td className="text-right tabular-nums">
                      <span
                        className={`font-medium ${
                          hasHighIdleDays ? 'text-rust font-semibold flex items-center justify-end gap-1' : 'text-muted'
                        }`}
                      >
                        {hasHighIdleDays && <AlertTriangle size={12} />}
                        {item.idleDaysThisMonth} days
                      </span>
                    </td>
                    <td className="text-right tabular-nums text-muted">{item.fuelConsumed} L</td>
                    <td>
                      {item.status === 'active' && <span className="badge badge-success">Running</span>}
                      {item.status === 'idle' && (
                        <span className="badge badge-rust flex items-center gap-1">
                          <AlertTriangle size={10} /> Idle Alert
                        </span>
                      )}
                      {item.status === 'standby' && <span className="badge badge-muted">Standby</span>}
                    </td>
                    <td className="max-w-xs">
                      <div className="text-xs text-ink font-medium truncate">{item.activity}</div>
                      <div className="text-2xs text-muted italic truncate">{item.remarks}</div>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        title={isIdle ? 'Mark as Running' : 'Mark as Idle'}
                        className={`p-1.5 rounded-md border text-2xs transition-colors ${
                          isIdle
                            ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                            : 'bg-surface text-muted border-border hover:bg-rust/10 hover:text-rust hover:border-rust/30'
                        }`}
                      >
                        {isIdle ? <Play size={12} /> : <Pause size={12} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Plant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 bg-ink text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-accent-light" />
                <h3 className="text-sm font-semibold">Register Plant / Machinery</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEquipment} className="p-6 space-y-4">
              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Equipment / Asset Name *
                </label>
                <input
                  type="text"
                  required
                  value={eqName}
                  onChange={(e) => setEqName(e.target.value)}
                  placeholder="e.g. Concrete Pump 36m Boom"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Make / Manufacturer
                  </label>
                  <input
                    type="text"
                    value={eqMake}
                    onChange={(e) => setEqMake(e.target.value)}
                    placeholder="e.g. Putzmeister / Sany"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Assigned Operator
                  </label>
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    placeholder="e.g. Prem Bahadur KC"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="active">Active Working</option>
                    <option value="idle">Idle / Standby</option>
                  </select>
                </div>
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                    Fuel Log (Liters)
                  </label>
                  <input
                    type="number"
                    defaultValue="20"
                    className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Activity Assignment
                </label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. Roof casting concrete pumping"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-equipment-form"
                  className="bg-accent hover:bg-accent-dark text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Save to Machinery Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
