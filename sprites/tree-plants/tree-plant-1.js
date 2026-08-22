// === Tree Plant 1 - Gate Moss ===
// Theme: bright/dark red lichen-moss climbing a trunk's edge, with short
// fingers sprigging outward from the bark.
//
// One edge-strip, not a full trunk-width span: game/render.js's
// drawGateMoss() tiles it top-to-bottom the same way drawGlassEdgeSide tiles
// the tank walls, and draws it TWICE per row — once flush against the
// trunk's left edge as-is, once flush against the right edge mirrored via
// drawSprite's flipX — so the same art runs down both sides of the trunk
// and overlaps its bark from either edge, leaving the middle of wide trunks
// (e.g. Trunk Interact 2, 16 grid units) bare bark between the two mossy
// edges rather than stretching to cover it.
// Columns 2-7 sit directly over the bark; columns 0-1 are the finger tips
// reaching out past the trunk edge (see GATE_MOSS_FINGER_MARGIN,
// game/constants.js).
// Size: 8x12 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_1 = {
  name: 'Tree Plant 1 - Gate Moss',
  theme: 'red lichen-moss edging a trunk, fingers reaching outward',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: true, // blocks ground passage until the tree's puzzle is solved (see game/interactions.js)
    placement: "trunk-run",
    animated: false,
    mounts_to: "tree-trunk",
    tileable: true, // repeats vertically to cover a trunk's full height
  },
  width: 8,
  height: 12,
  rows: [
    '.....ZZZ',
    '....Zzzz',
    '...Zz...',
    '..Zz....',
    '.....ZZZ',
    '....Zzzz',
    '.....ZZZ',
    '....Zzzz',
    '.Zz.....',
    'Zz......',
    '.....ZZZ',
    '....Zzzz',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_1;
