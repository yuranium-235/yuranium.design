// ============================================================
// DESIGN: "Executive Technical"
// - Sora display font, Inter body, JetBrains Mono for codes/dates
// - Workstream color-coded left borders on cards
// - Animated stat cards, interactive Gantt, expandable risk rows
// ============================================================

import { useState, useEffect } from "react";
import GanttChart from "@/components/GanttChart";
import MilestoneTable from "@/components/MilestoneTable";
import ScheduleRiskSection from "@/components/ScheduleRiskSection";
import ProductDesignSection from "@/components/ProductDesignSection";
import ProgramStrategySection from "@/components/ProgramStrategySection";
import {
  RISKS,
  WORKSTREAMS,
  WORKSTREAM_COLORS,
  WORKSTREAM_BORDER,
  WORKSTREAM_DESCRIPTIONS,
  type Workstream,
} from "@/lib/programData";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Clock, Zap, Shield, Package, Cpu, Wrench, FlaskConical, FileCheck, Truck } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/pasted_file_a8MPNL_image_3ee3507c.png";

const STATS = [
  { label: "Program Kickoff",   value: "Feb 25, 2026", sub: "Today",              icon: Zap,          color: "#2C6E9E" },
  { label: "DVT Build",         value: "May 19, 2026", sub: "Week 12 · 83 days",  icon: CheckCircle2, color: "#DC2626" },
  { label: "PVT Ramp Start",    value: "Jun 22, 2026", sub: "Week 17 · 117 days", icon: Package,      color: "#059669" },
  { label: "Total Program",     value: "~17 Weeks",    sub: "Kickoff → PVT",      icon: Clock,        color: "#6A4C93" },
  { label: "EVT Build",         value: "Skipped",      sub: "DVT-first program",  icon: AlertTriangle,color: "#D97706" },
  { label: "Workstreams",       value: "7 Active",     sub: "Parallel execution", icon: Shield,       color: "#1D7A8A" },
];

const WS_ICONS: Record<Workstream, React.ElementType> = {
  "Program Management":      Zap,
  "Mechanical Engineering":  Wrench,
  "Electrical Engineering":  Cpu,
  "Firmware / Software":     FlaskConical,
  "Reliability & Test":      Shield,
  "Regulatory & Compliance": FileCheck,
  "Supply Chain & NPI":      Truck,
};

const IMPACT_STYLES: Record<string, string> = {
  High:   "bg-red-50 text-red-700 border border-red-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low:    "bg-green-50 text-green-700 border border-green-200",
};

const PHASES = [
  {
    num: "01",
    title: "Concept & Pre-Tooling Validation",
    dates: "Feb 25 – Apr 1, 2026",
    weeks: "Weeks 1–6",
    color: "#2C6E9E",
    description: "The most critical phase. Finalize PRD, conduct detailed nose bridge studies, select core components, and iterate through 3D CAD and rapid prototypes. Goal: design locked before hard tool kick-off.",
  },
  {
    num: "02",
    title: "Tooling & Initial Bring-up",
    dates: "Apr 1 – May 19, 2026",
    weeks: "Weeks 6–12",
    color: "#1D7A8A",
    description: "Long-lead-time injection mold is kicked off. While the mold is fabricated, EE and FW finalize and validate the PCB assembly. Phase concludes with T1 mold shots and initial assembly trials.",
  },
  {
    num: "03",
    title: "DVT Build & Validation",
    dates: "May 19 – Jun 15, 2026",
    weeks: "Weeks 12–16",
    color: "#DC2626",
    description: "DVT build commences using production-intent parts. Units undergo comprehensive mechanical, electrical, and reliability testing. This is the formal gate for identifying and resolving final design issues.",
  },
  {
    num: "04",
    title: "PVT Ramp",
    dates: "Jun 22, 2026 onwards",
    weeks: "Week 17+",
    color: "#059669",
    description: "Following successful DVT exit, PVT begins. Focus shifts to validating the mass production process, scaling CM capacity, and ensuring consistent quality and yield before full production ramp.",
  },
];

