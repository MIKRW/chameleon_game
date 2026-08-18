// === Tree Plant 4 - Orchid Bloom ===
// Theme: small flower cluster rooted on the bark
//
// Uses 'n'/'N' (vine/accent green) for the bloom cluster, same convention as
// ground-plant-4's flower accent, so the two read as related plant families.
// Size: 8x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_PLANT_4 = {
  name: 'Tree Plant 4 - Orchid Bloom',
  theme: 'trunk-mounted foliage with an accent bloom',
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
    '...n.n..',
    '..nNnNn.',
    'kRLnNn..',
    'kRLLl...',
    'kRLl....',
    '........',
    '........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_4;
