// === Lightbulb ===
// Theme: hanging Edison-style lightbulb, currently switched off — brass
// socket, dark/grey glass and filament (no glow), long thin cord
//
// Anchors at row 0 (the cord), same convention as vine-1.js/vine-2.js,
// since it hangs from above rather than sitting on the floor.
// Size: 10x18 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const LIGHTBULB = {
  name: 'Lightbulb',
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

if (typeof module !== 'undefined' && module.exports) module.exports = LIGHTBULB;
