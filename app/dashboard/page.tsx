"use client";

import { useProject } from "@/lib/context";
import {
  sCurveData,
  burnRateData,
  delayData,
  resourceData,
} from "@/data/dashboard";
import { projects } from "@/data/projects";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState, useRef } from "react";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  Layers,
} from "lucide-react";

function useCountUp(target: number, duration: number = 1200) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, started]);

  return { value, ref };
}

function StatCard({
  label,
  value,
  unit,
  sub,
  flag,
  positive,
}: {
  label: string;
  value: number;
  unit: string;
  sub?: string;
  flag?: boolean;
  positive?: boolean;
}) {
  const { value: count, ref } = useCountUp(value);
  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl p-5 border ${flag ? "border-rust/30" : "border-border"} shadow-sm-warm`}
    >
      <div className="text-xs text-muted font-medium mb-3">{label}</div>
      <div
        className={`text-3xl font-semibold tabular-nums ${flag ? "text-rust" : positive ? "text-success" : "text-ink"}`}
      >
        {count}
        <span className="text-sm font-normal text-muted ml-1">{unit}</span>
      </div>
      {sub && <div className="text-xs text-muted mt-1.5">{sub}</div>}
    </div>
  );
}

function ProgressBar({
  label,
  planned,
  actual,
}: {
  label: string;
  planned: number;
  actual: number;
}) {
  const delta = actual - planned;
  const isAhead = delta >= 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted">{label}</span>
        <span
          className={`text-xs font-medium ${isAhead ? "text-success" : "text-critical"}`}
        >
          {isAhead ? "+" : ""}
          {delta.toFixed(1)}%
        </span>
      </div>
      <div className="relative h-2 bg-surface rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-border-strong/60 rounded-full"
          style={{ width: `${planned}%` }}
        />
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${isAhead ? "bg-success" : "bg-critical"}`}
          style={{ width: `${actual}%` }}
        />
      </div>
      <div className="flex justify-between text-2xs text-muted">
        <span>Planned {planned}%</span>
        <span>Actual {actual}%</span>
      </div>
    </div>
  );
}

const CustomSCurveTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink/95 text-white rounded-lg px-3 py-2 text-xs shadow-lg border border-white/10">
      <div className="font-medium mb-1 text-white/60">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="capitalize">{p.dataKey}:</span>
          <span className="font-medium">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

const CustomBurnTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink/95 text-white rounded-lg px-3 py-2 text-xs shadow-lg border border-white/10">
      <div className="font-medium mb-1 text-white/60">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="capitalize">{p.dataKey}:</span>
          <span className="font-medium">{p.value.toLocaleString()} bags</span>
        </div>
      ))}
    </div>
  );
};

const severityColors = {
  high: "text-critical",
  medium: "text-rust",
  low: "text-muted",
};

const severityBg = {
  high: "bg-critical/10 border-critical/20",
  medium: "bg-rust/10 border-rust/20",
  low: "bg-surface border-border",
};

