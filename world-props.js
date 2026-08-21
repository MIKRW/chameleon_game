// World prop placement — where each terrarium sprite instance sits, laid out
// against the 8-layer scene stack (see game/render.js header comment):
//   1 background, 2 background texture, 3 background decor (cosmetic only —
//   no floor placement/occlusion logic, painted before everything else),
//   4 far plants (behind player), 5 player, 6 near plants (in front of
//   player), 7 glass edges, 8 glass front.
//
// BACKGROUND_PLACEMENTS (layer 3) is for scenery only — it never occludes or
// interacts with the player, unlike the layer-4/6 far/near plant passes.
//
// `layer` (4 or 6) picks the coarse pass — behind or in front of the player.
// `z` is OPTIONAL and only needed to override the default stacking order.
// Within a layer, instances paint in array order (a stable sort falls back
// to insertion order when z is omitted/equal) — so appending an entry
// already puts it on top of everything earlier in the list without having
// to think about a number. Only add an explicit z when you need something
// to sit out of that natural order (e.g. an entry added later that should
// actually sit *behind* an earlier one). Higher z paints later == on top.
//
// `z` is independent of a sprite's fore/back name (e.g. tree-trunk-fore-*
// vs tree-trunk-back-*, see sprites/README.md) — that naming is purely a
// visual treatment (bark saturation) and doesn't imply which layer or z an
// instance has to use.
//
// Ground props only need an x (world-space); y snaps to the floor line at
// render time. Tree props snap to the floor the same way.

