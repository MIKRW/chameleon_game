// === Tree Plant 2 - Hanging Moss ===
// Theme: mossy clump clinging to the bark with thin trailing tendrils
// dangling below it
//
// Taller and slightly wider than the other single-knot foliage variants so
// its drooping strands read clearly against the trunk.
// Size: 9x12 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_2 = {
  name: 'Tree Plant 2 - Hanging Moss',
  theme: 'trunk-mounted foliage, hanging moss with dangling tendrils',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right"
  },
  width: 9,
  height: 12,
  rows: [
    '.........',
    '.kLLL....',
    'kLllLLl..',
    'kLlLlLl..',
    '.Ll.Ll.l.',
    '.l..l.l..',
    '.l..L.L..',
    '.L..l..l.',
    '.l..L..L.',
    '.f..l..l.',
    '....f..f.',
    '.........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_2;
