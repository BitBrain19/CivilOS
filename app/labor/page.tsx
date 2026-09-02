'use client';

import { useState } from 'react';
import { useProject } from '@/lib/context';
import { getLaborByProject, laborGangs, LaborGang } from '@/data/labor';
import {
  Users,
  HardHat,
  UserCheck,
  UserX,
  Plus,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export default function LaborPage() {
  const { activeProject } = useProject();
  const initialGangs = getLaborByProject(activeProject.id);
  const [gangs, setGangs] = useState<LaborGang[]>(initialGangs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // New Gang form state
  const [naikeName, setNaikeName] = useState('');
  const [gangName, setGangName] = useState('');
  const [masonCount, setMasonCount] = useState('4');
  const [helperCount, setHelperCount] = useState('6');
  const [barBenderCount, setBarBenderCount] = useState('0');
  const [activity, setActivity] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [remarks, setRemarks] = useState('');

  const totalHeadcount = gangs.reduce((sum, g) => sum + g.totalStrength, 0);
  const totalPresent = gangs.reduce((sum, g) => sum + g.presentToday, 0);
  const totalAbsent = totalHeadcount - totalPresent;
  const attendanceRate = totalHeadcount > 0 ? Math.round((totalPresent / totalHeadcount) * 100) : 0;

  const handleAddGang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naikeName || !activity) return;

    const mCount = parseInt(masonCount) || 0;
    const hCount = parseInt(helperCount) || 0;
    const bCount = parseInt(barBenderCount) || 0;
    const total = mCount + hCount + bCount;

    const newGang: LaborGang = {
      id: `lg-${Date.now()}`,
      projectId: activeProject.id,
      naikeName,
      gangName: gangName || `${naikeName}'s Gang`,
      trades: [
        ...(mCount > 0 ? [{ trade: 'Mason', count: mCount, present: mCount }] : []),
        ...(hCount > 0 ? [{ trade: 'Helper / Bharat', count: hCount, present: hCount }] : []),
        ...(bCount > 0 ? [{ trade: 'Bar-bender', count: bCount, present: bCount }] : []),
      ],
      totalStrength: total,
      presentToday: total,
      assignedActivity: activity,
      boqItemId: 'b1-custom',
      workLocation: workLocation || 'Main Structure',
      date: new Date().toISOString().split('T')[0],
      remarks: remarks || 'Gangs deployed as scheduled.',
    };

    setGangs([...gangs, newGang]);
    setIsModalOpen(false);
    setSuccessMsg(`Gang "${newGang.gangName}" successfully registered for today's shift.`);
    setNaikeName('');
    setGangName('');
    setActivity('');
    setWorkLocation('');
    setRemarks('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header action banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <h2 className="text-base font-semibold text-ink">Labor Gangs & Daily Manpower Deployment</h2>
          <p className="text-xs text-muted mt-0.5">
            Naike master roll, trade distribution, site attendance, and specific BOQ activity assignments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            id="log-new-gang"
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={14} />
            Deploy / Add Gang
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Labor metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Total Registered Force</span>
            <Users size={16} className="text-muted" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">{totalHeadcount} Workers</div>
          <div className="text-2xs text-muted mt-1">{gangs.length} Active Contractor Gangs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-success font-medium">Present on Site Today</span>
            <UserCheck size={16} className="text-success" />
          </div>
          <div className="text-2xl font-semibold text-success mt-2">{totalPresent} Workers</div>
          <div className="text-2xs text-muted mt-1">{attendanceRate}% Overall Attendance</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rust font-medium">Absentees / Shortfall</span>
            <UserX size={16} className="text-rust" />
          </div>
          <div className="text-2xl font-semibold text-rust mt-2">{totalAbsent} Absent</div>
          <div className="text-2xs text-muted mt-1">Reported by site Naikes at muster</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-accent font-medium">Shift Date</span>
            <Calendar size={16} className="text-accent" />
          </div>
          <div className="text-base font-semibold text-ink mt-2">Tuesday, 01 Oct 2024</div>
          <div className="text-2xs text-muted mt-1">Day shift: 07:30 to 17:30 NPT</div>
        </div>
      </div>

      {/* Gang Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {gangs.map((gang) => {
          const gangAttPct = Math.round((gang.presentToday / gang.totalStrength) * 100);
          const hasAbsence = gang.presentToday < gang.totalStrength;

          return (
            <div
              key={gang.id}
              className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="p-4 border-b border-border bg-surface/30 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-semibold text-xs">
                      <HardHat size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-ink leading-tight">{gang.gangName}</h3>
                      <div className="text-2xs text-muted mt-0.5">Naike: {gang.naikeName}</div>
                    </div>
                  </div>
                  <span
                    className={`badge text-2xs ${
                      gangAttPct === 100 ? 'badge-success' : gangAttPct >= 80 ? 'badge-rust' : 'badge-critical'
                    }`}
                  >
                    {gang.presentToday}/{gang.totalStrength} ({gangAttPct}%)
                  </span>
                </div>

                {/* Trade breakdown badges */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-2xs font-medium text-muted uppercase tracking-wider mb-1.5">
                      Trades & Headcount
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {gang.trades.map((t) => (
                        <div
                          key={t.trade}
                          className="bg-surface border border-border rounded px-2 py-1 text-2xs flex items-center gap-1 text-ink"
                        >
                          <span className="text-muted">{t.trade}:</span>
                          <span className="font-semibold">{t.present}</span>
                          {t.present < t.count && (
                            <span className="text-critical text-2xs">({t.count - t.present} absent)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity assignment */}
                  <div className="pt-2 border-t border-border/60">
                    <div className="text-2xs font-medium text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Briefcase size={10} /> Assigned Task
                    </div>
                    <div className="text-xs font-medium text-ink">{gang.assignedActivity}</div>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="text-2xs font-medium text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin size={10} /> Work Zone
                    </div>
                    <div className="text-2xs text-ink bg-surface/60 rounded px-2 py-1 inline-block">
                      {gang.workLocation}
                    </div>
                  </div>

                  {/* Remarks */}
                  {gang.remarks && (
                    <div className="text-2xs text-muted italic bg-surface/40 p-2 rounded border border-border/40">
                      &ldquo;{gang.remarks}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom footer status */}
              <div className="px-4 py-2.5 bg-surface/50 border-t border-border flex items-center justify-between text-2xs text-muted">
                <span>Verified by Site Supervisor</span>
                {hasAbsence ? (
                  <span className="flex items-center gap-1 text-rust font-medium">
                    <AlertCircle size={11} /> Short-staffed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-success font-medium">
                    <CheckCircle2 size={11} /> Full strength
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Gang Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 bg-ink text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-accent-light" />
                <h3 className="text-sm font-semibold">Deploy / Register Labor Gang</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGang} className="p-6 space-y-4">
              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Naike (Gang Leader) Name *
                </label>
                <input
                  type="text"
                  required
                  value={naikeName}
                  onChange={(e) => setNaikeName(e.target.value)}
                  placeholder="e.g. Shyam Lal Chaudhary"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Gang Title / Designation
                </label>
                <input
                  type="text"
                  value={gangName}
                  onChange={(e) => setGangName(e.target.value)}
                  placeholder="e.g. Plastering Specialist Team"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">Masons</label>
                  <input
                    type="number"
                    min="0"
                    value={masonCount}
                    onChange={(e) => setMasonCount(e.target.value)}
                    className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">Helpers</label>
                  <input
                    type="number"
                    min="0"
                    value={helperCount}
                    onChange={(e) => setHelperCount(e.target.value)}
                    className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">Bar-benders</label>
                  <input
                    type="number"
                    min="0"
                    value={barBenderCount}
                    onChange={(e) => setBarBenderCount(e.target.value)}
                    className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Assigned Activity *
                </label>
                <input
                  type="text"
                  required
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. 4th Floor Brick Masonry & Lintel Casting"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Location / Grid
                </label>
                <input
                  type="text"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  placeholder="e.g. 4th Floor Grid C-F"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-2xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Notes / Attendance Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Safety helmets issued, scaffolding verified"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-accent resize-none"
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
                  id="submit-gang-form"
                  className="bg-accent hover:bg-accent-dark text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Confirm & Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
