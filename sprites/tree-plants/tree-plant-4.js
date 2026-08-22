// === Tree Plant 4 - Oyster Mushrooms ===
// Theme: pale ivory bracket-fungus shelves stepping down a bark stub
//
// Uses dedicated P/H mushroom-cap colors (muted grey-brown cap top, deeper
// cool-brown gill underside) instead of leaf/vine greens, since bracket
// fungi read as flat shelves rather than foliage. Redrawn as three distinct
// shelf caps stepping down the bark. Each cap's top surface (P) sits flush
// against the trunk from the start and curls out into a rounded lip — the
// angled attachment lives on the UNDERSIDE instead: the gill layer (H)
// beneath each cap tucks back in and merges into the bark stub (k/R/r,
// merged in from the host trunk's own bark palette at render time, same
// convention as tree-plant-3's moss stub) right where the next cap begins,
// so it reads as the gills sweeping back and disappearing into the wood on
// a lean, the way a real bracket fungus attaches, rather than the cap itself
// tapering to a point. The top cap is biggest and reaches furthest out from
// the trunk; the mid and bottom caps taper down in both size and reach, the
// bottom one rooted directly into the closing bark stub. Mounted with a
// deeper trunk overlap (TREE_PLANT_4_TRUNK_OVERLAP, game/constants.js) than
// the other single-knot tree-plants so the cluster reads as growing out of
// the bark rather than resting beside it.
// Size: 9x11 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_4 = {
  name: 'Tree Plant 4 - Oyster Mushrooms',
  theme: 'trunk-mounted bracket fungi, stacked cream mushroom shelves',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right"
  },
  width: 9,
  height: 11,
  rows: [
    'kPPPPk...',
    'kPPPPPPk.',
    'kHHHHHHk.',
    'RkHHk....',
    '.kPPPk...',
    '.kPPPPk..',
    'RkHHk....',
    '..kPPk...',
    '.kPPPk...',
    'RkHk.....',
    'RRr......'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_4;
