/**
 * ProductDesignSection — Executive Technical Design
 * Shows product renders, exploded view, 2D drawings, BOM, and assembly process flow
 * Tabs for: Renders | Exploded View | 2D Drawings | BOM | Assembly Flow
 */

import { useState } from "react";

const CDN = {
  renderHero:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/pasted_file_CQWpcE_image_12dc35cc.png",
  renderFront:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/pasted_file_CQWpcE_image_12dc35cc.png",
  exploded:     "https://files.manuscdn.com/user_upload_by_module/session_file/310519663369013021/dGqkVfxXVbaUNJbs.png",
  assemblyFlow: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663369013021/blMlEvtNcnxbKFdT.png",
  dwg1:         "https://files.manuscdn.com/user_upload_by_module/session_file/310519663369013021/HDGnAUIkllEdHxMo.png",
  dwg2:         "https://files.manuscdn.com/user_upload_by_module/session_file/310519663369013021/dONxWEfvQCbfsbon.png",
  dwg3:         "https://files.manuscdn.com/user_upload_by_module/session_file/310519663369013021/mhzVyZznUXtGdMue.png",
};

const TABS = [
  { id: "renders",   label: "Product Renders" },
  { id: "exploded",  label: "Exploded View" },
  { id: "drawings",  label: "2D Drawings" },
  { id: "bom",       label: "Bill of Materials" },
  { id: "assembly",  label: "Assembly Flow" },
];

const BOM_MECHANICAL = [
  { item: "1", partNo: "CC-001", desc: "Front Enclosure", material: "PC-GF10, Black Gloss", qty: 1, process: "Injection Mold", costLow: 0.28, costHigh: 0.38 },
  { item: "2", partNo: "CC-002", desc: "Clamp", material: "PC-GF10, Black Gloss", qty: 1, process: "Injection Mold", costLow: 0.18, costHigh: 0.25 },
  { item: "3", partNo: "CC-003", desc: "Rear Cover", material: "PC-GF10, Black Gloss", qty: 1, process: "Injection Mold", costLow: 0.12, costHigh: 0.18 },
  { item: "4", partNo: "CC-004", desc: "Clamp Pivot Pin", material: "SUS304 Stainless Steel", qty: 1, process: "CNC Turn", costLow: 0.04, costHigh: 0.07 },
  { item: "5", partNo: "CC-005", desc: "Torsion Spring", material: "SUS301 Spring Steel", qty: 1, process: "CNC Spring Coil", costLow: 0.05, costHigh: 0.09 },
  { item: "6", partNo: "CC-006", desc: "Self-tapping Screw M1.6×4", material: "SUS304", qty: 2, process: "Cold Heading", costLow: 0.01, costHigh: 0.02 },
];

const BOM_ELECTRICAL = [
  { item: "7",  partNo: "CC-007", desc: "Main Logic Board — Bare PCB", material: "FR4 TG150, 2L, 1.0mm, ENIG", qty: 1, process: "PCB Fab", costLow: 0.18, costHigh: 0.28 },
  { item: "8",  partNo: "CC-008", desc: "Pogo Pin (Spring Contact)", material: "Gold-plated Brass, Ø2.0×10.7mm", qty: 2, process: "Purchased", costLow: 0.08, costHigh: 0.14 },
  { item: "9",  partNo: "CC-009", desc: "Pogo Pin Wire 28AWG 50mm", material: "Silicone-insulated Cu", qty: 2, process: "Purchased", costLow: 0.01, costHigh: 0.02 },
  { item: "10", partNo: "CC-010", desc: "USB-C Connector (Mid-mount)", material: "USB-C Receptacle, 9-pin SMT+THT", qty: 1, process: "Purchased", costLow: 0.06, costHigh: 0.10 },
  { item: "11", partNo: "CC-011", desc: "USB-C PD Controller IC", material: "PD Sink, 5V/9V/12V/20V", qty: 1, process: "Purchased", costLow: 0.18, costHigh: 0.35 },
  { item: "12", partNo: "CC-012", desc: "RGB Status LED", material: "SMD 0603 RGB, Common Cathode", qty: 1, process: "Purchased", costLow: 0.02, costHigh: 0.04 },
  { item: "13", partNo: "CC-013", desc: "Decoupling Capacitor 100nF 0402", material: "MLCC X5R 10V", qty: 4, process: "Purchased", costLow: 0.002, costHigh: 0.003 },
  { item: "14", partNo: "CC-014", desc: "Bulk Capacitor 10µF 0603", material: "MLCC X5R 10V", qty: 2, process: "Purchased", costLow: 0.008, costHigh: 0.010 },
  { item: "15", partNo: "CC-015", desc: "Current Sense Resistor 10mΩ 0402", material: "1% 0.5W", qty: 1, process: "Purchased", costLow: 0.01, costHigh: 0.02 },
  { item: "16", partNo: "CC-016", desc: "ESD Protection TVS 0402", material: "USB-C ESD Array, 5V Clamp", qty: 1, process: "Purchased", costLow: 0.03, costHigh: 0.06 },
  { item: "17", partNo: "CC-017", desc: "MCU (if required)", material: "Small MCU for LED / Auth", qty: 1, process: "Purchased", costLow: 0.08, costHigh: 0.20 },
  { item: "18", partNo: "CC-018", desc: "PCBA Assembly Service", material: "SMT + THT, 2-side, AOI", qty: 1, process: "CM Assembly", costLow: 0.25, costHigh: 0.45 },
];

