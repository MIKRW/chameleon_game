// Depth-layer bark saturation ladder — shared by every ladder-driven trunk
// entry in palette/terrarium-palette.js (trunk-interact-1/3's vivid r/R/h
// bark, trunk-bg-1a/2a/3a/4a/5a's muted q/Q/p back-bark). Each trunk is
// authored with ONE base color set at its native/richest layer; the other
// layer(s) it can appear at are derived here via an HSL round-trip that
// holds hue constant and only steps saturation/lightness — replacing the
// old hand-authored per-layer hex tables (which drifted hue between layers,
// not just saturation) with a computed formula.
//
// Measured baseline (see the old TERRARIUM_PALETTE_LAYER5_TREES /
// TERRARIUM_PALETTE_LAYER3_TREES tables, formerly in game/constants.js):
// layer 2 (~18% sat) < layer 3 (~24%) < layer 5 (~32%) < layer 8 (~42%, the
// richest/closest tier). Layers 5 and 8 (interactive trunks) are never
// alpha-faded — depth between them is carried entirely by this ladder, not
// opacity (see DEPTH-LAYERS.md and the comment above TREE_FADE_MIN_ALPHA in
// game/constants.js).

const LAYER_BARK_SATURATION = {
  2: 0.18,
  3: 0.24,
  5: 0.32,
  8: 0.42,
};

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hueToRgbChannel(p, q, t) {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToHex(h, s, l) {
  let r;
  let g;
  let b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgbChannel(p, q, h + 1 / 3);
    g = hueToRgbChannel(p, q, h);
    b = hueToRgbChannel(p, q, h - 1 / 3);
  }
  const toHex = (c) => {
    const v = Math.round(Math.max(0, Math.min(1, c)) * 255);
    return v.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Holds hue constant, steps saturation to the target layer's ladder rung,
// and nudges lightness along with it (rather than leaving lightness as-is)
// so a big saturation drop doesn't leave a washed-out/muddy color — same
// shape as the old hand-tuned tables' lightness moves, just computed instead
// of hand-picked per layer.
function deriveBarkColor(baseHex, targetLayer) {
  const { h, s, l } = hexToHsl(baseHex);
  const targetS = LAYER_BARK_SATURATION[targetLayer];
  const ratio = s > 0 ? targetS / s : 1;
  const targetL = l * (0.75 + 0.25 * ratio);
  return hslToHex(h, targetS, targetL);
}

// baseColors: { key: hex, ... } authored at baseLayer. Returns
// { [layer]: { key: hex, ... } } for every layer in `layers` — baseLayer's
// entry is baseColors verbatim (identity), every other layer's entry is
// each key run through deriveBarkColor for that layer.
function buildBarkLayers(baseColors, baseLayer, layers) {
  const result = {};
  for (const layer of layers) {
    if (layer === baseLayer) {
      result[layer] = { ...baseColors };
      continue;
    }
    const derived = {};
    for (const key in baseColors) {
      derived[key] = deriveBarkColor(baseColors[key], layer);
    }
    result[layer] = derived;
  }
  return result;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LAYER_BARK_SATURATION, hexToHsl, hslToHex, deriveBarkColor, buildBarkLayers };
}
