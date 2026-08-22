// === Background: Forest v7 (Autumn) ===
// Same hand-composed generator as forest-v6.js — explicit vertical light
// gradient, rolling per-column wave, fine dithered blending, soft leaf
// silhouettes — recolored to a warm orange/brown autumn palette instead of
// v6's cool teal-to-green. Every structural choice (full pixel-res build,
// 8x8 Bayer + jitter dithering, leaves stepped relative to the local tier)
// carries the same reasoning as v6; see that file's header for the "why."
// Kept as its own copy rather than a shared parameterized module because
// every other background variant in this folder is similarly self-
// contained — retuning one never risks the others.

const BACKGROUND_FOREST_V7 = (function build() {
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

  // Gradient anchors: floor is a near-black umber brown, lid warms up to a
  // lifted burnt-orange glow — hue drifts from brown toward orange across
  // the climb (opposite direction of v6's cool-to-green drift, but the same
  // "light source is above" logic). Saturation held a touch higher than
  // v6's 0.16 since warm hues read as muddier than cool ones at the same
  // saturation — still well inside the muted layer-1 band.
  const HUE_BOTTOM = 24; // dark umber brown
  const HUE_TOP = 36; // warm burnt orange
  const SAT = 0.24;
  const LIGHT_BOTTOM = 0.045;
  const LIGHT_TOP = 0.36;

  // Sprite rows are indexed one character at a time (see drawSpriteBlocky,
  // game/render.js) — every palette key MUST be a single character.
  const KEY_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const TIER_COUNT = 18;
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
  function ditherPick(x, y, frac) {
    const jitter = (smoothNoise(x * 0.5 + 12.3, y * 0.5 + 7.1) - 0.5) * 0.18;
    const threshold = (BAYER8[y & 7][x & 7] + 0.5) / 64 + jitter;
    return frac > threshold;
  }

  const WAVE_FREQ_A = 0.016;
  const WAVE_FREQ_B = 0.055;
  const WAVE_AMPLITUDE = 2.2;
  function waveOffset(x) {
    const a = smoothNoise(x * WAVE_FREQ_A, 5.2) * 2 - 1;
    const b = smoothNoise(x * WAVE_FREQ_B + 40, 91.7) * 2 - 1;
    return (a * 0.7 + b * 0.3) * WAVE_AMPLITUDE;
  }

  function tierAt(x, y) {
    const t = H > 1 ? y / (H - 1) : 0;
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

  const LEAF_MOTIFS = [
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
  ];
  const LEAF_TIER_STEP = 3;
  const LEAF_COVERAGE = 0.4;

  function softLeafPick(x, y, coverage) {
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
    const u = noise(i * 4.7, 71.3);
    const cy = Math.round((u ** 1.6) * (H - 1) * 0.72);
    const cx = Math.floor(noise(i * 6.1, 83.9) * W);
    const motif = LEAF_MOTIFS[Math.floor(noise(i * 8.3, 97.7) * LEAF_MOTIFS.length)];
    stampLeaf(motif, cx, cy, noise(i * 10.9, 113.1) > 0.5);
  }

  const rows = grid.map((row) => row.join(''));

  return {
    name: 'Background: Forest v7 (Autumn)',
    theme: 'hand-composed vertical light+hue gradient (dark umber floor shadow to warm burnt-orange canopy glow) with a rolling per-column wave, fine dithered blending, and soft leaf silhouettes',
    sprite: {
      width: W,
      height: H,
      rows,
    },
    palette,
  };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_FOREST_V7;
