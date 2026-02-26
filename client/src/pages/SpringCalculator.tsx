/*
 * DESIGN PHILOSOPHY: Technical Dashboard — Precision Engineering Tool
 * Dark charcoal bg (#0f1117), electric blue accent, JetBrains Mono for all numbers
 * Layout: Left panel (diagram on top, scrollable inputs below) | Right panel (results table)
 * Color-coded rows: green = good (SF ≥ target), amber = marginal, red = yields
 * Instant recalculation on every input change
 *
 * CALCULATION METHOD (Shigley 10th Ed., Chapter 10):
 *   T = F × arm   (arm = sqrt(armH² + armV²))
 *   σ = Ki × 32T / (π d³)   Ki = (4C−1)/(4C−4) + 0.615/C  [Shigley]
 *                             Ki = (4C²−C−1)/(4C(C−1))       [Wahl]
 *   SF = Sy / σ
 *   k = E d⁴ / (64 Dm Nb)  — per body; doubled for double torsion
 *   Double torsion: T_per_body = T/2, k_total = 2×k_single
 *   Body length: single = Nb×d; double = 2×(Nb+1)×d + bridgeGap
 *   θ_legs = (64T / (d⁴ E)) × (l1+l2) / (3π)  [rad]
 *   α_free = α_loaded + θ_body_deg + θ_legs_deg
 */

