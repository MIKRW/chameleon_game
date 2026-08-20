// Shared palette for the terrarium sprite set (plants, vines, trunks,
// floor, glass edges). Follows the same convention as PLAYER_PALETTE in
// ./player-palette.js: '.' is transparent, every other character maps to a
// hex color. Kept separate so the terrarium set can be themed independently
// of the player sprite.

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

  // Spanish moss (tree-plant-3) — pale silvery-sage hanging strands
  'S': '#b7c4ad', // moss strand highlight
  'F': '#6d7d68', // moss strand shade

  // Edison-bulb fixture (lightbulb.js) — brass socket + off/unlit glass
  'a': '#a9822f', // brass socket
  'A': '#6b4f1c', // brass socket shade
  'v': '#8d8d8d', // unlit filament / grey glass tint
  'V': '#4a4a4a', // unlit filament shade (dark grey)

  // Lit bulb (lightbulb-2.js) — same brass socket, warm glowing glass/filament
  'u': '#fff8dc', // lit glass, bright warm white
  'U': '#ffb300', // lit filament, warm amber
  'i': '#3a2f10', // faint warm glow bleeding into the dark background right around the bulb

  // Background texture (background-texture.js) — hidden pixel-digit code,
  // only drawn once lightbulb-2 is lit; bright warm tones against the dark
  // layer-1 backdrop (#132218 in game/render.js) so the digits are easy to read
  'j': '#f4e6b8', // digit stroke, shade 1 (warm highlight)
  'J': '#d9a441', // digit stroke, shade 2 (warm amber)

  // Light switch (light-switch.js / light-switch-2.js) — solid black plate
  // (k) with a small lever that moves between the off/down and on/up rows
  's': '#c0c8c6', // lever, off/down — pale metal so it reads against the black plate

  // Oyster mushroom shelf fungi (tree-plant-4) — pale ivory caps on bark
  'P': '#ece0c8', // mushroom cap, pale cream highlight
  'H': '#c4a878', // mushroom cap, tan shade / gill underside
};

if (typeof module !== 'undefined' && module.exports) module.exports = TERRARIUM_PALETTE;
