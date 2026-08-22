// === Background: Forest v4 ===
// Combines forest-v1.js's layout (accent + leaf motifs stamped on top of a
// depth-biased wash) with forest-v3.js's soft smoothNoise blob technique
// for that wash, instead of v1's per-cell random dither. The accent motifs
// (was earthy brown mounds) are now a dark green-blue teal, shaped like the
// leaf motifs rather than blocky mounds, and stamped with a per-cell chance
// of leaving the wash showing through — so they read as another patch of
// foliage dissolving into the backdrop rather than a distinct solid blob.
//
// Self-contained: ships its own palette (BACKGROUND_FOREST_V4.palette)
// rather than reusing TERRARIUM_PALETTE, so retuning this version's colors
// never touches any other sprite, and vice versa.
//
// Two generation passes, both built once at load:
//  1. Soft blob wash — value noise (smoothNoise: bilinear interpolation
//     between a coarse lattice of random values, see forest-v2.js for the
//     full writeup of why) sampled at a low frequency plus a lighter finer
//     octave, so the backdrop gradient forms soft organic patches instead
//     of pixel-by-pixel static, biased by depth (t: 0 top/lid, 1 bottom/
//     floor) so lit tones sit higher and shadow tones sit low.
//  2. Small teal-accent ('4'/'5') and leaf-silhouette ('6'/'7') motifs
//     stamped sparsely on top, each cell kept only some of the time (see
//     BLEND_KEEP_CHANCE) so edges dissolve into the wash instead of pasting
//     in as a hard silhouette — accents biased toward the lower grid,
//     leaves biased toward the upper grid, same layout as v1.
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

