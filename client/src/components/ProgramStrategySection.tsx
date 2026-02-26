// DESIGN: "Executive Technical" — Program Strategy & Options Section
// Three-option comparison table + dual-path risk mitigation recommendation
// ============================================================

import { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, ArrowRight, Shield, TrendingDown, ShoppingBag } from "lucide-react";

const OPTIONS = [
  {
    id: "current",
    name: "Current Luna Case",
    subtitle: "Existing POR",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&q=80",
    unitCost: "$19.20",
    costNote: "",
    capex: "—",
    rampMaterial: "—",
    idStatus: "Official ID Approved",
    idColor: "text-emerald-600",
    riskLabel: "Low Risk",
    riskCode: "P90",
    riskColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    riskBadgeColor: "bg-emerald-500",
    riskDescription: "Design has already gone through P1 and EVT engineering validation builds",
    pros: ["Fully validated through P1 + EVT", "Official ID approved", "No new tooling required", "Supply chain already qualified"],
    cons: ["Highest unit cost at $19.20", "No cost reduction for leadership", "Misses cost savings opportunity"],
    borderColor: "border-emerald-400",
    headerBg: "bg-emerald-50",
  },
  {
    id: "softgoods",
    name: "Low Cost Case",
    subtitle: "Integrated Retention Mech",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
    unitCost: "$9.40 – $10.00",
    costNote: "",
    capex: "$520k (per line)",
    rampMaterial: "TBD",
    idStatus: "No official ID available",
    idColor: "text-amber-600",
    riskLabel: "HIGH RISK",
    riskCode: "P10",
    riskColor: "bg-red-50 text-red-700 border-red-200",
    riskBadgeColor: "bg-red-500",
    riskDescription: "Design going straight to mass production without engineering validation. Softgoods + mechanical hardware integration adds complexity. Specialized supplier routing to FATP adds lead time risk.",
    pros: ["Significant cost reduction vs. current", "Integrated charging mechanism"],
    cons: ["No engineering validation history", "Softgoods + hardware integration risk", "Specialized supplier → FATP routing adds lead time", "No approved ID", "Straight to mass production"],
    borderColor: "border-red-400",
    headerBg: "bg-red-50",
  },
  {
    id: "clip",
    name: "Analog Case + Clip",
    subtitle: "Luxottica Case + New Charging Clip",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&q=80",
    unitCost: "$6.50 – $7.50",
    costNote: "",
    capex: "$520k (per line)",
    rampMaterial: "TBD",
    idStatus: "No official ID available",
    idColor: "text-amber-600",
    riskLabel: "HIGH RISK",
    riskCode: "P15",
    riskColor: "bg-orange-50 text-orange-700 border-orange-200",
    riskBadgeColor: "bg-orange-500",
    riskDescription: "Design going straight to mass production without engineering validation. However, case risk is de-risked by sourcing from Luxottica's existing high-volume manufacturer. Residual risk concentrated in the charging clip.",
    pros: ["Lowest unit cost at $6.50–$7.50", "Case de-risked via Luxottica's existing manufacturer", "Risk concentrated and manageable in clip only", "Clip can become standalone aftermarket SKU"],
    cons: ["Clip has no engineering validation history", "No approved ID", "Clip program on compressed DVT-first schedule", "Decision gate required before PVT"],
    borderColor: "border-orange-400",
    headerBg: "bg-orange-50",
  },
];