const PLANT_PLACEMENTS = [
  { sprite: 'ground-plant-1', x: 14, layer: 4 },
  { sprite: 'ground-plant-1', x: 150, layer: 4 },
  { sprite: 'ground-plant-1', x: 270, layer: 4 },
  { sprite: 'ground-plant-1', x: 500, layer: 4 },
  { sprite: 'ground-plant-1', x: 600, layer: 4 },
  { sprite: 'ground-plant-1', x: 700, layer: 4 },
  { sprite: 'ground-plant-1', x: 1290, layer: 4 },
  { sprite: 'ground-plant-1', x: 3000, layer: 4 },
  { sprite: 'ground-plant-2', x: 550, layer: 4 },
  { sprite: 'ground-plant-2', x: 650, layer: 4 },
  { sprite: 'ground-plant-2', x: 800, layer: 4 },
  { sprite: 'ground-plant-2', x: 2000, layer: 4 },
  { sprite: 'ground-plant-2', x: 2050, layer: 4 },
  { sprite: 'ground-plant-2', x: 2500, layer: 4 },
  { sprite: 'ground-plant-2', x: 3200, layer: 4 },
  { sprite: 'ground-plant-2', x: 3300, layer: 4 },
  { sprite: 'ground-plant-2', x: 3350, layer: 4 },
  { sprite: 'ground-plant-3', x: 950, layer: 4 },
  { sprite: 'ground-plant-4', x: 1650, layer: 4 },
  { sprite: 'ground-plant-5', x: 2250, layer: 4 },

  // Auto-filled scatter across the remaining empty floor gaps (see chat) —
  // a first pass for floor density, adjust/remove freely.
  { sprite: 'ground-plant-3', x: 230, layer: 4 },
  { sprite: 'ground-plant-5', x: 350, layer: 4 },
  { sprite: 'ground-plant-2', x: 420, layer: 4 },
  { sprite: 'ground-plant-3', x: 860, layer: 4 },
  { sprite: 'ground-plant-5', x: 910, layer: 4 },
  { sprite: 'ground-plant-2', x: 1030, layer: 4 },
  { sprite: 'ground-plant-4', x: 1100, layer: 4 },
  { sprite: 'ground-plant-5', x: 1170, layer: 4 },
  { sprite: 'ground-plant-3', x: 1240, layer: 4 },
  { sprite: 'ground-plant-2', x: 1360, layer: 4 },
  { sprite: 'ground-plant-5', x: 1420, layer: 4 },
  { sprite: 'ground-plant-3', x: 1480, layer: 4 },
  { sprite: 'ground-plant-4', x: 1540, layer: 4 },
  { sprite: 'ground-plant-2', x: 1600, layer: 4 },
  { sprite: 'ground-plant-3', x: 1720, layer: 4 },
  { sprite: 'ground-plant-5', x: 1780, layer: 4 },
  { sprite: 'ground-plant-2', x: 1840, layer: 4 },
  { sprite: 'ground-plant-4', x: 1900, layer: 4 },
  { sprite: 'ground-plant-3', x: 1960, layer: 4 },
  { sprite: 'ground-plant-5', x: 2100, layer: 4 },
  { sprite: 'ground-plant-2', x: 2150, layer: 4 },
  { sprite: 'ground-plant-4', x: 2200, layer: 4 },
  { sprite: 'ground-plant-2', x: 2320, layer: 4 },
  { sprite: 'ground-plant-4', x: 2380, layer: 4 },
  { sprite: 'ground-plant-3', x: 2440, layer: 4 },
  { sprite: 'ground-plant-2', x: 2560, layer: 4 },
  { sprite: 'ground-plant-5', x: 2620, layer: 4 },
  { sprite: 'ground-plant-1', x: 2680, layer: 4 },
  { sprite: 'ground-plant-3', x: 2760, layer: 4 },
  { sprite: 'ground-plant-4', x: 2820, layer: 4 },
  { sprite: 'ground-plant-2', x: 2880, layer: 4 },
  { sprite: 'ground-plant-5', x: 2940, layer: 4 },
  { sprite: 'ground-plant-2', x: 3060, layer: 4 },
  { sprite: 'ground-plant-4', x: 3120, layer: 4 },
  { sprite: 'ground-plant-3', x: 3170, layer: 4 },
  { sprite: 'ground-plant-2', x: 3400, layer: 4 },
  { sprite: 'ground-plant-5', x: 3450, layer: 4 },
  { sprite: 'ground-plant-3', x: 3500, layer: 4 },
  { sprite: 'ground-plant-4', x: 3550, layer: 4 },

  // Large ground-plant-1 backdrop leaves through the right-hand stretches
  // that were only short plants (roughly x1900-2680 and x3060-3570).
  // z: -1 so they paint before (and sit behind) everything else here.
  { sprite: 'ground-plant-1', x: 1950, layer: 4, z: -1 },
  { sprite: 'ground-plant-1', x: 2150, layer: 4, z: -1 },
  { sprite: 'ground-plant-1', x: 2350, layer: 4, z: -1 },
  { sprite: 'ground-plant-1', x: 2550, layer: 4, z: -1 },
  { sprite: 'ground-plant-1', x: 2750, layer: 4, z: -1 },
  { sprite: 'ground-plant-1', x: 2950, layer: 4, z: -1 },
  { sprite: 'ground-plant-1', x: 3150, layer: 4, z: -1 },
  { sprite: 'ground-plant-1', x: 3450, layer: 4, z: -1 },
];

// Purely cosmetic background scenery — furthest back, painted before the
// far-plants layer, never occluding or interacting with the player.
// Scattered across all 5 tree-trunk-back-* silhouettes at varied x
// positions and heights (see sprites/tree-trunk-backs/tree-trunk-back-*.js) so the backdrop
// doesn't read as one repeated trunk. Back 1 is the widest/tallest (runs
// floor-to-lid); Back 2/4/5 are mid-height; Back 3 is the shortest, still
// clearing the 1/3-window-height floor.
const BACKGROUND_PLACEMENTS = [
  { sprite: 'tree-trunk-back-3', x: 150, layer: 3 },
  { sprite: 'tree-trunk-back-5', x: 480, layer: 3 },
  { sprite: 'tree-trunk-back-1', x: 800, layer: 3 },
  { sprite: 'tree-trunk-back-4', x: 1050, layer: 3 },
  { sprite: 'tree-trunk-back-2', x: 1400, layer: 3 },
  { sprite: 'tree-trunk-back-1', x: 1700, layer: 3 },
  { sprite: 'tree-trunk-back-5', x: 2000, layer: 3 },
  { sprite: 'tree-trunk-back-3', x: 2300, layer: 3 },
  { sprite: 'tree-trunk-back-4', x: 2600, layer: 3 },
  { sprite: 'tree-trunk-back-2', x: 2900, layer: 3 },
  { sprite: 'tree-trunk-back-1', x: 3200, layer: 3 },
  { sprite: 'tree-trunk-back-5', x: 3450, layer: 3 },
];