const BACKGROUND_FOREST_V4 = (function build() {
  const CHUNKS_W = 150;
  const CHUNKS_H = 60;

  const palette = {
    '.': null,
    '1': '#132218', // backdrop base
    '2': '#1b3320', // backdrop lit, lighter — more common toward the top
    '3': '#0d1a10', // backdrop shadow, darker — more common toward the floor
    '4': '#123330', // teal accent, dark green-blue
    '5': '#081714', // teal accent shade, near-black green-blue
    '6': '#3f7a46', // leaf silhouette, muted mid green — bright enough to read against 1/2/3
    '7': '#1f4023', // leaf silhouette shade, dark muted green
  };

  // Deterministic pseudo-random in [0, 1) — same hash shape used for
  // reproducible "random" pixel art elsewhere, no external RNG dependency.
  function noise(x, y) {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  }

  // Value noise (see forest-v2.js/v3.js) — smooth interpolation between a
  // coarse lattice of random values, so colors form soft organic blobs
  // instead of per-cell static.
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
  const LOW_FREQ = 0.09;
  const HIGH_FREQ = 0.35;
  const grid = [];
  for (let cy = 0; cy < CHUNKS_H; cy++) {
    const t = CHUNKS_H > 1 ? cy / (CHUNKS_H - 1) : 0; // 0 top (lid) -> 1 bottom (floor)
    const row = new Array(CHUNKS_W);
    for (let cx = 0; cx < CHUNKS_W; cx++) {
      const field = smoothNoise(cx * LOW_FREQ, cy * LOW_FREQ) * 0.75
        + smoothNoise(cx * HIGH_FREQ + 50, cy * HIGH_FREQ + 50) * 0.25;
      const biased = Math.min(1, Math.max(0, field + (0.5 - t) * 0.3));
      let ch;
      if (biased < 0.3) ch = '3'; // shadow, more common near the floor
      else if (biased < 0.7) ch = '1'; // base
      else ch = '2'; // lit, more common near the top
      row[cx] = ch;
    }
    grid.push(row);
  }

  // --- Pass 2: teal-accent / leaf motifs, blended on top ----------------
  // Both motif families use the same elongated, diagonal leaf-shaped
  // footprints now (rather than the old blocky mound shape) so the teal
  // accents read as another kind of foliage clump, not a separate object
  // type. Cells simply omitted from the list leave the wash underneath
  // showing through, so footprints read as irregular blobs, not solid
  // rectangles.
  const TEAL_MOTIFS = [
    [{ dx: 0, dy: 0, ch: '4' }, { dx: 0, dy: 1, ch: '5' },
     { dx: 1, dy: 1, ch: '4' }, { dx: 1, dy: 2, ch: '5' }],
    [{ dx: 0, dy: 2, ch: '5' }, { dx: 1, dy: 1, ch: '4' },
     { dx: 1, dy: 0, ch: '4' }, { dx: 2, dy: 0, ch: '5' }],
    [{ dx: 0, dy: 0, ch: '4' }, { dx: 1, dy: 0, ch: '4' }, { dx: 2, dy: 1, ch: '5' }],
  ];
  const LEAF_MOTIFS = [
    [{ dx: 0, dy: 0, ch: '6' }, { dx: 0, dy: 1, ch: '7' },
     { dx: 1, dy: 1, ch: '6' }, { dx: 1, dy: 2, ch: '7' }],
    [{ dx: 0, dy: 2, ch: '7' }, { dx: 1, dy: 1, ch: '6' },
     { dx: 1, dy: 0, ch: '6' }, { dx: 2, dy: 0, ch: '7' }],
    [{ dx: 0, dy: 0, ch: '6' }, { dx: 1, dy: 0, ch: '6' }, { dx: 2, dy: 1, ch: '7' }],
  ];

  // Each cell only takes the motif's color BLEND_KEEP_CHANCE of the time —
  // otherwise it's skipped and the wash underneath keeps showing, so the
  // motif's silhouette dissolves at the edges instead of pasting in hard.
  const BLEND_KEEP_CHANCE = 0.72;
  function stamp(motif, ox, oy, mirror, seed) {
    for (const cell of motif) {
      const dx = mirror ? -cell.dx : cell.dx;
      const x = ox + dx;
      const y = oy + cell.dy;
      if (x < 0 || x >= CHUNKS_W || y < 0 || y >= CHUNKS_H) continue;
      if (noise(x * 17 + seed, y * 13 + seed * 3) > BLEND_KEEP_CHANCE) continue;
      grid[y][x] = cell.ch;
    }
  }

  const TEAL_COUNT = 90;
  for (let i = 0; i < TEAL_COUNT; i++) {
    const u = noise(i * 3.1, 11.7); // 0..1, skewed toward the floor below
    const cy = Math.round((1 - (1 - u) ** 1.6) * (CHUNKS_H - 1));
    const cx = Math.floor(noise(i * 5.3, 23.9) * CHUNKS_W);
    const motif = TEAL_MOTIFS[Math.floor(noise(i * 7.1, 41.3) * TEAL_MOTIFS.length)];
    stamp(motif, cx, cy, noise(i * 9.7, 59.1) > 0.5, i * 31 + 1);
  }

  const LEAF_COUNT = 140;
  for (let i = 0; i < LEAF_COUNT; i++) {
    const u = noise(i * 4.7, 71.3); // 0..1, skewed toward the canopy above
    const cy = Math.round((u ** 1.6) * (CHUNKS_H - 1));
    const cx = Math.floor(noise(i * 6.1, 83.9) * CHUNKS_W);
    const motif = LEAF_MOTIFS[Math.floor(noise(i * 8.3, 97.7) * LEAF_MOTIFS.length)];
    stamp(motif, cx, cy, noise(i * 10.9, 113.1) > 0.5, i * 37 + 2);
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
    name: 'Background: Forest v4',
    theme: 'v1 layout with v3-style soft blob wash, dark teal-blue leaf-shaped accents blended into the foliage instead of grey rock',
    sprite: {
      width: CHUNKS_W * 2,
      height: CHUNKS_H * 2,
      rows,
    },
    palette,
  };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_FOREST_V4;
