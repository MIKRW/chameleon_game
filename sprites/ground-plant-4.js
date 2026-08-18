// === Ground Plant 4 - Flowering Plant ===
// Theme: ground foliage with a light pink bloom, dark blue-to-green leaf
//
// Leaf body darkens toward the base and shifts to a blue hue there (b/B),
// fading up into the dedicated dark-leaf green pair (e/E) near the top of
// the clump, then a light pink flower (t/T) tops the plant. Renders
// slightly larger than a standard ground-plant instance (see renderScale),
// so it reads as a shadier, denser clump against the rest of the
// ground-plant set.
// Size: 12x10 (grid units; multiply by render scale x renderScale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const GROUND_PLANT_4 = {
  name: 'Ground Plant 4 - Flowering Plant',
  theme: 'ground foliage with a light pink bloom, dark blue-to-green leaf',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor",
    animated: false
  },
  width: 12,
  height: 10,
  renderScale: 1.5, // slightly larger than a standard ground-plant instance
  rows: [
    '............',
    '....t.t.....',
    '...tTtTt....',
    '....ttt.....',
    '..EeeeeeE...',
    '.EeeeeeeeE..',
    '.EeeeeeeeeE.',
    '..BBbbbBB...',
    '...BBBBB....',
    '....kk......'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_4;