const TREE_PLACEMENTS = [
  { sprite: 'tree-trunk-fore-3', x: 550, layer: 6 },

  // Tree Trunk Fore 2 (thick) instances, scattered in front of the player
  // (layer 6), kept well clear of the trunks above.
  { sprite: 'tree-trunk-fore-2', x: 1080, layer: 6 },
  { sprite: 'tree-trunk-fore-2', x: 1540, layer: 6 },
  { sprite: 'tree-trunk-fore-2', x: 2020, layer: 6 },
  { sprite: 'tree-trunk-fore-2', x: 2610, layer: 6 },
  { sprite: 'tree-trunk-fore-2', x: 3280, layer: 6 },

  // Two extra Tree Trunk Fore 3 (knotted, now 11 wide x 151 tall) instances
  // on layer 6, dropped into open floor gaps that clear every other trunk's
  // footprint on every layer (checked against BACKGROUND_PLACEMENTS'
  // layer-3 silhouettes too, so nothing here lines up in front of a back
  // trunk either): x320 sits between Fore 1 (200-244) and Back 5 (480-512);
  // x930 sits between Back 1 (800-848) and Back 4 (1050-1082).
  { sprite: 'tree-trunk-fore-3', x: 320, layer: 6 },
  { sprite: 'tree-trunk-fore-3', x: 930, layer: 6 },

  // Extra layer-4 trunks (behind the player): one more Fore 1 (11 wide),
  // two Fore 4 (curved lean, 8 wide), and two Fore 5 (forked, 8 wide).
  // Checked against every existing trunk on layers 3/4/6 for clearance:
  // x1150 sits between Fore 2 (1080-1096) and Back 2 (1400-1405);
  // x1250 sits in that same gap, clear of the new Fore 1 above;
  // x1750 sits between Back 1 (1700-1712) and Back 5 (2000-2008);
  // x1850 sits in that same gap, clear of Fore 4 above;
  // x2150 sits between Fore 2 (2020-2036) and Back 3 (2300-2305).
  { sprite: 'tree-trunk-fore-1', x: 1150, layer: 4 },
  { sprite: 'tree-trunk-fore-4', x: 1250, layer: 4 },
  { sprite: 'tree-trunk-fore-4', x: 1750, layer: 4 },
  { sprite: 'tree-trunk-fore-5', x: 1850, layer: 4 },
  { sprite: 'tree-trunk-fore-5', x: 2150, layer: 4 },

  // One more Fore 3 on the right-hand side of the terrarium (layer 6):
  // x3520 clears Back 5's last instance (3450-3482) and Fore 2's last
  // instance (3280-3344), and stays inside the glass wall (world width
  // 3600, 16px glass thickness, so usable floor ends at x3584).
  { sprite: 'tree-trunk-fore-3', x: 3520, layer: 6 },
];

