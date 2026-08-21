// === Background: Forest v1 ===
// The first tuned version of the layer-1 terrarium backdrop — kept as-is
// here so we can always swap back to it (see sprites/backgrounds/index.js,
// BACKGROUND_VARIANTS.forestV1) while forest-v2.js is tweaked further.
//
// Self-contained: ships its own palette (BACKGROUND_FOREST_V1.palette)
// rather than reusing TERRARIUM_PALETTE, so retuning this version's colors
// never touches any other sprite, and vice versa.
//
// Two generation passes, both built once at load:
//  1. A vertical gradient dither ('1'/'2'/'3', the dark-green backdrop
//     family) — lighter near the top (lid light), darker near the floor.
//  2. Small rock ('4'/'5') and leaf-silhouette ('6'/'7') motifs stamped
//     sparsely on top — rocks biased toward the lower grid, leaves biased
//     toward the upper grid, echoing the vivarium reference photos'
//     canopy-above/stone-below read without drawing anything detailed
//     enough to compete with actual foreground trunks/plants.
// Both passes use the same deterministic noise hash so the whole texture is
// stable across reloads instead of re-rolling every page load.
//
// Generated at a coarse 150x60 "chunk" grid (each chunk drawn 2x2 into the
// full array) so drawBackgroundSprite() (game/render.js) can render it with
// drawSpriteBlocky's BACKGROUND_PIXEL_BLOCK chunking, same lo-fi/
// further-away treatment drawBackgroundDecor() gives background trunks. At
// SCALE (4) x BACKGROUND_PIXEL_BLOCK (2) = 8px per chunk, the 720x480
// canvas only needs 90x60 chunks — the extra 60 chunks of width (480px)
// are slack so drawBackgroundSprite() can scroll this texture at
// BACKGROUND_PARALLAX speed (game/constants.js) across the whole camera
// range without ever running out of image on either edge; a single wide
// texture beats tiling two copies (tiling would seam, since this pattern
// isn't edge-seamless). Full grid size: 300x120 (chunks x 2).

