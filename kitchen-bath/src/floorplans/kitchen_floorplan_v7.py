"""
Kitchen Floor Plan v7 — Fridge relocated to lower counter area.
Based on v6 geometry (with 48" right-side bump-out).
Changes from v6:
- Fridge removed from left wall (between short leg and entry)
- Fridge placed at right end of lower counter (where CAB was)
- Old fridge spot becomes part of the L-shaped counter (merged, continuous)
- 6" gap between extended counter and entry door
- Lower counter run shortened from 110" to 103"
"""
import cairosvg

SCALE = 3.2
MARGIN_TOP = 130
MARGIN_BOTTOM = 80
MARGIN_LEFT = 120
MARGIN_RIGHT = 100

# Room dimensions
MAIN_W = 139
EXTENSION_DEPTH = 48
TOTAL_W = MAIN_W + EXTENSION_DEPTH  # 187"

# Vertical
L_LONG_DEPTH = 24
L_SHORT_LENGTH = 41
ENTRY_GAP = 32
LOWER_COUNTER_DEPTH = 26.5

# New layout: L-counter extends down to 77" (was 41" short leg + 42" fridge, now 77" continuous counter)
L_EXTENDED_LENGTH = 77  # short leg extended (41 + 36)
GAP_TO_ENTRY = 6
LEFT_BREAK_TOP = L_EXTENDED_LENGTH + GAP_TO_ENTRY  # 83"
LEFT_BREAK_BOTTOM = LEFT_BREAK_TOP + ENTRY_GAP  # 115"
ROOM_D = LEFT_BREAK_BOTTOM + LOWER_COUNTER_DEPTH  # 141.5"

STEP_TOP_Y = L_LONG_DEPTH  # 24"
STEP_BOTTOM_Y = ROOM_D - LOWER_COUNTER_DEPTH  # 115"
RIGHT_WALL_HEIGHT = 91  # = 115 - 24

# Components
L_LONG_LENGTH = 106
L_SHORT_WIDTH = 33.5
STOVE_W = 33
FRIDGE_W = 36       # width along lower wall
FRIDGE_D = 33.5     # depth into room
LOWER_COUNTER_LENGTH = MAIN_W - FRIDGE_W  # 103"
BACK_WINDOW = 46

# SVG size
svg_w = int(TOTAL_W * SCALE + MARGIN_LEFT + MARGIN_RIGHT)
svg_h = int(ROOM_D * SCALE + MARGIN_TOP + MARGIN_BOTTOM)

def px(inches): return inches * SCALE
def X(inches): return MARGIN_LEFT + px(inches)
def Y(inches): return MARGIN_TOP + px(inches)

lower_y = ROOM_D - LOWER_COUNTER_DEPTH
fridge_x = LOWER_COUNTER_LENGTH  # fridge starts where lower counter ends

