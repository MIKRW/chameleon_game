// Shared palette for the terrarium sprite set (plants, vines, trunks, canopy,
// floor, glass edges). Follows the same convention as the top-level
// PALETTE in ../sprites.js: '.' is transparent, every other character maps
// to a hex color. Kept separate so the terrarium set can be themed
// independently of the existing room/puzzle sprites.

const TERRARIUM_PALETTE = {
  '.': null,
  'k': '#1a1a1a', // shared outline

  // leaves / ground foliage
  'l': '#66bb6a', // leaf light
  'L': '#2e7d32', // leaf dark
  'f': '#a5d6a7', // leaf highlight / frond tip

  // vines
  'n': '#558b2f', // vine green
  'N': '#33691e', // vine green shade

  // mauve accent (ground-plant-3)
  'm': '#7a5077', // mauve light
  'M': '#4f2c4b', // mauve dark

  // turquoise-green blades (ground-plant-3), distinct from the yellow-green
  // l/L used elsewhere (e.g. ground-plant-1) so the two clumps read apart
  'c': '#26a69a', // turquoise light
  'C': '#00695c', // turquoise dark

  // yellow (ground-plant-2)
  'y': '#fdd835', // yellow light
  'Y': '#f9a825', // yellow dark

  // dark leaf (ground-plant-4)
  'e': '#356b38', // dark leaf light
  'E': '#153a17', // dark leaf dark

  // blue-hued base leaf, transitioning up into green (ground-plant-4)
  'b': '#3b6b8a', // base leaf blue
  'B': '#1f4258', // base leaf blue shade

  // light pink flower (ground-plant-4)
  't': '#f8bbd0', // flower petal light
  'T': '#f06292', // flower petal shade

  // bark — lightened/warmed so fore trunks read as closer, up front
  'r': '#8b6253', // bark
  'R': '#5a3c35', // bark shade
  'h': '#b99c92', // bark highlight

  // dark-green-tinted bark (tree-trunk-back-*), pulled toward the dark
  // background green (#16281c) for atmospheric depth — recedes regardless of
  // which draw layer a trunk sits on
  'q': '#3c5a46', // back-bark
  'Q': '#233a2a', // back-bark shade
  'p': '#4b735a', // back-bark highlight

  // canopy reuses l / L / f above so foliage colors stay consistent tree-to-tree

  // soil / floor
  'd': '#5d4037', // dirt
  'D': '#3e2723', // dirt shade
  'x': '#8d6e63', // pebble / dirt highlight

  // terrarium glass
  'g': '#bbdefb', // glass tint
  'G': '#90caf9', // glass tint shade
  'w': '#ffffff', // glass highlight / light catch
  'o': '#546e7a', // glass frame / seal

  // gate moss (tree-plant-1) — bright/dark red lichen
  'z': '#ff5252', // moss bright red
  'Z': '#7a1414', // moss dark red shade
};

if (typeof module !== 'undefined' && module.exports) module.exports = TERRARIUM_PALETTE;
