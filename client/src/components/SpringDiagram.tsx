/*
 * SpringDiagram.tsx
 * Interactive SVG torsion spring sketch with live dimension overlays.
 * Shows: end view (coil cross-section) + side view (body + legs)
 * All dimension callouts update live as inputs change.
 *
 * Design: engineering drawing aesthetic — dark bg, blue construction lines,
 * white geometry, electric-blue dimension annotations.
 */

interface SpringDiagramProps {
  d: number;        // wire diameter (mm)
  OD: number;       // outer diameter (mm)
  ID: number;       // inner diameter (mm)
  Lbody: number;    // body length (mm)
  leg1: number;     // leg 1 length (mm)
  leg2: number;     // leg 2 length (mm)
  alphaLoaded: number; // loaded angle between legs (deg)
  alphaFree: number;   // free angle (deg) — 0 if no result yet
  F: number;        // clamping force (N)
  armH: number;     // horizontal arm (mm)
  armV: number;     // vertical arm (mm)
  T: number;        // torque (N·mm)
  hasResult: boolean;
}

export default function SpringDiagram({
  d, OD, ID, Lbody, leg1, leg2, alphaLoaded, alphaFree,
  F, armH, armV, T, hasResult,
}: SpringDiagramProps) {
  // ── SVG canvas ──────────────────────────────────────────────────────────
  const W = 520;
  const H = 300;

  // ── Layout regions ───────────────────────────────────────────────────────
  // Left: end view (circle cross-section)  |  Right: side view (body + legs)
  const endCx = 110;
  const endCy = 150;
  const sideX0 = 230;   // left edge of side view
  const sideCy = 150;   // vertical center of side view

  // Scale: map real mm to SVG px
  // End view: OD maps to ~80px radius max
  const maxEndR = 75;
  const scale = Math.min(maxEndR / (OD / 2), 30); // px per mm, capped

  const rOD = (OD / 2) * scale;
  const rID = (ID / 2) * scale;
  const rWire = (d / 2) * scale;
  const rMid = ((OD + ID) / 4) * scale; // mean coil radius

  // Side view scale (use same scale but cap body length display)
  const maxSideW = 180;
  const sideScale = Math.min(maxSideW / Math.max(Lbody + leg1 + leg2 + 4, 1), scale);
  const bodyPx = Lbody * sideScale;
  const leg1Px = Math.min(leg1 * sideScale, 60);
  const leg2Px = Math.min(leg2 * sideScale, 60);
  const rOD_side = (OD / 2) * sideScale;

  // Side view positions
  const bodyX1 = sideX0 + 20;
  const bodyX2 = bodyX1 + bodyPx;

  // Leg angles in side view
  const alphaLoadedRad = (alphaLoaded * Math.PI) / 180;
  const alphaFreeRad   = (alphaFree   * Math.PI) / 180;

  // Leg 1 goes upward from right end of body (angle from horizontal)
  // Leg 2 goes downward from right end of body
  // In the loaded state, angle between them = alphaLoaded
  // We'll draw both legs from the right end of the coil body
  const halfLoaded = alphaLoadedRad / 2;
  const halfFree   = alphaFreeRad   / 2;

  // Leg 1 (upper) endpoint in loaded state
  const leg1EndX_loaded = bodyX2 + leg1Px * Math.cos(halfLoaded);
  const leg1EndY_loaded = sideCy  - leg1Px * Math.sin(halfLoaded);
  // Leg 2 (lower) endpoint in loaded state
  const leg2EndX_loaded = bodyX2 + leg2Px * Math.cos(halfLoaded);
  const leg2EndY_loaded = sideCy  + leg2Px * Math.sin(halfLoaded);

  // Free state legs (ghosted)
  const leg1EndX_free = bodyX2 + leg1Px * Math.cos(halfFree);
  const leg1EndY_free = sideCy  - leg1Px * Math.sin(halfFree);
  const leg2EndX_free = bodyX2 + leg2Px * Math.cos(halfFree);
  const leg2EndY_free = sideCy  + leg2Px * Math.sin(halfFree);

  // ── Dimension helpers ────────────────────────────────────────────────────
  // Horizontal dimension line with arrows and label
  function DimH({ x1, x2, y, label, above = true }: {
    x1: number; x2: number; y: number; label: string; above?: boolean;
  }) {
    const offset = above ? -10 : 10;
    const ty = y + offset;
    const arrowSize = 4;
    return (
      <g>
        {/* Extension lines */}
        <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke="#3b82f6" strokeWidth={0.5} />
        <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke="#3b82f6" strokeWidth={0.5} />
        {/* Dimension line */}
        <line x1={x1} y1={y} x2={x2} y2={y} stroke="#3b82f6" strokeWidth={0.5} />
        {/* Arrows */}
        <polygon points={`${x1},${y} ${x1 + arrowSize},${y - 2} ${x1 + arrowSize},${y + 2}`} fill="#3b82f6" />
        <polygon points={`${x2},${y} ${x2 - arrowSize},${y - 2} ${x2 - arrowSize},${y + 2}`} fill="#3b82f6" />
        {/* Label */}
        <text x={(x1 + x2) / 2} y={ty} textAnchor="middle" fill="#60a5fa" fontSize={9}
          fontFamily="'JetBrains Mono', monospace">{label}</text>
      </g>
    );
  }

  // Vertical dimension line
  function DimV({ x, y1, y2, label, right = true }: {
    x: number; y1: number; y2: number; label: string; right?: boolean;
  }) {
    const offset = right ? 10 : -10;
    const tx = x + offset;
    const arrowSize = 4;
    return (
      <g>
        <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke="#3b82f6" strokeWidth={0.5} />
        <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke="#3b82f6" strokeWidth={0.5} />
        <line x1={x} y1={y1} x2={x} y2={y2} stroke="#3b82f6" strokeWidth={0.5} />
        <polygon points={`${x},${y1} ${x - 2},${y1 + arrowSize} ${x + 2},${y1 + arrowSize}`} fill="#3b82f6" />
        <polygon points={`${x},${y2} ${x - 2},${y2 - arrowSize} ${x + 2},${y2 - arrowSize}`} fill="#3b82f6" />
        <text x={tx} y={(y1 + y2) / 2 + 3} textAnchor={right ? "start" : "end"} fill="#60a5fa" fontSize={9}
          fontFamily="'JetBrains Mono', monospace">{label}</text>
      </g>
    );
  }

  // Radius leader line
  function RadiusLeader({ cx, cy, angle, r, label }: {
    cx: number; cy: number; angle: number; r: number; label: string;
  }) {
    const ex = cx + Math.cos(angle) * r;
    const ey = cy + Math.sin(angle) * r;
    const lx = cx + Math.cos(angle) * (r + 18);
    const ly = cy + Math.sin(angle) * (r + 18);
    return (
      <g>
        <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#3b82f6" strokeWidth={0.5} strokeDasharray="3,2" />
        <line x1={ex} y1={ey} x2={lx} y2={ly} stroke="#3b82f6" strokeWidth={0.5} />
        <text x={lx + (Math.cos(angle) > 0 ? 2 : -2)} y={ly + 3}
          textAnchor={Math.cos(angle) > 0 ? "start" : "end"}
          fill="#60a5fa" fontSize={9} fontFamily="'JetBrains Mono', monospace">{label}</text>
      </g>
    );
  }

  // Arc angle annotation
  function AngleArc({ cx, cy, r, startAngle, endAngle, label, color = "#f59e0b" }: {
    cx: number; cy: number; r: number;
    startAngle: number; endAngle: number;
    label: string; color?: string;
  }) {
    const sa = -endAngle;
    const ea = -startAngle;
    const x1 = cx + r * Math.cos(sa);
    const y1 = cy + r * Math.sin(sa);
    const x2 = cx + r * Math.cos(ea);
    const y2 = cy + r * Math.sin(ea);
    const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const midAngle = -(startAngle + endAngle) / 2;
    const lx = cx + (r + 12) * Math.cos(midAngle);
    const ly = cy + (r + 12) * Math.sin(midAngle);
    return (
      <g>
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth={0.8} strokeDasharray="3,2" />
        <text x={lx} y={ly + 3} textAnchor="middle" fill={color} fontSize={9}
          fontFamily="'JetBrains Mono', monospace">{label}</text>
      </g>
    );
  }

  return (
    <div className="w-full bg-[#0d0f16] border border-slate-800/60 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/60">
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Spring Geometry — Live Preview</span>
        <span className="text-[9px] font-mono text-slate-700">End View · Side View</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
        {/* Background */}
        <rect width={W} height={H} fill="#0d0f16" />

        {/* Subtle grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a1d27" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {/* ── DIVIDER ──────────────────────────────────────────────────── */}
        <line x1={210} y1={10} x2={210} y2={H - 10} stroke="#1e2235" strokeWidth={1} strokeDasharray="4,3" />

        {/* ── SECTION LABELS ───────────────────────────────────────────── */}
        <text x={endCx} y={18} textAnchor="middle" fill="#334155" fontSize={8} fontFamily="'JetBrains Mono', monospace">END VIEW</text>
        <text x={(sideX0 + W - 10) / 2} y={18} textAnchor="middle" fill="#334155" fontSize={8} fontFamily="'JetBrains Mono', monospace">SIDE VIEW</text>

        {/* ── END VIEW ─────────────────────────────────────────────────── */}
        {/* Center crosshair */}
        <line x1={endCx - 12} y1={endCy} x2={endCx + 12} y2={endCy} stroke="#1e3a5f" strokeWidth={0.6} />
        <line x1={endCx} y1={endCy - 12} x2={endCx} y2={endCy + 12} stroke="#1e3a5f" strokeWidth={0.6} />

        {/* OD circle */}
        <circle cx={endCx} cy={endCy} r={rOD} fill="none" stroke="#94a3b8" strokeWidth={1.2} />
        {/* ID circle */}
        <circle cx={endCx} cy={endCy} r={rID} fill="none" stroke="#64748b" strokeWidth={0.8} strokeDasharray="4,2" />
        {/* Wire cross-section (top of coil) */}
        <circle cx={endCx} cy={endCy - rMid} r={rWire} fill="#1e293b" stroke="#e2e8f0" strokeWidth={1} />
        {/* Wire hatching */}
        <line x1={endCx - rWire * 0.6} y1={endCy - rMid - rWire * 0.6}
              x2={endCx + rWire * 0.6} y2={endCy - rMid + rWire * 0.6}
              stroke="#475569" strokeWidth={0.6} />
        <line x1={endCx - rWire * 0.6} y1={endCy - rMid + rWire * 0.2}
              x2={endCx + rWire * 0.2} y2={endCy - rMid + rWire * 0.6}
              stroke="#475569" strokeWidth={0.6} />

        {/* Mandrel (ID bore) */}
        <circle cx={endCx} cy={endCy} r={rID * 0.85} fill="#0f172a" stroke="#334155" strokeWidth={0.5} />

        {/* Dimension leaders */}
        <RadiusLeader cx={endCx} cy={endCy} angle={-Math.PI * 0.25} r={rOD}
          label={`OD ${OD.toFixed(2)}`} />
        <RadiusLeader cx={endCx} cy={endCy} angle={Math.PI * 0.6} r={rID}
          label={`ID ${ID.toFixed(2)}`} />
        {/* Wire diameter callout */}
        <line x1={endCx} y1={endCy - rMid - rWire}
              x2={endCx} y2={endCy - rMid + rWire}
              stroke="#3b82f6" strokeWidth={0.5} />
        <line x1={endCx - rWire} y1={endCy - rMid}
              x2={endCx + rWire} y2={endCy - rMid}
              stroke="#3b82f6" strokeWidth={0.5} />
        <text x={endCx + rWire + 3} y={endCy - rMid - 2}
          fill="#60a5fa" fontSize={9} fontFamily="'JetBrains Mono', monospace">
          d {d.toFixed(2)}
        </text>

        {/* ── SIDE VIEW ────────────────────────────────────────────────── */}
        {/* Coil body rectangle */}
        <rect
          x={bodyX1} y={sideCy - rOD_side}
          width={bodyPx} height={rOD_side * 2}
          fill="#0f172a" stroke="#94a3b8" strokeWidth={1}
        />
        {/* Coil hatching lines inside body */}
        {Array.from({ length: Math.max(1, Math.round(bodyPx / 6)) }).map((_, i) => {
          const lx = bodyX1 + (i + 0.5) * (bodyPx / Math.max(1, Math.round(bodyPx / 6)));
          return (
            <line key={i}
              x1={lx} y1={sideCy - rOD_side}
              x2={lx} y2={sideCy + rOD_side}
              stroke="#1e3a5f" strokeWidth={0.6}
            />
          );
        })}
        {/* Center axis line through body */}
        <line x1={bodyX1 - 15} y1={sideCy} x2={bodyX2 + 30} y2={sideCy}
          stroke="#1e3a5f" strokeWidth={0.5} strokeDasharray="6,3" />

        {/* Leg 1 — loaded (solid) */}
        <line x1={bodyX2} y1={sideCy}
          x2={leg1EndX_loaded} y2={leg1EndY_loaded}
          stroke="#e2e8f0" strokeWidth={1.5} strokeLinecap="round" />
        {/* Leg 2 — loaded (solid) */}
        <line x1={bodyX2} y1={sideCy}
          x2={leg2EndX_loaded} y2={leg2EndY_loaded}
          stroke="#e2e8f0" strokeWidth={1.5} strokeLinecap="round" />

        {/* Leg 1 — free state (ghosted, only if result exists) */}
        {hasResult && alphaFree > 0 && (
          <line x1={bodyX2} y1={sideCy}
            x2={leg1EndX_free} y2={leg1EndY_free}
            stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="4,2" strokeLinecap="round" />
        )}
        {/* Leg 2 — free state (ghosted) */}
        {hasResult && alphaFree > 0 && (
          <line x1={bodyX2} y1={sideCy}
            x2={leg2EndX_free} y2={leg2EndY_free}
            stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="4,2" strokeLinecap="round" />
        )}

        {/* Leg end dots */}
        <circle cx={leg1EndX_loaded} cy={leg1EndY_loaded} r={2} fill="#94a3b8" />
        <circle cx={leg2EndX_loaded} cy={leg2EndY_loaded} r={2} fill="#94a3b8" />

        {/* Loaded angle arc */}
        <AngleArc cx={bodyX2} cy={sideCy}
          r={Math.min(leg1Px * 0.45, leg2Px * 0.45, 20)}
          startAngle={halfLoaded} endAngle={-halfLoaded}
          label={`${alphaLoaded.toFixed(1)}°`} color="#f59e0b" />

        {/* Free angle arc (blue, dashed) */}
        {hasResult && alphaFree > 0 && (
          <AngleArc cx={bodyX2} cy={sideCy}
            r={Math.min(leg1Px * 0.65, leg2Px * 0.65, 28)}
            startAngle={halfFree} endAngle={-halfFree}
            label={`${alphaFree.toFixed(1)}°`} color="#60a5fa" />
        )}

        {/* Dimension: body length */}
        {bodyPx > 8 && (
          <DimH x1={bodyX1} x2={bodyX2} y={sideCy + rOD_side + 18}
            label={`L ${Lbody.toFixed(2)}`} above={false} />
        )}

        {/* Dimension: OD in side view */}
        <DimV x={bodyX1 - 14} y1={sideCy - rOD_side} y2={sideCy + rOD_side}
          label={`∅${OD.toFixed(2)}`} right={false} />

        {/* Leg 1 length label */}
        <text
          x={(bodyX2 + leg1EndX_loaded) / 2 + 3}
          y={(sideCy + leg1EndY_loaded) / 2 - 5}
          fill="#94a3b8" fontSize={8} fontFamily="'JetBrains Mono', monospace"
          textAnchor="middle">
          L1 ≤{leg1.toFixed(0)}
        </text>
        {/* Leg 2 length label */}
        <text
          x={(bodyX2 + leg2EndX_loaded) / 2 + 3}
          y={(sideCy + leg2EndY_loaded) / 2 + 10}
          fill="#94a3b8" fontSize={8} fontFamily="'JetBrains Mono', monospace"
          textAnchor="middle">
          L2 ≤{leg2.toFixed(0)}
        </text>

        {/* ── LOAD DIAGRAM (far right) ──────────────────────────────────── */}
        {/* Pivot point */}
        <circle cx={bodyX1 - 8} cy={sideCy} r={3} fill="none" stroke="#475569" strokeWidth={1} />
        <line x1={bodyX1 - 11} y1={sideCy - 5} x2={bodyX1 - 5} y2={sideCy - 5} stroke="#475569" strokeWidth={0.6} />
        <line x1={bodyX1 - 13} y1={sideCy - 7} x2={bodyX1 - 3} y2={sideCy - 7} stroke="#475569" strokeWidth={0.6} />

        {/* Force arrow */}
        <defs>
          <marker id="arrow-force" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" />
          </marker>
        </defs>
        <line x1={bodyX1 - 8} y1={sideCy - 30} x2={bodyX1 - 8} y2={sideCy - 8}
          stroke="#22d3ee" strokeWidth={1.2} markerEnd="url(#arrow-force)" />
        <text x={bodyX1 - 8} y={sideCy - 33} textAnchor="middle"
          fill="#22d3ee" fontSize={9} fontFamily="'JetBrains Mono', monospace">
          F {F.toFixed(1)}N
        </text>

        {/* ── TORQUE CALLOUT ───────────────────────────────────────────── */}
        <text x={W - 8} y={H - 28} textAnchor="end" fill="#475569" fontSize={8}
          fontFamily="'JetBrains Mono', monospace">T = F × arm</text>
        <text x={W - 8} y={H - 16} textAnchor="end" fill="#60a5fa" fontSize={10}
          fontFamily="'JetBrains Mono', monospace" fontWeight="600">
          {T.toFixed(1)} N·mm
        </text>

        {/* Legend */}
        <line x1={sideX0 + 5} y1={H - 20} x2={sideX0 + 18} y2={H - 20} stroke="#e2e8f0" strokeWidth={1.2} />
        <text x={sideX0 + 21} y={H - 17} fill="#64748b" fontSize={8} fontFamily="'JetBrains Mono', monospace">Loaded</text>
        {hasResult && (
          <>
            <line x1={sideX0 + 60} y1={H - 20} x2={sideX0 + 73} y2={H - 20}
              stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="4,2" />
            <text x={sideX0 + 76} y={H - 17} fill="#3b82f6" fontSize={8} fontFamily="'JetBrains Mono', monospace">Free</text>
          </>
        )}
      </svg>
    </div>
  );
}
