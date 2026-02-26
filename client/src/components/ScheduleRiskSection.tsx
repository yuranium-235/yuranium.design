// ============================================================
// DESIGN: "Executive Technical" — Schedule Risk & Probability Section
// Dark-on-light, Sora headings, JetBrains Mono for numbers,
// accent colors: red (#DC2626) for critical, amber (#D97706) for high,
// slate (#475569) for medium/low.
// ============================================================

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, TrendingDown, BarChart2, Info } from "lucide-react";
import {
  SCHEDULE_RISKS,
  MONTE_CARLO_SUMMARY,
  PROBABILITY_CHART_URL,
  type ScheduleRisk,
} from "@/lib/programData";

const IMPACT_STYLES: Record<ScheduleRisk["impact"], { badge: string; bar: string; border: string }> = {
  Critical: { badge: "bg-red-100 text-red-700 border border-red-200",  bar: "bg-red-500",    border: "border-l-red-500" },
  High:     { badge: "bg-amber-100 text-amber-700 border border-amber-200", bar: "bg-amber-500", border: "border-l-amber-500" },
  Medium:   { badge: "bg-slate-100 text-slate-600 border border-slate-200", bar: "bg-slate-400", border: "border-l-slate-400" },
  Low:      { badge: "bg-slate-50 text-slate-500 border border-slate-200",  bar: "bg-slate-300", border: "border-l-slate-300" },
};

const MAX_EXPECTED_SLIP = Math.max(...SCHEDULE_RISKS.map((r) => r.expectedSlip));

