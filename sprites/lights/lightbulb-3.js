// === Lightbulb 3 ===
// Theme: identical bulb art to lightbulb.js (off state) but with a much
// longer cord — used for the decoy bulb near x3400 in HANGING_PLACEMENTS,
// which hangs from the lid down past the branch on the rightmost tree
// (trunk-interact-3 at x3200, layer 5 — see BRANCH_PLACEMENTS in
// world-props.js, the tree-branch-2 at attachRow 30/side 'right'), so the
// glass/filament reads below the branch instead of overlapping it. Has no
// switch of its own and must never swap to the lit sprite the way
// 'lightbulb' does via resolveHangingSprite() in game/world-geometry.js.
//
// Anchors at row 0 (the cord), same convention as vine-1.js/vine-2.js,
// since it hangs from above rather than sitting on the floor.
// Size: 10x34 (grid units; multiply by render scale) — cord lengthened from
// lightbulb.js's 8 rows to 24 so the bulb clears that branch.
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const LIGHTBULB_3 = {
  name: 'Lightbulb 3',
  theme: 'hanging Edison bulb, brass socket, long dangling cord, off (dark/grey) glass',
  behavior: {
    type: 'static',
    layer: 'foreground',
    collision: false,
    placement: 'hanging',
    animated: false,
  },
  width: 10,
  height: 34,
  rows: [
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '....r.....',
    '...kkkk...',
    '..kaaaak..',
    '..kAAAak..',
    '..kgwwgk..',
    '.kgwvvgwk.',
    '.kgwVVgwk.',
    '.kgwvvgwk.',
    '..kgwwgk..',
    '...kggk...',
    '....kk....',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = LIGHTBULB_3;