// Branches mounted onto a subset of the trees above (see sprites/tree-branches/tree-branch-1.js
// / tree-branch-2.js) — kept sparse so the scene doesn't read as cluttered:
// only 1 of the 5 layer-4 trees (25%, max 3 branches) and 4 of the 9 layer-6
// trees (~44%, max 4 branches) get them. Each entry's `trunkX` + `layer` must
// match a TREE_PLACEMENTS entry exactly (that's how drawTreeBranches in
// game/render.js finds the trunk to hang off). `attachRow` is the row (0 = top of
// the trunk sprite, counting down toward the floor) where the branch's base
// touches the bark; `side` picks which edge it grows from and whether the
// branch-1/2 sprite gets flipped. Branches on the same trunk alternate sides
// and stay >=30 rows apart so they can't touch each other, and every chosen
// trunk is >=380px from any other chosen layer-4/6 trunk so no branch's
// ~40-64px reach crosses into a neighboring tree's branches. That clearance
// is only checked against other layer-4/6 branch trunks — layer 3
// (BACKGROUND_PLACEMENTS) is purely cosmetic scenery with no occlusion or
// interaction logic (see the comment above BACKGROUND_PLACEMENTS), so a
// layer-4/6 branch is free to visually run in front of a layer-3 trunk
// without that being a bug.
const BRANCH_PLACEMENTS = [
  // Layer 4 — Tree Trunk Fore 1 at x1150 (11 wide x151 tall), the only
  // layer-4 tree with room for a full branch, using the longer branch-2.
  { trunkX: 1150, layer: 4, sprite: 'tree-branch-2', attachRow: 25, side: 'right' },
  { trunkX: 1150, layer: 4, sprite: 'tree-branch-2', attachRow: 65, side: 'left' },
  { trunkX: 1150, layer: 4, sprite: 'tree-branch-2', attachRow: 105, side: 'right' },

  // Layer 6 — Tree Trunk Fore 3 at x550 (11 wide, knotted/narrow: branch-1).
  { trunkX: 550, layer: 6, sprite: 'tree-branch-1', attachRow: 35, side: 'right' },
  { trunkX: 550, layer: 6, sprite: 'tree-branch-1', attachRow: 90, side: 'left' },

  // Layer 6 — Tree Trunk Fore 2 at x1540 (16 wide, thick trunk: branch-2, max 4).
  { trunkX: 1540, layer: 6, sprite: 'tree-branch-2', attachRow: 20, side: 'right' },
  { trunkX: 1540, layer: 6, sprite: 'tree-branch-2', attachRow: 55, side: 'left' },
  { trunkX: 1540, layer: 6, sprite: 'tree-branch-2', attachRow: 90, side: 'right' },
  { trunkX: 1540, layer: 6, sprite: 'tree-branch-2', attachRow: 125, side: 'left' },

  // Layer 6 — Tree Trunk Fore 2 at x2610 (thick trunk: branch-2).
  { trunkX: 2610, layer: 6, sprite: 'tree-branch-2', attachRow: 30, side: 'left' },
  { trunkX: 2610, layer: 6, sprite: 'tree-branch-2', attachRow: 70, side: 'right' },
  { trunkX: 2610, layer: 6, sprite: 'tree-branch-2', attachRow: 110, side: 'left' },

  // Layer 6 — Tree Trunk Fore 3 at x3520 (narrow trunk: branch-1).
  { trunkX: 3520, layer: 6, sprite: 'tree-branch-1', attachRow: 40, side: 'right' },
  { trunkX: 3520, layer: 6, sprite: 'tree-branch-1', attachRow: 95, side: 'left' },
];

