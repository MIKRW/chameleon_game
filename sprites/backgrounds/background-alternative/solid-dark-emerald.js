// === Background: Solid Dark Emerald ===
// Flat single-color backdrop (no noise/foliage texture) — a plain dark
// emerald fill, for when the layer-1 backdrop should stay out of the way
// entirely instead of reading as its own scene. See sprites/backgrounds/index.js
// to switch which variant is active.

const BACKGROUND_SOLID_DARK_EMERALD = {
  name: 'Background: Solid Dark Emerald',
  theme: 'flat solid dark emerald fill, no texture',
  // Drawn as a plain canvas-wide fillRect (see drawBackgroundSprite,
  // game/render.js) rather than a sprite grid — a 1x1 sprite cell would
  // only cover a single pixel-sized cell, not the whole backdrop.
  solidColor: '#0d3b2a',
  sprite: {
    width: 1,
    height: 1,
    rows: ['.'],
  },
  palette: {},
};

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_SOLID_DARK_EMERALD;