function RiskRow({ risk }: { risk: ScheduleRisk }) {
  const [open, setOpen] = useState(false);
  const styles = IMPACT_STYLES[risk.impact];
  const barWidth = `${(risk.expectedSlip / MAX_EXPECTED_SLIP) * 100}%`;

  return (
    <div
      className={`border-l-4 ${styles.border} bg-white rounded-r-lg shadow-sm mb-3 overflow-hidden transition-shadow hover:shadow-md`}
    >
      {/* Header row */}
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Risk ID */}
        <span className="font-mono text-xs text-slate-400 w-12 shrink-0">{risk.id}</span>

        {/* Name */}
        <span className="flex-1 text-sm font-semibold text-slate-800 leading-snug">
          {risk.name}
        </span>

        {/* Tornado bar + expected slip */}
        <div className="hidden md:flex items-center gap-2 w-48 shrink-0">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${styles.bar} transition-all duration-500`}
              style={{ width: barWidth }}
            />
          </div>
          <span className="font-mono text-xs text-slate-500 w-12 text-right">
            {risk.expectedSlip.toFixed(2)}w
          </span>
        </div>

        {/* P(occur) */}
        <span className="hidden sm:block font-mono text-xs text-slate-500 w-10 text-right shrink-0">
          {(risk.pOccur * 100).toFixed(0)}%
        </span>

        {/* Impact badge */}
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.badge} shrink-0`}>
          {risk.impact}
        </span>

        {/* Chevron */}
        <span className="text-slate-400 shrink-0">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Risk Description
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{risk.description}</p>
            <div className="mt-3 flex gap-4 flex-wrap">
              <div>
                <p className="text-xs text-slate-400">P(occur)</p>
                <p className="font-mono text-sm font-bold text-slate-700">
                  {(risk.pOccur * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Likely slip</p>
                <p className="font-mono text-sm font-bold text-slate-700">{risk.slipMode}w</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Worst-case slip</p>
                <p className="font-mono text-sm font-bold text-red-600">{risk.slipMax}w</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Expected slip</p>
                <p className="font-mono text-sm font-bold text-amber-600">
                  {risk.expectedSlip.toFixed(2)}w
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Mitigation
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{risk.mitigation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScheduleRiskSection() {
  const s = MONTE_CARLO_SUMMARY;

  return (
    <section id="risk-analysis" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={18} className="text-red-500" />
            <span className="text-xs font-semibold tracking-widest text-red-500 uppercase">
              Schedule Risk Analysis
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            On-Time Probability &amp; Risk Register
          </h2>
          <p className="text-slate-600 max-w-2xl leading-relaxed">
            A Monte Carlo simulation (100,000 iterations) was run against 10 identified risk factors
            to estimate the probability of hitting the June 22, 2026 PVT ramp date. Each risk is
            modeled with an independent probability of occurrence and a triangular slip distribution.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span className="text-xs font-semibold text-amber-700">v4 Update — ID Lock Pushed to Mar 11:</span>
            <span className="text-xs text-amber-600">ID Lock slipped from Mar 6 → Mar 11, leaving only 2 days to Design Lock (Mar 13). SR-07 (ID churn) risk raised — pOccur 35% → 45%. P(on time) 11.8% → 11.7%. Zero tolerance for structural geometry changes after Mar 11.</span>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: "P(On Time)",
              value: `${(s.pOnTime * 100).toFixed(0)}%`,
              sub: "PVT by Jun 22, 2026",
              color: "text-red-600",
              bg: "bg-red-50 border-red-100",
              icon: <AlertTriangle size={16} className="text-red-500" />,
            },
            {
              label: "Median Slip",
              value: `${s.medianSlipWeeks}w`,
              sub: `Median PVT: ${s.medianPvtDate}`,
              color: "text-amber-600",
              bg: "bg-amber-50 border-amber-100",
              icon: <BarChart2 size={16} className="text-amber-500" />,
            },
            {
              label: "P90 Slip",
              value: `${s.p90SlipWeeks}w`,
              sub: `Worst 10%: ${s.p90PvtDate}`,
              color: "text-orange-600",
              bg: "bg-orange-50 border-orange-100",
              icon: <TrendingDown size={16} className="text-orange-500" />,
            },
            {
              label: "Total Expected Slip",
              value: `${s.totalExpectedSlip.toFixed(1)}w`,
              sub: `vs. ${s.nominalBufferWeeks}w buffer`,
              color: "text-slate-700",
              bg: "bg-slate-100 border-slate-200",
              icon: <Info size={16} className="text-slate-500" />,
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border p-5 ${card.bg} flex flex-col gap-1`}
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                {card.icon}
                {card.label}
              </div>
              <div className={`font-mono text-3xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-xs text-slate-500">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Methodology note */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-10 flex gap-3">
          <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Methodology (v2):</strong> Each risk factor is modeled as
            an independent Bernoulli event. When a risk occurs, its schedule impact is drawn from a
            triangular distribution (min / mode / max slip). A shared "program health" latent
            variable (Beta(3,3)) applies mild positive correlation across risks. The nominal schedule
            buffer of <span className="font-mono font-semibold">1.5 weeks</span> represents the gap
            between a realistically-paced 17-week program and the hard PVT deadline. Risk factors
            SR-04, SR-05, SR-07, SR-08, SR-09, SR-10 were updated to reflect reuse of qualified
            electronics from an existing program. SR-06 was slightly reduced. Mechanical risks
            SR-01, SR-02, SR-03 remain unchanged.{" "}
            <span className="font-mono text-xs text-slate-400">N = {s.iterations.toLocaleString()}</span>
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-12">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <BarChart2 size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">
              Schedule Outcome Distribution &amp; Risk Tornado Chart
            </span>
          </div>
          <img
            src={PROBABILITY_CHART_URL}
            alt="Monte Carlo schedule outcome distribution and risk tornado chart"
            className="w-full object-contain"
          />
        </div>

        {/* Risk table header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-slate-800">
            Risk Factor Detail
          </h3>
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-mono pr-2">
            <span className="w-48 text-center">Expected Slip (weeks)</span>
            <span className="w-10 text-right">P(occur)</span>
            <span className="w-16 text-right">Impact</span>
            <span className="w-4" />
          </div>
        </div>

        {/* Risk rows */}
        <div>
          {SCHEDULE_RISKS.map((risk) => (
            <RiskRow key={risk.id} risk={risk} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-slate-400 leading-relaxed max-w-2xl">
          Expected slip = P(occurrence) × mode slip. Risks are not fully independent; a shared
          program health factor applies mild positive correlation. The dominant risk driver is
          SR-01 (skipping EVT), which alone accounts for 3.30 of the 9.18 total expected slip weeks.
          Addressing SR-01 and SR-02 through a pre-DVT prototype validation sprint is the highest-leverage
          schedule de-risk action available.
        </p>
      </div>
    </section>
  );
}