export default function Home() {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#2C6E9E" }}>
              <Zap size={14} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
                Ray-Ban Meta · Charging Clip
              </span>
              <span className="ml-2 text-xs text-slate-400 font-mono hidden sm:inline">Program Risk Assessment</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            <a href="#overview" className="hover:text-slate-900 transition-colors">Overview</a>
            <a href="#schedule" className="hover:text-slate-900 transition-colors">Schedule</a>
            <a href="#risks" className="hover:text-slate-900 transition-colors">Risks</a>
            <a href="#risk-analysis" className="hover:text-slate-900 transition-colors">Probability</a>
            <a href="#strategy" className="hover:text-slate-900 transition-colors">Strategy</a>
            <a href="#workstreams" className="hover:text-slate-900 transition-colors">Workstreams</a>
            <a href="#product-design" className="hover:text-slate-900 transition-colors">Appendix</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:block">KO: Feb 25, 2026</span>
            <span className="text-xs font-mono text-slate-400 hidden md:block">Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              DVT-First Program
            </span>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/70" />
        <div className="relative container py-16 md:py-24">
          <div className="flex items-center gap-8">
          <div className="max-w-2xl flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-slate-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              PROGRAM ACTIVE · CONFIDENTIAL
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
              Luna Charging Case
               <br />
               <span className="text-slate-300">Program Risk Assessment</span>
            </h1>
            <div className="flex items-center gap-3 mb-6 text-sm">
              <span className="text-slate-400 font-mono">Michael Yu</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl">
              A USB-C pogo pin charging dongle that mechanically retains onto the nose bridge of the next-generation Ray-Ban Meta smart glasses, delivering power via two spring-loaded contacts.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2.5 border border-white/15">
                <span className="font-mono text-slate-400 text-xs">KO</span>
                <span className="font-semibold">Feb 25, 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-red-500/20 rounded-lg px-4 py-2.5 border border-red-400/30">
                <span className="font-mono text-red-300 text-xs">DVT</span>
                <span className="font-semibold">May 19, 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/20 rounded-lg px-4 py-2.5 border border-green-400/30">
                <span className="font-mono text-green-300 text-xs">PVT</span>
                <span className="font-semibold">Jun 22, 2026</span>
              </div>
            </div>
          </div>{/* end text col */}
          {/* Render image — right side */}
          <div className="hidden lg:flex flex-1 justify-end items-center">
            <img
              src={HERO_IMG}
              alt="Luna Charging Clip Render"
              className="max-h-72 object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
          </div>{/* end flex row */}
        </div>
      </section>

      {/* ── STAT CARDS ──────────────────────────────────────── */}
      <section id="overview" className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`,
                  borderTop: `3px solid ${stat.color}`,
                }}
              >
                <Icon size={16} style={{ color: stat.color }} />
                <div className="text-lg font-bold text-slate-900 leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                <div className="text-xs font-mono text-slate-400">{stat.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── EXECUTIVE SUMMARY ───────────────────────────────── */}
      <section className="container pb-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Executive Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
            <p>
              This program delivers a new charging clip accessory for the next-generation Ray-Ban Meta smart glasses. The clip is a compact USB-C dongle carrying two spring-loaded pogo pins that make electrical contact with the charging pads on the glasses, and a mechanical retention feature that secures the clip to the nose bridge during charging.
            </p>
            <p>
              The defining constraint of this program is a <strong className="text-slate-800">highly compressed, DVT-first timeline</strong> — bypassing the typical EVT phase and committing directly to production-intent hard tooling. This places immense pressure on the initial design, simulation, and rapid-prototyping phases, and demands rigorous front-loading of engineering effort across all seven workstreams in parallel.
            </p>
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Key Risk:</strong> Skipping EVT means design flaws discovered after hard tooling is complete will result in expensive mold rework. The program mitigates this through intensive FEA simulation, high-fidelity SLA/SLS prototyping, and mandatory DFM reviews before tool kick-off.
            </p>
          </div>
        </div>
      </section>

      {/* ── PHASE TIMELINE ──────────────────────────────────── */}
      <section className="container pb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5" style={{ fontFamily: "Sora, sans-serif" }}>
          Program Phases
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((phase) => (
            <div
              key={phase.num}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3"
              style={{ borderLeft: `4px solid ${phase.color}` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-100" style={{ fontFamily: "Sora, sans-serif" }}>{phase.num}</span>
                <span className="text-xs font-mono text-slate-400">{phase.weeks}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug" style={{ fontFamily: "Sora, sans-serif" }}>
                {phase.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">{phase.description}</p>
              <div className="text-xs font-mono font-medium" style={{ color: phase.color }}>{phase.dates}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MILESTONE TABLE ──────────────────────────────── */}
      <MilestoneTable />

      {/* ── RISK REGISTER ───────────────────────────────────── */}
      <section id="risks" className="container pb-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Risk Register
          </h2>
          <p className="text-sm text-slate-500 mb-6">Click any row to expand the full mitigation plan.</p>
          <div className="space-y-3">
            {RISKS.map((risk) => {
              const isOpen = expandedRisk === risk.id;
              return (
                <div
                  key={risk.id}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedRisk(isOpen ? null : risk.id)}
                  >
                    <span className="font-mono text-xs text-slate-400 w-10 flex-shrink-0">{risk.id}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${IMPACT_STYLES[risk.impact]}`}>
                      {risk.impact}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm flex-1" style={{ fontFamily: "Sora, sans-serif" }}>
                      {risk.title}
                    </span>
                    <span className="text-slate-400 flex-shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 bg-slate-50 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{risk.description}</p>
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mitigation Plan</div>
                        {risk.mitigation.map((m, i) => (
                          <div key={i} className="flex gap-3 text-sm text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE RISK & PROBABILITY ANALYSIS ──────────── */}
      <ScheduleRiskSection />

      {/* ── STRATEGY ────────────────────────────────────────── */}
      <ProgramStrategySection />

      {/* ── WORKSTREAMS ─────────────────────────────────────── */}
      <section id="workstreams" className="container pb-16">
        <h2 className="text-xl font-bold text-slate-900 mb-5" style={{ fontFamily: "Sora, sans-serif" }}>
          Engineering Workstreams
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKSTREAMS.map((ws) => {
            const Icon = WS_ICONS[ws];
            const color = WORKSTREAM_COLORS[ws];
            const borderClass = WORKSTREAM_BORDER[ws];
            return (
              <div
                key={ws}
                className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 border-l-4 ${borderClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm" style={{ fontFamily: "Sora, sans-serif" }}>{ws}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{WORKSTREAM_DESCRIPTIONS[ws]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── APPENDIX: DESIGN PACKAGE ────────────────────────── */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="container pt-10 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="inline-block w-1 h-6 bg-slate-400 rounded-full" />
            <span className="text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase">Appendix</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-600" style={{ fontFamily: "Sora, sans-serif" }}>Design Package & Detailed Schedule</h2>
          <p className="text-sm text-slate-400 mt-1 mb-6">Engineering drawings, BOM, product renders, assembly documentation, and detailed Gantt chart generated from the STEP file and program data.</p>
        </div>
        <ProductDesignSection />

        {/* Gantt Chart in Appendix */}
        <div className="container pb-10">
          <h3 className="text-lg font-bold text-slate-600 mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Detailed Program Gantt Chart</h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
            <p className="text-sm text-slate-500 mb-4">Hover over bars and milestones for task details. Dashed lines mark DVT and PVT gates.</p>
            <GanttChart />
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: "#2C6E9E" }}>
              <Zap size={10} className="text-white" />
            </div>
            <span style={{ fontFamily: "Sora, sans-serif" }} className="font-semibold text-slate-600">
              Ray-Ban Meta · Charging Clip NPI
            </span>
          </div>
          <div className="font-mono text-slate-400 text-center">
            KO: Feb 25, 2026 · DVT: May 19, 2026 · PVT: Jun 22, 2026
          </div>
          <div className="text-slate-400">Confidential — Internal Use Only</div>
        </div>
      </footer>
    </div>
  );
}
