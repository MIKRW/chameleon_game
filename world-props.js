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
const PLANT_PLACEMENTS = [];

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
const BACKGROUND_PLACEMENTS = [
  { sprite: 'trunk-bg-3a', x: 78, layer: 2 },
  { sprite: 'trunk-bg-5a', x: 249, layer: 2 },
  { sprite: 'trunk-bg-1a', x: 416, layer: 2 },
  { sprite: 'trunk-bg-4a', x: 546, layer: 2 },
  { sprite: 'trunk-bg-2a', x: 728, layer: 2 },
  { sprite: 'trunk-bg-1a', x: 884, layer: 2 },
  { sprite: 'trunk-bg-5a', x: 1040, layer: 2 },
  { sprite: 'trunk-bg-3a', x: 1196, layer: 2 },
  { sprite: 'trunk-bg-1a', x: 1664, layer: 2 },
  { sprite: 'trunk-bg-5a', x: 1794, layer: 2 },

  // Moved off TREE_PLACEMENTS (was layer 5) — these were the shorter,
  // half-height, vivid-bark BG 4b/5b trunks with the layer-5 fade+darkened-
  // bark treatment; now purely cosmetic background decor, no climb/interaction.
  { sprite: 'trunk-bg-4b', x: 650, layer: 2 },
  { sprite: 'trunk-bg-4b', x: 910, layer: 2 },
  { sprite: 'trunk-bg-5b', x: 962, layer: 2 },
  { sprite: 'trunk-bg-5b', x: 1118, layer: 2 },

  // BG 6a — the feature tree: a dramatic diagonal sweep from the floor,
  // crossing most of the terrarium's width and hooking back near the crown,
  // with three baked-in branches (130 wide x 151 tall). Moved here rather
  // than TREE_PLACEMENTS specifically so it's *not* climbable — findClimbableTrunk()
  // (game/movement.js) treats every TREE_PLACEMENTS entry as climbable
  // regardless of its sprite's own behavior.collision flag, so a prop this
  // size needs to live in the cosmetic-only layer-2 pass to actually stay
  // non-interactive. Near-black driftwood bark (see sprites/tree-trunks-bg/trunk-bg-6a.js)
  // plus the blocky/faded background render treatment reads as a big,
  // shadowed form looming behind the interactive trees. Kept exclusive to
  // layer 2 (not reused on layer 3) so it stays a one-off landmark.
  { sprite: 'trunk-bg-6a', x: 1430, layer: 2 },
];

// Second cosmetic background band, painted between layer 2 and the dirt/
// glass line (see draw() in game/render.js) — same trunk-bg-*a/*b variety
// as BACKGROUND_PLACEMENTS above (layer 6a excluded, kept a layer-2-only
// landmark), just different x positions and a step up the depth-layer
// saturation ladder (TERRARIUM_PALETTE_LAYER3_TREES, game/constants.js).
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
  { sprite: 'trunk-bg-4b', x: 1128, layer: 3 },
  { sprite: 'trunk-bg-1a', x: 1310, layer: 3 },
  { sprite: 'trunk-bg-2a', x: 1516, layer: 3 },
  { sprite: 'trunk-bg-5b', x: 1722, layer: 3 },
  { sprite: 'trunk-bg-4a', x: 1935, layer: 3 },
  // Moved from BACKGROUND_PLACEMENTS (layer 2, x:1508) — was crossing
  // directly through BG 6a's diagonal sweep, reading as a green trunk
  // cutting through it rather than sitting behind it. x re-scaled for this
  // layer's faster 0.55 parallax (was x:1508 at 0.4) to land in roughly the
  // same on-screen neighborhood.
  { sprite: 'trunk-bg-2a', x: 2074, layer: 3 },
  { sprite: 'trunk-bg-3a', x: 2149, layer: 3 },
];