import { useState, useMemo } from "react";
import { InfoIcon, ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import SpringDiagram from "@/components/SpringDiagram";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SpringInputs {
  F: number;
  armH: number;
  armV: number;
  maxOD: number;
  minID: number;
  maxBodyLen: number;
  minC: number;
  material: "music_wire" | "stainless_302" | "chrome_silicon";
  safetyTarget: number;
  alphaLoaded: number;
  leg1: number;
  leg2: number;
  kMin: number;
  kMax: number;
  minNb: number;
  doubleTorsion: boolean;
  kiFormula: "shigley" | "wahl";
  bridgeGap: number;
}

interface SpringResult {
  d: number;
  OD: number;
  ID: number;
  C: number;
  Nb: number;
  Lbody: number;
  k: number;
  sigma: number;
  Sy: number;
  SF: number;
  thetaBody: number;
  thetaLegs: number;
  thetaTotal: number;
  alphaFree: number;
  status: "good" | "marginal" | "yields";
  T: number;
}

// ── Material database ─────────────────────────────────────────────────────────
const MATERIALS = {
  music_wire:     { label: "Music Wire ASTM A228",          E: 207000, Sy: (d: number) => 0.78 * 2211 / Math.pow(d, 0.145) },
  stainless_302:  { label: "Stainless Steel 302 ASTM A313", E: 193000, Sy: (d: number) => 0.65 * 1867 / Math.pow(d, 0.146) },
  chrome_silicon: { label: "Chrome-Silicon ASTM A401",      E: 207000, Sy: (d: number) => 0.78 * 2449 / Math.pow(d, 0.108) },
};

function Ki(C: number, formula: "shigley" | "wahl" = "shigley"): number {
  if (formula === "wahl") return (4 * C * C - C - 1) / (4 * C * (C - 1));
  return (4 * C - 1) / (4 * C - 4) + 0.615 / C;
}

// ── Calculation engine ────────────────────────────────────────────────────────
function calcSpring(inputs: SpringInputs): SpringResult[] {
  const { F, armH, armV, maxOD, minID, maxBodyLen, minC, material, safetyTarget,
          alphaLoaded, leg1, leg2, kMin, kMax, minNb,
          doubleTorsion, kiFormula, bridgeGap } = inputs;
  const mat = MATERIALS[material];
  const E = mat.E;
  const arm = Math.sqrt(armH * armH + armV * armV);
  const T_total = F * arm;
  if (T_total <= 0 || arm <= 0) return [];

  // In double torsion mode each body carries T/2; k_total = 2 × k_single
  const T_stress = doubleTorsion ? T_total / 2 : T_total;

  const results: SpringResult[] = [];

  for (let di = 50; di <= 200; di += 5) {
    const d = di / 100;
    const Sy = mat.Sy(d);

    for (let ci = Math.round(Math.max(minC, 2.0) * 2); ci <= 24; ci++) {
      const C = ci / 2;
      const OD = d * (C + 1);
      const ID = OD - 2 * d;
      if (OD > maxOD + 0.001) continue;
      if (ID < minID - 0.001) continue;

      const Dm = OD - d;
      const kiVal = Ki(C, kiFormula);
      const sigma = kiVal * 32 * T_stress / (Math.PI * Math.pow(d, 3));
      const SF = Sy / sigma;

      const thetaLegsRad = (64 * T_total / (Math.pow(d, 4) * E)) * (leg1 + leg2) / (3 * Math.PI);
      const thetaLegsDeg = thetaLegsRad * (180 / Math.PI);

      const kSteps = 20;
      const kLogMin = Math.log10(Math.max(kMin, 1));
      const kLogMax = Math.log10(Math.max(kMax, kMin + 1));

      for (let ki2 = 0; ki2 <= kSteps; ki2++) {
        // k here is the effective total spring rate seen at the pivot
        const k_total = Math.pow(10, kLogMin + (ki2 / kSteps) * (kLogMax - kLogMin));
        // For double torsion: k_total = 2 × k_single  =>  k_single = k_total / 2
        const k_single = doubleTorsion ? k_total / 2 : k_total;
        const Nb = E * Math.pow(d, 4) / (64 * Dm * k_single);
        if (Nb < Math.max(minNb, 0.25) || Nb > 20) continue;

        // Body length formula depends on spring type
        const Lbody = doubleTorsion
          ? 2 * (Nb + 1) * d + bridgeGap   // Gemini-validated: 2*(Na+1)*d + bridge
          : Nb * d;                          // Standard single torsion
        if (Lbody > maxBodyLen + 0.001) continue;

        const thetaBodyDeg = (T_total / k_total) * (180 / Math.PI);
        const thetaTotalDeg = thetaBodyDeg + thetaLegsDeg;
        const alphaFree = alphaLoaded + thetaTotalDeg;

        const status: SpringResult["status"] =
          SF < 1.0 ? "yields" : SF < safetyTarget ? "marginal" : "good";

        results.push({ d, OD, ID, C, Nb, Lbody, k: k_total, sigma, Sy, SF,
          thetaBody: thetaBodyDeg, thetaLegs: thetaLegsDeg,
          thetaTotal: thetaTotalDeg, alphaFree, status, T: T_total });
      }
    }
  }

  results.sort((a, b) => {
    const order = { good: 0, marginal: 1, yields: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return b.SF - a.SF;
  });

  const seen = new Set<string>();
  const deduped: SpringResult[] = [];
  for (const r of results) {
    const key = `${r.d.toFixed(2)}-${r.C.toFixed(1)}-${r.Nb.toFixed(2)}`;
    if (!seen.has(key)) { seen.add(key); deduped.push(r); }
    if (deduped.length >= 300) break;
  }
  return deduped;
}

// ── Input field ───────────────────────────────────────────────────────────────
function InputField({ label, unit, value, onChange, min, max, step, tooltip }: {
  label: string; unit: string; value: number;
  onChange: (v: number) => void;
  min?: number; max?: number; step?: number; tooltip?: string;
}) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-1 mb-0.5">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none">{label}</label>
        {tooltip && (
          <div className="group relative">
            <InfoIcon className="w-3 h-3 text-slate-700 cursor-help" />
            <div className="absolute left-5 top-0 z-50 hidden group-hover:block w-52 bg-[#1e2130] border border-slate-700 rounded p-2 text-xs text-slate-300 shadow-2xl leading-relaxed">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <input
          type="number" value={value} min={min} max={max} step={step ?? 0.1}
          onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(v); }}
          className="w-full bg-[#1a1d27] border border-slate-700/80 rounded px-2.5 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
        />
        <span className="text-[10px] text-slate-600 w-14 shrink-0 font-mono leading-none">{unit}</span>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.15em] mb-2 mt-4 flex items-center gap-2">
      <span className="flex-1 h-px bg-blue-500/20"></span>
      {label}
      <span className="flex-1 h-px bg-blue-500/20"></span>
    </div>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────
type ColKey = keyof SpringResult;
const COLS: { key: ColKey; label: string; unit: string; dec: number }[] = [
  { key: "d",          label: "d",       unit: "mm",       dec: 2 },
  { key: "OD",         label: "OD",      unit: "mm",       dec: 2 },
  { key: "ID",         label: "ID",      unit: "mm",       dec: 2 },
  { key: "C",          label: "C",       unit: "",         dec: 1 },
  { key: "Nb",         label: "N",       unit: "coils",    dec: 2 },
  { key: "Lbody",      label: "L body",  unit: "mm",       dec: 2 },
  { key: "k",          label: "k",       unit: "N·mm/rad", dec: 0 },
  { key: "sigma",      label: "σ peak",  unit: "MPa",      dec: 0 },
  { key: "Sy",         label: "Sy",      unit: "MPa",      dec: 0 },
  { key: "SF",         label: "SF",      unit: "",         dec: 3 },
  { key: "thetaTotal", label: "θ total", unit: "°",        dec: 2 },
  { key: "alphaFree",  label: "α free",  unit: "°",        dec: 1 },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function SpringCalculator() {
  const DEFAULTS: SpringInputs = {
    F: 5.6, armH: 15.3, armV: 1.3,
    maxOD: 5.0, minID: 1.6, maxBodyLen: 6.0,
    minC: 4.0, material: "music_wire", safetyTarget: 1.3,
    alphaLoaded: 26.5, leg1: 8.0, leg2: 6.0,
    kMin: 200, kMax: 5000, minNb: 3.0,
    doubleTorsion: false, kiFormula: "shigley", bridgeGap: 0.26,
  };

  const [inputs, setInputs] = useState<SpringInputs>(DEFAULTS);
  const [sortCol, setSortCol] = useState<ColKey>("SF");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showYields, setShowYields] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SpringResult | null>(null);

  const set = (k: keyof SpringInputs) => (v: number | string) =>
    setInputs(prev => ({ ...prev, [k]: v }));

  const arm = Math.sqrt(inputs.armH ** 2 + inputs.armV ** 2);
  const T = inputs.F * arm;

  const allResults = useMemo(() => calcSpring(inputs), [inputs]);

  const displayed = useMemo(() => {
    let r = showYields ? allResults : allResults.filter(x => x.status !== "yields");
    return [...r].sort((a, b) => {
      const av = a[sortCol] as number;
      const bv = b[sortCol] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [allResults, showYields, sortCol, sortDir]);

  const goodCount     = allResults.filter(x => x.status === "good").length;
  const marginalCount = allResults.filter(x => x.status === "marginal").length;
  const yieldsCount   = allResults.filter(x => x.status === "yields").length;

  // Diagram shows selected row's geometry, or best result, or input defaults
  const diagramRow = selectedRow ?? (displayed.length > 0 ? displayed[0] : null);
  const diagOD     = diagramRow?.OD     ?? inputs.maxOD;
  const diagID     = diagramRow?.ID     ?? inputs.minID;
  const diagD      = diagramRow?.d      ?? (inputs.maxOD - inputs.minID) / 2;
  const diagLbody  = diagramRow?.Lbody  ?? 0;
  const diagAlphaFree = diagramRow?.alphaFree ?? 0;

  function toggleSort(col: ColKey) {
    if (col === sortCol) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: ColKey }) {
    if (col !== sortCol) return <ChevronsUpDownIcon className="w-3 h-3 text-slate-700 inline ml-0.5" />;
    return sortDir === "desc"
      ? <ChevronDownIcon className="w-3 h-3 text-blue-400 inline ml-0.5" />
      : <ChevronUpIcon   className="w-3 h-3 text-blue-400 inline ml-0.5" />;
  }

  const CAD_SKETCH_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/pasted_file_ycxClq_image_ae1bc850.png";

  return (
    <div className="flex flex-col h-full bg-[#0f1117] text-slate-100 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── CAD SKETCH BANNER ────────────────────────────────────────────── */}
      <div className="shrink-0 bg-[#0a0c12] border-b border-slate-800/80 px-4 py-2">
        <div className="text-[9px] font-mono text-blue-500 uppercase tracking-[0.2em] mb-1 text-center">Assembly Reference — Luna Charging Clip Cross Section</div>
        {/* Relative container so inputs can be absolutely positioned over the image */}
        <div className="relative mx-auto" style={{ width: '100%', maxWidth: 900 }}>
          <img
            src={CAD_SKETCH_URL}
            alt="Luna Clip CAD cross-section with spring dimensions"
            className="w-full h-auto object-contain rounded border border-slate-800/50"
            style={{ maxHeight: 220 }}
          />

          {/* ── Overlaid inputs — positions tuned to match annotation locations in the image ── */}

          {/* Horizontal arm — top left label "15.3 mm" */}
          <div className="absolute flex flex-col items-center" style={{ top: '2%', left: '10%' }}>
            <span className="text-[8px] font-mono text-red-400 mb-0.5 whitespace-nowrap">H arm</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.armH} step={0.1} min={0}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, armH: v })); }}
                className="w-14 bg-black/70 border border-red-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-red-300 text-center focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/40"
              />
              <span className="text-[8px] text-red-500 font-mono">mm</span>
            </div>
          </div>

          {/* Right span — top right label "15.0 mm" — maps to armH total span for reference only */}
          <div className="absolute flex flex-col items-center" style={{ top: '2%', left: '62%' }}>
            <span className="text-[8px] font-mono text-red-400 mb-0.5 whitespace-nowrap">H arm 2</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.armH} step={0.1} min={0}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, armH: v })); }}
                className="w-14 bg-black/70 border border-red-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-red-300 text-center focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/40"
              />
              <span className="text-[8px] text-red-500 font-mono">mm</span>
            </div>
          </div>

          {/* Leg 1 — upper leg label near spring */}
          <div className="absolute flex flex-col items-center" style={{ top: '22%', left: '60%' }}>
            <span className="text-[8px] font-mono text-red-400 mb-0.5 whitespace-nowrap">Leg 1 max</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.leg1} step={0.5} min={0}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, leg1: v })); }}
                className="w-12 bg-black/70 border border-red-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-red-300 text-center focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/40"
              />
              <span className="text-[8px] text-red-500 font-mono">mm</span>
            </div>
          </div>

          {/* Leg 2 — lower leg label near spring */}
          <div className="absolute flex flex-col items-center" style={{ top: '55%', left: '63%' }}>
            <span className="text-[8px] font-mono text-red-400 mb-0.5 whitespace-nowrap">Leg 2 max</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.leg2} step={0.5} min={0}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, leg2: v })); }}
                className="w-12 bg-black/70 border border-red-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-red-300 text-center focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/40"
              />
              <span className="text-[8px] text-red-500 font-mono">mm</span>
            </div>
          </div>

          {/* Loaded angle — near the 26.5° arc */}
          <div className="absolute flex flex-col items-center" style={{ top: '28%', left: '74%' }}>
            <span className="text-[8px] font-mono text-amber-400 mb-0.5 whitespace-nowrap">α loaded</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.alphaLoaded} step={0.5} min={0} max={360}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, alphaLoaded: v })); }}
                className="w-12 bg-black/70 border border-amber-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-amber-300 text-center focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
              />
              <span className="text-[8px] text-amber-500 font-mono">°</span>
            </div>
          </div>

          {/* Clamping force F — blue arrow at left */}
          <div className="absolute flex flex-col items-center" style={{ top: '52%', left: '5%' }}>
            <span className="text-[8px] font-mono text-blue-400 mb-0.5 whitespace-nowrap">F clamp</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.F} step={0.1} min={0.1}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, F: v })); }}
                className="w-12 bg-black/70 border border-blue-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-blue-300 text-center focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/40"
              />
              <span className="text-[8px] text-blue-500 font-mono">N</span>
            </div>
          </div>

          {/* Vertical offset 1.3 mm — bottom left, maps to armV */}
          <div className="absolute flex flex-col items-center" style={{ bottom: '4%', left: '3%' }}>
            <span className="text-[8px] font-mono text-red-400 mb-0.5 whitespace-nowrap">V offset</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.armV} step={0.1} min={0}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, armV: v })); }}
                className="w-12 bg-black/70 border border-red-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-red-300 text-center focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/40"
              />
              <span className="text-[8px] text-red-500 font-mono">mm</span>
            </div>
          </div>

          {/* Right side vertical offset 1.15 mm */}
          <div className="absolute flex flex-col items-center" style={{ bottom: '4%', right: '1%' }}>
            <span className="text-[8px] font-mono text-red-400 mb-0.5 whitespace-nowrap">V offset R</span>
            <div className="flex items-center gap-0.5">
              <input type="number" value={inputs.armV} step={0.1} min={0}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setInputs(p => ({ ...p, armV: v })); }}
                className="w-12 bg-black/70 border border-red-500/60 rounded px-1 py-0.5 text-[10px] font-mono text-red-300 text-center focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/40"
              />
              <span className="text-[8px] text-red-500 font-mono">mm</span>
            </div>
          </div>

          {/* Torque computed readout — bottom center */}
          <div className="absolute flex flex-col items-center" style={{ bottom: '4%', left: '50%', transform: 'translateX(-50%)' }}>
            <span className="text-[8px] font-mono text-blue-400/70">T = {T.toFixed(1)} N·mm · arm = {Math.sqrt(inputs.armH**2+inputs.armV**2).toFixed(2)} mm</span>
          </div>
        </div>
      </div>

      {/* ── TWO-PANEL ROW ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

      {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
      <aside className="w-72 shrink-0 bg-[#12141c] border-r border-slate-800/80 flex flex-col overflow-hidden">

        {/* Title */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-800/80 shrink-0">
          <div className="text-[9px] font-mono text-blue-500 uppercase tracking-[0.2em] mb-0.5">Torsion Spring</div>
          <h1 className="text-sm font-bold text-white leading-tight tracking-tight">Design Calculator</h1>
          <p className="text-[9px] text-slate-600 mt-0.5">Luna Charging Clip · Retention Mechanism</p>
        </div>

        {/* Diagram — fixed height, not scrollable */}
        <div className="px-3 pt-3 pb-2 shrink-0 border-b border-slate-800/60">
          <SpringDiagram
            d={diagD}
            OD={diagOD}
            ID={diagID}
            Lbody={diagLbody}
            leg1={inputs.leg1}
            leg2={inputs.leg2}
            alphaLoaded={inputs.alphaLoaded}
            alphaFree={diagAlphaFree}
            F={inputs.F}
            armH={inputs.armH}
            armV={inputs.armV}
            T={T}
            hasResult={diagramRow !== null}
          />
          {diagramRow && (
            <div className="mt-1.5 text-[9px] font-mono text-slate-600 text-center">
              {selectedRow ? "Selected row" : "Best result"} · click table row to update
            </div>
          )}
        </div>

        {/* Scrollable inputs */}
        <div className="flex-1 overflow-y-auto px-4 py-2">

          <SectionHeader label="Load" />
          <InputField label="Clamping Force" unit="N" value={inputs.F} onChange={set("F")} min={0.1} max={100} step={0.1}
            tooltip="Required tip force at the clip contact point" />
          <InputField label="Horizontal Arm" unit="mm" value={inputs.armH} onChange={set("armH")} min={0} max={200} step={0.1}
            tooltip="Horizontal distance from spring pivot to force application point" />
          <InputField label="Vertical Arm" unit="mm" value={inputs.armV} onChange={set("armV")} min={0} max={100} step={0.1}
            tooltip="Vertical distance from spring pivot to force application point" />
          <div className="bg-[#1a1d27] rounded border border-slate-700/50 px-3 py-1.5 mb-1 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-600">Effective arm</span>
              <span className="text-slate-300">{arm.toFixed(2)} mm</span>
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-slate-600">Torque T</span>
              <span className="text-blue-400 font-semibold">{T.toFixed(1)} N·mm</span>
            </div>
          </div>

          <SectionHeader label="Geometry" />
          <InputField label="Max OD" unit="mm" value={inputs.maxOD} onChange={set("maxOD")} min={1} max={50} step={0.1}
            tooltip="Maximum outer diameter — set by housing envelope" />
          <InputField label="Min ID" unit="mm" value={inputs.minID} onChange={set("minID")} min={0.1} max={30} step={0.1}
            tooltip="Minimum inner diameter — set by mandrel / shaft diameter" />
          <InputField label="Max Body Length" unit="mm" value={inputs.maxBodyLen} onChange={set("maxBodyLen")} min={0.5} max={100} step={0.5}
            tooltip="Maximum axial body length — set by housing axial envelope" />

          <SectionHeader label="Manufacturability" />
          <InputField label="Min Spring Index C" unit="" value={inputs.minC} onChange={set("minC")} min={2} max={12} step={0.5}
            tooltip="C = D_mean / d. Standard suppliers: C ≥ 4. Specialist CNC: C ≥ 2.5" />
          <InputField label="Min Coil Count N" unit="coils" value={inputs.minNb} onChange={set("minNb")} min={0.25} max={20} step={0.25}
            tooltip="Minimum active coils. Industry standard: N ≥ 3. Below 3 coils, consistent winding is not achievable on standard CNC equipment." />
          <InputField label="Min Safety Factor" unit="" value={inputs.safetyTarget} onChange={set("safetyTarget")} min={1.0} max={4.0} step={0.05}
            tooltip="Minimum acceptable SF = Sy / σ. Recommended ≥ 1.3 for production" />

          <SectionHeader label="Spring Configuration" />
          {/* Double torsion toggle */}
          <div className="mb-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setInputs(p => ({ ...p, doubleTorsion: !p.doubleTorsion }))}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  inputs.doubleTorsion ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  inputs.doubleTorsion ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
              <div>
                <div className="text-[11px] text-slate-300 font-semibold">Double Torsion Spring</div>
                <div className="text-[9px] text-slate-600">
                  {inputs.doubleTorsion
                    ? 'T/2 per body · k_total = 2×k_single · L = 2(N+1)d + bridge'
                    : 'Full T · L = N×d (standard single spring)'}
                </div>
              </div>
            </label>
          </div>
          {inputs.doubleTorsion && (
            <InputField label="Bridge Gap" unit="mm" value={inputs.bridgeGap} onChange={set("bridgeGap")} min={0.1} max={5} step={0.05}
              tooltip="Central U-bridge gap between the two coil bodies. Recommended ≥ 0.5×d to prevent coil contact under load." />
          )}

          {/* Ki formula selector */}
          <div className="mb-3">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-0.5">Stress Correction Factor</label>
            <div className="flex gap-2">
              {(['shigley', 'wahl'] as const).map(f => (
                <button key={f}
                  onClick={() => setInputs(p => ({ ...p, kiFormula: f }))}
                  className={`flex-1 py-1 rounded text-[10px] font-mono border transition-colors ${
                    inputs.kiFormula === f
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  {f === 'shigley' ? 'Shigley Ki' : 'Wahl Ki'}
                </button>
              ))}
            </div>
            <div className="text-[9px] text-slate-600 mt-0.5">
              {inputs.kiFormula === 'shigley'
                ? 'Conservative (industry standard for production design)'
                : 'Less conservative — Gemini uses this formula'}
            </div>
          </div>

          <SectionHeader label="Spring Rate Range" />
          <InputField label="k min" unit="N·mm/rad" value={inputs.kMin} onChange={set("kMin")} min={10} max={50000} step={50}
            tooltip="Minimum spring rate to explore" />
          <InputField label="k max" unit="N·mm/rad" value={inputs.kMax} onChange={set("kMax")} min={10} max={50000} step={50}
            tooltip="Maximum spring rate to explore" />

          <SectionHeader label="Angle & Legs" />
          <InputField label="Loaded Angle α" unit="°" value={inputs.alphaLoaded} onChange={set("alphaLoaded")} min={0} max={360} step={0.5}
            tooltip="Angle between legs in the assembled/loaded position — from housing CAD" />
          <InputField label="Leg 1 (upper)" unit="mm" value={inputs.leg1} onChange={set("leg1")} min={0} max={100} step={0.5}
            tooltip="Effective length of upper leg (clip arm side)" />
          <InputField label="Leg 2 (lower)" unit="mm" value={inputs.leg2} onChange={set("leg2")} min={0} max={100} step={0.5}
            tooltip="Effective length of lower leg (housing side)" />

          <SectionHeader label="Material" />
          <div className="mb-3">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-0.5">Wire Material</label>
            <select
              value={inputs.material}
              onChange={e => setInputs(p => ({ ...p, material: e.target.value as SpringInputs["material"] }))}
              className="w-full bg-[#1a1d27] border border-slate-700/80 rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
            >
              {Object.entries(MATERIALS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div className="pb-4">
            <button
              onClick={() => { setInputs(DEFAULTS); setSelectedRow(null); }}
              className="w-full text-[10px] text-slate-600 hover:text-slate-400 border border-slate-800 hover:border-slate-700 rounded py-1.5 transition-colors font-mono"
            >
              ↺ Reset to Luna defaults
            </button>
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-[#12141c] shrink-0">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.9)]"></span>
              <span className="text-[11px] font-mono text-emerald-400">{goodCount} Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-[11px] font-mono text-amber-400">{marginalCount} Marginal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/80"></span>
              <span className="text-[11px] font-mono text-red-400">{yieldsCount} Yields</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-500 hover:text-slate-300 select-none">
              <input type="checkbox" checked={showYields} onChange={e => setShowYields(e.target.checked)} className="accent-blue-500 w-3 h-3" />
              Show yielding designs
            </label>
            <span className="text-[11px] font-mono text-slate-700">{displayed.length} rows</span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[11px] border-collapse" style={{ minWidth: 900 }}>
            <thead className="sticky top-0 z-10 bg-[#1a1d27]">
              <tr>
                <th className="px-3 py-2 text-left text-slate-600 font-semibold border-b border-slate-800/80 whitespace-nowrap w-20">Status</th>
                {COLS.map(c => (
                  <th key={c.key} onClick={() => toggleSort(c.key)}
                    className={`px-2 py-2 text-right font-semibold border-b border-slate-800/80 cursor-pointer hover:text-slate-300 select-none whitespace-nowrap ${
                      c.key === 'sigma' ? 'text-orange-500/80' : 'text-slate-500'
                    }`}>
                    <span className="font-mono">{c.label}</span>
                    {c.unit && <span className="text-[9px] ml-0.5 opacity-60">({c.unit})</span>}
                    <SortIcon col={c.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={COLS.length + 1} className="text-center py-20 text-slate-700 font-mono">
                    No feasible designs — try relaxing constraints or expanding k range
                  </td>
                </tr>
              )}
              {displayed.map((r, i) => {
                const isSelected = selectedRow === r;
                const rowBg = isSelected
                  ? "bg-blue-900/30 border-l-2 border-blue-500"
                  : i % 2 === 0 ? "bg-[#0f1117]" : "bg-[#111318]";
                const sfColor = r.status === "good" ? "text-emerald-400" : r.status === "marginal" ? "text-amber-400" : "text-red-400";
                const badgeColor = r.status === "good"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : r.status === "marginal"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30";
                const cColor = r.C < 4 ? "text-amber-300 font-bold" : r.C < 6 ? "text-yellow-200" : "text-slate-200";

                return (
                  <tr key={i}
                    onClick={() => setSelectedRow(isSelected ? null : r)}
                    className={`${rowBg} hover:bg-blue-900/20 transition-colors cursor-pointer`}>
                    <td className="px-3 py-1">
                      <span className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold ${badgeColor}`}>
                        {r.status === "yields" ? "YIELDS" : `SF ${r.SF.toFixed(2)}`}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-right font-mono text-slate-200">{r.d.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right font-mono text-slate-200">{r.OD.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right font-mono text-slate-200">{r.ID.toFixed(2)}</td>
                    <td className={`px-2 py-1 text-right font-mono ${cColor}`}>
                      {r.C.toFixed(1)}{r.C < 4 && <span className="text-[8px] text-amber-500 ml-0.5">★</span>}
                    </td>
                    <td className="px-2 py-1 text-right font-mono text-slate-200">{r.Nb.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right font-mono text-slate-200">{r.Lbody.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right font-mono text-slate-400">{r.k.toFixed(0)}</td>
                    <td className="px-2 py-1 text-right font-mono font-semibold text-orange-300">{r.sigma.toFixed(0)}</td>
                    <td className="px-2 py-1 text-right font-mono text-slate-500">{r.Sy.toFixed(0)}</td>
                    <td className={`px-2 py-1 text-right font-mono font-bold ${sfColor}`}>{r.SF.toFixed(3)}</td>
                    <td className="px-2 py-1 text-right font-mono text-slate-400">{r.thetaTotal.toFixed(2)}</td>
                    <td className="px-2 py-1 text-right font-mono text-blue-400">{r.alphaFree.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-1.5 border-t border-slate-800/80 bg-[#12141c] shrink-0 flex items-center justify-between">
          <span className="text-[9px] text-slate-700 font-mono">
            d=wire dia · OD=outer dia · ID=inner dia · C=spring index · N=active coils · L=body length · k=spring rate · σ=peak stress · Sy=yield strength · SF=safety factor · θ=deflection · α_free=free angle
          </span>
          <span className="text-[9px] text-amber-700 font-mono shrink-0 ml-4">
        ★ C &lt; 4 requires specialist CNC coiling
        {inputs.doubleTorsion && <span className="ml-3 text-blue-700">⊗ Double torsion: T/2 per body · {inputs.kiFormula === 'shigley' ? 'Shigley Ki' : 'Wahl Ki'}</span>}
      </span>
        </div>
      </main>
      </div>{/* end two-panel row */}
    </div>
  );
}
