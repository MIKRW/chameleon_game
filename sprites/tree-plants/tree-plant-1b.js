// === Tree Plant 1b - Gate Moss Remnant ===
// Theme: same red lichen-moss as TREE_PLANT_1 (Gate Moss), but a much
// shorter clump — a leftover scrap rather than a full climbing strip.
//
// Left behind on the Moss Tree trunk once state.gateSolved flips and the
// full moss (TREE_PLANT_1) is removed — see drawGateMossRemnant() in
// game/render.js, which places one or two of these at fixed spots instead
// of tiling top-to-bottom the way the solved puzzle's moss did.
// Size: 8x3 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_1B = {
  name: 'Tree Plant 1b - Gate Moss Remnant',
  theme: 'small leftover scrap of red lichen-moss clinging to a trunk',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: false, // decoration only — the puzzle is already solved
    placement: "trunk-run",
    animated: false,
    mounts_to: "tree-trunk",
    tileable: false,
  },
  width: 8,
  height: 3,
  rows: [
    '.....ZZZ',
    '....Zzzz',
    '...Zz...',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_1B;
