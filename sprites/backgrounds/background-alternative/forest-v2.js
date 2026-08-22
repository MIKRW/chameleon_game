// === Background: Forest v2 ===
// Working copy of the layer-1 terrarium backdrop, forked from forest-v1.js
// so it can keep being retuned without touching the saved v1 version — see
// sprites/backgrounds/index.js, BACKGROUND_VARIANTS + ACTIVE_BACKGROUND_KEY
// to see/change which one is actually drawn.
//
// Self-contained: ships its own palette (BACKGROUND_FOREST_V2.palette)
// rather than reusing TERRARIUM_PALETTE, so retuning this version's colors
// never touches any other sprite, and vice versa.
//
// No rock formations here (tried, looked cluttered/goofy — see forest-v1.js
// if that's ever wanted back). An earlier pass at this file also tried a
// per-cell random dither for the wash, which read as flat "TV static" /
// stacked blocks rather than plant life — see smoothNoise() below for the
// fix: soft, interpolated blobs instead of independent-per-cell noise.
// Palette leans dark and muted throughout — dark green-blue (teal) and dark
// green-brown (olive), no bright/light accents — for a calm, shadowed
// canopy feel rather than anything that pops forward.
//
// Generation passes, all built once at load, in paint order:
//  1. Soft blob wash — value noise (smoothNoise: bilinear interpolation
//     between a coarse lattice of random values, see below) sampled at a
//     low frequency, so color regions form large, organic, cloud-like
//     patches instead of pixel-by-pixel static. A second, finer octave is
//     blended in at low weight for subtle grain without breaking the soft
//     shapes. The resulting continuous field picks from a small dark
//     teal/olive/green palette, biased by depth (t: 0 top/lid, 1 bottom/
//     floor) so cooler tones sit higher and warmer/darker tones sit low.
//  2. Foliage clusters — small leaf-shaped motifs (from v1) stamped
//     sparsely and sparingly, recolored per instance from a couple of
//     muted light/dark pairs, as gentle accents on top of the wash rather
//     than the main source of texture.
// Both passes share one deterministic noise hash so the whole texture is
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
// range without ever running out of image on either edge. Full grid size:
// 300x120 (chunks x 2).

