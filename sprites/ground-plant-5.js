// === Ground Plant 5 - Broadleaf Plant ===
// Theme: ground foliage, large flat leaves
//
// Two large paired leaves on a short stem; tallest of the plant set, use to break up rows of shorter plants.
// Size: 12x10 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const GROUND_PLANT_5 = {
  name: 'Ground Plant 5 - Broadleaf Plant',
  theme: 'ground foliage, large flat leaves',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor",
    animated: false
  },
  width: 12,
  height: 10,
  rows: [
    '............',
    '..LLL..LLL..',
    '.LlllL.LlllL',
    'LlllllLllllL',
    'LLlllLlllLLL',
    '.LLllLllLL..',
    '..LLLLLLL...',
    '...LLLLL....',
    '....kkk.....',
    '....kkk.....'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_5;
