/* ============================================================
   SCRATCH & EJECTION ASSESSMENT DASHBOARD
   Design: "Incident Report" — Dark Technical Dashboard
   Narrative: Internal test → Field evidence → Correlation analysis
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

/* ── Intersection Observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Animated counter ── */
function AnimatedNumber({ value, suffix = "", duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased * 10) / 10);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);
  return <span ref={ref}>{display % 1 === 0 ? display.toFixed(0) : display.toFixed(1)}{suffix}</span>;
}

/* ── Section wrapper with fade-in ── */
function Section({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, inView } = useInView(0.08);
  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      {children}
    </section>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, suffix = "", severity = "neutral", subtext = "" }: {
  label: string; value: number; suffix?: string;
  severity?: "critical" | "warning" | "safe" | "info" | "neutral"; subtext?: string;
}) {
  const borderColor = {
    critical: "border-[#F43F5E]/30",
    warning: "border-[#FBBF24]/30",
    safe: "border-[#34D399]/30",
    info: "border-[#38BDF8]/30",
    neutral: "border-[#A1A1AA]/20",
  }[severity];
  const glowClass = severity === "critical" ? "card-glow-critical" : severity === "warning" ? "card-glow-warning" : "";
  const numColor = {
    critical: "text-[#F43F5E]",
    warning: "text-[#FBBF24]",
    safe: "text-[#34D399]",
    info: "text-[#38BDF8]",
    neutral: "text-zinc-200",
  }[severity];

  return (
    <div className={`bg-zinc-900/80 border ${borderColor} rounded-lg p-5 ${glowClass}`}>
      <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
      <p className={`text-4xl md:text-5xl font-display font-bold ${numColor} leading-none`}>
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      {subtext && <p className="text-xs text-zinc-500 mt-2">{subtext}</p>}
    </div>
  );
}

/* ── Quote card ── */
function QuoteCard({ quote, source, date, severity = "neutral" }: {
  quote: string; source: string; date: string;
  severity?: "critical" | "warning" | "safe" | "info" | "neutral";
}) {
  const borderColor = {
    critical: "border-l-[#F43F5E]",
    warning: "border-l-[#FBBF24]",
    safe: "border-l-[#34D399]",
    info: "border-l-[#38BDF8]",
    neutral: "border-l-zinc-600",
  }[severity];
  return (
    <div className={`bg-zinc-900/50 border-l-2 ${borderColor} pl-4 pr-4 py-3 rounded-r-md`}>
      <p className="text-sm text-zinc-300 italic leading-relaxed">"{quote}"</p>
      <p className="text-[10px] font-mono text-zinc-600 mt-2">{source} · {date}</p>
    </div>
  );
}

/* ── Badge ── */
function Badge({ label, severity }: { label: string; severity: "critical" | "warning" | "safe" | "info" }) {
  const cls = `badge-${severity}`;
  return <span className={`${cls} text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full`}>{label}</span>;
}

/* ── Horizontal bar ── */
function HBar({ label, value, max, color, suffix = "%" }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const { ref, inView } = useInView();
  const pct = (value / max) * 100;
  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-xs font-mono text-zinc-300">{value}{suffix}</span>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: inView ? `${pct}%` : "0%", backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return <div className="container"><div className="border-t border-zinc-800/60" /></div>;
}

