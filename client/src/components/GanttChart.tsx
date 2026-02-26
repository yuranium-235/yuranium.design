// ============================================================
// DESIGN: "Executive Technical" — Gantt Chart Component
// Animated bars, workstream color coding, milestone diamonds
// ============================================================

import { useEffect, useRef, useState } from "react";
import {
  TASKS,
  WORKSTREAM_COLORS,
  WORKSTREAMS,
  KICKOFF,
  DVT_DATE,
  PVT_DATE,
  TOTAL_DAYS,
  daysFrom,
  type Workstream,
} from "@/lib/programData";

const BAR_HEIGHT = 20;
const ROW_GAP = 8;
const ROW_STRIDE = BAR_HEIGHT + ROW_GAP;
const WS_LABEL_W = 180;
const CHART_PAD_TOP = 48;
const CHART_PAD_BOTTOM = 24;

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  workstream: string;
  start: string;
  end: string;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function pct(days: number) {
  return (days / TOTAL_DAYS) * 100;
}

export default function GanttChart() {
  const [animated, setAnimated] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: "", workstream: "", start: "", end: "" });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Build rows: group tasks by workstream, maintaining order
  const rows: { task: typeof TASKS[0]; rowIndex: number }[] = [];
  let rowIndex = 0;
  let lastWs: Workstream | null = null;

  for (const task of TASKS) {
    if (lastWs !== null && task.workstream !== lastWs) {
      rowIndex++; // spacer row between workstreams
    }
    rows.push({ task, rowIndex });
    rowIndex++;
    lastWs = task.workstream;
  }

  const totalRows = rowIndex;
  const svgHeight = CHART_PAD_TOP + totalRows * ROW_STRIDE + CHART_PAD_BOTTOM;

  // Week tick marks
  const weekTicks: { day: number; label: string }[] = [];
  for (let w = 0; w * 7 <= TOTAL_DAYS; w++) {
    const d = new Date(KICKOFF.getTime() + w * 7 * 86400000);
    weekTicks.push({
      day: w * 7,
      label: `W${w + 1}\n${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    });
  }

  const dvtX = pct(daysFrom(DVT_DATE));
  const pvtX = pct(daysFrom(PVT_DATE));

  function handleMouseEnter(e: React.MouseEvent, task: typeof TASKS[0]) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      label: task.label,
      workstream: task.workstream,
      start: formatDate(task.start),
      end: task.isMilestone ? "" : formatDate(task.end),
    });
  }

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip(prev => ({ ...prev, x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 8 }));
  }

  function handleMouseLeave() {
    setTooltip(prev => ({ ...prev, visible: false }));
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 px-1">
        {WORKSTREAMS.map(ws => (
          <div key={ws} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: WORKSTREAM_COLORS[ws] }} />
            <span className="text-xs text-slate-600 font-medium">{ws}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rotate-45" style={{ backgroundColor: "#DC2626" }} />
          <span className="text-xs text-slate-600 font-medium">Milestone / Gate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rotate-45" style={{ backgroundColor: "#059669" }} />
          <span className="text-xs text-slate-600 font-medium">Confirmed Milestone</span>
        </div>
      </div>

      {/* SVG Gantt */}
      <div className="min-w-[900px]">
        <svg
          width="100%"
          viewBox={`0 0 100 ${svgHeight}`}
          preserveAspectRatio="none"
          style={{ height: `${svgHeight}px` }}
          className="block"
        >
          {/* Background grid */}
          {weekTicks.map(({ day }) => (
            <line
              key={day}
              x1={`${pct(day)}%`} y1={0}
              x2={`${pct(day)}%`} y2={svgHeight}
              stroke="#E2E8F0" strokeWidth="0.3"
            />
          ))}

          {/* Workstream band backgrounds */}
          {(() => {
            const bands: React.ReactNode[] = [];
            let wsStart: number | null = null;
            let wsEnd: number | null = null;
            let currentWs: Workstream | null = null;
            let wsIdx = 0;

            for (const { task, rowIndex: ri } of rows) {
              if (currentWs !== task.workstream) {
                if (currentWs !== null && wsStart !== null && wsEnd !== null) {
                  const y = CHART_PAD_TOP + wsStart * ROW_STRIDE - ROW_GAP / 2;
                  const h = (wsEnd - wsStart + 1) * ROW_STRIDE;
                  bands.push(
                    <rect key={currentWs} x={0} y={y} width="100%" height={h}
                      fill={wsIdx % 2 === 0 ? "#F8FAFC" : "#FFFFFF"} />
                  );
                  wsIdx++;
                }
                currentWs = task.workstream;
                wsStart = ri;
              }
              wsEnd = ri;
            }
            if (currentWs !== null && wsStart !== null && wsEnd !== null) {
              const y = CHART_PAD_TOP + wsStart * ROW_STRIDE - ROW_GAP / 2;
              const h = (wsEnd - wsStart + 1) * ROW_STRIDE;
              bands.push(
                <rect key={currentWs} x={0} y={y} width="100%" height={h}
                  fill={wsIdx % 2 === 0 ? "#F8FAFC" : "#FFFFFF"} />
              );
            }
            return bands;
          })()}

          {/* DVT & PVT vertical lines */}
          <line x1={`${dvtX}%`} y1={0} x2={`${dvtX}%`} y2={svgHeight} stroke="#DC2626" strokeWidth="1" strokeDasharray="3,2" opacity="0.7" />
          <line x1={`${pvtX}%`} y1={0} x2={`${pvtX}%`} y2={svgHeight} stroke="#059669" strokeWidth="1" strokeDasharray="3,2" opacity="0.7" />

          {/* Week labels */}
          {weekTicks.filter((_, i) => i % 2 === 0).map(({ day, label }) => {
            const parts = label.split("\n");
            return (
              <g key={day}>
                <text x={`${pct(day)}%`} y={16} textAnchor="middle" fontSize={5} fill="#94A3B8" fontFamily="JetBrains Mono, monospace">
                  {parts[0]}
                </text>
                <text x={`${pct(day)}%`} y={26} textAnchor="middle" fontSize={4.5} fill="#94A3B8" fontFamily="JetBrains Mono, monospace">
                  {parts[1]}
                </text>
              </g>
            );
          })}

          {/* DVT / PVT labels */}
          <text x={`${dvtX}%`} y={38} textAnchor="middle" fontSize={5.5} fill="#DC2626" fontWeight="bold" fontFamily="Sora, sans-serif">DVT</text>
          <text x={`${pvtX}%`} y={38} textAnchor="middle" fontSize={5.5} fill="#059669" fontWeight="bold" fontFamily="Sora, sans-serif">PVT</text>

          {/* Task bars */}
          {rows.map(({ task, rowIndex: ri }) => {
            const color = WORKSTREAM_COLORS[task.workstream];
            const y = CHART_PAD_TOP + ri * ROW_STRIDE;
            const startPct = pct(daysFrom(task.start));
            const endPct = pct(daysFrom(task.end));
            const widthPct = Math.max(endPct - startPct, 0.8);

            if (task.isMilestone) {
              const cx = startPct;
              const cy = y + BAR_HEIGHT / 2;
              const size = 4;
              const isConfirmed = task.label.includes("CONFIRMED");
              const milestoneColor = isConfirmed ? "#059669" : "#DC2626";
              return (
                <g key={`${task.workstream}-${task.label}`}
                  onMouseEnter={e => handleMouseEnter(e as unknown as React.MouseEvent, task)}
                  style={{ cursor: "pointer" }}>
                  <polygon
                    points={`${cx}%,${cy - size} ${cx + size * 0.6}%,${cy} ${cx}%,${cy + size} ${cx - size * 0.6}%,${cy}`}
                    fill={milestoneColor}
                    stroke="white"
                    strokeWidth="0.5"
                    style={{
                      opacity: animated ? 1 : 0,
                      transition: `opacity 0.4s ease ${ri * 0.015}s`,
                    }}
                  />
                  {isConfirmed && (
                    <text
                      x={`${cx + size * 0.8}%`}
                      y={cy + 1.5}
                      fontSize={4}
                      fill="#059669"
                      fontWeight="bold"
                      fontFamily="Sora, sans-serif"
                      style={{ opacity: animated ? 1 : 0, transition: `opacity 0.4s ease ${ri * 0.015}s` }}
                    >✓</text>
                  )}
                </g>
              );
            }

            return (
              <g key={`${task.workstream}-${task.label}`}
                onMouseEnter={e => handleMouseEnter(e as unknown as React.MouseEvent, task)}
                style={{ cursor: "pointer" }}>
                <rect
                  x={`${startPct}%`}
                  y={y + 2}
                  width={animated ? `${widthPct}%` : "0%"}
                  height={BAR_HEIGHT - 4}
                  rx={2}
                  fill={color}
                  opacity="0.88"
                  style={{
                    transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${ri * 0.018}s, opacity 0.3s ease ${ri * 0.018}s`,
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Workstream labels (positioned absolutely to the left of the SVG) */}
      {/* We render them as an overlay */}

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-50 pointer-events-none bg-slate-900 text-white rounded-lg shadow-xl px-3 py-2.5 text-xs max-w-[240px]"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <div className="font-semibold text-sm mb-1" style={{ fontFamily: "Sora, sans-serif" }}>{tooltip.label}</div>
          <div className="text-slate-300 text-xs mb-0.5">{tooltip.workstream}</div>
          <div className="font-mono text-slate-400 text-xs">
            {tooltip.end ? `${tooltip.start} → ${tooltip.end}` : `📍 ${tooltip.start}`}
          </div>
        </div>
      )}
    </div>
  );
}
