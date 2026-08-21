// === Background: Forest v3 ===
// A middle ground between forest-v1.js (brighter dithered gradient + small
// rock/leaf motifs, more contrast) and forest-v2.js (soft smoothNoise blob
// wash, dark teal/olive, muted, no rocks) — made at the user's request to
// compare against both. Self-contained: own palette, doesn't touch either
// other variant.
//
// Keeps v2's core fix (smoothNoise blobs instead of per-cell static — see
// that file's header for why) since that's what solved the "stacky" look,
// but lifts the palette partway back toward v1's brightness/saturation so
// it reads a little more vivid/foliage-rich than v2's very dark wash.
// Still deliberately drops v1's rock motifs — those were the part that got
// called out as cluttered/goofy, so this is a color-and-mood middle
// ground, not a rock middle ground. See sprites/backgrounds/index.js to
// switch which variant is active.
//
// Generated at a coarse 150x60 "chunk" grid (each chunk drawn 2x2 into the
// full array) — see forest-v2.js for the full mechanical breakdown
// (drawSpriteBlocky chunking, BACKGROUND_PARALLAX slack width, etc.), all
// identical here.

const BACKGROUND_FOREST_V3 = (function build() {
  const CHUNKS_W = 150;
  const CHUNKS_H = 60;

  const palette = {
    '.': null,
    // Backdrop wash — blended: v2's teal/olive-shifted hues, lifted further
    // toward v1's brightness this pass (was a smaller lift before).
    '1': '#1a3322', // backdrop base
    '2': '#20402f', // backdrop, teal-tinted lift
    '3': '#0e2015', // backdrop, deepest shadow
    '4': '#164a44', // dark teal, cooler blue-green patch
    '5': '#332d1c', // dark olive-brown patch
    '9': '#15331f', // pine shadow, between base and deepest shadow
    // Foliage accents — close to v1's saturation now
    '6': '#3a7040', // leaf, mid-bright green
    '7': '#1c3c22', // leaf, mid-bright green shade
    'a': '#4a5a2e', // leaf, olive-moss green
    'b': '#204a40', // leaf, teal green
  };

  // Deterministic pseudo-random in [0, 1) — same hash shape used for
  // reproducible "random" pixel art elsewhere, no external RNG dependency.
  function noise(x, y) {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  }

  // Value noise (see forest-v2.js) — smooth interpolation between a coarse
  // lattice of random values, so colors form soft organic blobs instead of
  // per-cell static.
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
      const biased = Math.min(1, Math.max(0, field + (t - 0.5) * 0.25));
      let ch;
      if (biased < 0.16) ch = '3';
      else if (biased < 0.34) ch = '9';
      else if (biased < 0.52) ch = '1';
      else if (biased < 0.68) ch = '2';
      else if (biased < 0.85) ch = '4';
      else ch = '5';
      row[cx] = ch;
    }
    grid.push(row);
  }

  // --- Pass 2: foliage accents, leaning toward v1's density -------------
  // Closer to v1's dense 220 than v2's sparse 70 now.
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

  const CLUSTER_COUNT = 180;
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
    const doubledRow = grid[cy].map((c) => c + c).join('');
    rows.push(doubledRow, doubledRow);
  }

  return {
    name: 'Background: Forest v3',
    theme: 'middle ground between v1 (brighter, dithered, rocky) and v2 (dark, soft, no rocks) — smooth wash, lifted palette, no rocks',
    sprite: {
      width: CHUNKS_W * 2,
      height: CHUNKS_H * 2,
      rows,
    },
    palette,
  };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_FOREST_V3;