/* ── Nav ── */
function Nav() {
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const links = [
    { id: "question", label: "Core Question" },
    { id: "internal-data", label: "Internal Test Data" },
    { id: "field-ejection", label: "Field: Ejection" },
    { id: "field-scratching", label: "Field: Scratching" },
    { id: "frame-case", label: "Frame × Case" },
    { id: "lens", label: "Lens" },
    { id: "structural", label: "Structural" },
    { id: "oakley", label: "Oakley" },
    { id: "finish", label: "Finish" },
    { id: "aftermarket", label: "Aftermarket" },
    { id: "conclusion", label: "Conclusion" },
  ];

  const handleNav = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600">Assessment</p>
            <p className="text-xs font-display font-semibold text-zinc-200">Ejection & Scratch Correlation</p>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-zinc-400 hover:text-zinc-200 p-1">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNav(l.id)}
                className={`text-[10px] px-2.5 py-1 rounded-full transition-colors ${
                  active === l.id ? "text-zinc-100 bg-zinc-800" : "text-zinc-500 bg-zinc-900 hover:text-zinc-300"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <nav className="fixed left-0 top-0 h-full w-52 bg-zinc-950/90 backdrop-blur-sm border-r border-zinc-800/60 z-50 hidden lg:flex flex-col pt-8 px-4">
        <div className="mb-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">Assessment</p>
          <p className="text-sm font-display font-semibold text-zinc-200 mt-1">Ejection & Scratch</p>
          <p className="text-sm font-display font-semibold text-zinc-200">Correlation Study</p>
        </div>
        <div className="flex flex-col gap-0.5">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => { e.preventDefault(); handleNav(l.id); }}
              className={`text-xs px-3 py-1.5 rounded transition-colors ${
                active === l.id ? "text-zinc-100 bg-zinc-800/60" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="mt-auto pb-6">
          <p className="text-[9px] font-mono text-zinc-700">March 2026</p>
          <p className="text-[9px] font-mono text-zinc-700">Internal Use Only</p>
        </div>
      </nav>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function ScratchAssessment() {

  /* ── Chart: Ejection rates ── */
  const ejectionData = {
    labels: ["Rhea\n(RB Gen 1&2)", "RBM3\n(Unreleased)", "PLS\n(HSTN)", "Paloma\n(Vanguard)", "Hera\n(Display)", "Modelo\n(Unreleased)", "Luna\n(Unreleased)"],
    datasets: [{
      label: "Ejection Rate (%)",
      data: [2, 2.8, 60.3, 50, 0, 25, 35],
      backgroundColor: ["#34D399","#34D399","#F43F5E","#F43F5E","#34D399","#FBBF24","#FBBF24"],
      borderRadius: 4,
      barThickness: 28,
    }],
  };

  /* ── Chart: Complaint distribution ── */
  const complaintDistData = {
    labels: ["Frame — Case-Induced", "Frame — User/Factory", "Lens — Case-Induced", "Lens — User/Handling", "Structural — Case", "Extraction Difficulty"],
    datasets: [{
      data: [16, 3, 2, 4, 4, 4],
      backgroundColor: ["#F43F5E", "#FB7185", "#38BDF8", "#7DD3FC", "#FBBF24", "#A1A1AA"],
      borderColor: "transparent",
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  /* ── Chart: Mechanism breakdown ── */
  const mechanismData = {
    labels: ["Insertion/Removal Friction", "Arm Overlap Abrasion", "Thermal Adhesion", "Sustained Pressure Warping", "Extraction Difficulty"],
    datasets: [{
      label: "Documented Instances",
      data: [7, 3, 3, 1, 4],
      backgroundColor: "#F43F5E",
      borderRadius: 4,
      barThickness: 20,
    }],
  };

  const chartTooltipStyle = {
    backgroundColor: "#18181B",
    titleColor: "#E4E4E7",
    bodyColor: "#A1A1AA",
    borderColor: "#27272A",
    borderWidth: 1,
    padding: 12,
    bodyFont: { family: "'JetBrains Mono', monospace" as const, size: 11 },
  };

  return (
    <div className="min-h-screen bg-[#09090B]">
      <Nav />

      <div className="lg:ml-52">
        {/* Mobile spacer */}
        <div className="lg:hidden h-14" />

        {/* ════════════════════════════════════════════════════════════
            PART 1: THE QUESTION
            ════════════════════════════════════════════════════════════ */}
        <header className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/hero-scratched-glasses-MipmdFMwUDwuwRxxwV9tYq.webp)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/50 via-[#09090B]/80 to-[#09090B]" />
          <div className="relative container py-20 md:py-28">
            <div className="flex items-center gap-3 mb-6">
              <Badge label="Internal" severity="info" />
              <Badge label="Q1 2026" severity="info" />
              <Badge label="Correlation Study" severity="warning" />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.08] max-w-4xl">
              Ejection vs. Field Damage:<br />
              <span className="text-zinc-500">A Correlation Study</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mt-4 max-w-3xl font-display">
              Glasses ejection out of the charging case upon drop
            </p>
            <p className="text-sm md:text-base text-zinc-500 mt-3 max-w-3xl leading-relaxed">
              Evaluating whether high glasses ejection rates from the charging case during internal 1m reliability drop testing correlate to user complaints, dissatisfaction, or product returns in the field.
            </p>
          </div>
        </header>

        {/* ── CORE QUESTION ── */}
        <Section id="question" className="container py-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600 mb-2">Study Framework</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">The Core Question</h2>

          <div className="bg-zinc-900/80 border border-[#38BDF8]/20 rounded-lg p-6 md:p-8 mb-8">
            <p className="text-lg md:text-xl text-zinc-200 leading-relaxed font-display">
              Does a high ejection rate of glasses out from the case during internal 1m reliability drop testing correlate to field complaints from users — or induce returns — as a result of the glasses ejecting upon accidental drop and being scratched?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-lg p-5">
              <div className="w-8 h-8 rounded-full bg-[#38BDF8]/10 flex items-center justify-center mb-3">
                <span className="text-[#38BDF8] font-mono font-bold text-sm">1</span>
              </div>
              <h3 className="text-sm font-display font-semibold text-zinc-200 mb-2">Internal Test Data</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Review our 1m drop test ejection rates across the full product portfolio to understand the scope of the engineering concern.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-lg p-5">
              <div className="w-8 h-8 rounded-full bg-[#38BDF8]/10 flex items-center justify-center mb-3">
                <span className="text-[#38BDF8] font-mono font-bold text-sm">2</span>
              </div>
              <h3 className="text-sm font-display font-semibold text-zinc-200 mb-2">Field Evidence</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Search public consumer feedback across all major platforms for evidence of ejection-induced complaints, scratching, and returns.</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-lg p-5">
              <div className="w-8 h-8 rounded-full bg-[#38BDF8]/10 flex items-center justify-center mb-3">
                <span className="text-[#38BDF8] font-mono font-bold text-sm">3</span>
              </div>
              <h3 className="text-sm font-display font-semibold text-zinc-200 mb-2">Correlation Analysis</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Determine whether internal ejection rates predict real-world damage — and identify what is actually driving scratch complaints.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">Data Sources: Reddit</span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">Facebook Groups</span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">Amazon Reviews</span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">TikTok</span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">Trustpilot</span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">Internal Test Results</span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-3 py-1 rounded-full">Returns Department</span>
          </div>
        </Section>

        <Divider />

        {/* ════════════════════════════════════════════════════════════
            PART 2: INTERNAL TEST DATA
            ════════════════════════════════════════════════════════════ */}
        <Section id="internal-data" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Internal Data" severity="warning" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600">Step 1 of 3</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Internal 1m Drop Test Results</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-4">
            Our reliability testing measures glasses ejection rate when the closed charging case is dropped from 1 meter. All cases in the portfolio exhibit lid pop-open behavior on impact. The following data represents <span className="text-zinc-200 font-semibold">internal lab results only</span> and does not represent any findings from the field.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            The returns department has <span className="text-zinc-200 font-semibold">not received any reports</span> indicating that users return glasses specifically due to ejection from the case in the market.
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Highest Ejection" value={60.3} suffix="%" severity="critical" subtext="Oakley HSTN (PLS)" />
            <StatCard label="Lowest Ejection" value={0} suffix="%" severity="safe" subtext="RB Meta Display (Hera)" />
            <StatCard label="Programs Tested" value={7} severity="info" subtext="Across full portfolio" />
            <StatCard label="Return Reports" value={0} severity="safe" subtext="Ejection-related returns" />
          </div>

          {/* Ejection bar chart */}
          <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Glasses Ejection Rate by Program — 1m Drop Test</h3>
            <Bar
              data={ejectionData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { ...chartTooltipStyle, callbacks: { label: (ctx: any) => `Ejection Rate: ${ctx.raw}%` } },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#A1A1AA", font: { family: "'Inter', sans-serif", size: 10 }, maxRotation: 0 },
                  },
                  y: {
                    grid: { color: "rgba(63,63,70,0.3)" },
                    ticks: { color: "#71717A", font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (val: any) => `${val}%` },
                    max: 70,
                  },
                },
              }}
            />
          </div>

          {/* Data table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Program</th>
                  <th className="text-left py-3 px-4 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Product</th>
                  <th className="text-center py-3 px-4 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Lid Pops Open</th>
                  <th className="text-center py-3 px-4 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Ejection Rate</th>
                  <th className="text-center py-3 px-4 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Return Driver?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { code: "Rhea", name: "Ray-Ban Meta Gen 1 & 2 (same case)", lid: "Yes", rate: "2%", rateNum: 2, driver: "N" },
                  { code: "RBM3", name: "Unreleased", lid: "Yes", rate: "2.8%", rateNum: 2.8, driver: "N/A" },
                  { code: "PLS", name: "Oakley HSTN", lid: "Yes", rate: "~60.3%", rateNum: 60.3, driver: "N" },
                  { code: "Paloma", name: "Oakley Vanguard", lid: "Yes", rate: "~50%", rateNum: 50, driver: "N" },
                  { code: "Hera", name: "Ray-Ban Meta Display", lid: "Yes", rate: "0%", rateNum: 0, driver: "N" },
                  { code: "Modelo", name: "Unreleased", lid: "Yes", rate: "~25%", rateNum: 25, driver: "N/A" },
                  { code: "Luna", name: "Unreleased (Proto 1)", lid: "Yes", rate: "~35%", rateNum: 35, driver: "N/A" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-300">{row.code}</td>
                    <td className="py-3 px-4 text-zinc-400">{row.name}</td>
                    <td className="py-3 px-4 text-center text-[#FBBF24]">{row.lid}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-semibold ${
                        row.rateNum >= 50 ? "text-[#F43F5E]" :
                        row.rateNum >= 20 ? "text-[#FBBF24]" :
                        "text-[#34D399]"
                      }`}>{row.rate}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-zinc-500">{row.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-lg p-5">
            <p className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-[#38BDF8] font-semibold">Key observation:</span> All case lids can pop open on drop — no case in the portfolio has a positive latch mechanism. Ejection rates range from 0% (Hera) to ~60% (PLS/HSTN). Despite these rates, the returns department has not flagged ejection as a return driver for any shipped product. This raises the question: is the ejection event actually causing damage that users notice and complain about?
            </p>
          </div>
        </Section>

        <Divider />

        {/* ════════════════════════════════════════════════════════════
            PART 3: FIELD EVIDENCE — EJECTION
            ════════════════════════════════════════════════════════════ */}
        <Section id="field-ejection" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Field Data" severity="safe" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600">Step 2a of 3</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Field Evidence: Ejection-Specific Complaints</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            A comprehensive search was conducted across all major consumer platforms to find reports of glasses ejecting from the charging case during drops, and resulting damage.
          </p>

          {/* The finding: zero */}
          <div className="bg-zinc-900/80 border border-[#34D399]/20 rounded-lg p-8 mb-8 text-center">
            <p className="text-6xl md:text-8xl font-display font-bold text-[#34D399] leading-none mb-3">0</p>
            <p className="text-sm text-zinc-300 font-display font-semibold">Direct ejection complaints found</p>
            <p className="text-xs text-zinc-500 mt-2 max-w-lg mx-auto">
              Across Reddit (4 subreddits, 30K+ members), Facebook Groups (70K+ members), Amazon (1,386 reviews), TikTok (3.2M+ related posts), and Trustpilot — zero consumers reported glasses ejecting from the case during a drop as a specific complaint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-lg p-5">
              <h3 className="text-sm font-display font-semibold text-zinc-200 mb-3">Platforms Searched</h3>
              <div className="space-y-2">
                {[
                  { platform: "Reddit", scope: "r/RayBanStories, r/RaybanMeta, r/OakleyMetaGlasses, r/MetaRayBanDisplay", result: "0 ejection reports" },
                  { platform: "Facebook Groups", scope: "Ray-Ban Meta groups (50K+ combined)", result: "0 ejection reports" },
                  { platform: "Amazon", scope: "Ray-Ban Meta Gen 2 (1,386 reviews)", result: "0 ejection reports" },
                  { platform: "TikTok", scope: "3.2M+ posts on related topics", result: "0 ejection reports" },
                  { platform: "Trustpilot", scope: "ray-ban.com reviews", result: "0 ejection reports" },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#34D399] mt-0.5 shrink-0">&#10003;</span>
                    <div>
                      <p className="text-xs text-zinc-300">{p.platform}</p>
                      <p className="text-[10px] text-zinc-600">{p.scope}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#34D399] ml-auto shrink-0">{p.result}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-lg p-5">
              <h3 className="text-sm font-display font-semibold text-zinc-200 mb-3">Internal Returns Data</h3>
              <div className="bg-zinc-800/30 rounded-md p-4 mb-3">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The returns department has <span className="text-[#34D399] font-semibold">not received any reports</span> indicating that users return glasses specifically due to ejection from the case upon accidental drop.
                </p>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                This is consistent with the public complaint data: even for products with high ejection rates (HSTN ~60%, Vanguard ~50%), neither internal returns data nor public consumer feedback identifies ejection as a standalone complaint or return driver.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-[#34D399]/10 rounded-lg p-5">
            <p className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-[#34D399] font-semibold">Preliminary finding:</span> High internal ejection rates do not appear to correlate with ejection-specific field complaints or returns. However, this does not mean the glasses are not being scratched in the field. The next section examines what consumers <em>are</em> actually complaining about.
            </p>
          </div>
        </Section>

        <Divider />

        {/* ════════════════════════════════════════════════════════════
            PART 4: FIELD EVIDENCE — WHAT IS ACTUALLY GETTING SCRATCHED
            ════════════════════════════════════════════════════════════ */}
        <Section id="field-scratching" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Field Data" severity="critical" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600">Step 2b of 3</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Field Evidence: How Glasses Are Actually Getting Scratched</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            While ejection is not a reported complaint, the charging case is a significant source of damage through other mechanisms. The following data categorizes all documented scratch and damage complaints across three axes.
          </p>

          {/* Overview stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Complaints" value={33} severity="critical" subtext="Documented instances" />
            <StatCard label="Case-Induced" value={67} suffix="%" severity="critical" subtext="Of all complaints" />
            <StatCard label="Frame Damage" value={59} suffix="%" severity="warning" subtext="Dominant damage type" />
            <StatCard label="Durability Negative" value={69} suffix="%" severity="warning" subtext="Amazon Gen 2 reviews" />
          </div>

          {/* Complaint distribution */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <h3 className="text-lg font-display font-semibold text-zinc-200 mb-4">Complaint Distribution by Category</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Frame scratching caused by the charging case is the single largest complaint category, accounting for roughly half of all documented complaints. Notably, none of these complaints mention ejection as the cause — the damage occurs during normal case interaction.
              </p>
              <div className="space-y-2">
                {[
                  { color: "#F43F5E", label: "Frame — Case-Induced (16)", pct: "48%" },
                  { color: "#FB7185", label: "Frame — User/Factory (3)", pct: "9%" },
                  { color: "#38BDF8", label: "Lens — Case-Induced (2)", pct: "6%" },
                  { color: "#7DD3FC", label: "Lens — User/Handling (4)", pct: "12%" },
                  { color: "#FBBF24", label: "Structural — Case (4)", pct: "12%" },
                  { color: "#A1A1AA", label: "Extraction Difficulty (4)", pct: "12%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-zinc-400 flex-1">{item.label}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-[300px] mx-auto">
              <Doughnut
                data={complaintDistData}
                options={{
                  cutout: "65%",
                  plugins: {
                    legend: { display: false },
                    tooltip: chartTooltipStyle,
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-[#F43F5E]/10 rounded-lg p-5">
            <p className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-[#F43F5E] font-semibold">Critical insight:</span> The charging case is causing real damage in the field — but through insertion/removal friction, thermal adhesion, arm overlap abrasion, and extraction difficulty. Not through ejection on drop. The following sections break down each damage category in detail.
            </p>
          </div>
        </Section>

        <Divider />

        {/* ════════════════════════════════════════════════════════════
            DEEP DIVE: FRAME × CASE SCRATCHING
            ════════════════════════════════════════════════════════════ */}
        <Section id="frame-case" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Critical" severity="critical" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600">Deep Dive</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Frame Scratches — Case-Induced</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            The charging case scratches the frame during insertion, removal, storage, and charging. Damage occurs at predictable contact points: nose bridge, front face, and arm overlap zones. This has persisted unchanged from Gen 1 (2024) through Gen 2 (March 2026).
          </p>

          {/* Mechanism breakdown */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Scratch Mechanisms</h3>
              <div className="bg-zinc-900/60 rounded-lg p-5 border border-zinc-800/40">
                <Bar
                  data={mechanismData}
                  options={{
                    indexAxis: "y" as const,
                    plugins: { legend: { display: false }, tooltip: chartTooltipStyle },
                    scales: {
                      x: { grid: { color: "rgba(63,63,70,0.3)" }, ticks: { color: "#71717A", font: { family: "'JetBrains Mono', monospace", size: 10 } } },
                      y: { grid: { display: false }, ticks: { color: "#A1A1AA", font: { family: "'Inter', sans-serif", size: 11 } } },
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Mechanism Details</h3>
              <div className="space-y-3">
                {[
                  { name: "Insertion/Removal Friction", desc: "Hard interior contact points scrape frame during sliding in/out", products: "All Ray-Ban Meta, Oakley HSTN" },
                  { name: "Arm Overlap Abrasion", desc: "Folded arms rub against each other at overlap points inside case", products: "All Ray-Ban Meta" },
                  { name: "Thermal Adhesion", desc: "Charging heat causes case lining (suede/felt) to bond to frame surface", products: "Ray-Ban Meta Gen 1 & 2" },
                  { name: "Sustained Pressure Warping", desc: "Case too snug + charging clip = frame deformation over time", products: "Ray-Ban Meta Large Wayfarer" },
                  { name: "Extraction Difficulty", desc: "Tight charging clip requires excessive force to remove glasses", products: "Oakley HSTN" },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-900/40 border border-zinc-800/30 rounded-md p-3">
                    <p className="text-xs font-semibold text-zinc-200">{m.name}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">{m.desc}</p>
                    <p className="text-[10px] font-mono text-zinc-600 mt-1">Affects: {m.products}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consumer quotes */}
          <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Consumer Voices</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            <QuoteCard quote="Sliding the meta glasses in and out of the charger scratches the face/frame. It's quite annoying the oversight of the case design." source="Reddit r/MetaRayBanDisplay" date="Oct 2025" severity="critical" />
            <QuoteCard quote="I have only had these 2 weeks and they are scratched to shit from the case. The arms folded over to fit in the case is rubbing and destroying the finish." source="Facebook Ray-ban meta Forum" date="Aug 2025" severity="critical" />
            <QuoteCard quote="When I charge my glasses have scratches on the front when I slip it into the charging case. Does it do it to you too?" source="Reddit r/RaybanMeta" date="Mar 26, 2026" severity="critical" />
            <QuoteCard quote="I have returned 2 glasses so far due to the case creating wear marks on the bridge. My 1st pair even had some of the case lining stuck to the glasses." source="Facebook Ray-Ban Meta Sunglass" date="Aug 2025" severity="warning" />
            <QuoteCard quote="The charging unit inside the glasses heats up the plastic and it melts to the felt a little bit." source="Reddit r/RayBanStories" date="Mar 2024" severity="warning" />
            <QuoteCard quote="The frame will slightly warp due to a small amount of pressure that is caused while in the case. Bought and returned 4 pairs." source="Reddit r/RayBanStories" date="Apr 2024" severity="warning" />
          </div>

          {/* Persistence timeline */}
          <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-lg p-5">
            <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Problem Persistence Timeline</h3>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-800" />
              {[
                { date: "Mar 2024", event: "Gen 1: Nose bridge scuffing from case reported" },
                { date: "Dec 2024", event: "Gen 2: Glossy Wayfarer scratched on day one from case" },
                { date: "Aug 2025", event: "Multiple Facebook reports; users returning glasses due to case wear" },
                { date: "Oct 2025", event: "Gen 2 Display: Same insertion/removal scratching reported" },
                { date: "Mar 2026", event: "Still happening — identical complaint posted 3 days ago" },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
                  <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 relative z-10 bg-[#F43F5E]" />
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600">{t.date}</p>
                    <p className="text-xs text-zinc-300">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── LENS SCRATCHING ── */}
        <Section id="lens" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Moderate" severity="info" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Lens Scratching</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            Lens scratching is less frequently attributed to the case and more often to general use, handling, and material properties. Only 2 of 6 documented lens scratch complaints implicate the case directly.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Case-Induced (2 instances)</h3>
              <div className="space-y-3">
                <div className="bg-zinc-900/40 border border-[#38BDF8]/20 rounded-md p-4">
                  <p className="text-xs text-zinc-300">Oakley HSTN: Lens chips along bottom edge where it sits in the frame</p>
                  <p className="text-[10px] font-mono text-zinc-600 mt-1">Reddit r/Oakley · Nov 2025</p>
                </div>
                <div className="bg-zinc-900/40 border border-[#38BDF8]/20 rounded-md p-4">
                  <p className="text-xs text-zinc-300">Oakley (historical): Lens scratched by soft vault case during removal</p>
                  <p className="text-[10px] font-mono text-zinc-600 mt-1">Oakley Forum · Sep 2013</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">User-Wear / Material (4 instances)</h3>
              <div className="space-y-3">
                <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-md p-4">
                  <p className="text-xs text-zinc-300">Amazon Gen 2: "Small scratch on the left lense" — no case attribution</p>
                  <p className="text-[10px] font-mono text-zinc-600 mt-1">Amazon Reviews · Ongoing</p>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-md p-4">
                  <p className="text-xs text-zinc-300">"One lens got a single scratch even though I was careful. LensCrafters said scratches aren't covered."</p>
                  <p className="text-[10px] font-mono text-zinc-600 mt-1">Facebook · Mar 2026</p>
                </div>
                <div className="bg-zinc-900/40 border border-[#FBBF24]/20 rounded-md p-4">
                  <p className="text-xs text-zinc-300 font-semibold">Material vulnerability: Oakley Plutonite lenses have zero anti-scratch coating</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Oakley warranty explicitly does not cover scratched lenses</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-[#38BDF8]/10 rounded-lg p-5">
            <p className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-[#38BDF8] font-semibold">Key distinction:</span> Frame scratching is overwhelmingly case-induced (~84% of frame complaints). Lens scratching is predominantly from general use and material properties (~67% of lens complaints). The case is not the primary driver of lens damage.
            </p>
          </div>
        </Section>

        <Divider />

        {/* ── STRUCTURAL DAMAGE ── */}
        <Section id="structural" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Warning" severity="warning" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Structural Damage — Case-Contributed</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            Beyond scratching, the case contributes to structural damage through extraction forces, sustained pressure, and repeated insertion/removal cycles.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Arm Detachment", desc: "Arm fell off taking glasses out of the case on the very first day of use.", source: "Facebook · 2025", severity: "critical" as const },
              { title: "Hinge Fatigue", desc: "Two pairs broke at identical location (right temple hinge) after ~7 months. Filed ACCC complaint.", source: "Tech Business News · Oct 2025", severity: "critical" as const },
              { title: "Frame Warping", desc: "Case pressure warps frame over time. User bought and returned 4 pairs — all had the same issue.", source: "Reddit · Apr 2024", severity: "warning" as const },
              { title: "HSTN Fragility", desc: "Frame cracked from minor impact during flight. Oakley: 'out of warranty,' $335 replacement.", source: "Reddit · Nov 2025", severity: "warning" as const },
            ].map((item, i) => (
              <div key={i} className={`bg-zinc-900/60 border rounded-lg p-5 ${
                item.severity === "critical" ? "border-[#F43F5E]/20 card-glow-critical" : "border-[#FBBF24]/20 card-glow-warning"
              }`}>
                <Badge label={item.severity} severity={item.severity} />
                <h4 className="text-sm font-display font-semibold text-zinc-200 mt-3 mb-2">{item.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{item.desc}</p>
                <p className="text-[10px] font-mono text-zinc-600 mt-3">{item.source}</p>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ── OAKLEY SPECIFIC ── */}
        <Section id="oakley" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Product-Specific" severity="warning" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Oakley-Specific Findings</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-6">
              <h3 className="text-lg font-display font-semibold text-zinc-200 mb-4">Oakley HSTN</h3>
              <div className="space-y-3">
                <HBar label="Ejection Rate (1m drop)" value={60.3} max={100} color="#F43F5E" />
                <HBar label="Case Extraction Difficulty" value={85} max={100} color="#FBBF24" suffix=" (severity)" />
                <HBar label="Anti-Scratch Coating" value={0} max={100} color="#F43F5E" suffix=" (none)" />
              </div>
              <div className="mt-4 space-y-2">
                <QuoteCard quote="The charging clip holds on pretty tightly, and there's no easy spot to grip — I end up needing both hands to get them out." source="Reddit r/OakleyMetaGlasses" date="Aug 2025" severity="warning" />
                <QuoteCard quote="One user physically removed the charging clip from the case and replaced it with hot glue." source="Reddit r/OakleyMetaGlasses" date="Dec 2025" severity="critical" />
              </div>
              <p className="text-[10px] text-zinc-600 mt-3">Meta published a dedicated help article: "How to remove AI glasses from charging case"</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-6">
              <h3 className="text-lg font-display font-semibold text-zinc-200 mb-4">Oakley Vanguard</h3>
              <div className="space-y-3">
                <HBar label="Ejection Rate (1m drop)" value={50} max={100} color="#F43F5E" />
                <HBar label="Installed Base Maturity" value={20} max={100} color="#38BDF8" suffix=" (early)" />
              </div>
              <div className="mt-4 bg-zinc-800/30 rounded-md p-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Newer product (Oct 2025) with limited complaint data. Sport use case (cycling, running, skiing) exposes the case to higher impact and abrasion environments. Early signals include charging case firmware bugs and stuck charging issues.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                  <span className="text-[#FBBF24] font-semibold">Forecast:</span> As installed base grows and sport use accumulates, case-related damage complaints will likely accelerate.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── FRAME FINISH ── */}
        <Section id="finish" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Design Insight" severity="info" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Frame Color & Finish Impact</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            The charging case scratches all frame finishes equally. However, the visibility of damage varies dramatically by finish type, which directly affects complaint rates and return behavior.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { finish: "Glossy / Shiny Black", visibility: "Extreme", visLevel: 95, color: "#F43F5E", desc: "Scratches visible within hours. Users return on day one. Multiple reports of case scratching on first extraction.", quote: "My Glossy Wayfarers look like I've been using them to clean my tools with." },
              { finish: "Matte Black", visibility: "Low", visLevel: 30, color: "#FBBF24", desc: "Same physical scratching, but much less visible. Users think matte is 'safer' — it's actually just harder to see the damage.", quote: "I knew they'd scratch — so I kept my defective matte pair rather than exchange for glossy." },
              { finish: "Clear / Transparent", visibility: "Moderate", visLevel: 50, color: "#38BDF8", desc: "Limited data. Scuffs show as clouding. Early yellowing concerns reported for Oakley HSTN clear frames.", quote: "Will they become yellowish in longterm?" },
            ].map((f, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-5">
                <h4 className="text-sm font-display font-semibold text-zinc-200 mb-1">{f.finish}</h4>
                <p className="text-[10px] font-mono text-zinc-600 mb-3">Scratch Visibility: {f.visibility}</p>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full" style={{ width: `${f.visLevel}%`, backgroundColor: f.color }} />
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">{f.desc}</p>
                <p className="text-[11px] text-zinc-500 italic border-l-2 border-zinc-700 pl-3">"{f.quote}"</p>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/40 border border-[#38BDF8]/10 rounded-lg p-5">
            <p className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-[#38BDF8] font-semibold">Design implication:</span> The underlying scratching mechanism is finish-agnostic. Glossy finishes simply make the damage impossible to ignore. Any case redesign must be validated against the most scratch-visible finish in the product line (glossy black).
            </p>
          </div>
        </Section>

        <Divider />

        {/* ── AFTERMARKET ── */}
        <Section id="aftermarket" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Market Signal" severity="warning" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Aftermarket Response</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8">
            The emergence of an aftermarket ecosystem specifically designed to solve the charging case's failures is a powerful market signal. Consumers are spending additional money to fix problems that should have been solved by the OEM case.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { product: "Felt/Fabric Liners", problem: "Interior scratching during insertion", price: "~$8-15", platform: "Amazon" },
              { product: "Hard-Shell EVA Cases", problem: "Drop protection, bag protection", price: "~$15-25", platform: "Amazon (sarlar, TOCCOOL)" },
              { product: "Aftermarket Charging Case", problem: "Full OEM case replacement", price: "$69.99", platform: "Amazon" },
              { product: "Screw Repair Kits", problem: "Hinge/structural repair", price: "$19.99", platform: "Amazon (4.9 stars)" },
              { product: "Soft Cloth Inserts", problem: "Arm overlap scratching", price: "DIY", platform: "Community" },
              { product: "3D-Printed Holders", problem: "Portability without bulk", price: "DIY", platform: "Thingiverse" },
              { product: "Anti-Drop Lanyards", problem: "Retention during wear", price: "~$10-20", platform: "TikTok" },
              { product: "Replacement Lenses", problem: "Lens scratch replacement", price: "~$30-50", platform: "Amazon" },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800/30 rounded-md p-4">
                <p className="text-xs font-semibold text-zinc-200">{item.product}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{item.problem}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-mono text-[#34D399]">{item.price}</span>
                  <span className="text-[10px] font-mono text-zinc-600">{item.platform}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Community Scale</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { platform: "TikTok", metric: "3.2M+", desc: "posts tagged with related keywords" },
              { platform: "Facebook Groups", metric: "70K+", desc: "combined members across Meta glasses groups" },
              { platform: "Reddit", metric: "30K+", desc: "combined members across 4 subreddits" },
              { platform: "Amazon Gen 2", metric: "1,386", desc: "reviews (25 negative durability mentions)" },
              { platform: "Trustpilot", metric: "30%", desc: "of ray-ban.com reviews are 1-star" },
              { platform: "Amazon AI", metric: "Flagged", desc: "'scratches appearing on lenses' in summary" },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800/30 rounded-md p-4 flex items-center gap-4">
                <p className="text-2xl font-display font-bold text-zinc-200 shrink-0">{item.metric}</p>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">{item.platform}</p>
                  <p className="text-[11px] text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* ════════════════════════════════════════════════════════════
            PART 5: CONCLUSION
            ════════════════════════════════════════════════════════════ */}
        <Section id="conclusion" className="container py-16">
          <div className="flex items-center gap-3 mb-2">
            <Badge label="Conclusion" severity="info" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600">Step 3 of 3</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">Correlation Analysis & Findings</h2>

          {/* Primary finding */}
          <div className="bg-zinc-900/80 border border-[#38BDF8]/20 rounded-lg p-6 md:p-8 mb-8">
            <h3 className="text-lg font-display font-semibold text-zinc-200 mb-4">Primary Finding</h3>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              <span className="text-[#38BDF8] font-semibold">No correlation found</span> between high internal ejection rates and field complaints or returns for the ejection event alone. Products with ejection rates as high as ~60% (HSTN) show zero public ejection-specific complaints and zero ejection-related return reports from the returns department.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-zinc-800/40 rounded-md p-4 text-center">
                <p className="text-3xl font-display font-bold text-[#34D399]">0</p>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Public ejection complaints</p>
              </div>
              <div className="bg-zinc-800/40 rounded-md p-4 text-center">
                <p className="text-3xl font-display font-bold text-[#34D399]">0</p>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Ejection-related returns</p>
              </div>
              <div className="bg-zinc-800/40 rounded-md p-4 text-center">
                <p className="text-3xl font-display font-bold text-[#F43F5E]">60.3%</p>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Highest internal ejection rate</p>
              </div>
            </div>
          </div>

          {/* However... */}
          <div className="bg-zinc-900/80 border border-[#F43F5E]/20 rounded-lg p-6 md:p-8 mb-8 card-glow-critical">
            <h3 className="text-lg font-display font-semibold text-zinc-200 mb-4">However: The Case Is Still Causing Damage</h3>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              While ejection is not a documented field problem, the charging case is a <span className="text-[#F43F5E] font-semibold">significant and persistent source of product damage</span> through other mechanisms. These are real, documented, and unresolved:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {[
                { mechanism: "Insertion/removal friction", status: "Active since Gen 1 (Mar 2024)", severity: "critical" as const },
                { mechanism: "Arm overlap abrasion", status: "Ongoing across all Ray-Ban Meta", severity: "critical" as const },
                { mechanism: "Thermal adhesion during charging", status: "Case lining bonds to frame", severity: "warning" as const },
                { mechanism: "Sustained pressure warping", status: "Large Wayfarer specific", severity: "warning" as const },
                { mechanism: "Extraction difficulty", status: "Oakley HSTN — users modifying cases", severity: "critical" as const },
                { mechanism: "Structural fatigue", status: "Arm detachment, hinge failure", severity: "critical" as const },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.severity === "critical" ? "bg-[#F43F5E]" : "bg-[#FBBF24]"
                  }`} />
                  <div>
                    <p className="text-xs text-zinc-200 font-semibold">{item.mechanism}</p>
                    <p className="text-[10px] text-zinc-500">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary table */}
          <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4">Summary</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-3 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Question</th>
                  <th className="text-left py-2 px-3 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Finding</th>
                  <th className="text-center py-2 px-3 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { q: "Does high ejection rate correlate to field complaints?", a: "No — zero ejection-specific complaints found across all platforms", confidence: "High", color: "#34D399" },
                  { q: "Does ejection drive product returns?", a: "No — returns department has no ejection-related return reports", confidence: "High", color: "#34D399" },
                  { q: "Is the case causing damage in the field?", a: "Yes — through insertion friction, thermal adhesion, arm overlap, and extraction force", confidence: "High", color: "#F43F5E" },
                  { q: "Has the problem been resolved across generations?", a: "No — identical complaints from Gen 1 (2024) through Gen 2 (March 2026)", confidence: "High", color: "#F43F5E" },
                  { q: "Are consumers finding workarounds?", a: "Yes — active aftermarket ecosystem selling case liners, hard shells, replacement cases", confidence: "High", color: "#FBBF24" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-zinc-800/40">
                    <td className="py-3 px-3 text-zinc-300">{row.q}</td>
                    <td className="py-3 px-3 text-zinc-400">{row.a}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-semibold" style={{ color: row.color }}>{row.confidence}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-lg p-5">
            <p className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-zinc-200 font-semibold">Bottom line:</span> Internal ejection testing does not predict a field problem for the ejection event itself. However, the charging case remains a documented, persistent, and unresolved source of cosmetic and structural damage to the glasses through everyday use interactions — insertion, removal, charging, and storage. These mechanisms are the actual drivers of consumer dissatisfaction with case-related damage.
            </p>
          </div>
        </Section>

        {/* ── FOOTER ── */}
        <footer className="container py-12 border-t border-zinc-800/60">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs text-zinc-500">Ejection & Scratch Correlation Study — Meta Smart Glasses Portfolio</p>
              <p className="text-[10px] text-zinc-700 mt-1">March 2026 · Internal Use Only · Consumer quotes verbatim from public posts</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-zinc-700">Ray-Ban Meta · Oakley HSTN · Oakley Vanguard</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