svg = []
svg.append(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_w} {svg_h}" width="{svg_w}" height="{svg_h}">
<style>
  text {{ font-family: 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif; }}
  .dim {{ font-size: 11px; fill: #c0392b; font-weight: 600; }}
  .dim-sm {{ font-size: 9px; fill: #c0392b; font-weight: 500; }}
  .label {{ font-size: 10.5px; fill: #2c3e50; font-weight: 700; }}
  .sublabel {{ font-size: 8.5px; fill: #7f8c8d; }}
  .title {{ font-size: 14px; fill: #2c3e50; font-weight: 700; }}
  .subtitle {{ font-size: 9.5px; fill: #95a5a6; }}
  .win-label {{ font-size: 8px; fill: #2980b9; }}
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

# Title
svg.append(f'<text x="{svg_w//2}" y="20" text-anchor="middle" class="title">Kitchen Floor Plan — Top-Down View (Scaled)</text>')
svg.append(f'<text x="{svg_w//2}" y="35" text-anchor="middle" class="subtitle">All dimensions in inches</text>')

# ===== ROOM WALLS =====
wall_lw = 3
# Back wall
svg.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(MAIN_W)}" y2="{Y(0)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Top-right corner step down
svg.append(f'<line x1="{X(MAIN_W)}" y1="{Y(0)}" x2="{X(MAIN_W)}" y2="{Y(STEP_TOP_Y)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Top extension wall (48" going right)
svg.append(f'<line x1="{X(MAIN_W)}" y1="{Y(STEP_TOP_Y)}" x2="{X(TOTAL_W)}" y2="{Y(STEP_TOP_Y)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Right windowed wall (91")
svg.append(f'<line x1="{X(TOTAL_W)}" y1="{Y(STEP_TOP_Y)}" x2="{X(TOTAL_W)}" y2="{Y(STEP_BOTTOM_Y)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Bottom extension wall (48" going left)
svg.append(f'<line x1="{X(TOTAL_W)}" y1="{Y(STEP_BOTTOM_Y)}" x2="{X(MAIN_W)}" y2="{Y(STEP_BOTTOM_Y)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Bottom-right corner step down
svg.append(f'<line x1="{X(MAIN_W)}" y1="{Y(STEP_BOTTOM_Y)}" x2="{X(MAIN_W)}" y2="{Y(ROOM_D)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Front wall
svg.append(f'<line x1="{X(MAIN_W)}" y1="{Y(ROOM_D)}" x2="{X(0)}" y2="{Y(ROOM_D)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
# Left wall with entry gap
svg.append(f'<line x1="{X(0)}" y1="{Y(ROOM_D)}" x2="{X(0)}" y2="{Y(LEFT_BREAK_BOTTOM)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')
svg.append(f'<line x1="{X(0)}" y1="{Y(LEFT_BREAK_BOTTOM)}" x2="{X(0)}" y2="{Y(LEFT_BREAK_TOP)}" stroke="#2c3e50" stroke-width="1.5" stroke-dasharray="5,3"/>')
svg.append(f'<line x1="{X(0)}" y1="{Y(LEFT_BREAK_TOP)}" x2="{X(0)}" y2="{Y(0)}" stroke="#2c3e50" stroke-width="{wall_lw}"/>')

# ===== FLOOR AREAS =====
# Main floor
svg.append(f'<rect x="{X(L_SHORT_WIDTH)}" y="{Y(L_LONG_DEPTH)}" width="{px(MAIN_W - L_SHORT_WIDTH)}" height="{px(STEP_BOTTOM_Y - STEP_TOP_Y)}" fill="#fafaf8" stroke="none"/>')
# Extension floor (48" bump-out)
svg.append(f'<rect x="{X(MAIN_W)}" y="{Y(STEP_TOP_Y)}" width="{px(EXTENSION_DEPTH)}" height="{px(RIGHT_WALL_HEIGHT)}" fill="#f5f5f2" stroke="none"/>')
# Entry floor
svg.append(f'<rect x="{X(0)}" y="{Y(LEFT_BREAK_TOP)}" width="{px(L_SHORT_WIDTH)}" height="{px(ENTRY_GAP)}" fill="#fafaf8" stroke="none"/>')

# ===== UPPER L-SHAPED COUNTER (now extends to 77") =====
# Long leg (top)
svg.append(f'<rect x="{X(0)}" y="{Y(0)}" width="{px(L_LONG_LENGTH)}" height="{px(L_LONG_DEPTH)}" fill="#ede8df" stroke="#8b7355" stroke-width="1.5"/>')
# Short leg (full extended height: from y=24 down to y=77)
svg.append(f'<rect x="{X(0)}" y="{Y(L_LONG_DEPTH)}" width="{px(L_SHORT_WIDTH)}" height="{px(L_EXTENDED_LENGTH - L_LONG_DEPTH)}" fill="#ede8df" stroke="#8b7355" stroke-width="1.5"/>')
# Remove internal border between long and short leg
svg.append(f'<line x1="{X(0.5)}" y1="{Y(L_LONG_DEPTH)}" x2="{X(L_SHORT_WIDTH - 0.5)}" y2="{Y(L_LONG_DEPTH)}" stroke="#ede8df" stroke-width="3"/>')

# Sink (in front of window, same position as v6)
sink_x = 38
sink_y = 4
svg.append(f'<rect x="{X(sink_x)}" y="{Y(sink_y)}" width="{px(14)}" height="{px(10)}" fill="#d4e6f1" stroke="#2980b9" stroke-width="1.2" rx="2"/>')
svg.append(f'<text x="{X(sink_x + 7)}" y="{Y(sink_y + 6)}" text-anchor="middle" class="sublabel" fill="#2980b9">Sink</text>')

# Labels
svg.append(f'<text x="{X(80)}" y="{Y(L_LONG_DEPTH/2 + 1)}" text-anchor="middle" class="label">UPPER COUNTER (L-shaped)</text>')
svg.append(f'<text x="{X(L_SHORT_WIDTH/2)}" y="{Y(L_LONG_DEPTH + (L_EXTENDED_LENGTH - L_LONG_DEPTH)/2)}" text-anchor="middle" class="sublabel">Short leg</text>')

# ===== STOVE =====
stove_x = L_LONG_LENGTH
svg.append(f'<rect x="{X(stove_x)}" y="{Y(0)}" width="{px(STOVE_W)}" height="{px(L_LONG_DEPTH)}" fill="#d5d5d5" stroke="#555" stroke-width="1.5"/>')
svg.append(f'<text x="{X(stove_x + STOVE_W/2)}" y="{Y(L_LONG_DEPTH/2 + 1)}" text-anchor="middle" class="label">STOVE</text>')
for r in range(2):
    for c in range(2):
        cx = X(stove_x + 8 + c * 14)
        cy = Y(5 + r * 11)
        svg.append(f'<circle cx="{cx}" cy="{cy}" r="3.5" fill="none" stroke="#777" stroke-width="0.6"/>')

# ===== ENTRY =====
entry_mid_y = (LEFT_BREAK_TOP + LEFT_BREAK_BOTTOM) / 2
svg.append(f'<line x1="{X(-12)}" y1="{Y(entry_mid_y + 6)}" x2="{X(5)}" y2="{Y(entry_mid_y + 6)}" stroke="#27ae60" stroke-width="2" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(-14)}" y="{Y(entry_mid_y + 7)}" text-anchor="end" class="label" fill="#27ae60">ENTRY</text>')

# ===== LOWER COUNTER =====
svg.append(f'<rect x="{X(0)}" y="{Y(lower_y)}" width="{px(LOWER_COUNTER_LENGTH)}" height="{px(LOWER_COUNTER_DEPTH)}" fill="#ede8df" stroke="#8b7355" stroke-width="1.5"/>')
svg.append(f'<text x="{X(LOWER_COUNTER_LENGTH/2)}" y="{Y(lower_y + LOWER_COUNTER_DEPTH/2 + 1)}" text-anchor="middle" class="label">LOWER COUNTER</text>')

# ===== FRIDGE (new position — right end of lower wall) =====
# Fridge: 36" wide x 33.5" deep. Deeper than counter so it sticks up into floor area.
svg.append(f'<rect x="{X(fridge_x)}" y="{Y(ROOM_D - FRIDGE_D)}" width="{px(FRIDGE_W)}" height="{px(FRIDGE_D)}" fill="#bdc3c7" stroke="#555" stroke-width="1.5" rx="2"/>')
svg.append(f'<text x="{X(fridge_x + FRIDGE_W/2)}" y="{Y(ROOM_D - FRIDGE_D/2 - 2)}" text-anchor="middle" class="label">FRIDGE</text>')
svg.append(f'<text x="{X(fridge_x + FRIDGE_W/2)}" y="{Y(ROOM_D - FRIDGE_D/2 + 4)}" text-anchor="middle" class="sublabel">33.5" deep</text>')

# ===== FLOOR LABELS =====
floor_cx = (L_SHORT_WIDTH + MAIN_W) / 2
floor_cy = STEP_TOP_Y + (STEP_BOTTOM_Y - STEP_TOP_Y) / 2
svg.append(f'<text x="{X(floor_cx)}" y="{Y(floor_cy - 3)}" text-anchor="middle" class="label" font-size="12">FLOOR AREA</text>')
svg.append(f'<text x="{X(floor_cx)}" y="{Y(floor_cy + 4)}" text-anchor="middle" class="sublabel">Counter height: 36" · Ceiling: 96" (8 ft)</text>')

# ===== WINDOWS =====
# Back wall window (46") — above sink
win_back_x = 38
svg.append(f'<rect x="{X(win_back_x)}" y="{Y(-1.5)}" width="{px(BACK_WINDOW)}" height="{px(1.5)}" fill="#aed6f1" stroke="#2980b9" stroke-width="1"/>')
svg.append(f'<text x="{X(win_back_x + BACK_WINDOW/2)}" y="{Y(-4)}" text-anchor="middle" class="win-label">Window 46"</text>')

# Top extension wall window (on the 48" wall)
win_top_ext_x = MAIN_W + 10
win_top_ext_w = 28
svg.append(f'<rect x="{X(win_top_ext_x)}" y="{Y(STEP_TOP_Y - 1.5)}" width="{px(win_top_ext_w)}" height="{px(1.5)}" fill="#aed6f1" stroke="#2980b9" stroke-width="1"/>')
svg.append(f'<text x="{X(win_top_ext_x + win_top_ext_w/2)}" y="{Y(STEP_TOP_Y - 4)}" text-anchor="middle" class="win-label">Window 24"</text>')

# Bottom extension wall window (on the 48" wall at bottom)
win_bot_ext_x = MAIN_W + 10
win_bot_ext_w = 28
svg.append(f'<rect x="{X(win_bot_ext_x)}" y="{Y(STEP_BOTTOM_Y)}" width="{px(win_bot_ext_w)}" height="{px(1.5)}" fill="#aed6f1" stroke="#2980b9" stroke-width="1"/>')
svg.append(f'<text x="{X(win_bot_ext_x + win_bot_ext_w/2)}" y="{Y(STEP_BOTTOM_Y + 5)}" text-anchor="middle" class="win-label">Window</text>')

# Right windowed wall — windows on the 91" wall
win_r_y1 = STEP_TOP_Y + 15
win_r_h1 = 25
svg.append(f'<rect x="{X(TOTAL_W - 0.5)}" y="{Y(win_r_y1)}" width="{px(1.5)}" height="{px(win_r_h1)}" fill="#aed6f1" stroke="#2980b9" stroke-width="1"/>')
win_r_y2 = STEP_TOP_Y + 50
win_r_h2 = 25
svg.append(f'<rect x="{X(TOTAL_W - 0.5)}" y="{Y(win_r_y2)}" width="{px(1.5)}" height="{px(win_r_h2)}" fill="#aed6f1" stroke="#2980b9" stroke-width="1"/>')

# ===== DIMENSION LINES =====

# --- TOP: 139" back wall ---
dy1 = -24
svg.append(f'<line x1="{X(0)}" y1="{Y(dy1)}" x2="{X(MAIN_W)}" y2="{Y(dy1)}" stroke="#c0392b" stroke-width="0.8" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(MAIN_W/2)}" y="{Y(dy1 - 3)}" text-anchor="middle" class="dim">139" (46.5 + 46 window + 46.5)</text>')
svg.append(f'<line x1="{X(0)}" y1="{Y(dy1+1)}" x2="{X(0)}" y2="{Y(-1)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')
svg.append(f'<line x1="{X(MAIN_W)}" y1="{Y(dy1+1)}" x2="{X(MAIN_W)}" y2="{Y(-1)}" stroke="#c0392b" stroke-width="0.3" stroke-dasharray="2,1.5"/>')

# --- TOP: 106" + 33" ---
dy2 = -14
svg.append(f'<line x1="{X(0)}" y1="{Y(dy2)}" x2="{X(L_LONG_LENGTH)}" y2="{Y(dy2)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(L_LONG_LENGTH/2)}" y="{Y(dy2 - 2)}" text-anchor="middle" class="dim-sm">106" counter</text>')
svg.append(f'<line x1="{X(L_LONG_LENGTH)}" y1="{Y(dy2)}" x2="{X(MAIN_W)}" y2="{Y(dy2)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(L_LONG_LENGTH + STOVE_W/2)}" y="{Y(dy2 - 2)}" text-anchor="middle" class="dim-sm">33"</text>')

# --- 48" extension (horizontal, at the step-out level) ---
ext_dim_y = STEP_TOP_Y + 5
svg.append(f'<line x1="{X(MAIN_W)}" y1="{Y(ext_dim_y)}" x2="{X(TOTAL_W)}" y2="{Y(ext_dim_y)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(MAIN_W + EXTENSION_DEPTH/2)}" y="{Y(ext_dim_y - 2.5)}" text-anchor="middle" class="dim-sm">48"</text>')

# --- RIGHT: 91" windowed wall ---
dx_r = TOTAL_W + 6
svg.append(f'<line x1="{X(dx_r)}" y1="{Y(STEP_TOP_Y)}" x2="{X(dx_r)}" y2="{Y(STEP_BOTTOM_Y)}" stroke="#c0392b" stroke-width="0.8" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_r + 2)}" y="{Y(STEP_TOP_Y + RIGHT_WALL_HEIGHT/2)}" text-anchor="start" class="dim">91"</text>')

# --- RIGHT near main: 24" upper counter depth ---
dx_r2 = MAIN_W + 2
svg.append(f'<line x1="{X(dx_r2)}" y1="{Y(0)}" x2="{X(dx_r2)}" y2="{Y(STEP_TOP_Y)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_r2 + 1.5)}" y="{Y(STEP_TOP_Y/2)}" text-anchor="start" class="dim-sm">24"</text>')

# --- RIGHT near main: 26.5" lower counter depth ---
svg.append(f'<line x1="{X(dx_r2)}" y1="{Y(STEP_BOTTOM_Y)}" x2="{X(dx_r2)}" y2="{Y(ROOM_D)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_r2 + 1.5)}" y="{Y(STEP_BOTTOM_Y + LOWER_COUNTER_DEPTH/2)}" text-anchor="start" class="dim-sm">26.5"</text>')

# --- LEFT: L-counter full height 77" ---
dx_l = -10
svg.append(f'<line x1="{X(dx_l)}" y1="{Y(0)}" x2="{X(dx_l)}" y2="{Y(L_EXTENDED_LENGTH)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_l - 1)}" y="{Y(L_EXTENDED_LENGTH/2)}" text-anchor="end" class="dim-sm">77"</text>')

# --- LEFT: 6" gap ---
svg.append(f'<text x="{X(dx_l - 1)}" y="{Y(L_EXTENDED_LENGTH + GAP_TO_ENTRY/2 + 1)}" text-anchor="end" class="sublabel">6" gap</text>')

# --- LEFT: entry 32" ---
svg.append(f'<line x1="{X(dx_l)}" y1="{Y(LEFT_BREAK_TOP)}" x2="{X(dx_l)}" y2="{Y(LEFT_BREAK_BOTTOM)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_l - 1)}" y="{Y((LEFT_BREAK_TOP + LEFT_BREAK_BOTTOM)/2)}" text-anchor="end" class="dim-sm">32"</text>')

# --- LEFT: lower counter 26.5" ---
svg.append(f'<line x1="{X(dx_l)}" y1="{Y(lower_y)}" x2="{X(dx_l)}" y2="{Y(ROOM_D)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(dx_l - 1)}" y="{Y(lower_y + LOWER_COUNTER_DEPTH/2)}" text-anchor="end" class="dim-sm">26.5"</text>')

# --- BOTTOM: 103" counter + 36" fridge ---
dy_b = ROOM_D + 8
svg.append(f'<line x1="{X(0)}" y1="{Y(dy_b)}" x2="{X(LOWER_COUNTER_LENGTH)}" y2="{Y(dy_b)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(LOWER_COUNTER_LENGTH/2)}" y="{Y(dy_b + 4.5)}" text-anchor="middle" class="dim">103" counter run</text>')
svg.append(f'<line x1="{X(LOWER_COUNTER_LENGTH)}" y1="{Y(dy_b)}" x2="{X(MAIN_W)}" y2="{Y(dy_b)}" stroke="#c0392b" stroke-width="0.6" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(LOWER_COUNTER_LENGTH + FRIDGE_W/2)}" y="{Y(dy_b + 4.5)}" text-anchor="middle" class="dim-sm">36" fridge</text>')

# --- Short leg width: 33.5" ---
dim_33_y = L_EXTENDED_LENGTH + 2
svg.append(f'<line x1="{X(0)}" y1="{Y(dim_33_y)}" x2="{X(L_SHORT_WIDTH)}" y2="{Y(dim_33_y)}" stroke="#c0392b" stroke-width="0.5" marker-start="url(#arr2)" marker-end="url(#arr)"/>')
svg.append(f'<text x="{X(L_SHORT_WIDTH/2)}" y="{Y(dim_33_y + 4)}" text-anchor="middle" class="dim-sm">33.5"</text>')

# Close
svg.append('</svg>')

with open('/home/ubuntu/kitchen_remodel/kitchen_floorplan_v7.svg', 'w') as f:
    f.write('\n'.join(svg))

cairosvg.svg2png(url='/home/ubuntu/kitchen_remodel/kitchen_floorplan_v7.svg',
                 write_to='/home/ubuntu/kitchen_remodel/kitchen_floorplan_v7.png', scale=2)

print(f"Kitchen v7 done: {svg_w}x{svg_h}px")
print(f"Fridge new position: x={fridge_x}\", bottom wall, {FRIDGE_W}\" wide x {FRIDGE_D}\" deep")
print(f"Lower counter: {LOWER_COUNTER_LENGTH}\" (was 110\")")
print(f"L-counter extended to: {L_EXTENDED_LENGTH}\" (was 41\" short leg)")
print(f"Gap to entry: {GAP_TO_ENTRY}\"")