const BOM_PACKAGING = [
  { item: "19", partNo: "CC-019", desc: "Retail Box Insert / Tray", material: "Molded Pulp or EVA Foam", qty: 1, process: "Mold / Die-cut", costLow: 0.08, costHigh: 0.15 },
  { item: "20", partNo: "CC-020", desc: "Quick Start Card", material: "4-color print, 85×55mm", qty: 1, process: "Print", costLow: 0.02, costHigh: 0.04 },
];

const COST_SUMMARY = [
  { category: "Mechanical Components", low: 0.68, high: 0.99 },
  { category: "Electronics (PCBA)", low: 0.97, high: 1.76 },
  { category: "Packaging", low: 0.10, high: 0.19 },
  { category: "Assembly Labor (~15 min)", low: 1.20, high: 1.20 },
];

function BomTable({ rows, title }: { rows: typeof BOM_MECHANICAL; title: string }) {
  return (
    <div className="mb-8">
      <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">{title}</h4>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Item</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Part No.</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">Description</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">Material / Spec</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600">Qty</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">Process</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-600 whitespace-nowrap">Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.item} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                <td className="px-3 py-2 font-mono text-slate-400">{row.item}</td>
                <td className="px-3 py-2 font-mono text-blue-700 font-semibold whitespace-nowrap">{row.partNo}</td>
                <td className="px-3 py-2 text-slate-800">{row.desc}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{row.material}</td>
                <td className="px-3 py-2 text-center text-slate-600">{row.qty}</td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{row.process}</td>
                <td className="px-3 py-2 text-right font-mono text-slate-700 whitespace-nowrap">
                  ${row.costLow.toFixed(2)}–${row.costHigh.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProductDesignSection() {
  const [activeTab, setActiveTab] = useState("renders");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const totalLow  = COST_SUMMARY.reduce((s, r) => s + r.low,  0);
  const totalHigh = COST_SUMMARY.reduce((s, r) => s + r.high, 0);

  return (
    <section id="product-design" className="py-20 bg-white border-t border-slate-100">
      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <img
            src={lightboxImg}
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light leading-none"
            onClick={() => setLightboxImg(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-indigo-600 rounded-full" />
            <span className="text-xs font-mono tracking-widest uppercase text-indigo-600">Product Design & Engineering</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
            Charging Clip — Design Package
          </h2>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
            Generated from the uploaded STEP file. Includes photorealistic marketing renders, exploded view with component callouts,
            2D mechanical drawings for the three primary injection-molded parts, a 20-line detailed bill of materials with
            cost estimates, and a full assembly process flow.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-8 border-b border-slate-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Product Renders ── */}
        {activeTab === "renders" && (
          <div>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              Photorealistic marketing renders generated from STEP geometry. Exterior plastics: gloss black PC-GF10.
              Click any image to enlarge.
            </p>
            <div
              className="group relative bg-slate-900 rounded-xl overflow-hidden cursor-zoom-in shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setLightboxImg(CDN.renderHero)}
            >
              <img
                src={CDN.renderHero}
                alt="ID Render"
                className="w-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                <span className="text-white text-xs font-mono">ID Render</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Housing Material", value: "PC-GF10" },
                { label: "Finish", value: "Gloss A1" },
                { label: "Overall Height", value: "~42mm" },
                { label: "Base Width", value: "27mm" },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                  <div className="text-xs text-slate-400 font-mono mb-1">{stat.label}</div>
                  <div className="text-sm font-bold text-slate-800">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Exploded View ── */}
        {activeTab === "exploded" && (
          <div>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              All 10 components labeled with part numbers and materials. Assembly axis shown as vertical dashed line.
              Click to enlarge.
            </p>
            <div
              className="cursor-zoom-in flex justify-center bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => setLightboxImg(CDN.exploded)}
            >
              <img src={CDN.exploded} alt="Exploded View" className="max-h-[700px] object-contain" />
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { no: "1", name: "Clamp", mat: "PC-GF10" },
                { no: "2", name: "Pivot Pin", mat: "SUS304" },
                { no: "3", name: "Torsion Spring", mat: "SUS301" },
                { no: "4", name: "Rear Cover", mat: "PC-GF10" },
                { no: "5", name: "Main Logic Board", mat: "FR4 PCB" },
                { no: "6", name: "Pogo Pins ×2", mat: "Au-plated Brass" },
                { no: "7", name: "Pogo Wires ×2", mat: "28AWG Silicone" },
                { no: "8", name: "USB-C Connector", mat: "Mid-mount" },
                { no: "9", name: "RGB Status LED", mat: "SMD 0603" },
                { no: "10", name: "Front Enclosure", mat: "PC-GF10" },
              ].map(p => (
                <div key={p.no} className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{p.no}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{p.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{p.mat}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: 2D Drawings ── */}
        {activeTab === "drawings" && (
          <div>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              Three engineering drawings covering the primary mechanical components. All dimensions in mm. Click to enlarge.
            </p>
            <div className="grid grid-cols-1 gap-6">
              {[
                { url: CDN.dwg1, label: "Drawing 1 of 3 — Front Enclosure (CC-001)", sub: "Front, Side, Top views · PC-GF10 · Scale 2:1" },
                { url: CDN.dwg2, label: "Drawing 2 of 3 — Clamp + Pivot Pin (CC-002 / CC-003)", sub: "Front, Side views + Pivot Pin detail · PC-GF10 / SUS304 · Scale 2:1" },
                { url: CDN.dwg3, label: "Drawing 3 of 3 — Main Logic Board PCB Envelope (CC-005)", sub: "Component-side top view + PCB stackup · FR4 TG150, 2L, ENIG · Scale 2:1" },
              ].map(dwg => (
                <div
                  key={dwg.url}
                  className="cursor-zoom-in border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => setLightboxImg(dwg.url)}
                >
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{dwg.label}</div>
                      <div className="text-xs text-slate-400 font-mono">{dwg.sub}</div>
                    </div>
                    <span className="text-xs text-indigo-500 font-mono">click to enlarge →</span>
                  </div>
                  <img src={dwg.url} alt={dwg.label} className="w-full object-contain bg-white p-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: BOM ── */}
        {activeTab === "bom" && (
          <div>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              20-line detailed BOM. All costs ex-factory (EXW Shenzhen) at 100k+ units/year. Costs in USD per unit.
            </p>
            <BomTable rows={BOM_MECHANICAL} title="Mechanical Components" />
            <BomTable rows={BOM_ELECTRICAL} title="Electrical / Electronic Components" />
            <BomTable rows={BOM_PACKAGING} title="Packaging & Accessories" />

            {/* Cost Summary */}
            <div className="mt-4 bg-slate-900 rounded-xl p-6 text-white">
              <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">BOM Cost Summary</h4>
              <div className="space-y-3">
                {COST_SUMMARY.map(row => {
                  const maxVal = totalHigh;
                  const pctHigh = (row.high / maxVal) * 100;
                  return (
                    <div key={row.category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">{row.category}</span>
                        <span className="text-xs font-mono text-white">${row.low.toFixed(2)}–${row.high.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${pctHigh}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Total COGS (incl. labor)</span>
                  <span className="text-sm font-mono font-bold text-indigo-300">
                    ~${totalLow.toFixed(2)}–${totalHigh.toFixed(2)} / unit
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 font-mono leading-relaxed">
                Dominant cost driver: PCBA electronics assembly. Pogo pin selection and PD controller IC are
                highest-risk BOM items for cost and lead time — lock these first.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab: Assembly Flow ── */}
        {activeTab === "assembly" && (
          <div>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              Dual-track assembly: Sub-Assembly A (PCBA) and Sub-Assembly B (Clamp Mechanism) run in parallel,
              merging at Final Assembly. Estimated cycle time: ~3.5 min/unit. Target yield: ≥97.0%.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "PCBA SA Cycle Time", value: "45 sec", sub: "Line rate, SMT reflow", color: "bg-blue-50 border-blue-200 text-blue-700" },
                { label: "Final Assembly", value: "90 sec", sub: "Per unit incl. test", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
                { label: "End-to-End Yield Target", value: "≥97.0%", sub: "AQL 1.0 Level II", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border px-5 py-4 ${s.color}`}>
                  <div className="text-xs font-mono opacity-70 mb-1">{s.label}</div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs opacity-60 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
            <div
              className="cursor-zoom-in flex justify-center bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => setLightboxImg(CDN.assemblyFlow)}
            >
              <img src={CDN.assemblyFlow} alt="Assembly Process Flow" className="max-h-[800px] object-contain" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
