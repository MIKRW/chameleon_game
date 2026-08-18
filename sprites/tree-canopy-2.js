// === Tree Canopy 2 - Wide Canopy ===
// Theme: broad, flatter canopy for wider trees
//
// Wider and flatter than Canopy 1; use over Trunk 2 (thick) or Trunk 5 (forked) for visual balance.
// Size: 16x10 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_CANOPY_2 = {
  name: 'Tree Canopy 2 - Wide Canopy',
  theme: 'broad, flatter canopy for wider trees',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "trunk-top",
    animated: false,
    pairs_with: "tree-trunk"
  },
  width: 16,
  height: 10,
  rows: [
    '..LLLLLLLLLLLL..',
    '.LlllLLllLLlllL.',
    'LlllfflllfflllL.',
    'LlllfflllfflllLL',
    'LllLLllllllLllLL',
    'LlllllffllllllLL',
    '.LlllllllllllL..',
    '..LLllllllLLL...',
    '...LLLLLLLL.....',
    '......kk........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_CANOPY_2;