const RECOMMENDATION_STEPS = [
  {
    num: "1",
    icon: Shield,
    color: "bg-emerald-500",
    title: "Keep Current Case as Day 0 POR",
    description: "Maintain the $19.20 Luna case as the Plan of Record for Day 0 shipment. The glasses launch is never at risk. This is the floor — guaranteed.",
    tag: "FLOOR — GUARANTEED",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    num: "2",
    icon: TrendingDown,
    color: "bg-blue-500",
    title: "Aggressively Drive Clip for Day 0",
    description: "Run the charging clip program at full speed with the intention to replace the current case in-box on Day 0. If the clip lands on time, capture the ~$12/unit cost savings at scale — recovering the $520k Capex within the first production run.",
    tag: "UPSIDE — ~63% COST REDUCTION",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    num: "3",
    icon: ShoppingBag,
    color: "bg-purple-500",
    title: "If Clip Misses Day 0 → Aftermarket SKU",
    description: "If the clip fails to qualify for Day 0, ship with the current case and sell the clip as an aftermarket accessory. The $520k Capex investment is recovered through aftermarket revenue. The glasses launch is unaffected.",
    tag: "HEDGE — CAPEX RECOVERY",
    tagColor: "bg-purple-100 text-purple-700",
  },
];

const DECISION_GATES = [
  {
    date: "Mar 30, 2026",
    gate: "Hard Tooling Kick-Off",
    decision: "Confirm clip design is mature enough to commit to production tooling. If not, evaluate aftermarket-only path.",
    owner: "Mechanical Engineering + Program Management",
    status: "confirmed",
  },
  {
    date: "May 8, 2026",
    gate: "T1 Mold Shots Review",
    decision: "Assess dimensional conformance and fit on nose bridge. Go/No-Go on T2 corrections vs. design change.",
    owner: "Mechanical Engineering",
    status: "planned",
  },
  {
    date: "May 16, 2026",
    gate: "DVT Parts Ready",
    decision: "All clip parts must be available for DVT build. If parts are not ready, Day 0 in-box path is effectively closed.",
    owner: "Supply Chain & NPI",
    status: "planned",
  },
  {
    date: "~May 26, 2026",
    gate: "Day 0 Go/No-Go Decision Gate",
    decision: "Hard decision: Does the clip ship in-box on Day 0, or does it transition to aftermarket SKU? Must be made ~4 weeks before PVT ramp to allow case supply chain to activate.",
    owner: "Program Management + Leadership",
    status: "critical",
  },
  {
    date: "Jun 22, 2026",
    gate: "PVT Ramp Start",
    decision: "Either clip ships in-box (cost savings captured) or current case ships in-box (clip transitions to aftermarket program).",
    owner: "Supply Chain & NPI",
    status: "planned",
  },
];

