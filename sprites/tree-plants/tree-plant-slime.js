// === Tree Plant Slime - Locked Trunk Coating ===
// Theme: bright yellow slime, tiled down the right-hand edge of every
// side-climbable trunk (layer 6, see TREE_PLACEMENTS in world-props.js) as
// long as the trunk-side-swap skill is still locked (state.skillUnlocked
// false, see game/state.js). Reuses the same yellow palette keys as
// ground-plant-2 (y/Y) rather than adding new ones. Drawn by
// drawSkillSlime() in game/render.js, tiled the same way drawGateMoss()
// tiles TREE_PLANT_1 down the gatekeeper trunk.
// Size: 4x8 (grid units; multiply by SCALE, see sprites/README.md)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_SLIME = {
  name: 'Tree Plant Slime - Locked Trunk Coating',
  theme: 'bright yellow slime coating blocking the right-hand side of a trunk',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "trunk-tile",
    animated: false
  },
  width: 4,
  height: 8,
  rows: [
    'yyyy',
    'yYYy',
    'yYYy',
    'yyyy',
    'yYYy',
    'yyyy',
    'yYYy',
    'yYYy'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_SLIME;
