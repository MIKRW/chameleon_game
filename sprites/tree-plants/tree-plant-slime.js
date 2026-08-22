// === Tree Plant Slime - Trunk Coating ===
// Theme: dull olive-yellow slime, tiled down both edges of every layer-8
// trunk (see TREE_PLACEMENTS in world-props.js) as purely decorative
// coating — not gated by Cling to Sides or any other puzzle state. Uses its
// own muted K/W/X keys (see TERRARIUM_PALETTE) rather than the bright
// ground-plant-2 y/Y, so it reads as a sickly coating instead of a
// saturated accent. Drawn by drawTrunkSlime() in game/render.js, tiled the
// same way drawGateMoss() tiles TREE_PLANT_1 down the Moss Tree trunk.
// A skinny single-cell drip core (with an occasional adjacent highlight/
// shade accent, never a full second core column) that zig-zags left/right
// a cell at a time down the tile instead of running dead-straight, so the
// tiled column reads as a thin, rippling trickle rather than a solid bar.
// Fully-open rows per tile keep the drip reading as irregular rather than
// continuous.
// Size: 4x14 (grid units; multiply by SCALE, see sprites/README.md)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_SLIME = {
  name: 'Tree Plant Slime - Trunk Coating',
  theme: 'dull olive-yellow decorative slime coating both edges of a trunk',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "trunk-tile",
    animated: false
  },
  width: 4,
  height: 14,
  rows: [
    '.K..',
    '.KW.',
    '.KX.',
    '..K.',
    '..W.',
    '..K.',
    '.K..',
    '....',
    '....',
    '..K.',
    '.KX.',
    '.KW.',
    '..K.',
    '....'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_SLIME;
