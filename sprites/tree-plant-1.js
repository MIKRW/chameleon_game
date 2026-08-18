// === Tree Plant 1 - Epiphyte Fern ===
// Theme: small fern tuft gripping the bark
//
// Mounts sideways against a trunk knot row; the 'k' cells in column 0 mark
// the bark-contact point, fronds fan out to the right from there.
// Size: 8x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_PLANT_1 = {
  name: 'Tree Plant 1 - Epiphyte Fern',
  theme: 'trunk-mounted foliage, small fern tuft',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right" // sprite grows rightward from its left edge; flip horizontally to mount on a trunk's left side
  },
  width: 8,
  height: 8,
  rows: [
    '........',
    '...f....',
    '..Lf....',
    'kRLlf...',
    'kRLllLf.',
    'kRLlf...',
    '..Lf....',
    '........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_1;
