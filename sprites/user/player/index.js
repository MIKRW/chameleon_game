// Aggregates the player's poses into one lookup table, the same way
// ../../index.js exposes TERRARIUM_SPRITES. Load player-default.js,
// player-climb-front.js, and player-climb-side.js before this one, then use
// SPRITES + PLAYER_PALETTE (from ../../palette/player-palette.js) +
// drawSprite (from ../../../sprites.js) to place the player.

const SPRITES = {
  playerDefault: PLAYER_DEFAULT,
  playerClimbFront: PLAYER_CLIMB_FRONT,
  playerClimbSide: PLAYER_CLIMB_SIDE,
};
