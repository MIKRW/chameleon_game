// === Player - Side-Climb Pose (left) ===
// Mirror of player-side-right.js — used while state.climb.face is 'side'
// and state.climb.side is 'left' (see game/movement.js attachToTrunk).
// 16-wide x 11-row grid, same dimensions as player.js. Uses PLAYER_PALETTE
// from ../../palette/player-palette.js.

const PLAYER_SIDE_LEFT = [
  '...........kk...',
  '.........kpegk..',
  '........kgkggk..',
  '..........kgGk..',
  '..........kggkgk',
  '........kgkgGk..',
  '..........kggk..',
  '..........kgGkgk',
  '........kgkggk..',
  '............kgk.',
  '..............kk',
];

if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_SIDE_LEFT;
