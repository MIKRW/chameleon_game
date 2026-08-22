// === Light Switch (off) ===
// Theme: a brass-framed square switch head on a narrow brass mounting arm,
// bolted into the bark near the top of a trunk — currently the last/
// rightmost reachable tree (see LIGHT_SWITCH_PLACEMENT, world-props.js) —
// deliberately so flipping it means climbing across the tank and up, rather
// than something reachable by just poking around near the bulb/background-
// texture. Toggling it (see
// nearLightSwitch() in game/world-geometry.js / handleInteractPress() in
// game/interactions.js) swaps the drawn
// sprite to light-switch-2.js, swaps lightbulb.js for lightbulb-2.js, and
// reveals background-texture.js — none of that logic lives in this file,
// which is just the off-state artwork.
//
// Drawn sideways-on: the square head sits at the left (columns 0-9,
// sticking out from the tree) and the skinny mounting arm sits at the
// right (columns 10-15), its tip embedding into the trunk bark — this is
// the natural orientation for a left-face mount; drawLightSwitch() in
// game/render.js mirrors it horizontally when LIGHT_SWITCH_PLACEMENT.side is
// 'right' so the arm still embeds into whichever face it's mounted on. The
// square's interior is solid black (k) here for off, and glows red (z,
// light-switch-2.js) for on — the brass (a/A) frame and arm don't change
// between states.
//
// Trunk-mounted prop: anchors at row 0 (top-left), same convention as a
// branch (see branchGeometry()/lightSwitchOrigin() in game/world-geometry.js) rather than
// snapping to the floor. Size: 16x10 (grid units; multiply by render
// scale). Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const LIGHT_SWITCH = {
  name: 'Light Switch (off)',
  theme: 'brass-framed square switch head on a mounting arm into the bark, head unlit black',
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
    'akkkkkkkka......',
    'akkkkkkkka......',
    'akkkkkkkkakAAAAk',
    'akkkkkkkkakAAAAk',
    'akkkkkkkkakAAAAk',
    'akkkkkkkkakAAAAk',
    'akkkkkkkka......',
    'akkkkkkkka......',
    'aaaaaaaaaa......',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = LIGHT_SWITCH;
