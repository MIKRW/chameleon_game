// Hand-defined pixel-art sprites, drawn to <canvas> from small text grids.
// Each sprite is a list of rows; each character maps to a palette color.
// '.' is transparent. No external image assets needed.

const PALETTE = {
  '.': null,
  'k': '#1a1a1a', // outline
  'g': '#a855f7', // player body (bright purple)
  'G': '#181430', // player body shade (blue-black)
  'e': '#ffffff', // eye white
  'p': '#000000', // pupil
  'b': '#6d4c34', // door brown
  'B': '#4e3423', // door brown shade
  'y': '#e0b84b', // keypad / brass accents
  't': '#37474f', // terminal casing
  'T': '#263238', // terminal casing shade
  's': '#00e676', // terminal screen glow
  'c': '#d8c48a', // scroll parchment
  'C': '#b3a06a', // scroll shade
  'v': '#78909c', // vault steel
  'V': '#546e7a', // vault steel shade
  'w': '#eceff1', // vault wheel highlight
  'u': '#38bdf8', // dorsal crest spike (bright blue, contrasts against the purple body)
  'U': '#0f2942', // crest shade (blue-black)
};

// Player poses below are a generic side-profile lizard (long body, tail, and
// snout rather than any specific species) in bright purple with a blue-black
// shade and a single blue crest spike behind the head. Each is a 16-wide x
// 11-row grid — bigger than the other room sprites so the elongated body
// silhouette reads clearly (see PLAYER_W/PLAYER_H in game.js, which must
// match this grid's dimensions).
const SPRITES = {
  // Default/grounded pose, facing right (used for walking/falling/mid-air —
  // everything except front- and side-climbing, which have their own poses
  // below).
  player: [
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
  ],
  // Front-climb pose — flat against the trunk, viewed head-on, legs splayed
  // symmetrically to grip both sides. Used while state.climb.face is
  // 'front' (see game.js attachToTrunk/playerSpriteForState).
  playerFront: [
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
  ],
  // Side-climb poses — unlike the grounded pose, the body runs vertically
  // (head at top, tail curled at the bottom) since these render on a
  // vertical trunk, with small legs gripping outward toward whichever side
  // is visible past the trunk's edge. Used while state.climb.face is
  // 'side', picked by which edge the player attached from (see game.js
  // attachToTrunk) — 'right' pokes legs/tail out to the right (the side
  // visible past the trunk), 'left' mirrors it to the left.
  playerSideRight: [
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
  ],
  playerSideLeft: [
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
  ],
  door: [
    'kkkkkkkkkkkk',
    'kbbbbbbbbbbk',
    'kbBbbbbbbBbk',
    'kbbbbbbbbbbk',
    'kbbb.yy.bbbk',
    'kbbb.yy.bbbk',
    'kbbbbbbbbbbk',
    'kbBbbbbbbBbk',
    'kbbbbbbbbbbk',
    'kkkkkkkkkkkk',
  ],
  terminal: [
    '.kkkkkkkkk..',
    '.ktttttttk..',
    '.ktssssstk..',
    '.ktssssstk..',
    '.ktssssstk..',
    '.kTTTTTTTk..',
    '..kkyykk....',
    '.kTTTTTTTk..',
    'kTTTTTTTTTk.',
    'kkkkkkkkkkk.',
  ],
  scroll: [
    '..cccccccc..',
    '.cCccccccCc.',
    'cCccccccccCc',
    'cccc.cc.cccc',
    'cccccccccccc',
    'cccc.cc.cccc',
    'cccccccccccc',
    'cCccccccccCc',
    '.cCccccccCc.',
    '..cccccccc..',
  ],
  vault: [
    'kkkkkkkkkkkk',
    'kvvvvvvvvvvk',
    'kvVvvwwvvVvk',
    'kvv.vwwv.vvk',
    'kvv.vwwv.vvk',
    'kvVvvwwvvVvk',
    'kvvvvvvvvvvk',
    'kvVvvvvvvVvk',
    'kvvvvvvvvvvk',
    'kkkkkkkkkkkk',
  ],
};

// `fade`, when given, fades rows from `minAlpha` (top, row 0) up to
// `maxAlpha` (bottom, last row) — same vertical fade convention as
// drawSpriteBlocky in game.js, for sprites that don't need the blocky
// background texture treatment.
function drawSprite(ctx, spriteRows, x, y, scale, palette = PALETTE, fade, flipX, flipY) {
  const lastRow = spriteRows.length - 1;
  for (let row = 0; row < spriteRows.length; row++) {
    const line = spriteRows[row];
    if (fade) {
      const t = lastRow > 0 ? row / lastRow : 1;
      ctx.globalAlpha = fade.minAlpha + (fade.maxAlpha - fade.minAlpha) * t;
    }
    const drawRow = flipY ? lastRow - row : row;
    for (let col = 0; col < line.length; col++) {
      const color = palette[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      const drawCol = flipX ? line.length - 1 - col : col;
      ctx.fillRect(x + drawCol * scale, y + drawRow * scale, scale, scale);
    }
  }
  if (fade) ctx.globalAlpha = 1;
}
