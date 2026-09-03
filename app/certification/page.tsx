'use client';

import { useState } from 'react';
import { useProject } from '@/lib/context';
import { getDPRByProject, DPREntry } from '@/data/dpr';
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
} from 'lucide-react';

export default function CertificationPage() {
  const { activeProject } = useProject();
  const initialEntries = getDPRByProject(activeProject.id);
  const [entries, setEntries] = useState<DPREntry[]>(initialEntries);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DPREntry | null>(null);

  const pendingEntries = entries.filter((e) => !e.certified);
  const certifiedEntries = entries.filter((e) => e.certified);

  const handleCertifySingle = (id: string) => {
    const target = entries.find((e) => e.id === id);
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            certified: true,
            certifiedBy: 'Er. Dipendra Shrestha (Site Engineer)',
            certifiedAt: new Date().toISOString(),
            mbRef: `MB-${activeProject.code}-${Date.now().toString().slice(-3)}`,
          };
        }
        return e;
      })
    );
    setToastMsg(`DPR Item "${target?.boqItemDesc}" certified and forwarded to Digital Measurement Book.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleCertifyAllPending = () => {
    if (pendingEntries.length === 0) return;
    setEntries((prev) =>
      prev.map((e) => {
        if (!e.certified) {
          return {
            ...e,
            certified: true,
            certifiedBy: 'Er. Dipendra Shrestha (Site Engineer)',
            certifiedAt: new Date().toISOString(),
            mbRef: `MB-${activeProject.code}-${Date.now().toString().slice(-3)}`,
          };
        }
        return e;
      })
    );
    setToastMsg(`All ${pendingEntries.length} pending site entries certified with engineer sign-off!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Header action banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-sm-warm">
        <div>
          <h2 className="text-base font-semibold text-ink">Engineer Certification & Quantity Sign-off</h2>
          <p className="text-xs text-muted mt-0.5">
            Verification workflow of site daily entries before locking quantities into the Digital Measurement Book (MB)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingEntries.length > 0 && (
            <button
              onClick={handleCertifyAllPending}
              id="certify-all-btn"
              className="flex items-center gap-2 bg-success hover:bg-success/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <CheckCheck size={15} />
              Certify All Pending ({pendingEntries.length})
            </button>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="flex items-center gap-2 text-success text-xs bg-success/10 border border-success/30 rounded-lg p-3 count-up">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rust/30 shadow-sm-warm bg-rust/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rust font-medium">Awaiting Site Verification</span>
            <Clock size={16} className="text-rust" />
          </div>
          <div className="text-2xl font-semibold text-rust mt-2">{pendingEntries.length} Entries</div>
          <div className="text-2xs text-muted mt-1">Requires physical dimension & photo validation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-success font-medium">Certified & Locked to MB</span>
            <Lock size={16} className="text-success" />
          </div>
          <div className="text-2xl font-semibold text-success mt-2">{certifiedEntries.length} Records</div>
          <div className="text-2xs text-muted mt-1">Signed by Er. Dipendra Shrestha (NEC Reg: 14209)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-sm-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Measurement Audit Trail</span>
            <ShieldCheck size={16} className="text-accent" />
          </div>
          <div className="text-2xl font-semibold text-ink mt-2">100% Verified</div>
          <div className="text-2xs text-muted mt-1">Geotagged & timestamped field evidence</div>
        </div>
      </div>

      {/* Queue 1: Awaiting Certification */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-surface/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rust animate-pulse" />
            <h3 className="text-sm font-semibold text-ink">Pending Engineer Approval Queue</h3>
          </div>
          <span className="badge badge-rust">{pendingEntries.length} items to certify</span>
        </div>

        {pendingEntries.length > 0 ? (
          <div className="divide-y divide-border">
            {pendingEntries.map((entry) => (
              <div key={entry.id} className="p-5 hover:bg-surface/20 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-ink">{entry.boqItemDesc}</span>
                      <span className="badge badge-muted text-2xs font-mono">{entry.id}</span>
                      <span className="badge badge-rust text-2xs">Pending Sign-off</span>
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
                        <span className="font-medium text-ink">Site Notes:</span> {entry.remarks}
                      </div>
                    )}

                    {/* Photo evidence preview */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-border rounded text-2xs text-muted">
                        <Camera size={12} />
                        <span>Site photo attached (Geotag verified)</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-border rounded text-2xs text-muted">
                        <Clock size={12} />
                        <span>Logged {new Date(entry.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Certify Button */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-ink">
                        {entry.quantityToday} <span className="text-xs font-normal text-muted">{entry.unit}</span>
                      </div>
                      <div className="text-2xs text-muted">Claimed by site supervisor</div>
                    </div>

                    <button
                      onClick={() => handleCertifySingle(entry.id)}
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
          <div className="py-12 text-center text-muted">
            <CheckCircle2 size={32} className="mx-auto text-success/60 mb-2" />
            <div className="text-sm font-medium text-ink">All site entries certified!</div>
            <div className="text-xs text-muted mt-0.5">There are no pending measurements awaiting engineer sign-off.</div>
          </div>
        )}
      </div>

      {/* Queue 2: Certified & Locked Records */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-surface/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-success" />
            <h3 className="text-sm font-semibold text-ink">Certified & Locked Records (MB Reference Log)</h3>
          </div>
          <span className="badge badge-success">{certifiedEntries.length} locked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>MB Reference</th>
                <th>Activity Description</th>
                <th>Date</th>
                <th>Gang / Naike</th>
                <th className="text-right">Certified Quantity</th>
                <th>Certified By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {certifiedEntries.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono text-2xs text-accent font-semibold">{c.mbRef || 'MB-SRC-2024-048'}</td>
                  <td className="font-medium text-ink">{c.boqItemDesc}</td>
                  <td className="text-2xs text-muted whitespace-nowrap">{c.date}</td>
                  <td className="text-2xs text-muted">{c.gang}</td>
                  <td className="text-right font-semibold text-ink tabular-nums">
                    {c.quantityToday} {c.unit}
                  </td>
                  <td>
                    <div className="text-xs font-medium text-ink">{c.certifiedBy || 'Er. Dipendra Shrestha'}</div>
                    <div className="text-2xs text-muted">Digital Signature Verified</div>
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
