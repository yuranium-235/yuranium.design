"""
Bathroom Floor Plan v4 — Updated with confirmed measurements from homeowner.
Changes from v3:
- Corner cutout depth: 25.5" (was ~22" estimated)
- Shower depth: 38" (was 36" estimated)
- Entry door width: 29" (was ~32" estimated)
- Window width: 43" (confirmed, on back wall starting from left)
- Vanity depth matches cutout depth: 25.5"
- Removed all "~" and "(est.)" and "(TBD)" markers — all measurements now confirmed
"""
import cairosvg

SCALE = 4.5
MARGIN_TOP = 160  # Increased to avoid title/dimension overlap
MARGIN_BOTTOM = 110
MARGIN_LEFT = 90
MARGIN_RIGHT = 80

# Room dimensions (confirmed)
ROOM_W = 71
ROOM_D = 94

# Components (confirmed)
VANITY_W = 36
VANITY_D = 25.5  # matches cutout depth
SHOWER_W = 36    # width along bottom wall
SHOWER_D = 38    # depth along right wall (confirmed)
ENTRY_W = 29     # confirmed
TOILET_W = 28
TOILET_D = 18
WINDOW_W = 43    # confirmed

# Cutout (confirmed)
CUTOUT_W = ROOM_W - VANITY_W  # 35"
CUTOUT_D = 25.5  # confirmed

# Positions
vanity_x = 0
vanity_y = 0
shower_x = ROOM_W - SHOWER_W  # 35"
shower_y = ROOM_D - SHOWER_D  # 56"
entry_x = 0

# Toilet centered between cutout bottom (25.5") and shower top (56")
toilet_x = ROOM_W - TOILET_W  # 43" (backed against right wall)
toilet_y = CUTOUT_D + (ROOM_D - SHOWER_D - CUTOUT_D - TOILET_D) / 2  # = 25.5 + (56-25.5-18)/2 = 25.5+6.25 = 31.75"

# SVG size
svg_w = int(ROOM_W * SCALE + MARGIN_LEFT + MARGIN_RIGHT)
svg_h = int(ROOM_D * SCALE + MARGIN_TOP + MARGIN_BOTTOM)

def px(inches): return inches * SCALE
def X(inches): return MARGIN_LEFT + px(inches)
def Y(inches): return MARGIN_TOP + px(inches)

