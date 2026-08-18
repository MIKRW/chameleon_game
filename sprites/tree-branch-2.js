// === Tree Branch 2 - Long Reach ===
// Theme: longer knobbly bark branch, juts out at an angle and tapers to a point
//
// Same mounting convention as tree-branch-1.js (bottom-left 'k' cell is the
// trunk-contact point, grows sideways with only a shallow rise, flip
// horizontally to mount on a trunk's left side) but much longer and flatter,
// for use on the taller/thicker trunk variants where a stubbier branch would
// look out of scale — long/flat enough for the chameleon to stand on and
// run out along its length (see BRANCH_GEOMETRIES / updateBranch in
// game.js), rather than reading as a short stub poking out of the bark.
// Size: 36x6 (grid units; multiply by render scale) — a ~140px reach at the
// game's SCALE 4, more than twice the player's width.
// Uses the shared TERRARIUM_PALETTE from palette.js — same r/R/h bark keys as
// the tree-trunk-fore-* set so it matches whichever fore trunk it's attached to.

const TREE_BRANCH_2 = {
  name: 'Tree Branch 2 - Long Reach',
  theme: 'long knobbly bark branch, tapers to a point, sturdy enough to stand on',
  behavior: {
    type: "static",
    layer: "background",
    collision: "platform", // standable on top / hangable underneath — see BRANCH_GEOMETRIES in game.js
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right" // sprite grows sideways (with a shallow rise) from its bottom-left corner; flip horizontally to mount on a trunk's left side
  },
  width: 36,
  height: 6,
  rows: [
    '...........................h...hrRrh',
    '...................r...rRrhrRrhr...r',
    '...........R...RrhrRrhrRrh.R........',
    '...r..RrhrRrhrRrhrRr................',
    'rRrhrRrhrRrhrR......................',
    'krhrRrhr...r........................'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_BRANCH_2;
