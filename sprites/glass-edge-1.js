// === Glass Edge 1 - Top Rim ===
// Theme: terrarium glass top rim, tileable horizontally
//
// A clean, simple glass line: one bright highlight row over one tint row.
// Runs along the top of the terrarium box. `opacity` makes the whole strip
// translucent so the terrarium reads through it.
// Size: 16x2 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const GLASS_EDGE_TOP = {
  name: 'Glass Edge 1 - Top Rim',
  theme: 'terrarium glass top rim, tileable horizontally',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: false,
    placement: "top-edge",
    animated: false,
    tileable: "horizontal",
    opacity: 0.5
  },
  width: 16,
  height: 2,
  rows: [
    'wwwwwwwwwwwwwwww',
    'gggggggggggggggg'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GLASS_EDGE_TOP;