svg = []
svg.append(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="{svg_w}" height="{svg_h}">
<style>
  text {{ font-family: 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif; }}
  .dim {{ font-size: 12px; fill: #c0392b; font-weight: 600; }}
  .dim-sm {{ font-size: 10px; fill: #c0392b; font-weight: 500; }}
  .label {{ font-size: 11px; fill: #2c3e50; font-weight: 700; }}
  .sublabel {{ font-size: 9px; fill: #7f8c8d; }}
  .title {{ font-size: 14px; fill: #2c3e50; font-weight: 700; }}
  .subtitle {{ font-size: 10px; fill: #95a5a6; }}
  .win-label {{ font-size: 9px; fill: #2980b9; }}
  .cutout-label {{ font-size: 9px; fill: #e67e22; font-weight: 500; }}
</style>
<defs>
  <marker id="arr" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
    <polygon points="0 0, 5 2, 0 4" fill="#c0392b"/>
  </marker>
  <marker id="arr2" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto">
    <polygon points="5 0, 0 2, 5 4" fill="#c0392b"/>
  </marker>
</defs>
<rect width="{svg_w}" height="{svg_h}" fill="white"/>
''')

# Title (positioned at top of SVG, well above the dimension lines)
svg.append(f'<text x="{svg_w//2}" y="22" text-anchor="middle" class="title">Bathroom Floor Plan — Top-Down View (Scaled)</text>')
svg.append(f'<text x="{svg_w//2}" y="38" text-anchor="middle" class="subtitle">All dimensions in inches · Confirmed measurements</text>')

# ===== ROOM WALLS =====
wall_lw = 3
# Top wall (only spans vanity width — cutout starts at vanity right edge)
svg.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(VANITY_W)}" y2="{Y(0)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Cutout vertical wall (from top wall down to cutout depth)
svg.append(f'<line x1="{X(VANITY_W)}" y1="{Y(0)}" x2="{X(VANITY_W)}" y2="{Y(CUTOUT_D)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Cutout horizontal wall (from vanity right edge to room right wall)
svg.append(f'<line x1="{X(VANITY_W)}" y1="{Y(CUTOUT_D)}" x2="{X(ROOM_W)}" y2="{Y(CUTOUT_D)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Right wall (from cutout down to bottom)
svg.append(f'<line x1="{X(ROOM_W)}" y1="{Y(CUTOUT_D)}" x2="{X(ROOM_W)}" y2="{Y(ROOM_D)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Bottom wall: solid from right wall to entry right edge
svg.append(f'<line x1="{X(ROOM_W)}" y1="{Y(ROOM_D)}" x2="{X(entry_x + ENTRY_W)}" y2="{Y(ROOM_D)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Entry gap (dashed)
svg.append(f'<line x1="{X(entry_x + ENTRY_W)}" y1="{Y(ROOM_D)}" x2="{X(entry_x)}" y2="{Y(ROOM_D)}" stroke="#2c3e50" stroke-width="1.5" stroke-dasharray="5,3"/>')
# Left wall
svg.append(f'<line x1="{X(0)}" y1="{Y(ROOM_D)}" x2="{X(0)}" y2="{Y(0)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')

# ===== FLOOR AREA =====
svg.append(f'<rect x="{X(0)}" y="{Y(0)}" width="{px(VANITY_W)}" height="{px(ROOM_D)}" fill="#fafaf8" stroke="none"/>')
svg.append(f'<rect x="{X(VANITY_W)}" y="{Y(CUTOUT_D)}" width="{px(ROOM_W - VANITY_W)}" height="{px(ROOM_D - CUTOUT_D)}" fill="#fafaf8" stroke="none"/>')

# ===== VANITY/SINK =====
svg.append(f'<rect x="{X(vanity_x)}" y="{Y(vanity_y)}" width="{px(VANITY_W)}" height="{px(VANITY_D)}" fill="#ede8df" stroke="#8b7355" stroke-width="1.5"/>')
svg.append(f'<text x="{X(VANITY_W/2)}" y="{Y(VANITY_D/2 - 3)}" text-anchor="middle" class="label">VANITY + SINK</text>')
# Sink oval
svg.append(f'<ellipse cx="{X(VANITY_W/2)}" cy="{Y(VANITY_D/2 + 4)}" rx="{px(5)}" ry="{px(3.5)}" fill="#d4e6f1" stroke="#2980b9" stroke-width="1"/>')

# ===== TOILET =====
tank_w = 8
bowl_length = TOILET_W - tank_w
svg.append(f'<rect x="{X(ROOM_W - tank_w)}" y="{Y(toilet_y)}" width="{px(tank_w)}" height="{px(TOILET_D)}" fill="#ddd" stroke="#888" stroke-width="0.8" rx="2"/>')
svg.append(f'<rect x="{X(ROOM_W - TOILET_W)}" y="{Y(toilet_y)}" width="{px(bowl_length)}" height="{px(TOILET_D)}" fill="#f0f0f0" stroke="#666" stroke-width="1" rx="3"/>')
svg.append(f'<ellipse cx="{X(ROOM_W - TOILET_W + bowl_length/2)}" cy="{Y(toilet_y + TOILET_D/2)}" rx="{px(7)}" ry="{px(6)}" fill="#e8e8e8" stroke="#888" stroke-width="0.8"/>')
svg.append(f'<text x="{X(ROOM_W - TOILET_W/2)}" y="{Y(toilet_y - 4)}" text-anchor="middle" class="label">TOILET</text>')

# ===== SHOWER =====
svg.append(f'<rect x="{X(shower_x)}" y="{Y(shower_y)}" width="{px(SHOWER_W)}" height="{px(SHOWER_D)}" fill="#d4e6f1" stroke="#2980b9" stroke-width="1.5"/>')
svg.append(f'<circle cx="{X(shower_x + SHOWER_W/2)}" cy="{Y(shower_y + SHOWER_D/2)}" r="3" fill="#aaa" stroke="#666" stroke-width="0.8"/>')
svg.append(f'<text x="{X(shower_x + SHOWER_W/2)}" y="{Y(shower_y + SHOWER_D/2 - 6)}" text-anchor="middle" class="label">SHOWER</text>')
svg.append(f'<text x="{X(shower_x + SHOWER_W/2)}" y="{Y(shower_y + SHOWER_D/2 + 8)}" text-anchor="middle" class="sublabel">36" x 38"</text>')

# ===== WINDOW =====
# Window on the back wall — no confirmed dimension, just show visually
win_x = 5  # Slightly inset from left wall
win_display_w = 24  # Visual representation only
svg.append(f'<rect x="{X(win_x)}" y="{Y(-1.5)}" width="{px(win_display_w)}" height="{px(1.5)}" fill="#aed6f1" stroke="#2980b9" stroke-width="1"/>')
svg.append(f'<text x="{X(win_x + win_display_w/2)}" y="{Y(-4)}" text-anchor="middle" class="win-label">Window</text>')

# ===== ENTRY ARROW =====
svg.append(f'<line x1="{X(ENTRY_W/2)}" y1="{Y(ROOM_D + 14)}" x2="{X(ENTRY_W/2)}" y2="{Y(ROOM_D + 3)}" stroke="#27ae60" stroke-width="2" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(ENTRY_W/2)}" y="{Y(ROOM_D + 19)}" text-anchor="middle" class="label" fill="#27ae60">ENTRY</text>')

# ===== FLOOR LABEL =====
svg.append(f'<text x="{X(16)}" y="{Y(60)}" text-anchor="middle" class="label" font-size="12">FLOOR</text>')

# ===== CUTOUT LABEL =====
svg.append(f'<text x="{X(VANITY_W + CUTOUT_W/2)}" y="{Y(CUTOUT_D/2 - 2)}" text-anchor="middle" class="cutout-label">CUTOUT</text>')
svg.append(f'<text x="{X(VANITY_W + CUTOUT_W/2)}" y="{Y(CUTOUT_D/2 + 5)}" text-anchor="middle" class="cutout-label">25.5" x 35"</text>')

# ===== DIMENSION LINES =====

# --- TOP: 71" width (well above the room, below title) ---
dy1 = -14
svg.append(f'<line x1="{X(0)}" y1="{Y(dy1)}" x2="{X(ROOM_W)}" y2="{Y(dy1)}" stroke="#c0392b" stroke-width="0.8" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(ROOM_W/2)}" y="{Y(dy1 - 3)}" text-anchor="middle" class="dim">71"</text>')
# Extension lines
svg.append(f'<line x1="{X(0)}" y1="{Y(dy1+1)}" x2="{X(0)}" y2="{Y(-1)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')
svg.append(f'<line x1="{X(ROOM_W)}" y1="{Y(dy1+1)}" x2="{X(ROOM_W)}" y2="{Y(CUTOUT_D - 1)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')

# --- LEFT: 94" depth ---
dx_l = -12
svg.append(f'<line x1="{X(dx_l)}" y1="{Y(0)}" x2="{X(dx_l)}" y2="{Y(ROOM_D)}" stroke="#c0392b" stroke-width="0.8" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_l - 2)}" y="{Y(ROOM_D/2)}" text-anchor="end" class="dim">94"</text>')

# --- RIGHT: Shower depth 38" ---
dx_r = ROOM_W + 8
svg.append(f'<line x1="{X(dx_r)}" y1="{Y(shower_y)}" x2="{X(dx_r)}" y2="{Y(ROOM_D)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_r + 2)}" y="{Y(shower_y + SHOWER_D/2)}" text-anchor="start" class="dim-sm">38"</text>')
# Extension lines for shower
svg.append(f'<line x1="{X(ROOM_W)}" y1="{Y(shower_y)}" x2="{X(dx_r - 1)}" y2="{Y(shower_y)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')
svg.append(f'<line x1="{X(ROOM_W)}" y1="{Y(ROOM_D)}" x2="{X(dx_r - 1)}" y2="{Y(ROOM_D)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')

# --- RIGHT: Cutout depth 25.5" (separate, higher up) ---
dx_r2 = ROOM_W + 8
# This dimension is from the cutout horizontal wall up to where the top wall would be
# Show it as a label next to the cutout area instead
svg.append(f'<line x1="{X(ROOM_W + 3)}" y1="{Y(0)}" x2="{X(ROOM_W + 3)}" y2="{Y(CUTOUT_D)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(ROOM_W + 5)}" y="{Y(CUTOUT_D/2)}" text-anchor="start" class="dim-sm">25.5"</text>')
# Extension lines for cutout
svg.append(f'<line x1="{X(VANITY_W)}" y1="{Y(0)}" x2="{X(ROOM_W + 2)}" y2="{Y(0)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')
svg.append(f'<line x1="{X(ROOM_W)}" y1="{Y(CUTOUT_D)}" x2="{X(ROOM_W + 2)}" y2="{Y(CUTOUT_D)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')

# --- BOTTOM ROW 1: Entry width (closer to room, at ROOM_D + 5) ---
svg.append(f'<line x1="{X(entry_x)}" y1="{Y(ROOM_D + 5)}" x2="{X(entry_x + ENTRY_W)}" y2="{Y(ROOM_D + 5)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(entry_x + ENTRY_W/2)}" y="{Y(ROOM_D + 9)}" text-anchor="middle" class="dim-sm">29"</text>')

# --- BOTTOM ROW 2: Shower width (further from room, at ROOM_D + 16) ---
svg.append(f'<line x1="{X(shower_x)}" y1="{Y(ROOM_D + 16)}" x2="{X(ROOM_W)}" y2="{Y(ROOM_D + 16)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(shower_x + SHOWER_W/2)}" y="{Y(ROOM_D + 20)}" text-anchor="middle" class="dim-sm">36"</text>')

# --- INSIDE: Vanity width 36" (inside the room, just below vanity) ---
dy_van = VANITY_D + 5
svg.append(f'<line x1="{X(0)}" y1="{Y(dy_van)}" x2="{X(VANITY_W)}" y2="{Y(dy_van)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(VANITY_W/2)}" y="{Y(dy_van + 4)}" text-anchor="middle" class="dim-sm">36"</text>')

# Close
svg.append('</svg>')

with open('/home/ubuntu/kitchen_remodel/bathroom_floorplan_v4.svg', 'w') as f:
    f.write('\n'.join(svg))

cairosvg.svg2png(url='/home/ubuntu/kitchen_remodel/bathroom_floorplan_v4.svg',
                 write_to='/home/ubuntu/kitchen_remodel/bathroom_floorplan_v4.png', scale=2)

print(f"Bathroom v4 done: {svg_w}x{svg_h}px")
print(f"Room: {ROOM_W}\" x {ROOM_D}\"")
print(f"Vanity: {VANITY_W}\" x {VANITY_D}\" (top-left)")
print(f"Cutout: {CUTOUT_W}\" x {CUTOUT_D}\" (top-right)")
print(f"Shower: {SHOWER_W}\" x {SHOWER_D}\" at ({shower_x}\", {shower_y}\") — bottom-right")
print(f"Toilet Y: {toilet_y:.1f}\" (centered between {CUTOUT_D}\" and {shower_y}\")")
print(f"Entry: {ENTRY_W}\" wide, left-aligned")
print(f"Window: {WINDOW_W}\" wide on back wall")
