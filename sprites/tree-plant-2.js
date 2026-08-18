// === Tree Plant 2 - Trunk Moss Patch ===
// Theme: low, rounded moss clump hugging the bark
//
// Stays close to the trunk rather than fanning outward; use where a subtler
// accent is wanted than the fuller epiphyte/orchid variants.
// Size: 8x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_PLANT_2 = {
  name: 'Tree Plant 2 - Trunk Moss Patch',
  theme: 'trunk-mounted foliage, low moss clump',
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
    '.LL.....',
    'kLlL....',
    'kLllL...',
    'kLlL....',
    '.LL.....',
    '........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_2;
