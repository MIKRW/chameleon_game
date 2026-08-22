// === Bug 1 - Collectible Critter ===
// Theme: small matte-black beetle-like bug with a pale back marking, used as
// a collectible (see BUG_PLACEMENTS in world-props.js, collectNearbyBug() in
// game/interactions.js). Deliberately tiny relative to the player so
// catching one takes lining up rather than just walking into a big hitbox.
// Size: 5x4 (grid units; multiply by SCALE, see sprites/README.md)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const BUG_1 = {
  name: 'Bug 1 - Collectible Critter',
  theme: 'small matte-black bug with a pale back marking',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "ground-or-trunk-or-air",
    animated: false
  },
  width: 5,
  height: 4,
  rows: [
    '.III.',
    'IIOII',
    'IIIII',
    '.I.I.'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = BUG_1;
