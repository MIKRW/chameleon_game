// === Tree Branch 2 - Long Reach ===
// Theme: longer solid bark branch, right-angle launch from the trunk tapering up to a point
//
// Same mounting convention as tree-branch-1.js (bottom-left 'k' cell is the
// trunk-contact point, flip horizontally to mount on a trunk's left side)
// but longer and taller, for use on the bigger trunk variants where a
// stubbier branch would look out of scale. Reads as one solid wedge of bark,
// not a speckled dither: a flat, thick, perpendicular launch straight out of
// the trunk (reading as a clean right angle at the join instead of sloping
// away immediately) that then tapers and rises to a point at the tip -- same
// top-row-highlight / bottom-row-shade banding the tree-trunk-fore-* sprites
// use, just laid out horizontally, so it matches the bark of the trunk it's
// mounted on. Long/flat enough for the chameleon to stand on and run out
// along its length (see BRANCH_GEOMETRIES / updateBranch in game.js).
// Defined for a right-side attach; flip horizontally (drawSprite's flipX) to
// mount on a trunk's left side instead.
// Size: 48x13 (grid units; multiply by render scale) -- a ~192px reach at the
// game's SCALE 4, four times the player's width.
// Uses the shared TERRARIUM_PALETTE from palette.js -- same r/R/h bark keys as
// the tree-trunk-fore-* set so it matches whichever fore trunk it's attached to.

const TREE_BRANCH_2 = {
  name: 'Tree Branch 2 - Long Reach',
  theme: 'long solid bark branch, right-angle launch tapering up to a point, sturdy enough to stand on',
  behavior: {
    type: "static",
    layer: "background",
    collision: "platform", // standable on top / hangable underneath -- see BRANCH_GEOMETRIES in game.js
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right" // sprite grows sideways at a right angle, then tapers up, from its bottom-left corner; flip horizontally to mount on a trunk's left side
  },
  width: 48,
  height: 13,
  thickness: 7, // solid bark thickness (grid units) at the trunk-contact end — used for the hang-underneath offset instead of the full sprite height, since the sprite's bounding box also covers the tapered reach out to the tip
  flatCols: 14, // columns (grid units, from the trunk-contact end) the branch stays level before it starts rising toward the tip — game.js's branchSurfaceYAt uses this so walking/hanging along the branch tracks its actual flat-then-rising silhouette instead of a single straight line from base to tip
  rows: [
    '.............................................hhh',
    '.......................................hhhhhh...',
    '..................................hhhhhRRRRR....',
    '............................hhhhhhrrRRR.........',
    '.......................hhhhhrrrrrrRR............',
    '.................hhhhhhrrrrrRRRRRR..............',
    'hhhhhhhhhhhhhhhhhrrrrrrrrrrr....................',
    'rrrrrrrrrrrrrrrrrrrrrrrRRRRR....................',
    'rrrrrrrrrrrrrrrrrrrrRRR.........................',
    'rrrrrrrrrrrrrrrrrRRR............................',
    'rrrrrrrrrrrrRRRRR...............................',
    'rrrrRRRRRRRR....................................',
    'kRRR............................................'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_BRANCH_2;
