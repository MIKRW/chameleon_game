// === Ground Plant 3 - Tall Grass Tuft ===
// Theme: ground foliage, wispy grass blades, turquoise-mauve
//
// Doubled-height variant (was 12x10) so the ground-plant set has some
// height variation; blades mix a turquoise green (c/C) with a darker mauve
// accent (m/M). Widened (was 12) and given its own turquoise pair instead
// of the standard l/L leaf green so it stands out from the solid-green
// ground-plant-1 clump.
// Size: 14x20 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GROUND_PLANT_3 = {
  name: 'Ground Plant 3 - Tall Grass Tuft',
  theme: 'ground foliage, wispy grass blades, turquoise-mauve',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor",
    animated: false
  },
  width: 14,
  height: 20,
  rows: [
    '....m.........',
    '....m.........',
    '....m.....M...',
    '....m.....M...',
    '.c..m.....M...',
    '.c..m.....M...',
    '.c..m..C..M...',
    '.c..m..C..M...',
    '.c..m..C..M..c',
    '.c..m..C..M..c',
    '.c..m..C..M..c',
    '.c..m..C..M..c',
    '.c..m..C..M..c',
    '.c..m..C..M..c',
    '.c..m..C..M..c',
    '.CcCMMMMMMcC..',
    '..CcCccccCcC..',
    '...CcccccC....',
    '....CCCCCC....',
    '......kk......'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_3;