const TREE_PLACEMENTS = [
  { sprite: 'trunk-interact-3', x: 550, layer: 7 },

  // Trunk Interact 2 (thick) instances, scattered in front of the player
  // (layer 7), kept well clear of the trunks above.
  { sprite: 'trunk-interact-2', x: 1080, layer: 7 },
  { sprite: 'trunk-interact-2', x: 1540, layer: 7 },
  { sprite: 'trunk-interact-2', x: 2020, layer: 7 },
  { sprite: 'trunk-interact-2', x: 2610, layer: 7 },
  { sprite: 'trunk-interact-2', x: 3280, layer: 7 },

  // Two extra Trunk Interact 3 (knotted, now 11 wide x 151 tall) instances
  // on layer 7, dropped into open floor gaps that clear every other trunk's
  // footprint on every layer (checked against BACKGROUND_PLACEMENTS'
  // layer-2 silhouettes too, so nothing here lines up in front of a bg
  // trunk either): x320 sits between Interact 1 (200-244) and BG 5a (480-512);
  // x930 sits between BG 1a (800-848) and BG 4a (1050-1082).
  { sprite: 'trunk-interact-3', x: 320, layer: 7 },
  { sprite: 'trunk-interact-3', x: 930, layer: 7 },

  // Extra layer-5 trunk (behind the player): one more Trunk Interact 1 (11 wide).
  // Checked against every existing trunk on layers 2/5/7 for clearance:
  // x1150 sits between Interact 2 (1080-1096) and BG 2a (1400-1405).
  // (The BG 4b/5b trunks that used to sit alongside this one at
  // 1250/1750/1850/2150 have moved to BACKGROUND_PLACEMENTS, layer 2 —
  // background decor only, not climbable.)
  { sprite: 'trunk-interact-1', x: 1150, layer: 5 },

  // One more Trunk Interact 3 on the right-hand side of the terrarium (layer 7):
  // x3520 clears BG 5a's last instance (3450-3482) and Interact 2's last
  // instance (3280-3344), and stays inside the glass wall (world width
  // 3600, 16px glass thickness, so usable floor ends at x3584).
  { sprite: 'trunk-interact-3', x: 3520, layer: 7 },
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
];

// Decorative single-knot foliage (tree-plant-2..5, see sprites/tree-plants/)
// mounted onto a subset of the trees above, excluding the gatekeeper trunk
// (x550/layer7 — TREE_PLANT_1, the moss variety, is reserved for that trunk's
// puzzle, tiled by drawGateMoss() in game/render.js, and isn't reused decoratively
// here). 10 instances total across the other 4 varieties (3/3/2/2 split): 6
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
const TREE_PLANT_PLACEMENTS = [];

// Hanging props — anchor at row 0 (top of the sprite) against LID_TOP
// instead of snapping to the floor, since they dangle from the glass lid
// rather than standing on the substrate (see sprites/lights/lightbulb.js). The
// sprite drawn here is resolved at render time (see resolveHangingSprite in
// game/world-geometry.js) — it swaps 'lightbulb' for 'lightbulb2' once state.lightOn is
// flipped, rather than needing a second placements entry.
const HANGING_PLACEMENTS = [
  { sprite: 'lightbulb', x: 150, layer: 5 },

  // Second, purely decorative bulb between the two rightmost trees (Interact 2
  // at x3280 and Interact 3 at x3520, both layer 7) — bait to lure the player
  // into flicking the (distant) real switch faster. Uses lightbulb-3.js, a
  // pixel-identical copy of the off-state lightbulb.js art under its own
  // sprite id, so resolveHangingSprite() in game/world-geometry.js (which only swaps ids
  // matching 'lightbulb') never lights it up. Kept on layer 5, same as the
  // real bulb, so it shares its depth/tint treatment; drawBackgroundTexture()'s
  // HANGING_PLACEMENTS.find(sprite === 'lightbulb') still resolves to the
  // x150 bulb since this entry uses a different sprite id.
  { sprite: 'lightbulb3', x: 3400, layer: 5 },
];

// Light switch — mounted on the trunk, near the top, of the second tree from
// the far right (Trunk Interact 2 at x3280, layer 7 — see TREE_PLACEMENTS
// above; the rightmost tree is x3520), on the left face of that trunk. Far
// from the lightbulb/background-texture cluster near x150, and only
// reachable by climbing (see sprites/lights/light-switch.js for why that distance
// is deliberate). `trunkX`/`layer` must match a TREE_PLACEMENTS entry
// exactly (same convention as BRANCH_PLACEMENTS); `attachRow` is the row
// (0 = top of the trunk sprite) the switch is bolted to; `side` must be
// 'left' since that's the face it's drawn/interacted from (see
// nearLightSwitch() in game/world-geometry.js / drawLightSwitch() in
// game/render.js). Interacting with it while side-climbing that trunk on
// the left (see handleInteractPress() in game/interactions.js) flips
// state.lightOn, which swaps the drawn sprite between
// light-switch.js/light-switch-2.js as well as lightbulb.js/lightbulb-2.js
// and toggles background-texture.js's visibility.
const LIGHT_SWITCH_PLACEMENT = { trunkX: 3280, layer: 7, attachRow: 15, side: 'left' };

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
