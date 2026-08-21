// === Tree Plant Slime - Locked Trunk Coating ===
// Theme: dull olive-yellow slime, tiled down the right-hand edge of every
// side-climbable trunk (layer 6, see TREE_PLACEMENTS in world-props.js) as
// long as the trunk-side-swap skill is still locked (state.skillUnlocked
// false, see game/state.js). Uses its own muted K/W/X keys (see
// TERRARIUM_PALETTE) rather than the bright ground-plant-2 y/Y, so it reads
// as a sickly coating instead of a saturated accent. Drawn by
// drawSkillSlime() in game/render.js, tiled the same way drawGateMoss()
// tiles TREE_PLANT_1 down the gatekeeper trunk.
// A rounded 2-wide drip core that bulges and tapers to a single centered
// point (rather than poking sideways to the tile edge) with a soft
// highlight/shade pair for a smooth, glossy look, plus fully-open rows per
// tile so the tiled column reads as an irregular drip, not one solid bar.
// Size: 4x14 (grid units; multiply by SCALE, see sprites/README.md)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_SLIME = {
  name: 'Tree Plant Slime - Locked Trunk Coating',
  theme: 'dull olive-yellow slime coating blocking the right-hand side of a trunk',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "trunk-tile",
    animated: false
  },
  width: 4,
  height: 14,
  rows: [
    '.KK.',
    'KWKK',
    'KXXK',
    'KKKW',
    '.KK.',
    '.WK.',
    '..K.',
    '....',
    '....',
    '.KK.',
    'KKXK',
    'KXKW',
    '.KK.',
    '..K.'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_SLIME;
