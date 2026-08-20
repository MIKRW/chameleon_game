// === Lightbulb 2 (lit) ===
// Theme: the same hanging Edison-style fixture as lightbulb.js, switched on —
// same brass socket and cord, but the glass and filament glow warm white/
// amber, with a faint glow bleeding into the dark background right around
// the bulb. Swapped in for lightbulb.js once the light switch (see
// light-switch.js / light-switch-on.js) is flipped on — that swap and the
// resulting reveal of background-texture.js are handled where props get
// drawn, not in this file.
//
// Anchors at row 0 (the cord), same convention as lightbulb.js.
// Size: 12x18 (grid units; multiply by render scale) — two columns wider
// than the off bulb to fit the glow halo without changing the cord's
// column, so swapping between the two only needs a horizontal recenter.
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const LIGHTBULB_2 = {
  name: 'Lightbulb 2 (lit)',
  theme: 'hanging Edison bulb, brass socket, long thin cord, on — warm glowing glass and faint halo',
  behavior: {
    type: 'static',
    layer: 'foreground',
    collision: false,
    placement: 'hanging',
    animated: false,
  },
  width: 12,
  height: 18,
  rows: [
    '.....r......',
    '.....r......',
    '.....r......',
    '.....r......',
    '.....r......',
    '.....r......',
    '.....r......',
    '.....r......',
    '....kkkk....',
    '...kaaaak...',
    '...kAAAak...',
    'i..kgwwgk..i',
    'i.kgwuugwk.i',
    'i.kgwUUgwk.i',
    'i.kgwuugwk.i',
    'i..kgwwgk..i',
    '....kggk....',
    '.....kk.....',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = LIGHTBULB_2;
