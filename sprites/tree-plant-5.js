// === Tree Plant 5 - Bromeliad Rosette ===
// Theme: spiky symmetric rosette jutting from the bark
//
// A sideways sibling of ground-plant-3's grass tuft — same wispy-blade
// language, mounted to a trunk instead of the floor.
// Size: 8x8 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_PLANT_5 = {
  name: 'Tree Plant 5 - Bromeliad Rosette',
  theme: 'trunk-mounted foliage, spiky rosette',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right"
  },
  width: 8,
  height: 8,
  rows: [
    '........',
    '....l...',
    '...Ll...',
    'kRLLlL..',
    'kRLlLl..',
    '...Ll...',
    '....l...',
    '........'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_5;
