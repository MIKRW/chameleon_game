// === Player - Side-Climb Pose ===
// Body runs vertically (head up, tail curled down) for clinging to a
// trunk's edge, with legs gripping outward. Drawn for the right edge;
// game/render.js flips it horizontally for the left edge.
// Used while state.climb.face is 'side' (see game/movement.js attachToTrunk).
// 16x11, uses PLAYER_PALETTE.

const PLAYER_CLIMB_SIDE = [
  '...kk...........',
  '..kgepk.........',
  '..kggkgk........',
  '..kGgk..........',
  'kgkggk..........',
  '..kGgkgk........',
  '..kggk..........',
  'kgkGgk..........',
  '..kggkgk........',
  '.kgk............',
  'kk..............',
];

if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_CLIMB_SIDE;
