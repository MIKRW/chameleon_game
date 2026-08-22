// === Background: Forest v6 ===
// Hand-composed replacement for the v2 "blob wash" backdrop. v2 picked a
// wash tone per-cell from a noise field, which read as random blotches with
// no clear depth logic. This version instead authors an explicit vertical
// light gradient — dark shadow pooling at the tank floor, lightening toward
// the lid, with a slow hue drift (cool teal-black at the floor warming
// slightly toward green near the lid) — then stamps soft/blurred leaf
// silhouettes on top, the same way tree-plant sprites stamp foliage onto a
// trunk rather than growing it from noise.
//
// Colors are generated in HSL rather than hand-picked hex, at a fine step
// count (TIER_COUNT), so the gradient has many small steps to dither
// between instead of a handful of far-apart tones — that's what makes
// adjacent wave bands blend into each other instead of reading as distinct
// stripes. Saturation stays flat at LAYER1_SAT (see DEPTH-LAYERS.md's ~15%
// layer-1 band); only hue and lightness move.
//
// Built at FULL pixel resolution (not a coarse chunk grid doubled up like
// v2/v1) — the dither needs to operate at the actual sampled-pixel scale or
// it reads as big flat checkerboard tiles instead of fine grain. An 8x8
// Bayer matrix (rather than 4x4) gives finer intermediate dither levels, and
// each pixel's threshold gets a small smooth-noise jitter so the dither
// pattern itself doesn't read as a rigid mechanical grid — closer to how a
// blurred/blended edge actually looks at this resolution. Leaves are darker
// than the tiers they sit on (silhouettes against the lamp-lit gradient, not
// brighter pop-color blobs) so they read as background texture, not shapes
// competing with the real foreground plants.
//
// Self-contained: ships its own generated palette so retuning this version
// never touches forest-v2 or any other sprite.

