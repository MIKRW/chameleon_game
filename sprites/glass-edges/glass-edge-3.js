// === Glass Edge 3 - Left Rim ===
// Theme: terrarium glass left side rim, tileable vertically
//
// A clean, simple glass line: solid tint, tileable with no seams. `opacity`
// makes the whole strip translucent so the terrarium reads through it. The
// light-catch highlight is drawn once near the top of the wall in code
// (game/render.js), not baked into this tileable body — a repeating highlight
// would just look like a stack of blocks at any real render scale.
// Size: 2x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GLASS_EDGE_LEFT = {
  name: 'Glass Edge 3 - Left Rim',
  theme: 'terrarium glass left side rim, tileable vertically',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: false,
    placement: "left-edge",
    animated: false,
    tileable: "vertical",
    opacity: 0.5
  },
  width: 2,
  height: 8,
  rows: [
    'gg',
    'gg',
    'gg',
    'gg',
    'gg',
    'gg',
    'gg',
    'gg'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GLASS_EDGE_LEFT;
