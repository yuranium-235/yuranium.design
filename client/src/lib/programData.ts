// ============================================================
// DESIGN: "Executive Technical" — program data source of truth
// ============================================================

export const KICKOFF = new Date("2026-02-25");
export const DVT_DATE = new Date("2026-05-19");
export const PVT_DATE = new Date("2026-06-22");

export function daysFrom(d: Date): number {
  return Math.round((d.getTime() - KICKOFF.getTime()) / (1000 * 60 * 60 * 24));
}

export const TOTAL_DAYS = daysFrom(PVT_DATE) + 35; // a bit of padding

export type Workstream =
  | "Program Management"
  | "Mechanical Engineering"
  | "Electrical Engineering"
  | "Firmware / Software"
  | "Reliability & Test"
  | "Regulatory & Compliance"
  | "Supply Chain & NPI";

export const WORKSTREAM_COLORS: Record<Workstream, string> = {
  "Program Management":      "#2C6E9E",
  "Mechanical Engineering":  "#457B9D",
  "Electrical Engineering":  "#1D7A8A",
  "Firmware / Software":     "#6A4C93",
  "Reliability & Test":      "#8B5CF6",
  "Regulatory & Compliance": "#D97706",
  "Supply Chain & NPI":      "#B45309",
};

export const WORKSTREAM_BG: Record<Workstream, string> = {
  "Program Management":      "bg-[#2C6E9E]",
  "Mechanical Engineering":  "bg-[#457B9D]",
  "Electrical Engineering":  "bg-[#1D7A8A]",
  "Firmware / Software":     "bg-[#6A4C93]",
  "Reliability & Test":      "bg-[#8B5CF6]",
  "Regulatory & Compliance": "bg-[#D97706]",
  "Supply Chain & NPI":      "bg-[#B45309]",
};

export const WORKSTREAM_BORDER: Record<Workstream, string> = {
  "Program Management":      "border-l-[#2C6E9E]",
  "Mechanical Engineering":  "border-l-[#457B9D]",
  "Electrical Engineering":  "border-l-[#1D7A8A]",
  "Firmware / Software":     "border-l-[#6A4C93]",
  "Reliability & Test":      "border-l-[#8B5CF6]",
  "Regulatory & Compliance": "border-l-[#D97706]",
  "Supply Chain & NPI":      "border-l-[#B45309]",
};

export interface Task {
  workstream: Workstream;
  label: string;
  start: Date;
  end: Date;
  isMilestone: boolean;
}

