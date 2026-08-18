// === Floor - Terrarium Substrate ===
// Theme: soil/substrate ground tile, tileable horizontally
//
// Only floor sprite for now; player and props sit with their bottom edge on row 0 of this tile. Scattered 'x' pebbles break up flatness - vary their positions if a second variant is added later.
// Size: 24x4 (grid units; multiply by render scale)
// Uses the shared TERRARIUM_PALETTE from palette.js.

const FLOOR = {
  name: 'Floor - Terrarium Substrate',
  theme: 'soil/substrate ground tile, tileable horizontally',
  behavior: {
    type: "static",
    layer: "background",
    collision: true,
    placement: "ground-line",
    animated: false,
    tileable: "horizontal",
    tile_note: "repeat this tile edge-to-edge to fill the terrarium width"
  },
  width: 24,
  height: 4,
  rows: [
    'dddddddddddddddddddddxx.',
    'dDdddxddDdddddxdddDdddd.',
    'DDDDDDDDDDDDDDDDDDDDDDDD',
    'DDDDDDDDDDDDDDDDDDDDDDDD'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = FLOOR;
