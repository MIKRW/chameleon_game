// === Tree Plant 3 - Bracket Fungus ===
// Theme: flat shelf fungus jutting from the bark
//
// Reuses bark palette entries ('r'/'R'/'h') instead of leaf greens so it
// reads as fungus rather than foliage — good for breaking up rows of plant
// variants with a non-leafy accent.
// Size: 8x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_PLANT_3 = {
  name: 'Tree Plant 3 - Bracket Fungus',
  theme: 'trunk-mounted growth, flat shelf fungus',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right"
  },
  width: 8,
  height: 8,
  rows: [
    '........',
    '........',
    '........',
    'kRRrr...',
    'kRhhhh..',
    'kRrrrr..',
    '........',
    '........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_3;
