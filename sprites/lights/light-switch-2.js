// === Light Switch 2 (on) ===
// Theme: same brass-framed switch head and mounting arm as light-switch.js,
// bolted to the same spot on the bark, head glowing dark blood-red
// instead of black. Drawn in place of light-switch.js once the
// player has flipped it (see nearLightSwitch() in game/world-geometry.js /
// handleInteractPress() in game/interactions.js), alongside swapping
// lightbulb.js for lightbulb-2.js and revealing background-texture.js. That
// toggle logic lives in game/interactions.js, not here.
//
// Trunk-mounted prop: anchors at row 0 (top-left), same convention as
// light-switch.js. Size: 16x10 (grid units; multiply by render scale).
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js — the
// blood-red glow uses its own '7' key rather than the z/Z moss red, so
// this sprite's color can change without touching tree-plant-1's gate moss.

const LIGHT_SWITCH_2 = {
  name: 'Light Switch 2 (on)',
  theme: 'brass-framed square switch head on a mounting arm into the bark, head glowing ruby with a sapphire facet glint',
  behavior: {
    type: 'static',
    layer: 'foreground',
    collision: false,
    placement: 'trunk',
    animated: false,
  },
  width: 16,
  height: 10,
  rows: [
    'aaaaaaaaaa......',
    'a99999999a......',
    'a88888888a......',
    'a77777777akAAAAk',
    'a77777777akAAAAk',
    'a77777777akAAAAk',
    'a77777777akAAAAk',
    'a88888888a......',
    'a99999999a......',
    'aaaaaaaaaa......',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = LIGHT_SWITCH_2;
