// === Tree Branch 1 - Short Knob ===
// Theme: short knobbly bark branch, juts out at an angle and tapers to a point
//
// Mounts against a trunk at a bark-contact row; the 'k' cell in the bottom-left
// corner marks the trunk-contact point. Reaches out mostly sideways with only
// a shallow upward rise (not a steep 45-degree stub) and narrows unevenly
// (not a straight taper) so it reads as knobbly rather than a clean cone —
// long/flat enough for the chameleon to stand on and run out along its
// length (see BRANCH_GEOMETRIES / updateBranch in game.js). Defined for a
// right-side attach; flip horizontally (drawSprite's flipX) to mount on a
// trunk's left side instead.
// Size: 24x4 (grid units; multiply by render scale) — a ~92px reach at the
// game's SCALE 4, comfortably wider than the player.
// Uses the shared TERRARIUM_PALETTE from palette.js — same r/R/h bark keys as
// the tree-trunk-fore-* set so it matches whichever fore trunk it's attached to.

const TREE_BRANCH_1 = {
  name: 'Tree Branch 1 - Short Knob',
  theme: 'knobbly bark branch, tapers to a point, sturdy enough to stand on',
  behavior: {
    type: "static",
    layer: "background",
    collision: "platform", // standable on top / hangable underneath — see BRANCH_GEOMETRIES in game.js
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right" // sprite grows sideways (with a shallow rise) from its bottom-left corner; flip horizontally to mount on a trunk's left side
  },
  width: 24,
  height: 4,
  rows: [
    '..................rhrRrh',
    '...r....RrhrRrhrRrhr....',
    'rhrRrhrRrhrRrh..........',
    'krRrhrRr...r............'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_BRANCH_1;
