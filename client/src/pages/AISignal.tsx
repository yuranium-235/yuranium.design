/**
 * AI SIGNAL — Hardware Engineer AI Effectiveness Tracker
 * Design: Mission Control / Aerospace HUD
 * Colors: #0a0a0f base, #00d4ff cyan accent, #ffb347 amber, #ef4444 red
 * Typography: JetBrains Mono for data, Inter for labels
 * Layout: Fixed left sidebar + scrollable main content
 */

import { useState, useEffect, useCallback } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area,
  BarChart, Bar, Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id: string;
  date: string;
  tool: string;
  category: string;
  duration: number;
  timeSaved: number;
  quality: number;
  notes: string;
  link?: string;
}

const CATEGORIES = [
  "Structural Analysis",
  "Thermal Analysis",
  "Material Selection",
  "DFM / Tolerancing",
  "BOM / Cost Engineering",
  "Supplier Research",
  "Documentation",
  "Rendering / Visualization",
  "Prototyping",
  "Risk Modelling",
  "Other",
];

const TOOLS = [
  "Manus AI", "ChatGPT", "Claude", "Gemini", "Copilot",
  "Midjourney", "DALL-E", "Stable Diffusion",
  "Ansys AI", "SimScale", "nTop", "Fusion 360 AI",
  "Other",
];

const SKILL_DIMS = [
  { key: "simulation", label: "Simulation & FEA" },
  { key: "materials", label: "Material Science" },
  { key: "dfm", label: "DFM / Tolerancing" },
  { key: "cost", label: "Cost Engineering" },
  { key: "visual", label: "Visual Comm." },
  { key: "research", label: "Research Synthesis" },
  { key: "docs", label: "Documentation" },
  { key: "crossdiscipline", label: "Cross-disciplinary" },
];

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_SESSIONS: Session[] = [
  { id: "1", date: "2026-03-10", tool: "Manus AI", category: "Structural Analysis", duration: 45, timeSaved: 180, quality: 5, notes: "FEA on hinge web wall thickness — 3 material sweep" },
  { id: "2", date: "2026-03-10", tool: "Manus AI", category: "Material Selection", duration: 30, timeSaved: 120, quality: 5, notes: "ESC & chemical resistance comparison PC/TR90/POM" },
  { id: "3", date: "2026-03-11", tool: "Manus AI", category: "Structural Analysis", duration: 25, timeSaved: 90, quality: 4, notes: "Spring proposals — double torsion min OD" },
  { id: "4", date: "2026-03-11", tool: "Manus AI", category: "Thermal Analysis", duration: 20, timeSaved: 75, quality: 4, notes: "Thermal warpage comparison — hot car soak scenario" },
  { id: "5", date: "2026-03-12", tool: "Manus AI", category: "BOM / Cost Engineering", duration: 15, timeSaved: 60, quality: 4, notes: "BOM cost review at 2-4M volume" },
  { id: "6", date: "2026-03-12", tool: "Manus AI", category: "Rendering / Visualization", duration: 20, timeSaved: 90, quality: 5, notes: "Photorealistic exploded view render" },
  { id: "7", date: "2026-03-13", tool: "Manus AI", category: "DFM / Tolerancing", duration: 25, timeSaved: 100, quality: 5, notes: "Ultrasonic welding design best practices for POM" },
  { id: "8", date: "2026-03-14", tool: "Manus AI", category: "Supplier Research", duration: 15, timeSaved: 45, quality: 3, notes: "TR90 datasheet thermal properties" },
  // ── Prada-Meta Charging Case — Drop Ejection Risk Analysis ──────────────────
  { id: "9",  date: "2026-03-05", tool: "Manus AI", category: "Risk Modelling", duration: 20, timeSaved: 90,  quality: 5, notes: "Prada-Meta: Initial drop ejection risk framing — qualitative severity assessment, Must-Fix classification", link: "https://pradacase-uakvemq6.manus.space/" },
  { id: "10", date: "2026-03-05", tool: "Manus AI", category: "Risk Modelling", duration: 60, timeSaved: 300, quality: 5, notes: "Prada-Meta: Monte Carlo simulation V1–V2 — Ray-Ban Meta → Prada-Meta context switch, $31M/yr ARR impact model", link: "https://pradacase-uakvemq6.manus.space/" },
  { id: "11", date: "2026-03-06", tool: "Manus AI", category: "Risk Modelling", duration: 45, timeSaved: 240, quality: 5, notes: "Prada-Meta: V3 lifetime cohort model — in-window vs. goodwill return paths, novelty drop frequency decomposition", link: "https://pradacase-uakvemq6.manus.space/" },
  { id: "12", date: "2026-03-06", tool: "Manus AI", category: "Risk Modelling", duration: 40, timeSaved: 200, quality: 5, notes: "Prada-Meta: V4 corrected model — 4-factor cosmetic damage probability chain (Beta distributions), cost reduced from $155.6M to $2.4M", link: "https://pradacase-uakvemq6.manus.space/" },
  { id: "13", date: "2026-03-07", tool: "Manus AI", category: "Risk Modelling", duration: 30, timeSaved: 150, quality: 5, notes: "Prada-Meta: V5 final audit — all parameters validated, 0.34% return rate, Nice-to-Fix severity, full interactive website published", link: "https://pradacase-uakvemq6.manus.space/" },
];

