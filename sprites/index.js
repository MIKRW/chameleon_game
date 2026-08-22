// Aggregates every terrarium sprite "page" into one lookup table, the same
// way user/player/index.js exposes a single SPRITES object. Load
// palette/terrarium-palette.js and all the individual sprite files before
// this one (or require() them in Node), then use TERRARIUM_SPRITES +
// TERRARIUM_PALETTE + drawSprite (from ../sprites.js) to place props when
// the terrarium scene is built.

const TERRARIUM_SPRITES = {
  // index 1 (ground-plant-2, the yellow bush) is intentionally left out — see
  // resolveGroundPlantSprite() in game/world-geometry.js, which maps
  // "ground-plant-N" to index N-1, so the gap must stay to keep
  // ground-plant-3/4/5's ids resolving to the right sprite.
  groundPlant: [GROUND_PLANT_1, undefined, GROUND_PLANT_3, GROUND_PLANT_4, GROUND_PLANT_5, GROUND_PLANT_6],
  treePlant: [TREE_PLANT_1, TREE_PLANT_2, TREE_PLANT_3, TREE_PLANT_4, TREE_PLANT_5],
  // Lettered size variants, keyed by full id — see resolveTreePlantSprite()
  // in game/world-geometry.js, which checks this map before falling back to
  // the numbered array above.
  treePlantVariants: { 'tree-plant-2b': TREE_PLANT_2B },
  bug: [],
  vine: [VINE_1, VINE_2],
  treeTrunk: {
    // Background-only decor (layer 2, cosmetic, never climbable) — indexed by
    // silhouette family (1-6), each holding whichever bark variants exist for
    // it: 'a' (muted) and/or 'b' (vivid). See resolveTreeTrunkSprite() in
    // game/world-geometry.js for how 'trunk-bg-Nx' ids resolve here.
    bg: [
      { a: TREE_TRUNK_BG_1A },
      { a: TREE_TRUNK_BG_2A },
      { a: TREE_TRUNK_BG_3A },
      { a: TREE_TRUNK_BG_4A, b: TREE_TRUNK_BG_4B },
      { a: TREE_TRUNK_BG_5A, b: TREE_TRUNK_BG_5B },
      { a: TREE_TRUNK_BG_6A, b: TREE_TRUNK_BG_6B },
    ],
    // Climbable trunks (TREE_PLACEMENTS, layer 5/7) — numbered on their own
    // track, independent of the bg silhouette numbers above.
    interact: [TREE_TRUNK_INTERACT_1, TREE_TRUNK_INTERACT_2, TREE_TRUNK_INTERACT_3],
  },
  treeBranch: [TREE_BRANCH_1, TREE_BRANCH_2, TREE_BRANCH_3],
  lightbulb: LIGHTBULB,
  lightbulb2: LIGHTBULB_2,
  lightbulb3: LIGHTBULB_3,
  backgroundTexture: BACKGROUND_TEXTURE,
  lightSwitch: LIGHT_SWITCH,
  lightSwitch2: LIGHT_SWITCH_2,
  floor: FLOOR,
  glassEdge: {
    top: GLASS_EDGE_TOP,
    bottom: GLASS_EDGE_BOTTOM,
    left: GLASS_EDGE_LEFT,
    right: GLASS_EDGE_RIGHT,
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TERRARIUM_PALETTE: require('./palette/terrarium-palette.js'),
    TERRARIUM_SPRITES,
  };
}
