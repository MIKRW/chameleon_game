// Aggregates the player's poses into one lookup table, the same way
// ../../index.js exposes TERRARIUM_SPRITES. Load player.js, player-front.js,
// player-side-left.js, and player-side-right.js before this one (or
// require() them in Node), then use SPRITES + PLAYER_PALETTE (from
// ../../palette/player-palette.js) + drawSprite (from ../../../sprites.js)
// to place the player.

const SPRITES = {
  player: PLAYER,
  playerFront: PLAYER_FRONT,
  playerSideLeft: PLAYER_SIDE_LEFT,
  playerSideRight: PLAYER_SIDE_RIGHT,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PLAYER_PALETTE: require('../../palette/player-palette.js'),
    SPRITES,
  };
}
