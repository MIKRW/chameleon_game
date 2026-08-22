// World prop placement — where each terrarium sprite instance sits, laid out
// against the 9-layer scene stack (see game/render.js header comment):
//   1 background, 2 background decor (cosmetic only — no floor
//   placement/occlusion logic, painted before everything else), 3 second
//   background decor band (same idea as layer 2, closer/faster/more
//   saturated — see DEPTH-LAYERS.md), 4 dirt/glass bottom, 5 far plants
//   (behind player), 6 player, 7 near plants (in front of player, plus the
//   hidden pixel-digit backdrop and light switch), 8 glass edges, 9 glass
//   front.
//
// BACKGROUND_PLACEMENTS/BACKGROUND_LAYER3_PLACEMENTS (layers 2/3) are for
// scenery only — they never occlude or interact with the player, unlike the
// layer-5/7 far/near plant passes.
//
// `layer` (5 or 7) picks the coarse pass — behind or in front of the player.
// `z` is OPTIONAL and only needed to override the default stacking order.
// Within a layer, instances paint in array order (a stable sort falls back
// to insertion order when z is omitted/equal) — so appending an entry
// already puts it on top of everything earlier in the list without having
// to think about a number. Only add an explicit z when you need something
// to sit out of that natural order (e.g. an entry added later that should
// actually sit *behind* an earlier one). Higher z paints later == on top.
//
// `z` is independent of a trunk sprite's id (e.g. trunk-bg-3a vs
// trunk-interact-3, see sprites/README.md) — the number is a silhouette
// family, the letter a variant within it (bark tone today, could be
// thickness or another variation later); neither says anything about which
// layer or z an instance has to use.
//
// Ground props only need an x (world-space); y snaps to the floor line at
// render time. Tree props snap to the floor the same way.

// Cleared for a trees/layers readjustment pass — re-add placements once the
// new layout is settled.
const PLANT_PLACEMENTS = [
  { sprite: 'ground-plant-1b', x: 120, layer: 2 },
  { sprite: 'ground-plant-1b', x: 900, layer: 2 },
  { sprite: 'ground-plant-1b', x: 1500, layer: 2 },
  { sprite: 'ground-plant-1b', x: 2050, layer: 2 },
  { sprite: 'ground-plant-4', x: 600, layer: 2 },
  { sprite: 'ground-plant-4', x: 790, layer: 2 },
  { sprite: 'ground-plant-1', x: 15, layer: 3 },
  { sprite: 'ground-plant-1', x: 400, layer: 3 },
  { sprite: 'ground-plant-1', x: 800, layer: 3 },
  { sprite: 'ground-plant-1', x: 1200, layer: 3 },
  { sprite: 'ground-plant-1', x: 3050, layer: 3 },
  { sprite: 'ground-plant-4', x: 2130, layer: 3 },
  { sprite: 'ground-plant-7', x: 1430, layer: 3, scaleMultiplier: 1.7 },
  { sprite: 'ground-plant-1', x: 1430, layer: 2, scaleMultiplier: 1.2 },
  { sprite: 'ground-plant-5', x: 50, layer: 5 },
  { sprite: 'ground-plant-5', x: 196, layer: 5 },
  { sprite: 'ground-plant-5', x: 2484, layer: 5 },
  { sprite: 'ground-plant-7', x: 100, layer: 7 },
  { sprite: 'ground-plant-7', x: 360, layer: 7 },
  { sprite: 'ground-plant-1', x: 560, layer: 7, scaleMultiplier: 0.6 },
  { sprite: 'ground-plant-1', x: 770, layer: 5, scaleMultiplier: 0.6 },
  { sprite: 'ground-plant-7', x: 1760, layer: 5 },
  { sprite: 'ground-plant-7', x: 1900, layer: 5 },
  { sprite: 'ground-plant-4', x: 2100, layer: 5 },
  { sprite: 'ground-plant-1', x: 2300, layer: 7, scaleMultiplier: 0.3 },
  { sprite: 'ground-plant-7', x: 900, layer: 7 },
  { sprite: 'ground-plant-7', x: 1450, layer: 7 },
  { sprite: 'ground-plant-1', x: 2200, layer: 7, scaleMultiplier: 0.7 },
  { sprite: 'ground-plant-7', x: 2550, layer: 7, scaleMultiplier: 1.4 },
];

