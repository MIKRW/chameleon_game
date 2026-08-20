// === Lightbulb 3 ===
// Theme: identical art to lightbulb.js (off state) — used for the decoy
// bulb near x3400 in HANGING_PLACEMENTS, which has no switch of its own and
// must never swap to the lit sprite the way 'lightbulb' does via
// resolveHangingSprite() in game/world-geometry.js.
//
// Anchors at row 0 (the cord), same convention as vine-1.js/vine-2.js,
// since it hangs from above rather than sitting on the floor.
// Size: 10x18 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const LIGHTBULB_3 = {
  name: 'Lightbulb 3',
  theme: 'hanging Edison bulb, brass socket, long thin cord, off (dark/grey) glass',
  behavior: {
    type: 'static',
    layer: 'foreground',
    collision: false,
    placement: 'hanging',
    animated: false,
  },
  width: 10,
  height: 18,
  rows: [
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
