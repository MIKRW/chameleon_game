// === Ground Plant 1 - Split-Leaf Philodendron ===
// Theme: ground foliage, large fenestrated leaf, rainforest-style
//
// Was a small fern; widened into a broad paired leaf (base pattern shared
// with ground-plant-5) with two punched-out fenestration slits for a
// monstera/split-leaf silhouette. `renderScale` draws it larger than the
// rest of the ground-plant set (see game.js drawGroundPlants) so it reads
// at a size proportionate to the chameleon, like a real understory leaf.
// Size: 12x10 (grid units; multiply by render scale x renderScale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const GROUND_PLANT_1 = {
  name: 'Ground Plant 1 - Split-Leaf Philodendron',
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
  renderScale: 3, // draw 3x larger than a standard ground-plant instance
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

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_1;
