// === Player - Default/Grounded Pose ===
// Generic side-profile lizard (long body, tail, and snout rather than any
// specific species) in bright purple with a blue-black shade and a single
// blue crest spike behind the head. Facing right; used for walking/falling/
// mid-air — everything except front-climbing and Cling to Sides, which have their
// own poses (see player-climb-front.js, player-climb-side.js). Mirrored at draw time
// when facing left (see game/render/actors.js playerFlipForState).
// 16-wide x 11-row grid (see PLAYER_W/PLAYER_H in game/constants.js, which
// must match this grid's dimensions). Uses PLAYER_PALETTE from
// ../../palette/player-palette.js.

const PLAYER_DEFAULT = [
  '................',
  '...........u....',
  '..........kUkk..',
  '........kkggepk.',
  '......kkggGggk..',
  '....kggGGGggggk.',
  '..kgg.GGGG.ggk..',
  '.kg..GGGG..gk...',
  'kk....kk...kk...',
  '.kk.............',
  '................',
];

if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_DEFAULT;