// Decorative single-knot foliage (tree-plant-2..5, see sprites/tree-plants/)
// mounted onto a subset of the trees above, excluding the gatekeeper trunk
// (x550/layer6 — TREE_PLANT_1, the moss variety, is reserved for that trunk's
// puzzle, tiled by drawGateMoss() in game/render.js, and isn't reused decoratively
// here). 10 instances total across the other 4 varieties (3/3/2/2 split): 6
// on layer 4 (the tall x1150 trunk gets two, on opposite sides; the four
// shorter layer-4 trees get one each) and 4 on layer 6 (spread across trunks
// that don't already carry a branch, so foliage doesn't stack on top of
// branches). `trunkX`/`layer` must match a TREE_PLACEMENTS entry exactly
// (same convention as BRANCH_PLACEMENTS); `attachRow` sits within the middle
// third of that trunk's height; `side` picks which edge it grows from and
// whether the sprite gets flipped (the art is drawn bark-contact-on-the-left,
// so 'left' mounts flip it).
const TREE_PLANT_PLACEMENTS = [
  // Layer 4 — Tree Trunk Fore 1 at x1150 (151 tall), the only layer-4 tree
  // tall enough for two plants; rows kept clear of its branches (25/65/105).
  { trunkX: 1150, layer: 4, sprite: 'tree-plant-2', attachRow: 55, side: 'left' },
  { trunkX: 1150, layer: 4, sprite: 'tree-plant-3', attachRow: 95, side: 'right' },

  // Layer 4 — the four Fore 4/5 trees (75 tall, half the terrarium's floor-
  // to-lid span — see tree-trunk-fore-4.js/tree-trunk-fore-5.js), one plant
  // each, alternating sides, row 35 (middle third of 75 is rows 25-50).
  { trunkX: 1250, layer: 4, sprite: 'tree-plant-4', attachRow: 35, side: 'right' },
  { trunkX: 1750, layer: 4, sprite: 'tree-plant-5', attachRow: 35, side: 'left' },
  { trunkX: 1850, layer: 4, sprite: 'tree-plant-3', attachRow: 35, side: 'right' },
  { trunkX: 2150, layer: 4, sprite: 'tree-plant-2', attachRow: 35, side: 'left' },

  // Layer 6 — four trees without branches, one plant each, alternating sides.
  { trunkX: 320, layer: 6, sprite: 'tree-plant-3', attachRow: 60, side: 'right' },
  { trunkX: 1080, layer: 6, sprite: 'tree-plant-4', attachRow: 75, side: 'left' },
  { trunkX: 2020, layer: 6, sprite: 'tree-plant-5', attachRow: 60, side: 'right' },
  { trunkX: 3280, layer: 6, sprite: 'tree-plant-4', attachRow: 75, side: 'left' },
];

// Hanging props — anchor at row 0 (top of the sprite) against LID_TOP
// instead of snapping to the floor, since they dangle from the glass lid
// rather than standing on the substrate (see sprites/lights/lightbulb.js). The
// sprite drawn here is resolved at render time (see resolveHangingSprite in
// game/world-geometry.js) — it swaps 'lightbulb' for 'lightbulb2' once state.lightOn is
// flipped, rather than needing a second placements entry.
const HANGING_PLACEMENTS = [
  { sprite: 'lightbulb', x: 150, layer: 4 },

  // Second, purely decorative bulb between the two rightmost trees (Fore 2
  // at x3280 and Fore 3 at x3520, both layer 6) — bait to lure the player
  // into flicking the (distant) real switch faster. Uses lightbulb-3.js, a
  // pixel-identical copy of the off-state lightbulb.js art under its own
  // sprite id, so resolveHangingSprite() in game/world-geometry.js (which only swaps ids
  // matching 'lightbulb') never lights it up. Kept on layer 4, same as the
  // real bulb, so it shares its depth/tint treatment; drawBackgroundTexture()'s
  // HANGING_PLACEMENTS.find(sprite === 'lightbulb') still resolves to the
  // x150 bulb since this entry uses a different sprite id.
  { sprite: 'lightbulb3', x: 3400, layer: 4 },
];

// Light switch — mounted on the trunk, near the top, of the second tree from
// the far right (Tree Trunk Fore 2 at x3280, layer 6 — see TREE_PLACEMENTS
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
const LIGHT_SWITCH_PLACEMENT = { trunkX: 3280, layer: 6, attachRow: 15, side: 'left' };

