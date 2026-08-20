// Aggregates every terrarium sprite "page" into one lookup table, the same
// way user/player/index.js exposes a single SPRITES object. Load
// palette/terrarium-palette.js and all the individual sprite files before
// this one (or require() them in Node), then use TERRARIUM_SPRITES +
// TERRARIUM_PALETTE + drawSprite (from ../sprites.js) to place props when
// the terrarium scene is built.

const TERRARIUM_SPRITES = {
  groundPlant: [GROUND_PLANT_1, GROUND_PLANT_2, GROUND_PLANT_3, GROUND_PLANT_4, GROUND_PLANT_5],
  treePlant: [TREE_PLANT_1, TREE_PLANT_2, TREE_PLANT_3, TREE_PLANT_4, TREE_PLANT_5],
  bug: [BUG_1],
  vine: [VINE_1, VINE_2],
  treeTrunk: {
    fore: [TREE_TRUNK_FORE_1, TREE_TRUNK_FORE_2, TREE_TRUNK_FORE_3, TREE_TRUNK_FORE_4, TREE_TRUNK_FORE_5],
    back: [TREE_TRUNK_BACK_1, TREE_TRUNK_BACK_2, TREE_TRUNK_BACK_3, TREE_TRUNK_BACK_4, TREE_TRUNK_BACK_5],
  },
  treeBranch: [TREE_BRANCH_1, TREE_BRANCH_2],
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