// ─── Benchmark profiles ───────────────────────────────────────────────────────
const BENCHMARK_AVG = [
  { key: "simulation", value: 30 },
  { key: "materials", value: 35 },
  { key: "dfm", value: 25 },
  { key: "cost", value: 40 },
  { key: "visual", value: 45 },
  { key: "research", value: 50 },
  { key: "docs", value: 55 },
  { key: "crossdiscipline", value: 30 },
];

const BENCHMARK_TOP = [
  { key: "simulation", value: 75 },
  { key: "materials", value: 80 },
  { key: "dfm", value: 70 },
  { key: "cost", value: 75 },
  { key: "visual", value: 85 },
  { key: "research", value: 88 },
  { key: "docs", value: 82 },
  { key: "crossdiscipline", value: 90 },
];

// ─── Improvement suggestions ──────────────────────────────────────────────────
const SUGGESTIONS = [
  {
    id: "s1",
    priority: "high",
    category: "Simulation & FEA",
    title: "Use AI to automate FEA pre-processing",
    description: "Tools like SimScale + GPT-4 API can auto-mesh and set boundary conditions from a natural language description of the load case. Reduces FEA setup time from hours to minutes.",
    tool: "SimScale + Manus AI",
    timeToLearn: "2–3 hrs",
    impact: "High",
  },
  {
    id: "s2",
    priority: "high",
    category: "DFM / Tolerancing",
    title: "AI-assisted GD&T tolerance stack-up",
    description: "Feed your assembly drawing to an AI with the tolerance stack-up method (worst-case or RSS) and get instant sensitivity analysis. Catches fit issues before physical prototypes.",
    tool: "Claude 3.5 / GPT-4o",
    timeToLearn: "1 hr",
    impact: "High",
  },
  {
    id: "s3",
    priority: "high",
    category: "Material Selection",
    title: "Build a personal AI material database",
    description: "Create a structured prompt template that queries Granta MI data via AI. Ask 'compare X and Y for this load case at this temperature' and get a ranked decision matrix instantly.",
    tool: "Manus AI + Granta MI",
    timeToLearn: "3 hrs",
    impact: "High",
  },
  {
    id: "s4",
    priority: "medium",
    category: "Cost Engineering",
    title: "AI-driven should-cost modelling",
    description: "Use AI to build parametric should-cost models from first principles — material cost + cycle time + overhead. Gives you negotiating leverage with suppliers at design review.",
    tool: "ChatGPT + Excel",
    timeToLearn: "2 hrs",
    impact: "Medium",
  },
  {
    id: "s5",
    priority: "medium",
    category: "Rendering / Visualization",
    title: "Generate CMF variants for design reviews",
    description: "Use image generation AI to rapidly produce CMF (color/material/finish) variants of CAD renders for stakeholder reviews. Eliminates the need for physical samples at early stages.",
    tool: "Manus AI / Midjourney",
    timeToLearn: "1 hr",
    impact: "Medium",
  },
  {
    id: "s6",
    priority: "medium",
    category: "Research Synthesis",
    title: "AI patent landscape analysis",
    description: "Feed competitor product teardowns + patent numbers to AI and get a structured freedom-to-operate summary. Identifies white space and risk areas in your design.",
    tool: "Claude 3.5 + Google Patents",
    timeToLearn: "2 hrs",
    impact: "Medium",
  },
  {
    id: "s7",
    priority: "low",
    category: "Documentation",
    title: "Auto-generate DVT test protocols",
    description: "Describe your product's use cases and failure modes to AI and get a structured DVT test protocol with pass/fail criteria. Saves 4–6 hrs per test plan.",
    tool: "Manus AI / ChatGPT",
    timeToLearn: "30 min",
    impact: "Medium",
  },
  {
    id: "s8",
    priority: "low",
    category: "Cross-disciplinary",
    title: "AI-assisted DFMEA generation",
    description: "Use AI to generate a first-pass DFMEA from a BOM + assembly drawing. Identifies failure modes you might miss and seeds the RPN scoring process.",
    tool: "GPT-4o + Excel",
    timeToLearn: "2 hrs",
    impact: "High",
  },
];

