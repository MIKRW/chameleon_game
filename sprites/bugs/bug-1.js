// === Bug 1 - Fly ===
// Theme: small collectible critter, pressed E on to catch it
//
// A little black fly (styled after the small black flies common in
// Australia): a matte black oval body with a single small pale marking,
// and a pair of narrow pale grey/white wings that sweep off the long
// top edge of the body at an angle rather than off its front/back tips.
// Sized up from the original beetle design so it's legible at a glance
// while still small relative to the player (see PLAYER_W/PLAYER_H in
// game/constants.js). Placed by BUG_PLACEMENTS (world-props.js) — some sit
// in the open from the start, others are mounted on a trunk's side, and the
// right-hand-face ones sit past the yellow slime coating
// (tree-plant-slime.js) that blocks that side until the trunk-side-swap
// skill (puzzle 3) is found. Catching one requires pressing E while
// overlapping it (see collectNearbyBug() in game/interactions.js) rather
// than just walking through it, so a passing jump doesn't auto-collect it.
// Size: 12x8 (grid units; multiply by SCALE, see sprites/README.md)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const BUG_1 = {
  name: 'Bug 1 - Fly',
  theme: 'small collectible critter',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor-or-trunk",
    animated: false
  },
  width: 12,
  height: 8,
  rows: [
    '.S........S.',
    '..S......S..',
    '...S....S...',
    '..kkkkkkkk..',
    '..kIIIIIIk..',
    '..kIOIIIIk..',
    '..kIIIIIIk..',
    '...kkkkkk...',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = BUG_1;
