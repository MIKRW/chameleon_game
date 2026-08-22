// === Tree Branch 1 - Short Knob ===
// Theme: solid bark branch, right-angle launch from the trunk tapering up to a point
//
// Mounts against a trunk at a bark-contact row; the 'k' cell in the bottom-left
// corner marks the trunk-contact point. Reads as one solid wedge of bark, not a
// speckled dither: a flat, thick, perpendicular launch straight out of the trunk
// (reading as a clean right angle at the join instead of sloping away
// immediately) that then tapers and rises to a point at the tip -- same
// top-row-highlight / bottom-row-shade banding the vivid-bark trunk sprites
// (trunk-interact-*, trunk-bg-*b) use, just laid out horizontally, so it
// matches the bark of the trunk it's mounted on. Long/flat enough for the
// chameleon to stand on and run out
// along its length (see BRANCH_GEOMETRIES in game/world-geometry.js / updateBranch in game/movement.js).
// Defined for a right-side attach; flip horizontally (drawSprite's flipX) to
// mount on a trunk's left side instead.
// Size: 32x10 (grid units; multiply by render scale) -- a ~128px reach at the
// game's SCALE 4, comfortably wider than the player.
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js -- same r/R/h bark keys as
// the vivid-bark trunk sprites so it matches whichever trunk it's attached to.

const TREE_BRANCH_1 = {
  name: 'Tree Branch 1 - Short Knob',
  theme: 'solid bark branch, right-angle launch tapering up to a point, sturdy enough to stand on',
  behavior: {
    type: "static",
    layer: "background",
    collision: "platform", // standable on top / hangable underneath -- see BRANCH_GEOMETRIES in game/world-geometry.js
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right" // sprite grows sideways at a right angle, then tapers up, from its bottom-left corner; flip horizontally to mount on a trunk's left side
  },
  width: 32,
  height: 10,
  thickness: 6, // solid bark thickness (grid units) at the trunk-contact end — used for the hang-underneath offset instead of the full sprite height, since the sprite's bounding box also covers the tapered reach out to the tip
  flatCols: 9, // columns (grid units, from the trunk-contact end) the branch stays level before it starts rising toward the tip — game/world-geometry.js's branchSurfaceYAt uses this so walking/hanging along the branch tracks its actual flat-then-rising silhouette instead of a single straight line from base to tip
  rows: [
    '.............................hhh',
    '.......................hhhhhh...',
    '..................hhhhhRRRRR....',
    '............hhhhhhrrrrR.........',
    'hhhhhhhhhhhhrrrrrrRRRR..........',
    'rrrrrrrrrrrrrrrrRR..............',
    'rrrrrrrrrrrrRRRR................',
    'rrrrrrrrrrRR....................',
    'rrrrRRRRRR......................',
    'kRRR............................'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_BRANCH_1;