// Purely cosmetic background scenery — furthest back, painted before the
// far-plants layer, never occluding or interacting with the player.
// Scattered across all 6 trunk-bg-*a (muted-bark) silhouettes at varied x
// positions and heights (see sprites/tree-trunks-bg/) so the backdrop
// doesn't read as one repeated trunk. BG 1a is the widest/tallest (runs
// floor-to-lid); BG 2a/4a/5a are mid-height; BG 3a is the shortest, still
// clearing the 1/3-window-height floor.
//
// x positions are scaled down from where they'd sit under 1:1 scrolling
// (the original hand-placed spread across the full 3600-wide world) because
// this layer now scrolls at BACKGROUND_DECOR_PARALLAX_LAYER2 (0.4, see
// game/constants.js) rather than 1:1 with the camera — a trunk placed at a
// raw world-x beyond CAMERA_X_MAX * 0.4 + CANVAS_W (1872px) would never
// scroll into view at that slower rate, since the camera can't pan far
// enough to drag it onscreen. Scaling every x down keeps the original
// relative order/spacing while fitting the whole set inside the screen-x
// range this parallax rate can actually reach.
// All layer-2 trunk placements cleared at the user's request. Sprites
// themselves are untouched; re-add placement entries to bring trees back.
const BACKGROUND_PLACEMENTS = [];

// BG 6a ('Angled Knotty', sprites/tree-trunks-bg/trunk-bg-6a.js) — a dramatic
// diagonal feature tree, currently unplaced. Was at x: 1430, layer: 2 in the
// list above; pull it back out and re-add a placement entry when it gets a
// new spot.

// Second cosmetic background band, painted between layer 2 and the dirt/
// glass line (see draw() in game/render.js) — same trunk-bg-*a/*b variety
// as BACKGROUND_PLACEMENTS above (layer 6a excluded, kept a layer-2-only
// landmark), just different x positions and a step up the depth-layer
// saturation ladder (resolveBarkPalette(placement.sprite, 3) in
// game/render.js, driven by sprites/palette/bark-ladder.js).
// Scrolls at BACKGROUND_DECOR_PARALLAX_LAYER3 (0.55, faster than layer 2's
// 0.4 but still slower than the 1:1 interactive layers), so x positions are
// spread across the wider [0, CAMERA_X_MAX * 0.55 + CANVAS_W] = [0, 2304]
// range that rate can reach — offset from layer 2's positions above so the
// two bands don't line up directly behind one another.
const BACKGROUND_LAYER3_PLACEMENTS = [
  { sprite: 'trunk-bg-2a', x: 168, layer: 3 },
  { sprite: 'trunk-bg-4a', x: 350, layer: 3 },
  { sprite: 'trunk-bg-1a', x: 533, layer: 3 },
  { sprite: 'trunk-bg-5a', x: 747, layer: 3 },
  { sprite: 'trunk-bg-3a', x: 945, layer: 3 },
  { sprite: 'trunk-bg-1a', x: 1310, layer: 3 },
  { sprite: 'trunk-bg-2a', x: 1516, layer: 3 },
  { sprite: 'trunk-bg-4a', x: 1935, layer: 3 },
  // Moved from BACKGROUND_PLACEMENTS (layer 2, x:1508) — was crossing
  // directly through BG 6a's diagonal sweep, reading as a green trunk
  // cutting through it rather than sitting behind it. x re-scaled for this
  // layer's faster 0.55 parallax (was x:1508 at 0.4) to land in roughly the
  // same on-screen neighborhood.
  { sprite: 'trunk-bg-2a', x: 2074, layer: 3 },
  { sprite: 'trunk-bg-3a', x: 2149, layer: 3 },
];

// Cleared for a trees/layers readjustment pass — re-add placements once the
// new layout is settled. BRANCH_PLACEMENTS and LIGHT_SWITCH_PLACEMENT below
// still reference trunkX values from the old layout (550, 1540, 2610, 3280,
// 3520) and are orphaned until those trunks are re-added.
const TREE_PLACEMENTS = [
  { sprite: 'trunk-interact-3', x: 300, layer: 5 },
  { sprite: 'trunk-interact-1', x: 1150, layer: 5 },
  { sprite: 'trunk-interact-3', x: 2000, layer: 5 },
  { sprite: 'trunk-interact-3', x: 2700, layer: 5 },
  { sprite: 'trunk-interact-2', x: 2350, layer: 7 },
  { sprite: 'trunk-interact-2', x: 2900, layer: 7 },
  { sprite: 'trunk-interact-2', x: 720, layer: 7 },
  { sprite: 'trunk-interact-3', x: 3200, layer: 5 },
  { sprite: 'trunk-interact-2', x: 3550, layer: 7 },
  // Moved from layer 5 (branchless trunk-interact-3) to layer 7, same x,
  // still branchless — brings a layer-7 (closer/interactive) tree into this
  // gap instead of a background one.
  { sprite: 'trunk-interact-2', x: 1580, layer: 7 },
];

