// === Tree Trunk Fore 4 - Curved Lean ===
// Theme: trunk that leans/curves to one side
//
// Top attach point (for canopy) drifts left across rows, so pair with a canopy sprite offset to match, or use standalone for a windswept look.
// Size: 8x14 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_TRUNK_FORE_4 = {
  name: 'Tree Trunk Fore 4 - Curved Lean',
  theme: 'trunk that leans/curves to one side',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "floor",
    animated: false,
    pairs_with: "tree-canopy"
  },
  width: 8,
  height: 14,
  rows: [
    '....rrrr',
    '...rRrrR',
    '..rRrrRr',
    '..rRrrRr',
    '.rRrrRr.',
    '.rRrrRr.',
    '.rRhhRr.',
    'rRrrRr..',
    'rRrrRr..',
    'rRhhRr..',
    'rRrrRr..',
    'rrRrrRr.',
    'rrRrrRr.',
    'kkkkkkkk'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_TRUNK_FORE_4;