const BACKGROUND_FOREST_V6 = (function build() {
  // Full sampled-pixel resolution. drawSpriteBlocky (game/render.js) walks
  // this in BACKGROUND_PIXEL_BLOCK-size steps, so every value here is a
  // real candidate pixel rather than a duplicated macro-block.
  const W = 300;
  const H = 120;

  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Gradient anchors: floor is near-black cool teal, lid is a dark but
  // lifted green — hue drifts ~35deg across the climb, saturation held
  // constant in the layer-1 band so depth reads through lightness/hue, not
  // an accidental saturation swing.
  const HUE_BOTTOM = 175; // cool teal
  const HUE_TOP = 138; // shifted toward green
  const SAT = 0.16;
  const LIGHT_BOTTOM = 0.04;
  const LIGHT_TOP = 0.34;

  // Sprite rows are indexed one character at a time (see drawSpriteBlocky,
  // game/render.js), so every palette key here MUST be a single character —
  // multi-char keys joined into a row string silently corrupt the whole
  // grid (each character gets read back as its own separate key).
  const KEY_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const TIER_COUNT = 18; // fine steps so dithering blends rather than stripes
  const palette = { '.': null };
  const TIERS = [];
  let keyCursor = 0;
  for (let i = 0; i < TIER_COUNT; i++) {
    const t = i / (TIER_COUNT - 1); // 0 floor -> 1 lid
    const hue = HUE_BOTTOM + (HUE_TOP - HUE_BOTTOM) * t;
    const light = LIGHT_BOTTOM + (LIGHT_TOP - LIGHT_BOTTOM) * t;
    const key = KEY_CHARS[keyCursor++];
    palette[key] = hslToHex(hue, SAT, light);
    TIERS.push(key);
  }

  function noise(x, y) {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  }

  function smoothNoise(x, y) {
    const x0 = Math.floor(x); const x1 = x0 + 1;
    const y0 = Math.floor(y); const y1 = y0 + 1;
    let sx = x - x0; let sy = y - y0;
    sx *= sx * (3 - 2 * sx);
    sy *= sy * (3 - 2 * sy);
    const n00 = noise(x0, y0); const n10 = noise(x1, y0);
    const n01 = noise(x0, y1); const n11 = noise(x1, y1);
    const ix0 = n00 + (n10 - n00) * sx;
    const ix1 = n01 + (n11 - n01) * sx;
    return ix0 + (ix1 - ix0) * sy;
  }

  // 8x8 Bayer ordered-dither matrix (finer than 4x4 — more intermediate
  // dither levels between two adjacent tiers, so a wave boundary blends
  // over a wider, softer band). Every drawn pixel still stays one flat
  // palette hex — the "blend" is a pixel-density gradient, not alpha.
  const BAYER8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ];
  // Small smooth jitter added to each pixel's dither threshold so the
  // pattern doesn't read as a rigid mechanical grid at the boundary between
  // two wave bands — nudges the effective matrix cell up/down a little,
  // organic-blurring the edge the same way real light bleeds unevenly.
  function ditherPick(x, y, frac) {
    const jitter = (smoothNoise(x * 0.5 + 12.3, y * 0.5 + 7.1) - 0.5) * 0.18;
    const threshold = (BAYER8[y & 7][x & 7] + 0.5) / 64 + jitter;
    return frac > threshold;
  }

  // Wave: two smooth octaves of low-frequency noise, summed, so the
  // gradient's tier boundaries rise and fall at a couple of different
  // scales across the width instead of one uniform ripple.
  const WAVE_FREQ_A = 0.016; // broad, slow rolling hills
  const WAVE_FREQ_B = 0.055; // smaller secondary ripple
  const WAVE_AMPLITUDE = 2.2; // in tier-index units — how far boundaries shift
  function waveOffset(x) {
    const a = smoothNoise(x * WAVE_FREQ_A, 5.2) * 2 - 1;
    const b = smoothNoise(x * WAVE_FREQ_B + 40, 91.7) * 2 - 1;
    return (a * 0.7 + b * 0.3) * WAVE_AMPLITUDE;
  }

  function tierAt(x, y) {
    const t = H > 1 ? y / (H - 1) : 0; // 0 top/lid -> 1 bottom/floor
    // Full-strength wave everywhere — the playable camera mostly frames the
    // lower half of this backdrop, so a taper toward the floor would hide
    // the undulation from view entirely instead of just calming it.
    const offsetVal = waveOffset(x);
    let p = (1 - t) * (TIERS.length - 1) + offsetVal;
    p = Math.min(TIERS.length - 1, Math.max(0, p));
    const base = Math.floor(p);
    const next = Math.min(TIERS.length - 1, base + 1);
    const frac = p - base;
    return ditherPick(x, y, frac) ? next : base;
  }

  const grid = [];
  for (let y = 0; y < H; y++) {
    const row = new Array(W);
    for (let x = 0; x < W; x++) row[x] = TIERS[tierAt(x, y)];
    grid.push(row);
  }

  // --- Blurred leaf silhouettes ------------------------------------------
  // Small motifs, darker than whatever wash tier already sits under each
  // cell — a fixed step down the SAME gradient array, not a separate
  // near-black tone. A fixed absolute darkness read fine at the shadowy
  // floor but read as stark black dots once the wash lightened toward the
  // canopy; stepping relative to the local tier keeps the contrast (and the
  // "softness") consistent everywhere. Dithered at partial coverage with a
  // wider jitter than the wash dither so edges break up into loose grain
  // instead of a crisp cutout or a hard dot.
  const LEAF_MOTIFS = [
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
  ];
  const LEAF_TIER_STEP = 3; // how many tiers darker than the local wash
  const LEAF_COVERAGE = 0.4; // fraction of a stamped cell that actually darkens

  function softLeafPick(x, y, coverage) {
    // Wider/softer jitter than the wash's ditherPick, and no hard Bayer
    // grid — a purely noise-based threshold blurs the leaf's edge into
    // loose, irregular grain rather than a crisp dithered silhouette.
    const n = smoothNoise(x * 0.9 + 3.1, y * 0.9 + 17.4);
    return n < coverage;
  }

  function stampLeaf(motif, ox, oy, mirror) {
    for (const cell of motif) {
      const dx = mirror ? -cell.x : cell.x;
      const x = ox + dx;
      const y = oy + cell.y;
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      if (!softLeafPick(x, y, LEAF_COVERAGE)) continue;
      const currentTier = TIERS.indexOf(grid[y][x]);
      const darker = TIERS[Math.max(0, currentTier - LEAF_TIER_STEP)];
      grid[y][x] = darker;
    }
  }

  const CLUSTER_COUNT = 90;
  for (let i = 0; i < CLUSTER_COUNT; i++) {
    // Biased toward the upper 2/3 (canopy), rare near the floor.
    const u = noise(i * 4.7, 71.3);
    const cy = Math.round((u ** 1.6) * (H - 1) * 0.72);
    const cx = Math.floor(noise(i * 6.1, 83.9) * W);
    const motif = LEAF_MOTIFS[Math.floor(noise(i * 8.3, 97.7) * LEAF_MOTIFS.length)];
    stampLeaf(motif, cx, cy, noise(i * 10.9, 113.1) > 0.5);
  }

  const rows = grid.map((row) => row.join(''));

  return {
    name: 'Background: Forest v6',
    theme: 'hand-composed vertical light+hue gradient (dark cool floor shadow to lifted green canopy) with a rolling per-column wave, fine dithered blending, and soft leaf silhouettes',
    sprite: {
      width: W,
      height: H,
      rows,
    },
    palette,
  };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_FOREST_V6;
