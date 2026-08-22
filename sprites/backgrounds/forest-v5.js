// === Background: Forest v5 ===
// Mixes forest-v3.js (brighter smoothNoise wash, denser foliage — the one
// that's been preferred so far) with forest-v4.js's blended-motif technique
// (each stamped cell only keeps its color some of the time, so edges
// dissolve into the wash instead of pasting in hard). No teal or earthy
// brown this time — the whole palette is jewel-toned green: ebony-shadow,
// emerald, and jade.
//
// Self-contained: ships its own palette (BACKGROUND_FOREST_V5.palette)
// rather than reusing TERRARIUM_PALETTE, so retuning this version's colors
// never touches any other sprite, and vice versa.
//
// Two generation passes, both built once at load:
//  1. Soft blob wash — value noise (smoothNoise, see forest-v2.js for the
//     full writeup) sampled at a low frequency plus a lighter finer octave,
//     picking across a 6-tone jewel-green pool (ebony shadow through
//     emerald/jade patches) weighted by depth (t: 0 top/lid, 1 bottom/
//     floor) — same mechanic as v3's wash, recolored.
//  2. Foliage clusters — leaf-shaped motifs (v3/v4's shapes) stamped
//     sparsely, each recolored from an emerald or jade light/dark pair,
//     with v4's per-cell blend chance so clusters dissolve into the wash
//     at their edges instead of reading as pasted-on shapes.
// Both passes share one deterministic noise hash so the whole texture is
// stable across reloads instead of re-rolling every page load.
//
// Generated at a coarse 150x60 "chunk" grid (each chunk drawn 2x2 into the
// full array) — see forest-v2.js for the full mechanical breakdown
// (drawSpriteBlocky chunking, BACKGROUND_PARALLAX slack width, etc.), all
// identical here.

const BACKGROUND_FOREST_V5 = (function build() {
  const CHUNKS_W = 150;
  // 60 chunks exactly covers CANVAS_H at zero scroll offset; the extra 6
  // give drawBackgroundSprite's vertical parallax (game/render.js) room to
  // shift the texture without exposing its bottom edge while climbing.
  const CHUNKS_H = 66;

  // Canonical jewel-green hues, desaturated to ~15% (layer-1 tier of the
  // depth-layer saturation ladder, see DEPTH-LAYERS.md — this is the
  // furthest layer, so it needs to be the least vivid of all of them; same
  // hue and lightness as the original jewel-toned set, just pulled toward
  // gray). BRIGHTNESS below scales all of them uniformly on top of that
  // (same hue/saturation ratio, just darker or lighter) so "make it darker"
  // is a one-line change instead of hand-recalculating every hex. Drop
  // BRIGHTNESS toward 0 to go darker, push it above 1 (up to ~1.4 or so
  // before channels start clipping at 255) to go lighter.
  const BASE_COLORS = {
    '1': '#1e2922', // backdrop base, ebony-tinted deep green
    '2': '#2b3b32', // backdrop lit lift, richer green
    '3': '#0f1511', // backdrop, deepest ebony shadow
    '9': '#18201b', // pine shadow, between base and deepest
    '4': '#3b4f46', // emerald patch
    '5': '#486157', // jade patch
    '6': '#506d5d', // leaf, bright emerald
    '7': '#293831', // leaf, emerald shade
    'a': '#64877b', // leaf, bright jade
    'b': '#344640', // leaf, jade shade
  };
  const BRIGHTNESS = 0.62; // currently "one shade darker" than BASE_COLORS
  // Nudges each color's channels away from its own gray point before the
  // BRIGHTNESS scale is applied, a small bump above the ~15%-desaturated
  // BASE_COLORS tier so layer 1 doesn't read as quite so washed-out.
  const SATURATION_BOOST = 1.1;

  function scaleColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v * factor)));
    return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
  }

  function boostSaturation(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const avg = (r + g + b) / 3;
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(avg + (v - avg) * factor)));
    return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
  }

  const palette = { '.': null };
  for (const [key, hex] of Object.entries(BASE_COLORS)) {
    palette[key] = scaleColor(boostSaturation(hex, SATURATION_BOOST), BRIGHTNESS);
  }

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
      if (biased < 0.16) ch = '3'; // deepest ebony shadow, rare
      else if (biased < 0.34) ch = '9'; // pine shadow
      else if (biased < 0.52) ch = '1'; // base
      else if (biased < 0.68) ch = '2'; // lit lift
      else if (biased < 0.85) ch = '4'; // emerald patch
      else ch = '5'; // jade patch
      row[cx] = ch;
    }
    grid.push(row);
  }

  // --- Pass 2: foliage clusters, blended at the edges --------------------
  const LEAF_MOTIFS = [
    [{ dx: 0, dy: 0 }, { dx: 0, dy: 1, dark: true },
     { dx: 1, dy: 1 }, { dx: 1, dy: 2, dark: true }],
    [{ dx: 0, dy: 2, dark: true }, { dx: 1, dy: 1 },
     { dx: 1, dy: 0 }, { dx: 2, dy: 0, dark: true }],
    [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 1, dark: true }],
  ];
  const COLOR_PAIRS = [['6', '7'], ['a', 'b']]; // emerald pair, jade pair

  // Each cell only takes the motif's color BLEND_KEEP_CHANCE of the time —
  // otherwise it's skipped and the wash underneath keeps showing, so the
  // cluster's silhouette dissolves at the edges instead of pasting in hard.
  const BLEND_KEEP_CHANCE = 0.78;
  function stampLeaf(motif, ox, oy, mirror, pair, seed) {
    for (const cell of motif) {
      const dx = mirror ? -cell.dx : cell.dx;
      const x = ox + dx;
      const y = oy + cell.dy;
      if (x < 0 || x >= CHUNKS_W || y < 0 || y >= CHUNKS_H) continue;
      if (noise(x * 17 + seed, y * 13 + seed * 3) > BLEND_KEEP_CHANCE) continue;
      grid[y][x] = cell.dark ? pair[1] : pair[0];
    }
  }

  const CLUSTER_COUNT = 160;
  for (let i = 0; i < CLUSTER_COUNT; i++) {
    const u = noise(i * 4.7, 71.3); // 0..1, skewed toward the canopy above
    const cy = Math.round((u ** 1.4) * (CHUNKS_H - 1));
    const cx = Math.floor(noise(i * 6.1, 83.9) * CHUNKS_W);
    const motif = LEAF_MOTIFS[Math.floor(noise(i * 8.3, 97.7) * LEAF_MOTIFS.length)];
    const pair = COLOR_PAIRS[Math.floor(noise(i * 12.1, 137.9) * COLOR_PAIRS.length)];
    stampLeaf(motif, cx, cy, noise(i * 10.9, 113.1) > 0.5, pair, i * 37 + 2);
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
    name: 'Background: Forest v5',
    theme: 'v3 wash + v4 blended-motif technique, recolored to ebony/emerald/jade — no teal, no earthy brown',
    sprite: {
      width: CHUNKS_W * 2,
      height: CHUNKS_H * 2,
      rows,
    },
    palette,
  };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_FOREST_V5;
