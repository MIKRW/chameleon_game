// === Tree Plant 3 - Spanish Moss ===
// Theme: pale silvery-sage strands draping down from a branch stub
//
// Uses dedicated S/F moss-strand colors instead of leaf greens or bark
// tones, since neither reads as the thin, dry, hanging texture of Spanish
// moss — a small bark stub (k/R/r) anchors the strands to the trunk.
// Size: 8x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_3 = {
  name: 'Tree Plant 3 - Spanish Moss',
  theme: 'trunk-mounted growth, hanging silvery moss strands',
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
    'kSFS....',
    '.SFSF...',
    '.FSFSS..',
    '.SFS.FS.',
    '.FS..SF.',
    '.S...FS.',
    '.....S..'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_3;