export default function DashboardPage() {
  const { activeProject } = useProject();
  const [sortBy, setSortBy] = useState<"days" | "severity">("days");

  const scurve = sCurveData[activeProject.id] ?? [];
  const burnrate = burnRateData[activeProject.id] ?? [];
  const delays = delayData[activeProject.id] ?? [];
  const resources = resourceData[activeProject.id] ?? [];

  const budgetUsedPct = Math.round(
    (activeProject.spentToDate / activeProject.contractValue) * 100,
  );
  const progressVsBudgetHealth = activeProject.actualProgress - budgetUsedPct;

  const sortedDelays = [...delays].sort((a, b) => {
    if (sortBy === "days") return b.daysSlipped - a.daysSlipped;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  const formatNPR = (n: number) => {
    if (n >= 10000000) return `₨ ${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `₨ ${(n / 100000).toFixed(1)} L`;
    return `₨ ${n.toLocaleString()}`;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Project summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Contract Value"
          value={Math.round(activeProject.contractValue / 100000)}
          unit="L NPR"
          sub={`${(activeProject.contractValue / 10000000).toFixed(2)} Crore`}
        />
        <StatCard
          label="Spent to Date"
          value={Math.round(activeProject.spentToDate / 100000)}
          unit="L NPR"
          sub={`${budgetUsedPct}% of budget`}
          flag={budgetUsedPct > activeProject.actualProgress + 8}
        />
        <StatCard
          label="Planned Progress"
          value={activeProject.plannedProgress}
          unit="%"
          sub="As per programme"
        />
        <StatCard
          label="Actual Progress"
          value={activeProject.actualProgress}
          unit="%"
          sub={`${activeProject.actualProgress - activeProject.plannedProgress}% vs planned`}
          flag={activeProject.actualProgress < activeProject.plannedProgress}
          positive={
            activeProject.actualProgress >= activeProject.plannedProgress
          }
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* S-Curve */}
        <div className="col-span-2 bg-white rounded-xl border border-border shadow-sm-warm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Progress S-Curve
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Planned vs. actual cumulative progress
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-border-strong inline-block rounded" />{" "}
                Planned
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-accent inline-block rounded" />{" "}
                Actual
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={scurve}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8C8B84" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#8C8B84" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3A5A73" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3A5A73" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E0E0D8"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "#8C8B84" }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8C8B84" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomSCurveTooltip />} />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="#C8C8BF"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="url(#plannedGrad)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3A5A73"
                strokeWidth={2}
                fill="url(#actualGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost vs Budget */}
        <div className="bg-white rounded-xl border border-border shadow-sm-warm p-5">
          <h3 className="text-sm font-semibold text-ink mb-1">
            Cost vs. Budget
          </h3>
          <p className="text-xs text-muted mb-5">
            Expenditure against contract value
          </p>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted">Budget</span>
                <span className="font-medium text-ink">
                  {formatNPR(activeProject.contractValue)}
                </span>
              </div>
              <div className="h-2.5 bg-surface rounded-full">
                <div className="h-full bg-border-strong/40 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted">Spent</span>
                <span
                  className={`font-medium ${budgetUsedPct > activeProject.actualProgress + 8 ? "text-rust" : "text-ink"}`}
                >
                  {formatNPR(activeProject.spentToDate)}
                </span>
              </div>
              <div className="h-2.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    budgetUsedPct > activeProject.actualProgress + 8
                      ? "bg-rust"
                      : "bg-accent"
                  }`}
                  style={{ width: `${budgetUsedPct}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border space-y-2">
              <ProgressBar
                label="Physical progress"
                planned={activeProject.plannedProgress}
                actual={activeProject.actualProgress}
              />
              <div className="pt-2">
                <div
                  className={`flex items-center gap-2 text-xs ${progressVsBudgetHealth >= 0 ? "text-success" : "text-rust"}`}
                >
                  {progressVsBudgetHealth >= 0 ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}
                  <span>
                    Work progress{" "}
                    {progressVsBudgetHealth >= 0 ? "ahead of" : "behind"} spend
                    rate by {Math.abs(progressVsBudgetHealth)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Burn rate + Resources + Delays */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Burn Rate */}
        <div className="bg-white rounded-xl border border-border shadow-sm-warm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Cement Burn Rate
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Estimated vs. actual consumption (bags/month)
              </p>
            </div>
            {burnrate.some((b) => b.actual > b.estimated) && (
              <span className="badge badge-rust text-2xs flex items-center gap-1">
                <AlertTriangle size={10} /> Over-consuming
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={burnrate}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E0E0D8"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#8C8B84" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8C8B84" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomBurnTooltip />} />
              <Bar
                dataKey="estimated"
                fill="#E0E0D8"
                radius={[2, 2, 0, 0]}
                name="Estimated"
              />
              <Bar
                dataKey="actual"
                radius={[2, 2, 0, 0]}
                name="Actual"
                fill="#3A5A73"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-xl border border-border shadow-sm-warm p-5">
          <h3 className="text-sm font-semibold text-ink mb-5">
            Resource Utilization
          </h3>
          <div className="space-y-4">
            {resources.map((r) => (
              <div
                key={r.label}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${r.flag ? "bg-rust/8 border border-rust/20" : "bg-surface border border-border"}`}
              >
                <div className="flex items-center gap-2">
                  {r.flag ? (
                    <AlertTriangle
                      size={14}
                      className="text-rust flex-shrink-0"
                    />
                  ) : (
                    <Layers size={14} className="text-muted flex-shrink-0" />
                  )}
                  <span className="text-xs text-ink font-medium">
                    {r.label}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-semibold ${r.flag ? "text-rust" : "text-ink"}`}
                  >
                    {r.value}
                  </span>
                  <span className="text-xs text-muted ml-1">{r.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delay Table */}
        <div className="bg-white rounded-xl border border-border shadow-sm-warm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-ink">
                Schedule Delays
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {delays.length} activities slipped
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSortBy("days")}
                className={`text-2xs px-2 py-1 rounded ${sortBy === "days" ? "bg-accent text-white" : "text-muted hover:bg-surface"}`}
              >
                Days
              </button>
              <button
                onClick={() => setSortBy("severity")}
                className={`text-2xs px-2 py-1 rounded ${sortBy === "severity" ? "bg-accent text-white" : "text-muted hover:bg-surface"}`}
              >
                Severity
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {sortedDelays.map((d) => (
              <div
                key={d.id}
                className={`rounded-lg px-3 py-2.5 border ${severityBg[d.severity]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-ink truncate">
                      {d.activity}
                    </div>
                    <div className="text-2xs text-muted mt-0.5">
                      {d.responsible}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold flex items-center gap-1 flex-shrink-0 ${severityColors[d.severity]}`}
                  >
                    <Clock size={11} />
                    {d.daysSlipped}d
                  </div>
                </div>
                <div className="text-2xs text-muted mt-1.5 leading-relaxed">
                  {d.reason}
                </div>
              </div>
            ))}
            {delays.length === 0 && (
              <div className="text-center py-6 text-muted text-xs">
                No delays recorded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Projects Summary row */}
      <div className="bg-white rounded-xl border border-border shadow-sm-warm p-5">
        <h3 className="text-sm font-semibold text-ink mb-4">
          All Projects Overview
        </h3>
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-2.5 border-b border-surface last:border-0"
            >
              <div className="w-full sm:w-36 flex-shrink-0">
                <div className="text-xs font-medium text-ink truncate">
                  {p.name}
                </div>
                <div className="text-2xs text-muted mt-0.5">{p.code}</div>
              </div>
              <div className="flex-1 min-w-0 w-full space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-border-strong/50 rounded-full"
                      style={{ width: `${p.plannedProgress}%` }}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        p.status === "on-track"
                          ? "bg-success"
                          : p.status === "delayed"
                            ? "bg-rust"
                            : "bg-critical"
                      }`}
                      style={{ width: `${p.actualProgress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-2xs text-muted">
                  <span>Planned {p.plannedProgress}%</span>
                  <span className="text-border-strong">·</span>
                  <span
                    className={
                      p.status === "on-track"
                        ? "text-success"
                        : p.status === "delayed"
                          ? "text-rust"
                          : "text-critical"
                    }
                  >
                    Actual {p.actualProgress}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:block sm:text-right flex-shrink-0 sm:w-28 w-full">
                <div className="text-xs font-medium text-ink">
                  {formatNPR(p.contractValue)}
                </div>
                <div className="text-2xs text-muted">Contract value</div>
              </div>
              <div className="flex-shrink-0 self-end sm:self-auto">
                <span
                  className={`badge text-2xs ${
                    p.status === "on-track"
                      ? "badge-success"
                      : p.status === "delayed"
                        ? "badge-rust"
                        : "badge-critical"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