// ─── AI Tools Library ─────────────────────────────────────────────────────────
const TOOLS_LIBRARY = [
  {
    name: "Manus AI",
    category: "General / Multi-modal",
    useCase: "Simulation analysis, material selection, BOM review, rendering, research synthesis",
    hardwareRating: 5,
    url: "https://manus.im",
    tip: "Best for complex multi-step engineering workflows. Chain simulation → material → cost analysis in one session.",
  },
  {
    name: "Claude 3.5 Sonnet",
    category: "General / Reasoning",
    useCase: "Long-document analysis, tolerance stack-up, DFMEA, technical writing",
    hardwareRating: 5,
    url: "https://claude.ai",
    tip: "Superior at reading and reasoning over long datasheets and standards documents. Feed entire IPC specs and ask targeted questions.",
  },
  {
    name: "ChatGPT / GPT-4o",
    category: "General / Code",
    useCase: "Python scripts for parametric design, should-cost models, test protocol generation",
    hardwareRating: 4,
    url: "https://chatgpt.com",
    tip: "Use Code Interpreter to run parametric spring/beam calculations directly. Faster than setting up a Python environment.",
  },
  {
    name: "SimScale",
    category: "FEA / CFD",
    useCase: "Cloud FEA for structural, thermal, and fluid analysis without local solver licenses",
    hardwareRating: 5,
    url: "https://simscale.com",
    tip: "Free tier supports 3,000 core-hours/year. Use for quick sanity checks before committing to full Ansys runs.",
  },
  {
    name: "nTop (nTopology)",
    category: "Generative Design",
    useCase: "Topology optimisation for lightweight AR frame structures, lattice infill for 3D-printed prototypes",
    hardwareRating: 4,
    url: "https://ntop.com",
    tip: "Use nTop's field-driven design to optimise hinge geometry for minimum weight at target stiffness — directly relevant to AR frames.",
  },
  {
    name: "Midjourney / DALL-E",
    category: "Rendering / CMF",
    useCase: "CMF variant exploration, concept sketching, stakeholder presentation renders",
    hardwareRating: 3,
    url: "https://midjourney.com",
    tip: "Use reference images from your CAD renders + material keywords to get photorealistic CMF variants in minutes instead of days.",
  },
  {
    name: "Perplexity AI",
    category: "Research",
    useCase: "Supplier landscape research, regulatory compliance (RoHS, REACH), standards lookup",
    hardwareRating: 4,
    url: "https://perplexity.ai",
    tip: "Turn on 'Pro Search' mode and ask for supplier comparisons with citations. Much faster than manual Alibaba/ThomasNet searches.",
  },
  {
    name: "Notion AI",
    category: "Documentation",
    useCase: "DVT/PVT test protocol generation, design review summaries, DFMEA first drafts",
    hardwareRating: 3,
    url: "https://notion.so",
    tip: "Keep a running AI-assisted engineering notebook. Ask it to summarise last week's decisions and generate action items automatically.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem("ai_signal_sessions");
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_SESSIONS;
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem("ai_signal_sessions", JSON.stringify(sessions));
}

function computeSkillScores(sessions: Session[]) {
  const catMap: Record<string, number> = {};
  sessions.forEach(s => {
    catMap[s.category] = (catMap[s.category] || 0) + s.quality * s.duration;
  });
  const total = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;

  const map: Record<string, number> = {
    "Structural Analysis": "simulation",
    "Thermal Analysis": "simulation",
    "Material Selection": "materials",
    "DFM / Tolerancing": "dfm",
    "BOM / Cost Engineering": "cost",
    "Rendering / Visualization": "visual",
    "Supplier Research": "research",
    "Documentation": "docs",
    "Prototyping": "crossdiscipline",
    "Other": "crossdiscipline",
    "Cross-disciplinary": "crossdiscipline",
  } as any;

  const dimScores: Record<string, number> = {};
  SKILL_DIMS.forEach(d => { dimScores[d.key] = 0; });

  Object.entries(catMap).forEach(([cat, score]) => {
    const dim = map[cat] || "crossdiscipline";
    dimScores[dim] = (dimScores[dim] || 0) + score;
  });

  // Normalise to 0-100
  const maxVal = Math.max(...Object.values(dimScores), 1);
  return SKILL_DIMS.map(d => ({
    subject: d.label,
    You: Math.round((dimScores[d.key] / maxVal) * 95),
    "Avg HW Eng": BENCHMARK_AVG.find(b => b.key === d.key)?.value ?? 40,
    "Top 10%": BENCHMARK_TOP.find(b => b.key === d.key)?.value ?? 80,
  }));
}

function getStreak(sessions: Session[]): number {
  const dates = Array.from(new Set(sessions.map(s => s.date))).sort().reverse();
  if (!dates.length) return 0;
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const d of dates) {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    const diff = (cursor.getTime() - dt.getTime()) / 86400000;
    if (diff <= 1) { streak++; cursor = dt; }
    else break;
  }
  return streak;
}

