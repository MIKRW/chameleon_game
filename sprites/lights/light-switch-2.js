// === Light Switch 2 (on) ===
// Theme: same brass-framed switch head and mounting arm as light-switch.js,
// bolted to the same spot on the bark, head glowing red instead of black.
// Drawn in place of light-switch.js once the player has flipped it (see
// nearLightSwitch() in game/world-geometry.js / handleInteractPress() in
// game/interactions.js), alongside swapping lightbulb.js for lightbulb-2.js
// and revealing background-texture.js. That toggle logic lives in
// game/interactions.js, not here.
//
// Trunk-mounted prop: anchors at row 0 (top-left), same convention as
// light-switch.js. Size: 16x10 (grid units; multiply by render scale).
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const LIGHT_SWITCH_2 = {
  name: 'Light Switch 2 (on)',
  theme: 'brass-framed square switch head on a mounting arm into the bark, head glowing red',
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
    'azzzzzzzza......',
    'azzzzzzzza......',
    'azzzzzzzzakAAAAk',
    'azzzzzzzzakAAAAk',
    'azzzzzzzzakAAAAk',
    'azzzzzzzzakAAAAk',
    'azzzzzzzza......',
    'azzzzzzzza......',
    'aaaaaaaaaa......',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = LIGHT_SWITCH_2;