// Collectible bugs (see game/interactions.js collectNearbyBug() /
// game/render.js drawBugs()) — 15 total, sized to the 3600px world (WORLD_WIDTH, see
// game/constants.js). Three placement modes, all resolved by bugGeometry()
// in game/world-geometry.js:
//   `ground` — snaps to the floor at `x`, like PLANT_PLACEMENTS. The 4 here
//     sit right on top of an existing ground-plant cluster (see
//     PLANT_PLACEMENTS above) so they read as hiding in the foliage rather
//     than sitting bare on open floor.
//   `trunk` — mounts onto a trunk's side at `attachRow`, same convention as
//     TREE_PLANT_PLACEMENTS (`trunkX`/`layer` must match a TREE_PLACEMENTS
//     entry exactly, `attachRow` picked clear of that trunk's existing
//     branch/tree-plant rows). `side: 'right'` sits behind the yellow slime
//     coating (tree-plant-slime.js) that blocks that face until the
//     trunk-side-swap skill (puzzle 3) is unlocked (see
//     attachToTrunk()/passBranchAlongTrunk() in game/movement.js); `side:
//     'left'` needs no skill at all, just ordinary climbing. Three of the
//     seven right-side bugs sit on trunks the puzzles already teach players
//     to side-climb on the left (GATE_TRUNK, CODE_TRUNK,
//     LIGHT_SWITCH_TRUNK — see game/world-geometry.js), so the slime hiding
//     them is a visible clue there's more to find.
//   `air` — floats at a fixed `x`/`heightAboveFloor` in an open gap between
//     trees, no prop underneath, reachable with a plain standing jump (the
//     2 here sit at 80px, comfortably under a jump's ~103px apex — see
//     JUMP_VELOCITY/GRAVITY in game/constants.js) — the "jump tree to tree
//     through open space" traversal already used to cross between trunks.
const BUG_PLACEMENTS = [
  { mode: 'ground', sprite: 'bug-1', x: 270, layer: 4 }, // beside ground-plant-1 (270) / ground-plant-3 (230)
  { mode: 'ground', sprite: 'bug-1', x: 910, layer: 4 }, // beside ground-plant-5 (910) / ground-plant-3 (860)
  { mode: 'ground', sprite: 'bug-1', x: 1600, layer: 4 }, // beside ground-plant-2 (1600), between the 1480/1720 plant-3 cluster
  { mode: 'ground', sprite: 'bug-1', x: 2380, layer: 4 }, // beside ground-plant-4 (2380/2200) / ground-plant-3 (2440)
  { mode: 'trunk', sprite: 'bug-1', trunkX: 2020, layer: 6, side: 'left', attachRow: 30 },
  { mode: 'trunk', sprite: 'bug-1', trunkX: 3520, layer: 6, side: 'left', attachRow: 65 },
  { mode: 'air', sprite: 'bug-1', x: 1350, layer: 6, heightAboveFloor: 80 }, // open gap between the x1080 and x1540 trunks
  { mode: 'air', sprite: 'bug-1', x: 2850, layer: 6, heightAboveFloor: 80 }, // open gap between the x2610 and x3280 trunks
  { mode: 'trunk', sprite: 'bug-1', trunkX: 320, layer: 6, side: 'right', attachRow: 20 },
  { mode: 'trunk', sprite: 'bug-1', trunkX: 550, layer: 6, side: 'right', attachRow: 70 },
  { mode: 'trunk', sprite: 'bug-1', trunkX: 930, layer: 6, side: 'right', attachRow: 40 },
  { mode: 'trunk', sprite: 'bug-1', trunkX: 1080, layer: 6, side: 'right', attachRow: 50 },
  { mode: 'trunk', sprite: 'bug-1', trunkX: 2020, layer: 6, side: 'right', attachRow: 20 },
  { mode: 'trunk', sprite: 'bug-1', trunkX: 2610, layer: 6, side: 'right', attachRow: 90 },
  { mode: 'trunk', sprite: 'bug-1', trunkX: 3280, layer: 6, side: 'right', attachRow: 30 },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PLANT_PLACEMENTS,
    TREE_PLACEMENTS,
    BACKGROUND_PLACEMENTS,
    BRANCH_PLACEMENTS,
    TREE_PLANT_PLACEMENTS,
    HANGING_PLACEMENTS,
    LIGHT_SWITCH_PLACEMENT,
    BUG_PLACEMENTS,
  };
}
