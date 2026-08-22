// Registers every swappable layer-1 backdrop variant and picks which one
// drawBackgroundSprite() (game/render.js) actually draws. Each variant
// carries its own { sprite, palette } — unlike the rest of
// TERRARIUM_SPRITES, backgrounds don't share TERRARIUM_PALETTE, so tweaking
// one variant's colors never affects another.
//
// forest-v1.js through forest-v5.js, forest-v7.js, and solid-dark-emerald.js
// (earlier iterations and unused alternates, kept for reference/reverting)
// live in background-alternative/. forest-v6.js (the current pick) lives
// alongside this file.
//
// To swap: change ACTIVE_BACKGROUND_KEY to any key in BACKGROUND_VARIANTS
// below. To add a new variant: copy forest-v6.js, load the new file before
// this one in index.html, and add it to BACKGROUND_VARIANTS.

const BACKGROUND_VARIANTS = {
  forestV1: BACKGROUND_FOREST_V1,
  forestV2: BACKGROUND_FOREST_V2,
  forestV3: BACKGROUND_FOREST_V3,
  forestV4: BACKGROUND_FOREST_V4,
  forestV5: BACKGROUND_FOREST_V5,
  forestV6: BACKGROUND_FOREST_V6,
  forestV7: BACKGROUND_FOREST_V7,
  solidDarkEmerald: BACKGROUND_SOLID_DARK_EMERALD,
};

const ACTIVE_BACKGROUND_KEY = 'forestV6';

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BACKGROUND_VARIANTS, ACTIVE_BACKGROUND_KEY };
}