const BACKGROUND_FOREST_V2 = (function build() {
  const CHUNKS_W = 150;
  const CHUNKS_H = 60;

  const palette = {
    '.': null,
    // Backdrop wash — dark, muted, low-contrast family. No bright/light
    // entries on purpose: everything here should recede, not pop forward.
    '1': '#0c2315', // backdrop base, dark green
    '2': '#0f2c21', // backdrop, dark green-blue (teal) shift
    '3': '#07180c', // backdrop, deepest shadow
    '4': '#0a2d2d', // dark teal, cooler blue-green
    '5': '#261f0e', // dark green-brown (olive), warmer shift
    '9': '#082313', // deep pine shadow, between base and deepest shadow
    // Foliage accents — still muted/dark, just enough lift to read as
    // leaf shapes against the wash without turning bright
    '6': '#184827', // leaf, muted green
    '7': '#0e2d15', // leaf, muted green shade
    'a': '#2c4117', // leaf, muted olive-green
    'b': '#0d332c', // leaf, muted teal-green
  };

  // Deterministic pseudo-random in [0, 1) — same hash shape used for
  // reproducible "random" pixel art elsewhere, no external RNG dependency.
  function noise(x, y) {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  }

  // Value noise: hash the lattice corners around (x, y) and bilinearly
  // interpolate between them, so the result varies smoothly instead of
  // jumping randomly cell-to-cell — this is what turns "static" into soft,
  // organic blobs. Smoothstep on the fractional part avoids visible creases
  // at lattice boundaries.
  function smoothNoise(x, y) {
    const x0 = Math.floor(x); const x1 = x0 + 1;
    const y0 = Math.floor(y); const y1 = y0 + 1;
    let sx = x - x0; let sy = y - y0;
    sx *= sx * (3 - 2 * sx); // smoothstep
    sy *= sy * (3 - 2 * sy);
    const n00 = noise(x0, y0); const n10 = noise(x1, y0);
    const n01 = noise(x0, y1); const n11 = noise(x1, y1);
    const ix0 = n00 + (n10 - n00) * sx;
    const ix1 = n01 + (n11 - n01) * sx;
    return ix0 + (ix1 - ix0) * sy;
  }

  // --- Pass 1: soft blob wash -------------------------------------------
  const LOW_FREQ = 0.09; // large soft patches
  const HIGH_FREQ = 0.35; // subtle finer grain, blended in lightly
  const grid = [];
  for (let cy = 0; cy < CHUNKS_H; cy++) {
    const t = CHUNKS_H > 1 ? cy / (CHUNKS_H - 1) : 0; // 0 top (lid) -> 1 bottom (floor)
    const row = new Array(CHUNKS_W);
    for (let cx = 0; cx < CHUNKS_W; cx++) {
      const field = smoothNoise(cx * LOW_FREQ, cy * LOW_FREQ) * 0.75
        + smoothNoise(cx * HIGH_FREQ + 50, cy * HIGH_FREQ + 50) * 0.25; // 0..1-ish
      // Depth bias: nudge the field down near the floor so darker tones
      // win more often there, up near the top so teal/base win more often.
      const biased = Math.min(1, Math.max(0, field + (t - 0.5) * 0.25));
      let ch;
      if (biased < 0.16) ch = '3'; // deepest shadow, rare
      else if (biased < 0.34) ch = '9'; // pine shadow
      else if (biased < 0.52) ch = '1'; // base
      else if (biased < 0.68) ch = '2'; // teal-tinted base
      else if (biased < 0.85) ch = '4'; // cooler teal patch
      else ch = '5'; // olive-brown patch
      row[cx] = ch;
    }
    grid.push(row);
  }

  // --- Pass 2: sparse foliage accents ------------------------------------
  const LEAF_MOTIFS = [
    [{ dx: 0, dy: 0 }, { dx: 0, dy: 1, dark: true },
     { dx: 1, dy: 1 }, { dx: 1, dy: 2, dark: true }],
    [{ dx: 0, dy: 2, dark: true }, { dx: 1, dy: 1 },
     { dx: 1, dy: 0 }, { dx: 2, dy: 0, dark: true }],
    [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 1, dark: true }],
  ];
  const COLOR_PAIRS = [['6', '7'], ['a', '7'], ['b', '7']];

  function stampLeaf(motif, ox, oy, mirror, pair) {
    for (const cell of motif) {
      const dx = mirror ? -cell.dx : cell.dx;
      const x = ox + dx;
      const y = oy + cell.dy;
      if (x < 0 || x >= CHUNKS_W || y < 0 || y >= CHUNKS_H) continue;
      grid[y][x] = cell.dark ? pair[1] : pair[0];
    }
  }

  const CLUSTER_COUNT = 70;
  for (let i = 0; i < CLUSTER_COUNT; i++) {
    const u = noise(i * 4.7, 71.3); // 0..1, skewed toward the canopy above
    const cy = Math.round((u ** 1.4) * (CHUNKS_H - 1));
    const cx = Math.floor(noise(i * 6.1, 83.9) * CHUNKS_W);
    const motif = LEAF_MOTIFS[Math.floor(noise(i * 8.3, 97.7) * LEAF_MOTIFS.length)];
    const pair = COLOR_PAIRS[Math.floor(noise(i * 12.1, 137.9) * COLOR_PAIRS.length)];
    stampLeaf(motif, cx, cy, noise(i * 10.9, 113.1) > 0.5, pair);
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
    name: 'Background: Forest v2',
    theme: 'soft, dark blob wash (teal/olive-shifted greens) with sparse muted foliage accents, no rock formations',
    sprite: {
      width: CHUNKS_W * 2,
      height: CHUNKS_H * 2,
      rows,
    },
    palette,
  };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_FOREST_V2;
