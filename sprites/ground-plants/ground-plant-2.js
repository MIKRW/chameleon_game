// === Ground Plant 2 - Round Bush ===
// Theme: ground foliage, dense clump, yellow
//
// Blobby, rounded silhouette; reads well at small sizes, use for wide open
// floor space. Yellow instead of green (y/Y light/dark), for variety
// against the rest of the ground-plant set. Two small white (w) flower
// dots are scattered across the clump for accent.
// Size: 12x10 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GROUND_PLANT_2 = {
  name: 'Ground Plant 2 - Round Bush',
  theme: 'ground foliage, dense clump, yellow',
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
    '...YYYYYY...',
    '..YywwyyYY..',
    '.YyywwyyyY..',
    '.YyyYYyyyY..',
    'YyyyYYywwYy.',
    '.YyyyyywwY..',
    '..YYyyyyY...',
    '...YYYYY....',
    '....kk......'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_2;