function getWeeklyTrend(sessions: Session[]) {
  const weeks: Record<string, { sessions: number; timeSaved: number; score: number }> = {};
  sessions.forEach(s => {
    const d = new Date(s.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!weeks[key]) weeks[key] = { sessions: 0, timeSaved: 0, score: 0 };
    weeks[key].sessions++;
    weeks[key].timeSaved += s.timeSaved;
    weeks[key].score += s.quality;
  });
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, v]) => ({
      week: week.slice(5),
      sessions: v.sessions,
      timeSaved: Math.round(v.timeSaved / 60),
      avgQuality: +(v.score / v.sessions).toFixed(1),
    }));
}

function getEffectivenessScore(sessions: Session[]): number {
  if (!sessions.length) return 0;
  const breadth = new Set(sessions.map(s => s.category)).size / CATEGORIES.length;
  const depth = sessions.reduce((a, s) => a + s.quality, 0) / (sessions.length * 5);
  const volume = Math.min(sessions.length / 50, 1);
  const timeSaved = Math.min(sessions.reduce((a, s) => a + s.timeSaved, 0) / 3000, 1);
  return Math.round((breadth * 0.25 + depth * 0.35 + volume * 0.2 + timeSaved * 0.2) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = "#00d4ff" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="border border-slate-800 bg-[#0d1117] p-4 flex flex-col gap-1 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 80% 20%, ${color}, transparent 60%)` }} />
      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500">{label}</span>
      <span className="text-3xl font-mono font-bold" style={{ color }}>{value}</span>
      {sub && <span className="text-[10px] font-mono text-slate-600">{sub}</span>}
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => onChange?.(i)}
          className={`text-lg transition-colors ${i <= value ? "text-amber-400" : "text-slate-700"} ${onChange ? "hover:text-amber-300 cursor-pointer" : "cursor-default"}`}
        >★</button>
      ))}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return (
    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border rounded ${colors[priority] || colors.low}`}>
      {priority}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AISignal() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [activeTab, setActiveTab] = useState<"dashboard" | "log" | "tools" | "suggestions">("dashboard");
  const [showLogForm, setShowLogForm] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    tool: "Manus AI",
    category: CATEGORIES[0],
    duration: 30,
    timeSaved: 60,
    quality: 4,
    notes: "",
  });

  useEffect(() => { saveSessions(sessions); }, [sessions]);

  const addSession = useCallback(() => {
    const s: Session = { ...form, id: Date.now().toString() };
    setSessions(prev => [s, ...prev]);
    setShowLogForm(false);
    setForm(f => ({ ...f, notes: "" }));
  }, [form]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  const score = getEffectivenessScore(sessions);
  const streak = getStreak(sessions);
  const totalTimeSaved = sessions.reduce((a, s) => a + s.timeSaved, 0);
  const totalSessions = sessions.length;
  const avgQuality = sessions.length ? (sessions.reduce((a, s) => a + s.quality, 0) / sessions.length).toFixed(1) : "0.0";
  const skillData = computeSkillScores(sessions);
  const weeklyTrend = getWeeklyTrend(sessions);
  const catBreakdown = CATEGORIES.map(cat => ({
    cat: cat.split("/")[0].trim(),
    count: sessions.filter(s => s.category === cat).length,
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

  const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/ai_tracker_hero_bg-fHckMQSHHz2SNvWzgY4Pcs.webp";
  const RADAR_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/ai_tracker_avatar_bg-bs5rdCT5349tXGgS8at2v4.webp";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "log", label: "Session Log", icon: "⊞" },
    { id: "tools", label: "AI Tools", icon: "⊕" },
    { id: "suggestions", label: "Improve", icon: "↑" },
  ] as const;

  const filteredSuggestions = SUGGESTIONS.filter(s =>
    (filterCat === "All" || s.category === filterCat) &&
    (filterPriority === "All" || s.priority === filterPriority)
  );

  return (
    <div
      className="flex h-screen bg-[#0a0a0f] text-slate-200 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Left Sidebar ── */}
      <aside className="w-52 shrink-0 flex flex-col border-r border-slate-800/60 bg-[#0d1117]">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <img src={RADAR_BG} alt="" className="w-8 h-8 rounded-full opacity-80" />
            <div>
              <div className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase">AI Signal</div>
              <div className="text-[9px] font-mono text-slate-600 tracking-wider">HW Engineer Tracker</div>
            </div>
          </div>
        </div>

        {/* Score gauge */}
        <div className="px-4 py-4 border-b border-slate-800/60">
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-slate-600 mb-1">Effectiveness Score</div>
          <div className="text-4xl font-mono font-bold text-cyan-400">{score}</div>
          <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${score}%`, background: "linear-gradient(90deg, #00d4ff, #00ff88)" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] font-mono text-slate-700">0</span>
            <span className="text-[8px] font-mono text-slate-700">100</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                activeTab === item.id
                  ? "text-cyan-400 bg-cyan-400/5 border-r-2 border-cyan-400"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[11px] font-mono tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick stats */}
        <div className="px-4 py-4 border-t border-slate-800/60 space-y-2">
          <div className="flex justify-between">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Streak</span>
            <span className="text-[11px] font-mono text-amber-400">{streak}d 🔥</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Sessions</span>
            <span className="text-[11px] font-mono text-cyan-400">{totalSessions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">Hrs Saved</span>
            <span className="text-[11px] font-mono text-green-400">{(totalTimeSaved / 60).toFixed(0)}h</span>
          </div>
        </div>

        {/* Back link */}
        <div className="px-4 py-3 border-t border-slate-800/60">
          <a href="/" className="text-[9px] font-mono text-slate-700 hover:text-slate-400 transition-colors uppercase tracking-wider">
            ← Program Site
          </a>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div>
            {/* Hero banner */}
            <div
              className="relative h-40 flex items-end px-8 pb-6"
              style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center top" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
              <div className="relative z-10">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400/70 mb-1">
                  IC7 Hardware Engineer · Reality Labs · AR & Smart Glasses
                </div>
                <h1 className="text-2xl font-mono font-bold text-white">
                  AI Effectiveness Dashboard
                </h1>
              </div>
              <button
                onClick={() => setShowLogForm(true)}
                className="relative z-10 ml-auto bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-mono font-bold px-4 py-2 transition-colors tracking-wider uppercase"
              >
                + Log Session
              </button>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800/40 mx-6 mt-6">
              <KpiCard label="Effectiveness Score" value={score} sub="out of 100" color="#00d4ff" />
              <KpiCard label="Total Sessions" value={totalSessions} sub="all time" color="#00d4ff" />
              <KpiCard label="Hours Saved" value={`${(totalTimeSaved / 60).toFixed(0)}h`} sub={`${totalTimeSaved} min total`} color="#00ff88" />
              <KpiCard label="Avg Quality" value={avgQuality} sub="out of 5.0" color="#ffb347" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6">
              {/* Skill Radar */}
              <div className="border border-slate-800 bg-[#0d1117] p-5">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-4">Skill Radar vs Benchmarks</div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={skillData}>
                    <PolarGrid stroke="#1e2a3a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }} />
                    <Radar name="Top 10%" dataKey="Top 10%" stroke="#ffb347" fill="#ffb347" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 2" />
                    <Radar name="Avg HW Eng" dataKey="Avg HW Eng" stroke="#334155" fill="#334155" fillOpacity={0.1} strokeWidth={1} strokeDasharray="2 2" />
                    <Radar name="You" dataKey="You" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip
                      contentStyle={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 0, fontFamily: "monospace", fontSize: 11 }}
                      labelStyle={{ color: "#94a3b8" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2">
                  {[{ color: "#00d4ff", label: "You" }, { color: "#ffb347", label: "Top 10%" }, { color: "#334155", label: "Avg HW Eng" }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5" style={{ background: l.color }} />
                      <span className="text-[9px] font-mono text-slate-500">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly trend */}
              <div className="border border-slate-800 bg-[#0d1117] p-5">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-4">Weekly Time Saved (hrs)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={weeklyTrend}>
                    <defs>
                      <linearGradient id="tsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                    <XAxis dataKey="week" tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }} />
                    <YAxis tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }} />
                    <Tooltip
                      contentStyle={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 0, fontFamily: "monospace", fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="timeSaved" stroke="#00d4ff" fill="url(#tsGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="px-6 mt-6 mb-8">
              <div className="border border-slate-800 bg-[#0d1117] p-5">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-4">Sessions by Category</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={catBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }} />
                    <YAxis type="category" dataKey="cat" tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }} width={110} />
                    <Tooltip
                      contentStyle={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 0, fontFamily: "monospace", fontSize: 11 }}
                    />
                    <Bar dataKey="count" radius={0}>
                      {catBreakdown.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#00d4ff" : i === 1 ? "#00b8d9" : "#0e7490"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── LOG TAB ── */}
        {activeTab === "log" && (
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-mono font-bold text-white">Session Log</h2>
                <p className="text-[10px] font-mono text-slate-600 mt-0.5">Record every AI-assisted engineering session</p>
              </div>
              <button
                onClick={() => setShowLogForm(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-mono font-bold px-4 py-2 transition-colors tracking-wider uppercase"
              >
                + New Session
              </button>
            </div>

            {/* Log form */}
            {showLogForm && (
              <div className="border border-cyan-500/30 bg-[#0d1117] p-6 mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 mb-4">Log New Session</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Date", field: "date", type: "date" },
                    { label: "Duration (min)", field: "duration", type: "number" },
                    { label: "Time Saved (min)", field: "timeSaved", type: "number" },
                  ].map(({ label, field, type }) => (
                    <div key={field}>
                      <label className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1">{label}</label>
                      <input
                        type={type}
                        value={(form as any)[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: type === "number" ? +e.target.value : e.target.value }))}
                        className="w-full bg-[#0a0a0f] border border-slate-700 text-slate-200 text-[11px] font-mono px-3 py-2 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Tool</label>
                    <select
                      value={form.tool}
                      onChange={e => setForm(f => ({ ...f, tool: e.target.value }))}
                      className="w-full bg-[#0a0a0f] border border-slate-700 text-slate-200 text-[11px] font-mono px-3 py-2 focus:outline-none focus:border-cyan-500"
                    >
                      {TOOLS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-[#0a0a0f] border border-slate-700 text-slate-200 text-[11px] font-mono px-3 py-2 focus:outline-none focus:border-cyan-500"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Quality</label>
                    <StarRating value={form.quality} onChange={v => setForm(f => ({ ...f, quality: v }))} />
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <label className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Notes</label>
                    <input
                      type="text"
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="What did you accomplish with AI?"
                      className="w-full bg-[#0a0a0f] border border-slate-700 text-slate-200 text-[11px] font-mono px-3 py-2 focus:outline-none focus:border-cyan-500 placeholder-slate-700"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={addSession} className="bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-mono font-bold px-5 py-2 transition-colors uppercase tracking-wider">
                    Save Session
                  </button>
                  <button onClick={() => setShowLogForm(false)} className="border border-slate-700 text-slate-400 text-[11px] font-mono px-5 py-2 hover:border-slate-500 transition-colors uppercase tracking-wider">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Sessions table */}
            <div className="border border-slate-800 bg-[#0d1117] overflow-hidden">
              <table className="w-full text-[11px] font-mono">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Date", "Tool", "Category", "Duration", "Time Saved", "Quality", "Notes", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[9px] uppercase tracking-widest text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, i) => (
                    <tr key={s.id} className={`border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors ${i % 2 === 0 ? "" : "bg-slate-900/20"}`}>
                      <td className="px-4 py-3 text-slate-400">{s.date}</td>
                      <td className="px-4 py-3 text-cyan-400">{s.tool}</td>
                      <td className="px-4 py-3 text-slate-300">{s.category}</td>
                      <td className="px-4 py-3 text-slate-400">{s.duration}m</td>
                      <td className="px-4 py-3 text-green-400">{s.timeSaved}m</td>
                      <td className="px-4 py-3"><StarRating value={s.quality} /></td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs">
                        <span className="truncate block">{s.notes}</span>
                        {s.link && (
                          <a href={s.link} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-[9px] font-mono text-cyan-500 hover:text-cyan-300 border border-cyan-900 hover:border-cyan-600 px-1.5 py-0.5 transition-colors">
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3H3a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1V7M7 1h4m0 0v4m0-4L5 7"/></svg>
                            VIEW SITE
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteSession(s.id)} className="text-slate-700 hover:text-red-400 transition-colors text-xs">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TOOLS TAB ── */}
        {activeTab === "tools" && (
          <div className="px-6 py-6">
            <div className="mb-6">
              <h2 className="text-lg font-mono font-bold text-white">AI Tools Library</h2>
              <p className="text-[10px] font-mono text-slate-600 mt-0.5">Curated for AR hardware & smart glasses engineering workflows</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {TOOLS_LIBRARY.map(tool => (
                <div key={tool.name} className="border border-slate-800 bg-[#0d1117] p-5 hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                        {tool.name} ↗
                      </a>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-slate-600 mt-0.5">{tool.category}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`text-xs ${i <= tool.hardwareRating ? "text-amber-400" : "text-slate-800"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">{tool.useCase}</p>
                  <div className="border-l-2 border-cyan-500/30 pl-3">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-cyan-500/60 mb-0.5">Pro Tip</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{tool.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUGGESTIONS TAB ── */}
        {activeTab === "suggestions" && (
          <div className="px-6 py-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-mono font-bold text-white">Improvement Roadmap</h2>
                <p className="text-[10px] font-mono text-slate-600 mt-0.5">Targeted actions to reach top-decile AI usage in hardware engineering</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterPriority}
                  onChange={e => setFilterPriority(e.target.value)}
                  className="bg-[#0d1117] border border-slate-700 text-slate-300 text-[10px] font-mono px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  {["All", "high", "medium", "low"].map(p => <option key={p} value={p}>{p === "All" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
                <select
                  value={filterCat}
                  onChange={e => setFilterCat(e.target.value)}
                  className="bg-[#0d1117] border border-slate-700 text-slate-300 text-[10px] font-mono px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Categories</option>
                  {Array.from(new Set(SUGGESTIONS.map(s => s.category))).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredSuggestions.map(s => (
                <div key={s.id} className="border border-slate-800 bg-[#0d1117] p-5 hover:border-slate-700 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <PriorityBadge priority={s.priority} />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600 border border-slate-800 px-2 py-0.5">{s.category}</span>
                  </div>
                  <h3 className="text-[13px] font-mono font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{s.description}</p>
                  <div className="flex gap-6 text-[9px] font-mono">
                    <div>
                      <span className="text-slate-600 uppercase tracking-wider">Tool: </span>
                      <span className="text-cyan-400">{s.tool}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 uppercase tracking-wider">Learn: </span>
                      <span className="text-amber-400">{s.timeToLearn}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 uppercase tracking-wider">Impact: </span>
                      <span className={s.impact === "High" ? "text-green-400" : "text-amber-400"}>{s.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
