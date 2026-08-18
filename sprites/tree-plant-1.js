// === Tree Plant 1 - Gate Moss ===
// Theme: bright/dark red lichen-moss climbing a trunk's full height, with
// short fingers sprigging outward from the bark on both sides.
//
// Unlike the other tree-plant sprites (which mount once at a single knot),
// this one is a short repeatable tile: game.js's drawGateMoss() stacks it
// top-to-bottom to cover an entire trunk, the same way the glass edge
// sprites tile to cover the tank walls (see drawGlassEdgeSide in game.js).
// Columns 2-12 sit directly over an 11-wide trunk's bark; columns 0-1 and
// 13-14 are the finger tips reaching out past either edge.
// Size: 15x12 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const TREE_PLANT_1 = {
  name: 'Tree Plant 1 - Gate Moss',
  theme: 'red lichen-moss running the length of a trunk, fingers reaching outward',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: true, // blocks ground passage until the tree's puzzle is solved (see game.js)
    placement: "trunk-run",
    animated: false,
    mounts_to: "tree-trunk",
    tileable: true, // repeats vertically to cover a trunk's full height
  },
  width: 15,
  height: 12,
  rows: [
    '.....ZZZZZ.....',
    '....ZzzzzzZ....',
    '...Zz.....zZ...',
    '..Zz.......zZ..',
    '.....ZZZZZ.....',
    '....ZzzzzzZ....',
    '.....ZZZZZ.....',
    '....ZzzzzzZ....',
    '.Zz.........zZ.',
    'Zz...........zZ',
    '.....ZZZZZ.....',
    '....ZzzzzzZ....',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_1;
