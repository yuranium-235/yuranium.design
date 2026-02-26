// MilestoneTable.tsx
// Design: Executive Technical — clean milestone timeline table
// Replaces the Gantt chart in the main Schedule section.
// Gantt chart is preserved in the Appendix.

import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const MILESTONES = [
  {
    id: "M1",
    name: "ID Lock",
    date: "Mar 11, 2026",
    dateShort: "3/11",
    owner: "Industrial Design",
    phase: "Design",
    status: "upcoming",
    description: "Industrial design geometry frozen. Clamp saddle, front enclosure footprint, LED position, and USB-C port location locked. No structural changes after this date.",
    critical: true,
  },
  {
    id: "M2",
    name: "Design Lock",
    date: "Mar 13, 2026",
    dateShort: "3/13",
    owner: "Mechanical Engineering",
    phase: "Design",
    status: "upcoming",
    description: "Final mechanical design complete with ID integration. CAD frozen and released to supplier for DFM review.",
    critical: true,
  },
  {
    id: "M3",
    name: "DVT OK2Tool",
    date: "Mar 30, 2026",
    dateShort: "3/30",
    owner: "Program / ME",
    phase: "Tooling",
    status: "upcoming",
    description: "Hard mass production tooling kick-off. DFM review complete, all tooling POs placed. Point of no return for design changes without mold ECO cost.",
    critical: true,
  },
  {
    id: "M4",
    name: "DVT FATP Line Bring-Up",
    date: "May 7, 2026",
    dateShort: "5/7",
    owner: "NPI / CM",
    phase: "DVT",
    status: "upcoming",
    description: "FATP line bring-up at contract manufacturer. Assembly fixtures, test stations, and process documentation in place. First DVT units built.",
    critical: false,
  },
  {
    id: "M5",
    name: "DVT FATP",
    date: "May 19, 2026",
    dateShort: "5/19",
    owner: "NPI / Reliability",
    phase: "DVT",
    status: "upcoming",
    description: "DVT build complete. Full DVT unit quantity available for validation testing. Mechanical, electrical, and reliability testing begins.",
    critical: true,
  },
  {
    id: "M6",
    name: "PVT FATP",
    date: "Jun 22, 2026",
    dateShort: "6/22",
    owner: "NPI / Supply Chain",
    phase: "PVT",
    status: "upcoming",
    description: "Production Validation Test ramp start. All DVT exit criteria met. Mass production tooling and FATP process validated at rate.",
    critical: true,
  },
  {
    id: "M7",
    name: "OK2Ship",
    date: "Jul 20, 2026",
    dateShort: "7/20",
    owner: "Program Lead",
    phase: "Launch",
    status: "upcoming",
    description: "All regulatory certifications received, PVT exit criteria met, and product cleared for customer shipment. Day 0 launch readiness confirmed.",
    critical: true,
  },
];

const PHASE_COLORS: Record<string, string> = {
  Design:  "bg-blue-100 text-blue-700 border-blue-200",
  Tooling: "bg-amber-100 text-amber-700 border-amber-200",
  DVT:     "bg-purple-100 text-purple-700 border-purple-200",
  PVT:     "bg-emerald-100 text-emerald-700 border-emerald-200",
  Launch:  "bg-rose-100 text-rose-700 border-rose-200",
};

const PHASE_BAR: Record<string, string> = {
  Design:  "bg-blue-500",
  Tooling: "bg-amber-500",
  DVT:     "bg-purple-500",
  PVT:     "bg-emerald-500",
  Launch:  "bg-rose-500",
};

export default function MilestoneTable() {
  return (
    <section id="schedule" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-mono font-semibold tracking-widest text-blue-600 uppercase">Program Schedule</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
            Key Milestones
          </h2>
          <p className="text-slate-500 text-base max-w-2xl">
            Confirmed program dates from EPM. KO: Feb 25, 2026 · DVT: May 19, 2026 · PVT Ramp: Jun 22, 2026 · OK2Ship: Jul 20, 2026.
          </p>
        </div>

        {/* Timeline bar */}
        <div className="mb-10 flex items-center gap-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          {["Design", "Tooling", "DVT", "PVT", "Launch"].map((phase, i) => (
            <div
              key={phase}
              className={`flex-1 py-2.5 text-center text-xs font-semibold border-r last:border-r-0 border-slate-200 ${PHASE_COLORS[phase]}`}
            >
              {phase}
            </div>
          ))}
        </div>

        {/* Milestone cards */}
        <div className="space-y-3">
          {MILESTONES.map((m, idx) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Phase color bar */}
                <div className={`w-1.5 shrink-0 ${PHASE_BAR[m.phase]}`} />

                {/* Content */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 flex-1 min-w-0">
                  {/* ID + Date */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-base font-bold text-slate-900" style={{ fontFamily: "Sora, sans-serif" }}>
                        {m.name}
                        {m.critical && (
                          <span className="ml-2 text-[10px] font-semibold text-red-500 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded-full align-middle">
                            CRITICAL PATH
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{m.owner}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 leading-relaxed">{m.description}</p>
                  </div>

                  {/* Date + Phase badge */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <div className="text-lg font-bold text-slate-800 font-mono">{m.dateShort}</div>
                    <div className="text-xs text-slate-400">{m.date}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PHASE_COLORS[m.phase]}`}>
                      {m.phase}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-slate-400 text-center font-mono">
          Detailed Gantt chart available in the Appendix section below · 17-week program · DVT-First (EVT skipped)
        </p>
      </div>
    </section>
  );
}
