// === Tree Plant 5 - Bromeliad Rosette ===
// Theme: spiky symmetric rosette jutting from the bark
//
// A sideways sibling of ground-plant-3's grass tuft — same wispy-blade
// language, mounted to a trunk instead of the floor.
// Size: 16x16 (grid units; multiply by render scale) - doubled from 8x8
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

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
  width: 16,
  height: 16,
  rows: [
    '................',
    '................',
    '........ll......',
    '........ll......',
    '......LLll......',
    '......LLll......',
    'kkRRLLLLllLL....',
    'kkRRLLLLllLL....',
    'kkRRLLllLLll....',
    'kkRRLLllLLll....',
    '......LLll......',
    '......LLll......',
    '........ll......',
    '........ll......',
    '................',
    '................'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_5;
