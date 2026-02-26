/*
 * DESIGN PHILOSOPHY: Technical Dashboard — Precision Engineering Tool
 * Dark charcoal bg (#0f1117), electric blue accent, JetBrains Mono for data
 * Three sub-tabs: Spring Selection | Hinge Web FEA | Material Selection
 * Each tab presents analysis charts + structured data tables + key findings
 */
import { useState } from "react";

// ── CDN asset URLs ────────────────────────────────────────────────────────────
const ASSETS = {
  springTradeoff:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/spring_tradeoff_v3_a9642dc5.png",
  wallAnalysis:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/wall_analysis_a266a154.png",
  wallAnalysisTR90: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/wall_analysis_tr90_3a71bd32.png",
  escComparison:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/esc_comparison_d7385c88.png",
  thermalComparison:"https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/thermal_comparison_d406ad4c.png",
};

// ── Shared primitives ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.15em] mb-3 mt-5 flex items-center gap-2">
      <span className="flex-1 h-px bg-blue-500/20" />
      {children}
      <span className="flex-1 h-px bg-blue-500/20" />
    </div>
  );
}

function FindingCard({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    green:  "border-emerald-500/40 bg-emerald-500/5",
    amber:  "border-amber-500/40 bg-amber-500/5",
    red:    "border-red-500/40 bg-red-500/5",
    blue:   "border-blue-500/40 bg-blue-500/5",
    purple: "border-purple-500/40 bg-purple-500/5",
  };
  const labelColors: Record<string, string> = {
    green:  "text-emerald-400",
    amber:  "text-amber-400",
    red:    "text-red-400",
    blue:   "text-blue-400",
    purple: "text-purple-400",
  };
  return (
    <div className={`rounded border px-3 py-2.5 ${colors[color] ?? colors.blue}`}>
      <div className={`text-[9px] font-mono font-bold uppercase tracking-widest mb-1 ${labelColors[color] ?? labelColors.blue}`}>{label}</div>
      <div className="text-[11px] text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

function DataTable({ headers, rows, highlight }: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  highlight?: number; // column index to highlight
}) {
  return (
    <div className="overflow-x-auto rounded border border-slate-800/80">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="bg-[#12141c]">
            {headers.map((h, i) => (
              <th key={i} className={`px-3 py-2 text-left font-semibold border-b border-slate-800/80 whitespace-nowrap
                ${i === highlight ? "text-blue-400" : "text-slate-500"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-[#0f1117]" : "bg-[#111318]"}>
              {row.map((cell, ci) => (
                <td key={ci} className={`px-3 py-1.5 border-b border-slate-800/40
                  ${ci === highlight ? "text-blue-300 font-mono font-semibold" : "text-slate-300 font-mono"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-4">
      <div className="rounded-lg border border-slate-800/80 overflow-hidden bg-[#0a0c12]">
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      </div>
      <figcaption className="text-[9px] text-slate-600 font-mono mt-1.5 text-center italic">{caption}</figcaption>
    </figure>
  );
}

// ── Sub-tab: Spring Selection ─────────────────────────────────────────────────
function SpringSelectionTab() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-2">
      <SectionLabel>Objective</SectionLabel>
      <p className="text-[12px] text-slate-400 leading-relaxed">
        Identify the smallest achievable outer diameter for both single-torsion and double-torsion spring
        configurations that meet the clamping force requirement (F&nbsp;=&nbsp;5.6&nbsp;N at the pivot arm)
        with a safety factor ≥&nbsp;2.0 against yield, across three spring materials.
      </p>

      <SectionLabel>Design Constraints</SectionLabel>
      <DataTable
        headers={["Parameter", "Value", "Notes"]}
        rows={[
          ["Required clamping force", "5.6 N", "At glasses temple contact point"],
          ["Pivot arm length", "~8 mm", "Horizontal + vertical component"],
          ["Max outer diameter (target)", "≤ 5.0 mm", "Drives clip housing width"],
          ["Min spring index C", "4.0", "Below C=4 requires specialist CNC coiling"],
          ["Safety factor target", "≥ 2.0", "Cyclic loading, 4,000 cycles"],
          ["Loaded angle α", "90°", "Closed/clamped position"],
          ["Temperature range", "−20 °C to +85 °C", "Hot-car soak included"],
        ]}
      />

      <SectionLabel>Spring Type Comparison</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FindingCard color="blue" label="Single Torsion">
          One coil body. Full torque T = F × arm carried by the single body. Requires larger wire
          diameter or more coils to achieve the same safety factor. Simpler assembly — one pivot pin,
          one seating feature. Minimum OD achievable: <span className="text-blue-300 font-mono font-bold">~4.2 mm</span> (Music Wire, d=0.55 mm, C=6.6).
        </FindingCard>
        <FindingCard color="purple" label="Double Torsion">
          Two coil bodies sharing the load — each body carries T/2. Halving the torque per body
          allows a smaller wire diameter for the same stress level, reducing OD. Total spring rate
          k_total = 2 × k_single. Minimum OD achievable: <span className="text-purple-300 font-mono font-bold">~3.4 mm</span> (Music Wire, d=0.45 mm, C=6.5).
          Requires bridge gap between bodies; adds ~1.5–2.0 mm to total axial length.
        </FindingCard>
      </div>

      <SectionLabel>Recommended Designs — Smallest OD per Configuration</SectionLabel>
      <DataTable
        headers={["Config", "Material", "Wire d (mm)", "OD (mm)", "Active Coils N", "Body Length (mm)", "Spring Rate k (N·mm/°)", "SF", "Notes"]}
        highlight={3}
        rows={[
          ["Single", "Music Wire A228",    "0.55", "4.18", "7.5",  "4.1", "0.48", "2.12", "Recommended baseline"],
          ["Single", "Stainless 302 A313", "0.60", "4.50", "8.0",  "4.8", "0.44", "2.05", "Corrosion resistant"],
          ["Single", "Chrome-Silicon A401","0.50", "4.00", "6.5",  "3.3", "0.52", "2.18", "Highest strength"],
          ["Double", "Music Wire A228",    "0.45", "3.38", "6.0",  "9.4", "0.51", "2.08", "Smallest OD overall ★"],
          ["Double", "Stainless 302 A313", "0.50", "3.75", "7.0", "10.5", "0.47", "2.03", "Corrosion + small OD"],
          ["Double", "Chrome-Silicon A401","0.40", "3.20", "5.5",  "8.2", "0.55", "2.14", "Minimum possible OD"],
        ]}
      />

      <SectionLabel>Trade-off Analysis</SectionLabel>
      <ChartFigure
        src={ASSETS.springTradeoff}
        alt="Spring trade-off chart: OD vs safety factor across materials and configurations"
        caption="Figure 1 — Spring trade-off: outer diameter vs. safety factor for single and double torsion configurations across three materials. Shaded region = feasible design space (SF ≥ 2.0, OD ≤ 5.0 mm)."
      />

      <SectionLabel>Key Findings</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FindingCard color="green" label="Double Torsion Wins on OD">
          The double-torsion configuration achieves ~0.8 mm smaller OD than the equivalent
          single-torsion design at the same safety factor. This directly reduces the required
          housing width and clip profile.
        </FindingCard>
        <FindingCard color="amber" label="Chrome-Silicon Enables Smallest Wire">
          Chrome-Silicon (ASTM A401) has ~10% higher yield strength than Music Wire at the same
          diameter, enabling d&nbsp;=&nbsp;0.40&nbsp;mm and OD&nbsp;=&nbsp;3.2&nbsp;mm in double-torsion.
          However, C&nbsp;&lt;&nbsp;4 at this size requires specialist CNC coiling — verify with supplier.
        </FindingCard>
        <FindingCard color="blue" label="Stainless for Corrosion Environments">
          If the spring is exposed to sweat or humidity (e.g., uncoated), 302 Stainless (ASTM A313)
          is preferred. The OD penalty vs. Music Wire is only ~0.3–0.4&nbsp;mm. Passivation after
          coiling is recommended.
        </FindingCard>
      </div>
    </div>
  );
}

// ── Sub-tab: Hinge Web FEA ────────────────────────────────────────────────────
function HingeWebFEATab() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-2">
      <SectionLabel>Problem Statement</SectionLabel>
      <p className="text-[12px] text-slate-400 leading-relaxed">
        The narrow wall section between the pivot pin hole and the bearing surface of the housing
        (the "hinge web") is the most structurally critical feature of the clip. The spring leg
        bears against the top edge of this web, creating combined bending and shear. This analysis
        determines the minimum allowable web width <em>w</em> before the section yields or fails
        under repeated clamping loads.
      </p>

      <SectionLabel>Model Assumptions</SectionLabel>
      <DataTable
        headers={["Parameter", "Value", "Basis"]}
        rows={[
          ["Applied force F", "5.6 N", "Full clamping force at spring leg contact"],
          ["Section thickness t (into page)", "1.2 mm", "Plastic enclosure wall — given"],
          ["Moment arm", "= w (conservative)", "Load assumed at outermost edge of web"],
          ["Failure criterion", "Von Mises", "σ_vm = √(σ_b² + 3τ²)"],
          ["Bending stress", "σ_b = 6Fw / (t·w²) = 6F/(t·w)", "Rectangular section modulus Z = t·w²/6"],
          ["Shear stress", "τ = 1.5 F / (t·w)", "Average shear × 1.5 form factor"],
          ["Safety factor target", "SF ≥ 2.0", "Cyclic plastic, 4,000 open-close cycles"],
        ]}
      />

      <SectionLabel>Results — Minimum Web Width by Material</SectionLabel>
      <DataTable
        headers={["Material", "σ_yield (MPa)", "Min w — SF = 2.0 (mm)", "Recommended w — SF ≈ 2.4 (mm)", "Notes"]}
        highlight={2}
        rows={[
          ["POM (Delrin)", "70", "0.84", "≥ 1.0", "Best yield margin; dry = conditioned"],
          ["PC (Polycarbonate)", "60", "0.98", "≥ 1.2", "ESC risk offsets structural advantage"],
          ["TR90 (Grilamid TR-90)", "60", "0.98", "≥ 1.2", "Preferred — ESC resistant, no moisture penalty"],
          ["Nylon 66 (dry)", "55", "1.06", "≥ 1.3", "Conditioned yield drops to ~42 MPa"],
          ["Nylon 66 (conditioned)", "42", "1.38", "≥ 1.6", "Design to conditioned value in humid environments"],
        ]}
      />

      <SectionLabel>Safety Factor vs. Wall Width — POM / PC / TR90</SectionLabel>
      <ChartFigure
        src={ASSETS.wallAnalysis}
        alt="Safety factor vs wall width for POM, PC, and Nylon 66"
        caption="Figure 2 — Safety factor vs. hinge web width w for three materials. Horizontal dashed line = SF target of 2.0. Bending dominates over shear at all practical widths (σ_b / τ ≈ 6:1 at w = 1.5 mm)."
      />

      <SectionLabel>Updated Analysis — TR90 Replacing Nylon 66</SectionLabel>
      <ChartFigure
        src={ASSETS.wallAnalysisTR90}
        alt="Safety factor vs wall width for POM, PC, and TR90"
        caption="Figure 3 — Revised analysis substituting TR90 for Nylon 66. TR90 and PC share the same 60 MPa yield stress, producing identical minimum wall widths. TR90's higher ductility (>50% elongation) provides a visible deformation warning mode before fracture."
      />

      <SectionLabel>Key Findings</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FindingCard color="green" label="Bending Dominates">
          At w&nbsp;=&nbsp;1.5&nbsp;mm the bending stress is 18.7&nbsp;MPa vs. only 3.1&nbsp;MPa shear.
          The section modulus Z&nbsp;=&nbsp;t·w²/6 grows with w², so narrowing the web is
          disproportionately harmful — halving w quadruples the bending stress.
        </FindingCard>
        <FindingCard color="blue" label="Practical Lower Bound">
          <span className="text-blue-300 font-mono font-bold">1.0 mm</span> for POM/PC/TR90 (SF&nbsp;=&nbsp;2.0).
          <span className="text-blue-300 font-mono font-bold"> 1.2 mm</span> recommended for TR90/PC (SF&nbsp;≈&nbsp;2.4).
          At 1.5&nbsp;mm all three materials achieve SF&nbsp;&gt;&nbsp;2.8×, which is comfortable for
          4,000-cycle fatigue life.
        </FindingCard>
        <FindingCard color="amber" label="TR90 Preferred">
          TR90 matches PC structurally (same yield stress, same minimum width) but far exceeds PC
          on ESC and chemical resistance. Its &gt;50% elongation at break means the web deforms
          visibly before fracturing — a safer failure mode than the brittle cracking seen in PC.
        </FindingCard>
      </div>
    </div>
  );
}

// ── Sub-tab: Material Selection ───────────────────────────────────────────────
function MaterialSelectionTab() {
  const [activeSubTab, setActiveSubTab] = useState<"chemical" | "thermal">("chemical");

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-2">
      <SectionLabel>Selection Criteria</SectionLabel>
      <p className="text-[12px] text-slate-400 leading-relaxed">
        The charging clip is a body-contact wearable that will be regularly exposed to sweat, sunscreen,
        cosmetics, and seasonal temperature extremes. Three candidate materials are evaluated across
        two axes: chemical / ESC resistance and thermal stability / warpage resistance.
      </p>

      {/* Sub-tab switcher */}
      <div className="flex gap-1 mt-3 mb-1">
        {(["chemical", "thermal"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-1.5 text-[11px] font-mono rounded border transition-colors
              ${activeSubTab === tab
                ? "bg-blue-600/20 border-blue-500/60 text-blue-300"
                : "bg-transparent border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}
          >
            {tab === "chemical" ? "Chemical & ESC Resistance" : "Thermal Stability & Warpage"}
          </button>
        ))}
      </div>

      {activeSubTab === "chemical" && (
        <>
          <SectionLabel>Chemical & ESC Resistance — Body-Contact Agents</SectionLabel>
          <ChartFigure
            src={ASSETS.escComparison}
            alt="ESC and chemical resistance heatmap: PC vs TR90 vs POM"
            caption="Figure 4 — Chemical and ESC resistance heatmap for body-contact agents. Rating scale: Excellent (4) → Severe Risk (0). Overall scores: POM 3.2/4, TR90 3.1/4, PC 1.4/4."
          />

          <SectionLabel>Agent-by-Agent Summary</SectionLabel>
          <DataTable
            headers={["Agent", "PC", "TR90", "POM", "Critical Notes"]}
            rows={[
              ["Sweat (lactic acid, urea, salts)", "⚠ Caution", "✓ Excellent", "✓ Excellent", "Urea in sweat attacks PC under stress"],
              ["Sebum / skin oils", "✓ Good", "✓ Excellent", "✓ Excellent", "All three resist fats and fatty acids"],
              ["Sunscreen (chemical UV filters)", "✗ Severe Risk", "✓ Good", "✓ Good", "OMC, oxybenzone, avobenzone crack PC — SAE 2011-01-0037"],
              ["Sunscreen (DEET component)", "✗ Poor", "⚠ Caution", "✓ Good", "DEET is amide-based; PA affinity for TR90"],
              ["Ethanol / IPA (hand sanitiser)", "✗ Poor", "⚠ Caution", "✓ Good", "Common in cosmetics and sanitisers"],
              ["Foundation / lipstick / mascara", "✓ Good", "✓ Excellent", "✓ Excellent", "Mineral oils and waxes are non-aggressive"],
              ["Nail polish remover (acetone)", "✗ Severe Risk", "⚠ Caution", "⚠ Caution", "Avoid all three; not a realistic in-use exposure"],
              ["ESC susceptibility (overall)", "✗ Poor", "✓ Excellent", "✓ Good", "PC amorphous = no crystalline barrier"],
            ]}
          />

          <SectionLabel>Why PC Fails in This Application</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FindingCard color="red" label="PC — Not Recommended">
              PC is amorphous with no crystalline barrier to chemical diffusion. Sunscreen UV filters
              (present on virtually every user's hands) plasticise the amorphous PC, lowering local Tg
              and allowing crack propagation at stresses well below yield. A peer-reviewed SAE study
              (2011-01-0037) documents this exact failure mode on finger-contact plastic parts.
              The failure is sudden and brittle — no warning deformation.
            </FindingCard>
            <FindingCard color="green" label="TR90 — Recommended">
              Grilamid TR-90 was developed specifically for eyewear frames — the identical use case.
              EMS-Grivory explicitly markets its ESC resistance as a differentiator vs. other transparent
              plastics. No moisture penalty (dry = conditioned yield stress). Ductile failure mode
              (&gt;50% elongation). Rated for repeated flexure at a pivot over thousands of cycles.
            </FindingCard>
          </div>
        </>
      )}

      {activeSubTab === "thermal" && (
        <>
          <SectionLabel>Thermal Stability & Warpage — Hot Car + Cycling</SectionLabel>
          <ChartFigure
            src={ASSETS.thermalComparison}
            alt="Thermal stability comparison: PC vs TR90 vs POM"
            caption="Figure 5 — Thermal comparison: (left) HDT thresholds vs. 85°C hot-car reference; (centre) CTE-driven dimensional change on a 30 mm reference length; (right) modulus retention vs. temperature; (bottom) scenario risk heatmap."
          />

          <SectionLabel>Key Thermal Properties</SectionLabel>
          <DataTable
            headers={["Property", "PC", "TR90", "POM", "Unit"]}
            highlight={3}
            rows={[
              ["Glass transition Tg", "147", "155", "−60 (semi-cryst.)", "°C"],
              ["HDT/A (1.80 MPa)", "128", "115", "100", "°C"],
              ["HDT/B (0.45 MPa)", "140", "135", "158", "°C"],
              ["CTE (23–55 °C)", "68", "90", "115", "µm/m/°C"],
              ["Moulding shrinkage", "0.6", "0.75", "2.0", "%"],
              ["Modulus at RT", "2,350", "1,600", "3,100", "MPa"],
              ["Modulus at 80 °C", "~1,800", "~1,200", "~1,500", "MPa"],
              ["Moisture effect on yield", "None", "None (dry ≈ cond.)", "None", "—"],
            ]}
          />

          <SectionLabel>Scenario Risk Assessment</SectionLabel>
          <DataTable
            headers={["Scenario", "PC", "TR90", "POM", "Dominant Factor"]}
            rows={[
              ["Hot car soak (85 °C, 4 h)", "Good", "Good", "Good", "All HDT/A > 100°C; short-term soak OK"],
              ["Temp cycling (−20 → +70 °C)", "Good", "Caution", "Poor", "POM CTE = 115 µm/m/°C — highest differential vs. metal spring"],
              ["Creep under spring load (80 °C)", "Caution", "Good", "Poor", "POM HDT/A only 15°C above hot-car peak"],
              ["Dimensional fit stability (seasonal)", "Good", "Caution", "Poor", "POM: 0.31 mm change on 30 mm vs. PC: 0.18 mm"],
              ["Post-mould warpage", "Good", "Good", "Poor", "POM shrinkage 2.0% vs. 0.6–0.75% for PC/TR90"],
              ["Modulus retention at 80 °C", "Good", "Good", "Caution", "POM loses ~45% modulus by 80°C"],
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <FindingCard color="red" label="POM — Thermal Weakness">
              Despite the highest room-temperature stiffness, POM has the worst thermal profile for
              this application: highest CTE (115 µm/m/°C), highest moulding shrinkage (2.0%), and
              significant creep at 80°C. Seasonal temperature swings will change clamp force and
              clip-to-frame fit noticeably over the product lifetime.
            </FindingCard>
            <FindingCard color="green" label="TR90 — Balanced Performance">
              TR90 handles hot-car soak well (HDT/A = 115°C) and resists creep under load better
              than POM. CTE of 90 µm/m/°C is moderate. For tighter dimensional control across
              temperature cycles, a glass-filled grade (Grilamid TR 90 GF30) reduces CTE to
              ~40–50 µm/m/°C at the cost of some ductility.
            </FindingCard>
            <FindingCard color="blue" label="PC — Best Dimensional Stability">
              PC has the lowest CTE (68 µm/m/°C) and best dimensional stability across temperature
              cycles. However, this advantage is negated by its severe ESC risk under sunscreen
              and sweat exposure. PC is not recommended unless the design can guarantee zero
              sustained stress — impossible in a spring-loaded clip.
            </FindingCard>
          </div>
        </>
      )}

      <SectionLabel>Overall Material Recommendation</SectionLabel>
      <DataTable
        headers={["Criterion", "PC", "TR90", "POM", "Winner"]}
        rows={[
          ["Structural (min wall width)", "1.2 mm", "1.2 mm", "1.0 mm", "POM (marginally)"],
          ["ESC / chemical resistance", "Severe Risk", "Excellent", "Good", "TR90"],
          ["Hot car soak (85 °C)", "Good", "Good", "Good", "Tie"],
          ["Thermal cycling / warpage", "Good", "Caution", "Poor", "PC"],
          ["Moisture stability", "Good", "Excellent", "Good", "TR90"],
          ["Fatigue / flex life", "Moderate", "Excellent", "Good", "TR90"],
          ["Moulding precision", "Good", "Good", "Caution (high shrinkage)", "PC / TR90"],
          ["Industry precedent (eyewear)", "Rare", "Dominant", "Uncommon", "TR90"],
          ["Overall verdict", "✗ Not recommended", "✓ Best choice", "⚠ Acceptable backup", "TR90"],
        ]}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
type Tab = "spring" | "fea" | "material";

export default function EngineeringAnalysis() {
  const [activeTab, setActiveTab] = useState<Tab>("spring");

  const tabs: { id: Tab; label: string; shortLabel: string }[] = [
    { id: "spring",   label: "Spring Selection",       shortLabel: "Springs"  },
    { id: "fea",      label: "Hinge Web FEA",          shortLabel: "FEA"      },
    { id: "material", label: "Material Selection",     shortLabel: "Materials"},
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f1117] text-slate-100 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-[#0a0c12] border-b border-slate-800/80 px-6 py-3 flex items-center justify-between">
        <div>
          <div className="text-[9px] font-mono text-blue-500 uppercase tracking-[0.2em]">Luna Charging Clip</div>
          <div className="text-[15px] font-semibold text-slate-100 mt-0.5">Engineering Analysis</div>
        </div>
        <div className="text-[9px] font-mono text-slate-700 text-right">
          <div>Rev. A — Mar 2026</div>
          <div className="text-slate-800">Structural · Chemical · Thermal</div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-[#0d0f18] border-b border-slate-800/80 px-4 flex items-end gap-0.5 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 text-[11px] font-mono rounded-t border-x border-t transition-all
              ${activeTab === tab.id
                ? "bg-[#0f1117] border-slate-700/80 text-blue-300 border-b-[#0f1117] -mb-px z-10"
                : "bg-transparent border-transparent text-slate-600 hover:text-slate-400 hover:bg-slate-800/30"
              }`}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "spring"   && <SpringSelectionTab />}
        {activeTab === "fea"      && <HingeWebFEATab />}
        {activeTab === "material" && <MaterialSelectionTab />}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-1.5 border-t border-slate-800/80 bg-[#0a0c12] flex items-center justify-between">
        <span className="text-[9px] text-slate-700 font-mono">
          Sources: Shigley's Mechanical Engineering Design 10th Ed. · EMS-Grivory Grilamid TR-90 TDS · SAE 2011-01-0037 · DuPont Delrin Design Guide · Curbell Plastics ESC White Paper
        </span>
        <span className="text-[9px] text-slate-800 font-mono">Luna Charging Clip — Program Plan</span>
      </div>
    </div>
  );
}
