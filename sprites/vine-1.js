// === Vine 1 - Bare Hanging Vine ===
// Theme: simple hanging vine, no leaves
//
// Anchored at the top (attach point = row 0) so it can hang in front of canopy/trunk sprites; gentle left-right wobble per segment gives a hand-drawn feel even though behavior is static.
// Size: 6x16 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const VINE_1 = {
  name: 'Vine 1 - Bare Hanging Vine',
  theme: 'simple hanging vine, no leaves',
  behavior: {
    type: "static",
    layer: "foreground",
    collision: false,
    placement: "canopy-hang",
    animated: false,
    anchor: "top",
    sway: false
  },
  width: 6,
  height: 16,
  rows: [
    '..nn..',
    '..Nn..',
    '..nN..',
    '.nn...',
    '.Nn...',
    '..nN..',
    '..nn..',
    '.nN...',
    '.nn...',
    '..Nn..',
    '..nn..',
    '.nN...',
    '.nn...',
    '..Nn..',
    '..nn..',
    '..nn..'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = VINE_1;
