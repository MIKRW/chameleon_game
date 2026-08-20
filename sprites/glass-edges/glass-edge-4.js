// === Glass Edge 4 - Right Rim ===
// Theme: terrarium glass right side rim, tileable vertically
//
// Mirrors Glass Edge 3. A clean, simple glass line: solid tint, tileable
// with no seams. `opacity` makes the whole strip translucent so the
// terrarium reads through it. The light-catch highlight is drawn once near
// the top of the wall in code (game/render.js), not baked into this tileable body.
// Size: 2x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GLASS_EDGE_RIGHT = {
  name: 'Glass Edge 4 - Right Rim',
  theme: 'terrarium glass right side rim, tileable vertically',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: false,
    placement: "right-edge",
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

if (typeof module !== 'undefined' && module.exports) module.exports = GLASS_EDGE_RIGHT;
