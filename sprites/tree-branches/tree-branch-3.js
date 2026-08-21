// === Tree Branch 3 - Long Reach (Driftwood) ===
// Theme: longer solid driftwood-bark branch, right-angle launch from the trunk tapering up to a point
//
// Same shape and mounting convention as tree-branch-2.js (bottom-left 'k'
// cell is the trunk-contact point, flip horizontally to mount on a trunk's
// left side), just recolored with the near-black driftwood bark keys
// (1/2/3) instead of the shared r/R/h bark, so it matches trunk-interact-2's
// recolored driftwood trunk and trunk-bg-6a/6b (the angled feature trees)
// rather than the other, lighter-barked layer-7 trunks. Reads as one solid
// wedge of bark, not a speckled dither: a flat, thick, perpendicular launch
// straight out of the trunk (reading as a clean right angle at the join
// instead of sloping away immediately) that then tapers and rises to a
// point at the tip. Long/flat enough for the chameleon to stand on and run
// out along its length (see BRANCH_GEOMETRIES in game/world-geometry.js / updateBranch in game/movement.js).
// Defined for a right-side attach; flip horizontally (drawSprite's flipX) to
// mount on a trunk's left side instead.
// Size: 48x13 (grid units; multiply by render scale) -- a ~192px reach at the
// game's SCALE 4, four times the player's width.
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js -- the
// digit-keyed driftwood bark (1/2/3), exclusive to the driftwood-toned trees.

const TREE_BRANCH_3 = {
  name: 'Tree Branch 3 - Long Reach (Driftwood)',
  theme: 'long solid driftwood-bark branch, right-angle launch tapering up to a point, sturdy enough to stand on',
  behavior: {
    type: "static",
    layer: "background",
    collision: "platform", // standable on top / hangable underneath -- see BRANCH_GEOMETRIES in game/world-geometry.js
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right" // sprite grows sideways at a right angle, then tapers up, from its bottom-left corner; flip horizontally to mount on a trunk's left side
  },
  width: 48,
  height: 13,
  thickness: 7, // solid bark thickness (grid units) at the trunk-contact end — used for the hang-underneath offset instead of the full sprite height, since the sprite's bounding box also covers the tapered reach out to the tip
  flatCols: 14, // columns (grid units, from the trunk-contact end) the branch stays level before it starts rising toward the tip — game/world-geometry.js's branchSurfaceYAt uses this so walking/hanging along the branch tracks its actual flat-then-rising silhouette instead of a single straight line from base to tip
  rows: [
    '.............................................333',
    '.......................................333333...',
    '..................................3333322222....',
    '............................33333311222.........',
    '.......................3333311111122............',
    '.................33333311111222222..............',
    '3333333333333333311111111111....................',
    '1111111111111111111111122222....................',
    '11111111111111111111222.........................',
    '11111111111111111222............................',
    '11111111111122222...............................',
    '111122222222....................................',
    'k222............................................'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_BRANCH_3;
