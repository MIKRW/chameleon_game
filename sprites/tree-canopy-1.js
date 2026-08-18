// === Tree Canopy 1 - Round Canopy ===
// Theme: compact rounded canopy
//
// Attach row is the last row (kk marks trunk contact point); center it over a trunk's top row.
// Size: 16x10 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_CANOPY_1 = {
  name: 'Tree Canopy 1 - Round Canopy',
  theme: 'compact rounded canopy',
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
    '......LLLL......',
    '....LLllllLL....',
    '..LLlllfflllLL..',
    '.Llllfflfflllll.',
    'LlllffLLfflllllL',
    'LlllLLLLLLlllllL',
    '.LlllllllllllL..',
    '..LLllllllLLL...',
    '...LLLLLLLL.....',
    '......kk........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_CANOPY_1;
