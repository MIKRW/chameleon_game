// === Tree Trunk Fore 5 - Forked ===
// Theme: trunk that splits into two branches near the top
//
// Two top attach points (rows 0-2, left and right) support two small canopy sprites, or one wide canopy centered over the fork.
// Size: 8x14 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_TRUNK_FORE_5 = {
  name: 'Tree Trunk Fore 5 - Forked',
  theme: 'trunk that splits into two branches near the top',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "floor",
    animated: false,
    pairs_with: "tree-canopy",
    attach_points: "two, left and right at top"
  },
  width: 8,
  height: 14,
  rows: [
    'rr....rr',
    'Rr....rR',
    '.rr..rr.',
    '..rrrr..',
    '..rRRr..',
    '.rRrrRr.',
    '.rRrrRr.',
    '.rRhhRr.',
    '.rRrrRr.',
    '.rRrrRr.',
    '.rRhhRr.',
    'rrRrrRrr',
    'rrRrrRrr',
    'kkkkkkkk'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_TRUNK_FORE_5;
