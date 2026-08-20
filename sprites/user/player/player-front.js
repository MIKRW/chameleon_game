// === Player - Front-Climb Pose ===
// Flat against the trunk, viewed head-on, legs splayed symmetrically to grip
// both sides. Used while state.climb.face is 'front' (see game/movement.js
// attachToTrunk and game/render.js playerSpriteForState).
// 16-wide x 11-row grid, same dimensions as player.js. Uses PLAYER_PALETTE
// from ../../palette/player-palette.js.

const PLAYER_FRONT = [
  '.......u........',
  '......kkkk......',
  '.....keppek.....',
  '.....kggggk.....',
  '....kggGGggk....',
  '....kggGGggk....',
  '..kgkggGGggkgk..',
  '.kg.kggGGggk.gk.',
  'kk....kggk....kk',
  '.......kk.......',
  '.......k........',
];

if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_FRONT;
