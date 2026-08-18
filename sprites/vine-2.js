// === Vine 2 - Leafy Hanging Vine ===
// Theme: hanging vine with alternating leaf clusters
//
// Same anchor/attach convention as Vine 1; small leaf tufts ('l') alternate sides every ~4 rows to avoid a repetitive look when several are placed in a row.
// Size: 6x16 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const VINE_2 = {
  name: 'Vine 2 - Leafy Hanging Vine',
  theme: 'hanging vine with alternating leaf clusters',
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
    '.lNnl.',
    '..nN..',
    '..Nn..',
    'lnNnl.',
    '..nN..',
    '..nn..',
    '.lNnl.',
    '..Nn..',
    '..nn..',
    'lnNnl.',
    '..nN..',
    '..nn..',
    '.lNnl.',
    '..Nn..',
    '..nn..'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = VINE_2;
