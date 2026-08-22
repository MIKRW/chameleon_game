// === Ground Plant 7 - Split-Leaf Philodendron (Small Olive Variant) ===
// Theme: ground foliage, large fenestrated leaf, rainforest-style
//
// Smaller, more olive-toned variant of ground-plant-1 (GROUND_PLANT_1): same
// shape/rows, renderScale cut 30% (3 -> 2.1) and its own palette entry
// (independent of ground-plant-1's l/L) shifted toward a duller olive-green.
// Size: 12x10 (grid units; multiply by render scale x renderScale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GROUND_PLANT_7 = {
  name: 'Ground Plant 7 - Split-Leaf Philodendron (Small Olive Variant)',
  theme: 'ground foliage, large fenestrated leaf, rainforest-style',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor",
    animated: false
  },
  width: 12,
  height: 10,
  renderScale: 2.1, // 30% smaller than ground-plant-1's 3x
  rows: [
    '............',
    '..LLL..LLL..',
    '.LlllL.LlllL',
    'Lll.llLll.lL',
    'LLl.lLll.LLL',
    '.LLllLllLL..',
    '..LLLLLLL...',
    '...LLLLL....',
    '....kkk.....',
    '....kkk.....'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_7;