// Branches mounted onto a subset of the trees above (see sprites/tree-branches/tree-branch-1.js
// / tree-branch-2.js) — kept sparse so the scene doesn't read as cluttered:
// only 1 of the 5 layer-5 trees (25%, max 3 branches) and 4 of the 9 layer-7
// trees (~44%, max 4 branches) get them. Each entry's `trunkX` + `layer` must
// match a TREE_PLACEMENTS entry exactly (that's how drawTreeBranches in
// game/render.js finds the trunk to hang off). `attachRow` is the row (0 = top of
// the trunk sprite, counting down toward the floor) where the branch's base
// touches the bark; `side` picks which edge it grows from and whether the
// branch-1/2 sprite gets flipped. Branches on the same trunk alternate sides
// and stay >=30 rows apart so they can't touch each other, and every chosen
// trunk is >=380px from any other chosen layer-5/7 trunk so no branch's
// ~40-64px reach crosses into a neighboring tree's branches. That clearance
// is only checked against other layer-5/7 branch trunks — layer 2
// (BACKGROUND_PLACEMENTS) is purely cosmetic scenery with no occlusion or
// interaction logic (see the comment above BACKGROUND_PLACEMENTS), so a
// layer-5/7 branch is free to visually run in front of a layer-2 trunk
// without that being a bug.
const BRANCH_PLACEMENTS = [
  // Layer 5 — Trunk Interact 3 at x300 (11 wide x157 tall: branch-1).
  { trunkX: 300, layer: 5, sprite: 'tree-branch-1', attachRow: 88, side: 'left' },

  // Layer 5 — Trunk Interact 3 at x2000 (11 wide x157 tall), one long
  // branch-2 plus two short branch-1s, alternating sides.
  { trunkX: 2000, layer: 5, sprite: 'tree-branch-2', attachRow: 30, side: 'right' },
  { trunkX: 2000, layer: 5, sprite: 'tree-branch-1', attachRow: 70, side: 'left' },
  { trunkX: 2000, layer: 5, sprite: 'tree-branch-1', attachRow: 110, side: 'right' },

  // Layer 5 — Trunk Interact 3 at x2700 previously had two short branch-1s
  // here. Removed: with WORLD_WIDTH temporarily shortened to 2650 (see
  // game/constants.js), that trunk sits just past the new right glass wall
  // and is itself invisible/inaccessible, but its left-side branch's tip
  // reached back to x2580 — inside the wall — so it floated on screen with
  // no visible trunk attached. Re-add once the trunk itself is back in
  // reach (WORLD_WIDTH restored, or the trunk moved).
  //
  // Layer 5 — Trunk Interact 3 at x3200 (11 wide x157 tall), two long
  // branch-2s, alternating sides.
  { trunkX: 3200, layer: 5, sprite: 'tree-branch-2', attachRow: 30, side: 'right' },
  { trunkX: 3200, layer: 5, sprite: 'tree-branch-2', attachRow: 90, side: 'left' },

  // Layer 5 — Trunk Interact 1 at x1150 (11 wide x151 tall), the only
  // layer-5 tree with room for a full branch, using the longer branch-2.
  { trunkX: 1150, layer: 5, sprite: 'tree-branch-2', attachRow: 25, side: 'right' },
  { trunkX: 1150, layer: 5, sprite: 'tree-branch-2', attachRow: 65, side: 'left' },
  { trunkX: 1150, layer: 5, sprite: 'tree-branch-2', attachRow: 105, side: 'right' },

  // Layer 7 — Trunk Interact 3 at x550 (11 wide, knotted/narrow: branch-1).
  { trunkX: 550, layer: 7, sprite: 'tree-branch-1', attachRow: 35, side: 'right' },
  { trunkX: 550, layer: 7, sprite: 'tree-branch-1', attachRow: 90, side: 'left' },

  // Layer 7 — Trunk Interact 2 at x1540 (16 wide, thick trunk, recolored to
  // driftwood bark: branch-3, the driftwood-toned variant of branch-2, max 4).
  { trunkX: 1540, layer: 7, sprite: 'tree-branch-3', attachRow: 20, side: 'right' },
  { trunkX: 1540, layer: 7, sprite: 'tree-branch-3', attachRow: 55, side: 'left' },
  { trunkX: 1540, layer: 7, sprite: 'tree-branch-3', attachRow: 90, side: 'right' },
  { trunkX: 1540, layer: 7, sprite: 'tree-branch-3', attachRow: 125, side: 'left' },

  // Layer 7 — Trunk Interact 2 at x2610 (thick trunk, recolored to driftwood
  // bark: branch-3).
  { trunkX: 2610, layer: 7, sprite: 'tree-branch-3', attachRow: 30, side: 'left' },
  { trunkX: 2610, layer: 7, sprite: 'tree-branch-3', attachRow: 70, side: 'right' },
  { trunkX: 2610, layer: 7, sprite: 'tree-branch-3', attachRow: 110, side: 'left' },

  // Layer 7 — Trunk Interact 3 at x3520 (narrow trunk: branch-1).
  { trunkX: 3520, layer: 7, sprite: 'tree-branch-1', attachRow: 40, side: 'right' },
  { trunkX: 3520, layer: 7, sprite: 'tree-branch-1', attachRow: 95, side: 'left' },

  // Layer 7 — Trunk Interact 2 at x2350 (16 wide, thick trunk, recolored to
  // driftwood bark: branch-3, the driftwood-toned variant of branch-2), this
  // being the rightmost of the three trunk-interact-2 placements. Only 2
  // branches (down from 3) at rows chosen to clear the layer-5 Trunk
  // Interact 3 neighbors on both sides (x2000 reaches right via branches at
  // rows 30/110; x2700 reaches left via a branch at row 60) — branch-3's
  // ~184px reach doesn't touch either neighbor's trunk directly (both are
  // >380px away), but the original rows 30/70/110 lined up in height with
  // those neighbors' reaching branches and visually crossed them. Row 60/100
  // sit clear of both neighbors' occupied row-bands.
  { trunkX: 2350, layer: 7, sprite: 'tree-branch-3', attachRow: 60, side: 'left' },
  { trunkX: 2350, layer: 7, sprite: 'tree-branch-3', attachRow: 100, side: 'right' },

  // Layer 7 — Trunk Interact 2 at x720 (16 wide, thick trunk, recolored to
  // driftwood bark: branch-3). Three branches, right/left/right reading from
  // the bottom (attachRow 110) up to the top (attachRow 30).
  { trunkX: 720, layer: 7, sprite: 'tree-branch-3', attachRow: 30, side: 'right' },
  { trunkX: 720, layer: 7, sprite: 'tree-branch-3', attachRow: 70, side: 'left' },
  { trunkX: 720, layer: 7, sprite: 'tree-branch-3', attachRow: 110, side: 'right' },

  // Layer 7 — Trunk Interact 2 at x3550 (16 wide, thick trunk, recolored to
  // driftwood bark: branch-3). One branch in the lower half.
  { trunkX: 3550, layer: 7, sprite: 'tree-branch-3', attachRow: 110, side: 'left' },
];

