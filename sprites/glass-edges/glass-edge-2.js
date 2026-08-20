// === Glass Edge 2 - Bottom Rim ===
// Theme: terrarium glass bottom rim, tileable horizontally
//
// A clean, simple glass line, deliberately one row thicker than the other
// three edges since the bottom rim carries the tank's weight. `opacity`
// makes the whole strip translucent so the terrarium reads through it.
// Size: 16x3 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GLASS_EDGE_BOTTOM = {
  name: 'Glass Edge 2 - Bottom Rim',
  theme: 'terrarium glass bottom rim, tileable horizontally',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: false,
    placement: "bottom-edge",
    animated: false,
    tileable: "horizontal",
    opacity: 0.5
  },
  width: 16,
  height: 3,
  rows: [
    'gggggggggggggggg',
    'gggggggggggggggg',
    'wwwwwwwwwwwwwwww'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GLASS_EDGE_BOTTOM;