function mk(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

export const TASKS: Task[] = [
  // Program Management
  { workstream: "Program Management", label: "Program Kickoff & Charter",    start: mk(2026,2,25), end: mk(2026,3,4),  isMilestone: false },
  { workstream: "Program Management", label: "PRD / Requirements Lock",      start: mk(2026,2,25), end: mk(2026,3,11), isMilestone: false },
  { workstream: "Program Management", label: "DVT Build Review Gate",        start: mk(2026,5,19), end: mk(2026,5,19), isMilestone: true  },
  { workstream: "Program Management", label: "DVT Exit / PVT Gate Review",   start: mk(2026,6,15), end: mk(2026,6,15), isMilestone: true  },
  { workstream: "Program Management", label: "PVT Ramp Start",               start: mk(2026,6,22), end: mk(2026,6,22), isMilestone: true  },

  // Mechanical Engineering
  { workstream: "Mechanical Engineering", label: "Nose bridge interface study & measurement", start: mk(2026,2,25), end: mk(2026,3,6),  isMilestone: false },
  { workstream: "Mechanical Engineering", label: "ID Lock ✓ CONFIRMED",                       start: mk(2026,3,6),  end: mk(2026,3,6),  isMilestone: true  },
  { workstream: "Mechanical Engineering", label: "ME design with ID integration",             start: mk(2026,3,6),  end: mk(2026,3,13), isMilestone: false },
  { workstream: "Mechanical Engineering", label: "ME Design Freeze ✓ CONFIRMED",              start: mk(2026,3,13), end: mk(2026,3,13), isMilestone: true  },
  { workstream: "Mechanical Engineering", label: "DFM review with supplier",                  start: mk(2026,3,13), end: mk(2026,3,27), isMilestone: false },
  { workstream: "Mechanical Engineering", label: "Hard Tooling Kick-Off ✓ CONFIRMED",         start: mk(2026,3,30), end: mk(2026,3,30), isMilestone: true  },
  { workstream: "Mechanical Engineering", label: "Rapid proto (SLA/SLS) — bench test",        start: mk(2026,3,6),  end: mk(2026,3,27), isMilestone: false },
  { workstream: "Mechanical Engineering", label: "T1 mold shots & dimensional check",         start: mk(2026,4,27), end: mk(2026,5,8),  isMilestone: false },
  { workstream: "Mechanical Engineering", label: "T2 / ECO mold corrections",                 start: mk(2026,5,8),  end: mk(2026,5,16), isMilestone: false },
  { workstream: "Mechanical Engineering", label: "DVT mechanical parts ready",                start: mk(2026,5,16), end: mk(2026,5,16), isMilestone: true  },
  { workstream: "Mechanical Engineering", label: "DVT mechanical validation testing",         start: mk(2026,5,19), end: mk(2026,6,9),  isMilestone: false },
  { workstream: "Mechanical Engineering", label: "PVT mechanical parts ready",                start: mk(2026,6,16), end: mk(2026,6,16), isMilestone: true  },

  // Electrical Engineering
  { workstream: "Electrical Engineering", label: "Pogo pin spec & supplier selection",  start: mk(2026,2,25), end: mk(2026,3,11), isMilestone: false },
  { workstream: "Electrical Engineering", label: "USB-C interface & power architecture",start: mk(2026,2,25), end: mk(2026,3,18), isMilestone: false },
  { workstream: "Electrical Engineering", label: "Schematic & PCB layout (v1)",         start: mk(2026,3,11), end: mk(2026,4,1),  isMilestone: false },
  { workstream: "Electrical Engineering", label: "PCB fabrication & assembly",          start: mk(2026,4,1),  end: mk(2026,4,22), isMilestone: false },
  { workstream: "Electrical Engineering", label: "Bench electrical validation",         start: mk(2026,4,22), end: mk(2026,5,6),  isMilestone: false },
  { workstream: "Electrical Engineering", label: "PCB v2 (ECO if needed)",              start: mk(2026,5,6),  end: mk(2026,5,16), isMilestone: false },
  { workstream: "Electrical Engineering", label: "DVT electrical parts ready",          start: mk(2026,5,16), end: mk(2026,5,16), isMilestone: true  },
  { workstream: "Electrical Engineering", label: "DVT electrical validation",           start: mk(2026,5,19), end: mk(2026,6,9),  isMilestone: false },
  { workstream: "Electrical Engineering", label: "PVT electrical parts ready",          start: mk(2026,6,16), end: mk(2026,6,16), isMilestone: true  },

  // Firmware / Software
  { workstream: "Firmware / Software", label: "USB PD / charging protocol spec",     start: mk(2026,2,25), end: mk(2026,3,11), isMilestone: false },
  { workstream: "Firmware / Software", label: "FW development (USB-C PD, safety)",   start: mk(2026,3,11), end: mk(2026,4,22), isMilestone: false },
  { workstream: "Firmware / Software", label: "FW integration & bench test",         start: mk(2026,4,22), end: mk(2026,5,13), isMilestone: false },
  { workstream: "Firmware / Software", label: "DVT FW release candidate",            start: mk(2026,5,13), end: mk(2026,5,13), isMilestone: true  },
  { workstream: "Firmware / Software", label: "DVT FW validation & soak",            start: mk(2026,5,19), end: mk(2026,6,9),  isMilestone: false },
  { workstream: "Firmware / Software", label: "PVT FW golden release",               start: mk(2026,6,16), end: mk(2026,6,16), isMilestone: true  },

  // Reliability & Test
  { workstream: "Reliability & Test", label: "Test plan development",                         start: mk(2026,2,25), end: mk(2026,3,18), isMilestone: false },
  { workstream: "Reliability & Test", label: "Pogo pin contact force / life test",            start: mk(2026,4,15), end: mk(2026,5,13), isMilestone: false },
  { workstream: "Reliability & Test", label: "DVT reliability suite (drop, ESD, mech. retention, thermal)", start: mk(2026,5,19), end: mk(2026,6,9), isMilestone: false },
  { workstream: "Reliability & Test", label: "DVT reliability exit report",                   start: mk(2026,6,9),  end: mk(2026,6,9),  isMilestone: true  },
  { workstream: "Reliability & Test", label: "PVT OQC / line yield monitoring",               start: mk(2026,6,22), end: mk(2026,7,13), isMilestone: false },

  // Regulatory & Compliance
  { workstream: "Regulatory & Compliance", label: "MRC / BioC material qualification",  start: mk(2026,2,25), end: mk(2026,4,8),  isMilestone: false },
  { workstream: "Regulatory & Compliance", label: "FCC / CE / RoHS pre-compliance",     start: mk(2026,4,8),  end: mk(2026,5,13), isMilestone: false },
  { workstream: "Regulatory & Compliance", label: "Submit for FCC / CE certification",  start: mk(2026,5,19), end: mk(2026,5,19), isMilestone: true  },
  { workstream: "Regulatory & Compliance", label: "Certification approval expected",    start: mk(2026,6,10), end: mk(2026,6,10), isMilestone: true  },

  // Supply Chain & NPI
  { workstream: "Supply Chain & NPI", label: "Supplier qualification (pogo, PCB, housing)", start: mk(2026,2,25), end: mk(2026,3,25), isMilestone: false },
  { workstream: "Supply Chain & NPI", label: "BOM & AVL finalization",                      start: mk(2026,3,18), end: mk(2026,4,8),  isMilestone: false },
  { workstream: "Supply Chain & NPI", label: "DVT build materials procurement",             start: mk(2026,4,1),  end: mk(2026,5,12), isMilestone: false },
  { workstream: "Supply Chain & NPI", label: "DVT build @ CM",                              start: mk(2026,5,12), end: mk(2026,5,19), isMilestone: false },
  { workstream: "Supply Chain & NPI", label: "PVT materials & capacity commit",             start: mk(2026,5,19), end: mk(2026,6,15), isMilestone: false },
  { workstream: "Supply Chain & NPI", label: "PVT build start",                             start: mk(2026,6,22), end: mk(2026,6,22), isMilestone: true  },
];

export const WORKSTREAMS = Object.keys(WORKSTREAM_COLORS) as Workstream[];

export interface Risk {
  id: string;
  title: string;
  impact: "High" | "Medium" | "Low";
  description: string;
  mitigation: string[];
}

export const RISKS: Risk[] = [
  {
    id: "R-01",
    title: "Skipping EVT Build",
    impact: "High",
    description: "Design flaws (mechanical fit, electrical faults) discovered after hard tooling is complete lead to expensive mold rework and significant schedule delays.",
    mitigation: [
      "Perform rigorous FEA on the retention clip for stress/strain and tolerance stack-up analysis before tool kick-off.",
      "Create multiple SLA/SLS prototypes for bench testing of mechanical fit, retention force, and user experience.",
      "Mandate DFM reviews with the injection molding supplier before CAD is finalized.",
    ],
  },
  {
    id: "R-02",
    title: "Mechanical Retention Failure",
    impact: "High",
    description: "The clip does not securely attach to the glasses, is difficult to align, damages cosmetic surfaces of the nose bridge, or has inadequate retention force.",
    mitigation: [
      "Obtain high-resolution 3D scan data of the final next-gen glasses nose bridge geometry on Day 1.",
      "Dedicate a rapid prototyping stream exclusively to iterating on the nose bridge clip geometry and material.",
      "Work with the pogo pin supplier to model required spring force against mechanical retention capacity.",
    ],
  },
  {
    id: "R-03",
    title: "Pogo Pin Sourcing & Reliability",
    impact: "Medium",
    description: "Selected pogo pin supplier cannot meet timeline, or pins fail life-cycle testing (contact resistance, spring force degradation) during DVT.",
    mitigation: [
      "Identify and qualify two potential pogo pin suppliers in parallel during the first three weeks.",
      "Procure sample pins immediately and begin life-cycle testing well ahead of the integrated DVT build.",
    ],
  },
  {
    id: "R-04",
    title: "Regulatory Compliance Delays",
    impact: "Medium",
    description: "Failures during FCC/CE testing or delays in material compliance documentation (RoHS, REACH, BioC/MRC) gate the start of PVT and shipment.",
    mitigation: [
      "Conduct in-house or 3rd-party pre-compliance testing on first assembled PCB prototypes to identify EMI/ESD issues early.",
      "Make RoHS/REACH and biocompatibility documentation a mandatory deliverable for all component suppliers as part of initial qualification.",
    ],
  },
];

export const WORKSTREAM_DESCRIPTIONS: Record<Workstream, string> = {
  "Program Management": "Owns the program charter, PRD, milestone gates, cross-functional alignment, and executive reporting. Drives all gate reviews from kickoff through PVT ramp.",
  "Mechanical Engineering": "Responsible for industrial design, 3D CAD, material selection (housing, clip), tolerance analysis, and all tooling. The critical path runs directly through ME — the injection mold has the longest lead time on the program.",
  "Electrical Engineering": "Owns pogo pin selection, PCB schematic and layout, USB-C power delivery interface, and all electrical validation. Runs in parallel with ME and must deliver a validated PCB assembly in time for the DVT build.",
  "Firmware / Software": "Develops firmware for the charging clip's microcontroller, managing the USB-C PD handshake and charging safety features. Must deliver a DVT-ready release candidate before the build date.",
  "Reliability & Test": "Develops the DVT test plan and executes all validation testing including mechanical (drop, retention force), electrical (ESD), and environmental (thermal, humidity). Their findings determine DVT exit and PVT readiness.",
  "Regulatory & Compliance": "Manages all material declarations (RoHS, REACH, BioC/MRC) and submissions for agency certification (FCC, CE, UL). A critical-path dependency for market release.",
  "Supply Chain & NPI": "Manages all supplier qualification, component procurement, BOM costing, and contract manufacturer engagement. Responsible for ensuring all materials are on-site for DVT and PVT builds.",
};

// ── Schedule Risk & Probability Analysis Data ──────────────────────────────

export const PROBABILITY_CHART_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663369013021/W6PHqEe8bVmgPywmzYh9Re/probability_analysis_v3_6a6fd77b.png";

export interface ScheduleRisk {
  id: string;
  name: string;
  pOccur: number;        // probability of occurrence 0–1
  expectedSlip: number;  // expected slip in weeks (P × mode)
  slipMode: number;      // most likely slip in weeks if it occurs
  slipMax: number;       // worst-case slip in weeks if it occurs
  impact: "Critical" | "High" | "Medium" | "Low";
  description: string;
  mitigation: string;
}

export const SCHEDULE_RISKS: ScheduleRisk[] = [
  {
    id: "SR-01",
    name: "Critical design flaw at DVT (EVT skipped)",
    pOccur: 0.30,
    expectedSlip: 1.95,
    slipMode: 6.5,
    slipMax: 10.0,
    impact: "Critical",
    description:
      "RISK REDUCED (v3): Positive 3D-printed prototype results validate the core mechanism — clothing-pin actuation, tooth/divot engagement, and pogo pin contact. Residual risk is the material property gap between 3D-print and injection-molded PC, and any late ID geometry changes that require mechanical redesign before tooling KO.",
    mitigation:
      "Continue prototype iteration to cover all three key validation targets: (1) 500-cycle open/close fatigue test, (2) pull-force test against USB-C cable tug spec, (3) dimensional study of jaw gap vs. nose bridge thickness across 5–10 printed parts. Lock ID geometry by Mar 6 to prevent late changes from invalidating prototype results.",
  },
  {
    id: "SR-02",
    name: "Mechanical retention / nose bridge fit failure",
    pOccur: 0.28,
    expectedSlip: 0.98,
    slipMode: 3.5,
    slipMax: 6.0,
    impact: "High",
    description:
      "RISK REDUCED (v3): Prototype testing confirms the tooth/divot engagement mechanism is working and the pogo pins are making contact. Residual risk is the production tolerance stack-up in injection-molded parts vs. the actual glasses nose bridge geometry — which the 3D-printed prototype cannot fully replicate.",
    mitigation:
      "Validate contact force and jaw gap on printed prototypes against the confirmed nose bridge geometry before tooling KO on Mar 30. Require a dimensional study of 5–10 T1 parts immediately upon T1 receipt to catch any tolerance stack-up issues before DVT build.",
  },
  {
    id: "SR-03",
    name: "Injection mold tooling delay (T1 late or rejected)",
    pOccur: 0.30,
    expectedSlip: 0.60,
    slipMode: 2.0,
    slipMax: 4.0,
    impact: "High",
    description:
      "RISK SLIGHTLY REDUCED (v3): A validated design going into tooling is less likely to require major T1 rework than an unvalidated one. However, this is a supplier execution risk — China production steel molds carry a 4–8 week lead time to T1, and dimensional rejection is common for precision clip geometries regardless of design maturity.",
    mitigation:
      "Kick off tooling on Mar 30 with a pre-qualified mold supplier. Conduct a DFM review before tool release. Build an explicit T2 correction window into the schedule. Require CMM report on T1 parts within 48 hours of receipt.",
  },
  {
    id: "SR-04",
    name: "PCB re-spin required (EE issue at bench validation)",
    pOccur: 0.08,
    expectedSlip: 0.20,
    slipMode: 2.5,
    slipMax: 4.0,
    impact: "Low",
    description:
      "RISK REDUCED: The PCB design is being reused from an existing qualified program. Only minor adaptation is expected (connector footprint, pogo pin routing). A full re-spin is unlikely but possible if the adaptation introduces unforeseen issues.",
    mitigation:
      "Conduct a focused delta-review of all changes from the source design. Validate only the modified sections on bench. Full re-spin risk is low given the existing qualification baseline.",
  },
  {
    id: "SR-05",
    name: "BioC / MRC material qualification failure",
    pOccur: 0.15,
    expectedSlip: 0.53,
    slipMode: 3.5,
    slipMax: 6.0,
    impact: "Medium",
    description:
      "RISK REDUCED: PCB materials, solder alloys, conformal coatings, and electronic components are already MRC-qualified from the existing program. Remaining exposure is limited to the new mechanical housing plastics and pogo pin plating on the charging clip body.",
    mitigation:
      "Require DMF-free PC housing material certification and nickel-free or low-nickel plating declarations from mechanical suppliers. Electronic BOM materials are pre-cleared.",
  },
  {
    id: "SR-06",
    name: "FCC / CE certification delay",
    pOccur: 0.20,
    expectedSlip: 0.40,
    slipMode: 2.0,
    slipMax: 4.0,
    impact: "Medium",
    description:
      "RISK SLIGHTLY REDUCED: Reusing a qualified electronics platform may enable a modular or delta-certification path, reducing test scope. However, the new mechanical form factor still requires a full FCC/CE submission and lab queue times remain a risk.",
    mitigation:
      "Confirm with the certification lab whether a modular certification path is available given the electronics reuse. Book lab slots at least 6 weeks before DVT. Run pre-compliance testing early.",
  },
  {
    id: "SR-07",
    name: "ID churn / late industrial design changes",
    pOccur: 0.45,
    expectedSlip: 1.12,
    slipMode: 2.5,
    slipMax: 4.0,
    impact: "High",
    description:
      "RISK FURTHER INCREASED (v4): ID Lock pushed to Mar 11, leaving only 2 days before Design Lock on Mar 13. Any ID change after Mar 11 that affects structural geometry (clamp saddle, front enclosure footprint, LED position) cannot be absorbed before tooling KO on Mar 30. The compressed 2-day window between ID Lock and Design Lock eliminates all buffer for late changes.",
    mitigation:
      "Get a written scope commitment from the ID team before Mar 11 ID lock: freeze clamp saddle geometry, front enclosure footprint/height, LED position, and USB-C port location. Surface cosmetics (texture, logo placement) may remain open. Any structural geometry change after Mar 11 must be escalated to the program lead immediately. The 2-day window to Design Lock (Mar 13) means zero tolerance for structural changes after ID Lock.",
  },
  {
    id: "SR-08",
    name: "Component shortage / procurement delay",
    pOccur: 0.10,
    expectedSlip: 0.20,
    slipMode: 2.0,
    slipMax: 3.5,
    impact: "Low",
    description:
      "RISK REDUCED: Electronic components are already on the Approved Vendor List (AVL) from the existing program and are likely in stock or on open purchase orders. Remaining procurement risk is limited to the new mechanical parts.",
    mitigation:
      "Leverage existing program's open POs and inventory for electronic components. Place mechanical tooling and pogo pin orders immediately at kickoff.",
  },
  {
    id: "SR-09",
    name: "DVT build yield / quality issue at CM",
    pOccur: 0.22,
    expectedSlip: 0.33,
    slipMode: 1.5,
    slipMax: 3.0,
    impact: "Medium",
    description:
      "RISK REDUCED: The PCBA process is already proven at the CM from the existing program. Remaining risk is limited to the new mechanical assembly steps (clamp, spring, pivot pin) and the final clip assembly process.",
    mitigation:
      "Reuse existing PCBA fixtures and test programs from the source program. Focus pre-build readiness review on the new mechanical assembly steps and final clip assembly jigs.",
  },
  {
    id: "SR-10",
    name: "Firmware / USB-C PD protocol issue",
    pOccur: 0.05,
    expectedSlip: 0.10,
    slipMode: 2.0,
    slipMax: 3.0,
    impact: "Low",
    description:
      "RISK SIGNIFICANTLY REDUCED: Firmware is being carried forward from the existing qualified program. The USB-C PD handshake, safety cutoff logic, and soak test suite are already validated. Only minor adaptation for any new LED control or authentication logic is required.",
    mitigation:
      "Perform a delta-review of firmware changes from the source build. Regression test only the modified modules. Deliver a release candidate early given the low expected delta.",
  },
];

export const MONTE_CARLO_SUMMARY = {
  pOnTime: 0.117,
  pLate: 0.883,
  nominalBufferWeeks: 1.5,
  medianSlipWeeks: 5.6,
  meanSlipWeeks: 6.2,
  p90SlipWeeks: 12.0,
  totalExpectedSlip: 6.41,
  iterations: 100000,
  medianPvtDate: "Late July 2026",
  p90PvtDate: "Mid September 2026",
  // v4 update: ID Lock pushed from Mar 6 to Mar 11.
  // Only 2 days between ID Lock (3/11) and Design Lock (3/13).
  // SR-07 (ID churn) pOccur raised 0.35->0.45, slipMode raised 2.0->2.5w.
  // SR-01 expectedSlip raised 1.80->1.95 due to late ID change risk.
  // All other risks unchanged from v3.
  version: "v4 — ID Lock Mar 11 (2-day window to Design Lock)",
};