// Decorative single-knot foliage (tree-plant-2..5, see sprites/tree-plants/)
// mounted onto a subset of the trees above, excluding the Moss Tree
// (x720/layer7 — TREE_PLANT_1, the moss variety, is reserved for that
// gatekeeper trunk's puzzle, tiled by drawGateMoss() in game/render.js, and
// isn't reused decoratively here). 10 instances total across the other 4
// varieties (3/3/2/2 split): 6
// on layer 5 (the tall x1150 trunk gets two, on opposite sides; the four
// shorter layer-5 trees get one each) and 4 on layer 7 (spread across trunks
// that don't already carry a branch, so foliage doesn't stack on top of
// branches). `trunkX`/`layer` must match a TREE_PLACEMENTS entry exactly
// (same convention as BRANCH_PLACEMENTS); `attachRow` sits within the middle
// third of that trunk's height; `side` picks which edge it grows from and
// whether the sprite gets flipped (the art is drawn bark-contact-on-the-left,
// so 'left' mounts flip it).
// Cleared for a trees/layers readjustment pass — re-add placements once the
// new layout is settled.
const TREE_PLANT_PLACEMENTS = [
  // Layer 7 — Trunk Interact 2 at x3550, the rightmost tree placement.
  // Shares the left face with that trunk's existing branch-3 at attachRow
  // 110 (see BRANCH_PLACEMENTS); this foliage sits higher up the trunk.
  { trunkX: 3550, layer: 7, sprite: 'tree-plant-2', attachRow: 21, side: 'left' },
  // Layer 5 — Trunk Interact 3 at x300. Right face, very top of the trunk.
  { trunkX: 300, layer: 5, sprite: 'tree-plant-2', attachRow: 10, side: 'right' },
  // Left face, directly under the trunk's branch (tree-branch-1 at attachRow
  // 78, side 'left' — see BRANCH_PLACEMENTS), reading as growing beneath it.
  { trunkX: 300, layer: 5, sprite: 'tree-plant-2', attachRow: 90, side: 'left' },
  // Right face, lower still — below the attachRow-60 instance above. Large
  // (3x) variant so it reads clearly near the base of the trunk.
  { trunkX: 300, layer: 5, sprite: 'tree-plant-2b', attachRow: 130, side: 'right' },

  // Layer 5 — Trunk Interact 1 at x1150, the tall branch-bearing trunk (11
  // wide x151 tall, branches at attachRow 25/right, 65/left, 105/right — see
  // BRANCH_PLACEMENTS). 5 plants (3x tree-plant-2, 2x tree-plant-2b):  one at
  // the very top, and one tucked under each branch reading as growing
  // beneath it, plus an extra low on the trunk to balance. Sides alternate
  // left/right/left/right/left (3 left, 2 right) which, combined with the
  // trunk's 2-right/1-left branches, nets to 4 left / 4 right — evenly
  // weighted overall.
  { trunkX: 1150, layer: 5, sprite: 'tree-plant-2', attachRow: 5, side: 'left' },
  { trunkX: 1150, layer: 5, sprite: 'tree-plant-2b', attachRow: 35, side: 'right' },
  { trunkX: 1150, layer: 5, sprite: 'tree-plant-2', attachRow: 78, side: 'left' },
  { trunkX: 1150, layer: 5, sprite: 'tree-plant-2', attachRow: 118, side: 'right' },
  { trunkX: 1150, layer: 5, sprite: 'tree-plant-2b', attachRow: 140, side: 'left' },

  // Layer 7 — Trunk Interact 2 at x2350, the light-switch tree (branches at
  // attachRow 60/left, 100/right — see BRANCH_PLACEMENTS; switch itself at
  // attachRow 70/right). A right-side drip below the lower (right) branch,
  // a left-side drip further up the trunk clear of the left branch, and a
  // second left-side drip just below the left branch (attachRow 60) reading
  // as slime seeping out from under it.
  { trunkX: 2350, layer: 7, sprite: 'tree-plant-slime', attachRow: 125, side: 'right' },
  { trunkX: 2350, layer: 7, sprite: 'tree-plant-slime', attachRow: 25, side: 'left' },
  { trunkX: 2350, layer: 7, sprite: 'tree-plant-slime', attachRow: 82, side: 'left' },

  // Layer 7 — Trunk Interact 2 at x1580, the level's one remaining
  // branchless/foliage-free layer-7 trunk (see the comment above its
  // TREE_PLACEMENTS entry). 5 slime patches alternating sides (3 left/2
  // right) spread top to bottom of the 157-tall trunk, each >=30 rows from
  // its neighbors so the patches read as separate drips down both faces
  // rather than one continuous coating.
  { trunkX: 1580, layer: 7, sprite: 'tree-plant-slime', attachRow: 15, side: 'left' },
  { trunkX: 1580, layer: 7, sprite: 'tree-plant-slime', attachRow: 45, side: 'right' },
  { trunkX: 1580, layer: 7, sprite: 'tree-plant-slime', attachRow: 80, side: 'left' },
  { trunkX: 1580, layer: 7, sprite: 'tree-plant-slime', attachRow: 110, side: 'right' },
  { trunkX: 1580, layer: 7, sprite: 'tree-plant-slime', attachRow: 140, side: 'left' },

  // Layer 5 — Trunk Interact 3 at x2000, the second trunk-interact-3
  // placement. Oyster mushroom clusters stepping down both faces of the
  // trunk, clear of that trunk's existing branches (attachRow 30/right,
  // 70/left, 110/right — see BRANCH_PLACEMENTS).
  { trunkX: 2000, layer: 5, sprite: 'tree-plant-4', attachRow: 15, side: 'left' },
  { trunkX: 2000, layer: 5, sprite: 'tree-plant-4', attachRow: 50, side: 'right' },
  { trunkX: 2000, layer: 5, sprite: 'tree-plant-4', attachRow: 90, side: 'left' },
  { trunkX: 2000, layer: 5, sprite: 'tree-plant-4', attachRow: 130, side: 'right' },
];