const BACKGROUND_FOREST_V1 = (function build() {
  const CHUNKS_W = 150;
  const CHUNKS_H = 60;

  const palette = {
    '.': null,
    '1': '#132218', // backdrop base (matches the original flat fill exactly)
    '2': '#1b3320', // backdrop lit fleck, lighter — thins out toward the floor
    '3': '#0d1a10', // backdrop shadow fleck, darker — thickens toward the floor
    '4': '#4a5850', // rock highlight, cool desaturated grey-green
    '5': '#232e29', // rock shade, dark cool grey-green
    '6': '#3f7a46', // leaf silhouette, muted mid green — bright enough to read against 1/2/3
    '7': '#1f4023', // leaf silhouette shade, dark muted green
  };

  // Deterministic pseudo-random in [0, 1) — same hash shape used for
  // reproducible "random" pixel art elsewhere, no external RNG dependency.
  function noise(x, y) {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  }

  // --- Pass 1: vertical gradient dither -------------------------------
  const grid = [];
  for (let cy = 0; cy < CHUNKS_H; cy++) {
    const t = CHUNKS_H > 1 ? cy / (CHUNKS_H - 1) : 0; // 0 top (lid) -> 1 bottom (floor)
    const lightChance = 0.12 * (1 - t * 0.7); // lit flecks thin out with depth
    const darkChance = 0.12 * (0.3 + t * 0.7); // shadow flecks thicken with depth
    const row = new Array(CHUNKS_W);
    for (let cx = 0; cx < CHUNKS_W; cx++) {
      const n = noise(cx, cy);
      let ch = '1';
      if (n < lightChance) ch = '2';
      else if (n > 1 - darkChance) ch = '3';
      row[cx] = ch;
    }
    grid.push(row);
  }

  // --- Pass 2: rock / leaf motifs, stamped on top ---------------------
  // Each template is a small footprint of {dx, dy, ch}; cells simply
  // omitted from the list leave the gradient underneath showing through,
  // so footprints read as irregular blobs, not solid rectangles.
  const ROCK_MOTIFS = [
    [{ dx: 1, dy: 0, ch: '5' }, { dx: 2, dy: 0, ch: '5' },
     { dx: 0, dy: 1, ch: '5' }, { dx: 1, dy: 1, ch: '4' }, { dx: 2, dy: 1, ch: '4' }, { dx: 3, dy: 1, ch: '5' },
     { dx: 1, dy: 2, ch: '5' }, { dx: 2, dy: 2, ch: '5' }],
    [{ dx: 0, dy: 0, ch: '5' }, { dx: 1, dy: 0, ch: '4' },
     { dx: 0, dy: 1, ch: '4' }, { dx: 1, dy: 1, ch: '4' }, { dx: 2, dy: 1, ch: '5' }],
  ];
  const LEAF_MOTIFS = [
    [{ dx: 0, dy: 0, ch: '6' }, { dx: 0, dy: 1, ch: '7' },
     { dx: 1, dy: 1, ch: '6' }, { dx: 1, dy: 2, ch: '7' }],
    [{ dx: 0, dy: 2, ch: '7' }, { dx: 1, dy: 1, ch: '6' },
     { dx: 1, dy: 0, ch: '6' }, { dx: 2, dy: 0, ch: '7' }],
    [{ dx: 0, dy: 0, ch: '6' }, { dx: 1, dy: 0, ch: '6' }, { dx: 2, dy: 1, ch: '7' }],
  ];

  function stamp(motif, ox, oy, mirror) {
    for (const cell of motif) {
      const dx = mirror ? -cell.dx : cell.dx;
      const x = ox + dx;
      const y = oy + cell.dy;
      if (x < 0 || x >= CHUNKS_W || y < 0 || y >= CHUNKS_H) continue;
      grid[y][x] = cell.ch;
    }
  }

  const ROCK_COUNT = 90;
  for (let i = 0; i < ROCK_COUNT; i++) {
    const u = noise(i * 3.1, 11.7); // 0..1, skewed toward the floor below
    const cy = Math.round((1 - (1 - u) ** 1.6) * (CHUNKS_H - 1));
    const cx = Math.floor(noise(i * 5.3, 23.9) * CHUNKS_W);
    const motif = ROCK_MOTIFS[Math.floor(noise(i * 7.1, 41.3) * ROCK_MOTIFS.length)];
    stamp(motif, cx, cy, noise(i * 9.7, 59.1) > 0.5);
  }

  const LEAF_COUNT = 140;
  for (let i = 0; i < LEAF_COUNT; i++) {
    const u = noise(i * 4.7, 71.3); // 0..1, skewed toward the canopy above
    const cy = Math.round((u ** 1.6) * (CHUNKS_H - 1));
    const cx = Math.floor(noise(i * 6.1, 83.9) * CHUNKS_W);
    const motif = LEAF_MOTIFS[Math.floor(noise(i * 8.3, 97.7) * LEAF_MOTIFS.length)];
    stamp(motif, cx, cy, noise(i * 10.9, 113.1) > 0.5);
  }

  // --- Expand to the full pixel-sampled array --------------------------
  const rows = [];
  for (let cy = 0; cy < CHUNKS_H; cy++) {
    // Expand each chunk 2x horizontally, and reuse the same row twice
    // (2x vertically) — drawSpriteBlocky only samples every BACKGROUND_
    // PIXEL_BLOCK-th row/col, so the duplicate entries just exist to fill
    // out the sampled array; only the even indices are ever read.
    const doubledRow = grid[cy].map((c) => c + c).join('');
    rows.push(doubledRow, doubledRow);
  }

  return {
    name: 'Background: Forest v1',
    theme: 'procedural gradient + rock/leaf motif backdrop texture, replaces the flat layer-1 fill',
    sprite: {
      width: CHUNKS_W * 2,
      height: CHUNKS_H * 2,
      rows,
    },
    palette,
  };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_FOREST_V1;
