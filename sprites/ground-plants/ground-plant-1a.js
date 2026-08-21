// === Ground Plant 1a - Split-Leaf Philodendron (Large Variant) ===
// Theme: ground foliage, large fenestrated leaves, rainforest-style
//
// Larger, darker variant of ground-plant-1 (GROUND_PLANT_1): a third leaf
// added, drawn side-on with a skinny twisting stem instead of the original's
// straight paired-leaf mirror layout. Uses the darker e/E leaf tones (shared
// with ground-plant-4) instead of l/L so it reads a shade deeper than the
// base plant. Fenestration slits run two rows tall for a slenderer cut than
// the original's single-row punctures.
// Size: 14x13 (grid units; multiply by render scale x renderScale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GROUND_PLANT_1A = {
  name: 'Ground Plant 1a - Split-Leaf Philodendron (Large Variant)',
  theme: 'ground foliage, large fenestrated leaves, rainforest-style, side profile',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor",
    animated: false
  },
  width: 14,
  height: 13,
  renderScale: 3.3, // larger than ground-plant-1's 3x
  rows: [
    '..............',
    '.....EEE......',
    '.....Ee.eE....',
    '.....Ee.eE....',
    '......EEE.....',
    '......k..EEE..',
    '.......kEe.eE.',
    '.EEE...kEe.eE.',
    'Ee.eE.k.......',
    'Ee.eE.k.......',
    '.EEE...k......',
    '......kkk.....',
    '......kkk.....'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_1A;