// Hanging props — anchor at row 0 (top of the sprite) against LID_TOP
// instead of snapping to the floor, since they dangle from the glass lid
// rather than standing on the substrate (see sprites/lights/lightbulb.js). The
// sprite drawn here is resolved at render time (see resolveHangingSprite in
// game/world-geometry.js) — it swaps 'lightbulb' for 'lightbulb2' once state.lightOn is
// flipped, rather than needing a second placements entry.
const HANGING_PLACEMENTS = [
  { sprite: 'lightbulb', x: 150, layer: 5 },

  // Original decorative bulb between the two rightmost trees (Interact 2 at
  // x3280 and Interact 3 at x3520, both layer 7) — bait to lure the player
  // into flicking the (distant) real switch faster. Left in place even
  // though WORLD_WIDTH (game/constants.js) was later shortened to 2650,
  // pushing it (and those two trees) past the camera clamp/canvas clip and
  // out of reach — restoring the old width brings it back for free.
  { sprite: 'lightbulb3', x: 3400, layer: 5 },

  // Second decorative bulb, added for the current shortened world so a bait
  // bulb is actually reachable/visible again: sits just past the x2350
  // trunk-interact-2 (layer 7, the real light switch's tree), playing the
  // same "lure the player toward the switch" role the x3400 bulb used to,
  // comfortably inside CAMERA_X_MAX's reach (2650) with room before the
  // right wall. Also uses lightbulb-3.js (never lights up) for the same
  // reason as above — resolveHangingSprite() in game/world-geometry.js only
  // swaps sprite ids matching 'lightbulb'.
  { sprite: 'lightbulb3', x: 2500, layer: 5 },
];

