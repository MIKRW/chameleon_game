// === Tree Plant 4 - Oyster Mushrooms ===
// Theme: pale ivory bracket-fungus shelves stepping down a bark stub
//
// Uses dedicated P/H mushroom-cap colors (cream cap, tan gill underside)
// instead of leaf/vine greens, since bracket fungi read as flat cream
// shelves rather than foliage — a small bark stub (k/R/r) anchors the
// cluster to the trunk, same convention as tree-plant-3's moss stub.
// Size: 8x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_4 = {
  name: 'Tree Plant 4 - Oyster Mushrooms',
  theme: 'trunk-mounted bracket fungi, stacked cream mushroom shelves',
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
    'kRr.....',
    'kHPP....',
    '.HPPPk..',
    '.kHPPPk.',
    '..kHPPPk',
    '...kHPP.',
    '....kHk.',
    '........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_4;
