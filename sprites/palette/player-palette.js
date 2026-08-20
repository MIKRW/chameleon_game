// Palette for the player (chameleon) sprite in sprites/user/player/. Follows
// the same convention as TERRARIUM_PALETTE in ./terrarium-palette.js: '.' is
// transparent, every other character maps to a hex color. Kept separate so
// the player can be themed independently of the terrarium set.

const PLAYER_PALETTE = {
  '.': null,
  'k': '#1a1a1a', // outline
  'g': '#a855f7', // player body (bright purple)
  'G': '#181430', // player body shade (blue-black)
  'e': '#ffffff', // eye white
  'p': '#000000', // pupil
  'u': '#38bdf8', // dorsal crest spike (bright blue, contrasts against the purple body)
  'U': '#0f2942', // crest shade (blue-black)
};

if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_PALETTE;