export default function ProgramStrategySection() {
  const [showAllGates, setShowAllGates] = useState(false);

  return (
    <section id="strategy" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-1 h-8 bg-blue-600 rounded-full" />
            <span className="text-xs font-mono font-semibold tracking-widest text-blue-600 uppercase">Program Strategy</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Options Analysis & Recommendation
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Leadership challenged the $19.20 current case cost, prompting evaluation of lower-cost alternatives.
            The following analysis compares three options across unit cost, development risk, and schedule impact,
            and presents a dual-path strategy that eliminates binary launch risk.
          </p>
        </div>

        {/* Options Comparison */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "Sora, sans-serif" }}>
            Three-Option Comparison
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className={`rounded-2xl border-2 ${opt.borderColor} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Header */}
                <div className={`${opt.headerBg} px-6 py-5 border-b border-slate-100`}>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "Sora, sans-serif" }}>{opt.name}</h4>
                      <p className="text-sm text-slate-500">{opt.subtitle}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${opt.riskBadgeColor}`}>
                      {opt.riskCode}
                    </span>
                  </div>
                </div>

                {/* Cost */}
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: "JetBrains Mono, monospace" }}>{opt.unitCost}</span>
                    <span className="text-xs text-slate-400">/ unit</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{opt.costNote}</p>
                  {opt.capex !== "—" && (
                    <div className="mt-2 text-xs text-slate-500">
                      <span className="font-medium">Capex:</span> {opt.capex} &nbsp;|&nbsp; <span className="font-medium">Ramp Prep:</span> {opt.rampMaterial}
                    </div>
                  )}
                </div>

                {/* Risk */}
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold mb-2 ${opt.riskColor}`}>
                    {opt.riskCode === "P90"
                      ? <CheckCircle className="w-3.5 h-3.5" />
                      : <AlertTriangle className="w-3.5 h-3.5" />
                    }
                    {opt.riskLabel} ({opt.riskCode})
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{opt.riskDescription}</p>
                </div>

                {/* ID Status */}
                <div className="px-6 py-3 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID Status</span>
                  <p className={`text-sm font-medium mt-0.5 ${opt.idColor}`}>{opt.idStatus}</p>
                </div>

                {/* Pros / Cons — always visible */}
                <div className="px-6 py-4 border-t border-slate-100">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 mb-1.5">Advantages</p>
                      <ul className="space-y-1">
                        {opt.pros.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-500 mb-1.5">Concerns</p>
                      <ul className="space-y-1">
                        {opt.cons.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono font-semibold tracking-widest text-blue-300 uppercase">Recommended Strategy</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
              Dual-Path Risk Mitigation
            </h3>
            <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-3xl">
              Rather than a binary bet on the clip, the recommended approach converts the program into a
              <strong className="text-white"> two-path structure with a guaranteed floor and an upside option</strong>.
              The glasses launch is fully protected regardless of clip outcome. The clip becomes a no-lose investment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {RECOMMENDATION_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative">
                    {i < RECOMMENDATION_STEPS.length - 1 && (
                      <div className="hidden md:flex absolute top-8 -right-3 z-10 items-center">
                        <ArrowRight className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                      <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 ${step.tagColor}`}>
                        {step.tag}
                      </span>
                      <h4 className="font-bold text-white text-base mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
                        {step.num}. {step.title}
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key insight callout */}
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-6">
              <p className="text-blue-200 text-sm leading-relaxed">
                <strong className="text-blue-100">Why this works:</strong> Under the original framing, the clip's ~P15 on-time probability is a crisis.
                Under this dual-path strategy, P15 is simply the probability of capturing cost savings on Day 0 — a nice-to-have, not a must-have.
                The program can now be run aggressively without existential downside risk to the glasses launch.
                At 500k+ units, a successful Day 0 clip landing represents <strong className="text-white">$5.8M+ in annual unit cost savings</strong> — recovering the $520k Capex in the first production run.
              </p>
            </div>
          </div>
        </div>

        {/* Decision Gate Timeline */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Decision Gate Framework
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            The dual-path strategy requires explicit go/no-go decision gates. The critical gate is approximately 4 weeks before PVT ramp.
          </p>
          <div className="space-y-3">
            {DECISION_GATES.slice(0, showAllGates ? undefined : 3).map((gate, i) => (
              <div
                key={i}
                className={`flex gap-4 p-5 rounded-xl border ${
                  gate.status === "critical"
                    ? "border-red-200 bg-red-50"
                    : gate.status === "confirmed"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="shrink-0 text-right w-28">
                  <span className="text-xs font-mono font-bold text-slate-500">{gate.date}</span>
                </div>
                <div className={`w-px shrink-0 ${
                  gate.status === "critical" ? "bg-red-300" : gate.status === "confirmed" ? "bg-emerald-300" : "bg-slate-300"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "Sora, sans-serif" }}>{gate.gate}</span>
                    {gate.status === "critical" && (
                      <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">CRITICAL DECISION</span>
                    )}
                    {gate.status === "confirmed" && (
                      <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">CONFIRMED</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{gate.decision}</p>
                  <p className="text-xs text-slate-400"><span className="font-medium">Owner:</span> {gate.owner}</p>
                </div>
              </div>
            ))}
          </div>
          {DECISION_GATES.length > 3 && (
            <button
              onClick={() => setShowAllGates(!showAllGates)}
              className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showAllGates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAllGates ? "Show fewer gates" : `Show all ${DECISION_GATES.length} decision gates`}
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
