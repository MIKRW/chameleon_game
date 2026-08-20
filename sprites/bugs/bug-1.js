// === Bug 1 - Beetle ===
// Theme: small collectible critter, walked over to "eat" it
//
// A tiny round beetle with two side legs and two eye-spots. Deliberately
// small relative to the player (see PLAYER_W/PLAYER_H in game/constants.js)
// so it reads as a bug, not another plant. Placed by BUG_PLACEMENTS
// (world-props.js) — some sit in the open from the start, others are mounted
// on the right-hand face of a trunk, past the yellow slime coating
// (tree-plant-slime.js) that blocks that side until the trunk-side-swap
// skill (puzzle 3) is found. See BUG_GEOMETRIES/bugRect in
// game/world-geometry.js and updateBugs()/drawBugs() in
// game/interactions.js/game/render.js.
// Size: 8x5 (grid units; multiply by SCALE, see sprites/README.md)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const BUG_1 = {
  name: 'Bug 1 - Beetle',
  theme: 'small collectible critter',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor-or-trunk",
    animated: false
  },
  width: 8,
  height: 5,
  rows: [
    '..k..k..',
    '.kIIIIk.',
    'kIOIIOIk',
    '.kIIIIk.',
    '..k..k..'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = BUG_1;