// Light switch — mounted on the trunk of x2350 (Trunk Interact 2, layer 7),
// currently the last/rightmost reachable tree given WORLD_WIDTH's temporary
// 2650 shortening (see the GATE_TRUNK comment in game/world-geometry.js).
// Sits on the right face of that trunk, between its two branches (see
// BRANCH_PLACEMENTS above: attachRow 60/left, attachRow 100/right) —
// attachRow 70 sits a bit above the midpoint between them. Only reachable by
// climbing (see sprites/lights/light-switch.js for why that distance is
// deliberate). `trunkX`/`layer` must match a TREE_PLACEMENTS entry exactly
// (same convention as BRANCH_PLACEMENTS); `attachRow` is the row (0 = top of
// the trunk sprite) the switch is bolted to; `side` picks which face it's
// drawn/interacted from (see lightSwitchOrigin()/nearLightSwitch() in
// game/world-geometry.js / drawLightSwitch() in game/render.js — the sprite
// mirrors when side is 'right'). Interacting with it while side-climbing
// that trunk on the matching side (see handleInteractPress() in
// game/interactions.js) flips state.lightOn, which swaps the drawn sprite
// between light-switch.js/light-switch-2.js as well as
// lightbulb.js/lightbulb-2.js and toggles background-texture.js's
// visibility.
const LIGHT_SWITCH_PLACEMENT = { trunkX: 2350, layer: 7, attachRow: 70, side: 'right' };

// Collectible bugs (see game/interactions.js collectNearbyBug() /
// game/render.js drawBugs()), resolved by bugGeometry() in
// game/world-geometry.js. Empty for now — the bug/fly sprite has been
// pulled — so BUGS_REQUIRED (game/constants.js) is 0 and bug collection is
// trivially satisfied without affecting the completion condition.
const BUG_PLACEMENTS = [];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PLANT_PLACEMENTS,
    TREE_PLACEMENTS,
    BACKGROUND_PLACEMENTS,
    BACKGROUND_LAYER3_PLACEMENTS,
    BRANCH_PLACEMENTS,
    TREE_PLANT_PLACEMENTS,
    HANGING_PLACEMENTS,
    LIGHT_SWITCH_PLACEMENT,
    BUG_PLACEMENTS,
  };
}
