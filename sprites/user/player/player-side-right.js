// === Player - Side-Climb Pose (right) ===
// Unlike the grounded pose, the body runs vertically (head at top, tail
// curled at the bottom) since this renders on a vertical trunk, with small
// legs gripping outward toward the side visible past the trunk's edge. Used
// while state.climb.face is 'side' and state.climb.side is 'right' — picked
// by which edge the player attached from (see game/movement.js
// attachToTrunk). Mirrored by player-side-left.js.
// 16-wide x 11-row grid, same dimensions as player.js. Uses PLAYER_PALETTE
// from ../../palette/player-palette.js.

const PLAYER_SIDE_RIGHT = [
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

if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_SIDE_RIGHT;
