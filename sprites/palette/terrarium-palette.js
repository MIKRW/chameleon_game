// Per-sprite palette table for the terrarium sprite set (plants, trunks,
// floor, glass edges). Unlike ./player-palette.js (one flat
// character-key map shared by the whole player sprite set), each terrarium
// sprite id here gets its OWN nested `{ key: hex, ... }` object — a single
// flat table used to mean two sprites that happened to share a palette
// character (e.g. 'l'/'L') recolored together by accident even when they
// were meant to be independent. Nesting by sprite id removes that
// collision risk entirely: every sprite's colors live in their own object
// and can be retuned without touching anything else.
//
// '.' is transparent, same convention as before — omitted (or `null`) is
// equivalent, since sprites.js's drawSprite / game/render.js's
// drawSpriteBlocky both do `if (!color) continue`.
//
// Ladder-driven bark trunks (the trunk-interact-1/3 vivid r/R/h family and
// the trunk-bg-*a muted q/Q/p family) are shaped differently: non-varying
// keys (k, D if present) sit at the top level, and the keys that vary by
// depth layer sit under `.layers[layerNumber]`, built once at load time by
// buildBarkLayers() (see ./bark-ladder.js — load that file BEFORE this one,
// index.html). Each entry is authored at its native/richest layer; the
// other layer(s) it can appear at are derived by holding hue constant and
// stepping saturation/lightness, replacing the old hand-tuned
// TERRARIUM_PALETTE_LAYER5_TREES / TERRARIUM_PALETTE_LAYER3_TREES tables
// (formerly in game/constants.js) which drifted hue between layers. See
// resolveBarkPalette() in game/render.js for how `.layers` gets merged over
// the base object at draw time.
//
// Bark sprites that only ever show at ONE fixed tone (no layer variation —
// either intentionally fixed, like the driftwood-toned trunks, or currently
// unplaced) stay flat, same shape as every other sprite here.
//
// Branches (tree-branch-*) and the trunk-mounted stub plants
// (tree-plant-3/4/5) don't own a bark color at all — at render time their
// own entry (just 'k', plus any non-bark keys) is merged with whichever
// trunk they're mounted to's resolved bark palette, so they always match
// their host trunk. See drawTreeBranches/drawTreePlants in game/render.js.

const TERRARIUM_PALETTE = {
  // === ground-plant-1 — Split-Leaf Philodendron ===
  // leaf light/dark + shared outline
  // independent from every other leaf-green sprite below; all start at the same green but can now drift apart freely
  'ground-plant-1': {
    'k': '#1a1a1a',
    'l': '#66bb6a',
    'L': '#2e7d32',
  },

  // === ground-plant-1b — Split-Leaf Philodendron (Side-View, Three-Leaf) ===
  // leaf light/dark + shared outline, same tones as ground-plant-1, plus a
  // pale rim highlight at each leaf tip (ground-plant-6's f, own copy) and a
  // brighter vein-line accent running down each leaf's tapered body
  'ground-plant-1b': {
    'k': '#202127',
    'l': '#464702',
    'L': '#473e0a',
    'f': '#4d5a2f',
    'v': '#686e2e',
  },

  // === ground-pladnt-7 — Split-Leaf Philodendron (Small Olive Variant) ===
  // same shape as ground-plant-1, own independent palette shifted olive
  'ground-plant-7': {
    'k': '#1a1a1a',
    'l': '#8a9a46',
    'L': '#556b2f',
  },

  // === ground-plant-3 — Tall Grass Tuft ===
  // turquoise-green blades + mauve accent + shared outline
  // distinct turquoise pair keeps this clump reading apart from the plain-green ground-plant-1
  'ground-plant-3': {
    'k': '#1a1a1a',
    'm': '#7a5077',
    'M': '#4f2c4b',
    'c': '#26a69a',
    'C': '#00695c',
  },

  // === ground-plant-4 — Flowering Plant ===
  // dark leaf, blue-hued base leaf, pink flower + shared outline
  // three tone pairs blending up the plant: blue base -> dark green -> pink bloom
  'ground-plant-4': {
    'k': '#1a1a1a',
    'e': '#356b38',
    'E': '#153a17',
    'b': '#3b6b8a',
    'B': '#1f4258',
    't': '#f8bbd0',
    'T': '#f06292',
  },

  // === ground-plant-5 — Broadleaf Plant ===
  // leaf light/dark + shared outline
  // was keyed 0/9 in the old flat palette to dodge a collision with ground-plant-1; no longer needed now each sprite has its own object
  'ground-plant-5': {
    'k': '#1a1a1a',
    'l': '#2caa6b',
    'L': '#1f644a',
  },

  // === ground-plant-6 — Split-Leaf Philodendron (Large Variant) ===
  // dark leaf light/dark + shared outline + pale rim highlight
  // brightened off ground-plant-4's e/E dark-leaf tones (which now read as too close to the
  // jewel-green forest-v5 background at this layer-8 prominence) and given a highlight tone
  // so the leaf edges read crisp against the backdrop instead of blending into it
  'ground-plant-6': {
    'k': '#5c4e42',
    'e': '#4c9c50',
    'E': '#1f5622',
    'f': '#367531',
  },

  // === tree-plant-1 — Gate Moss ===
  // bright/dark red lichen
  // no 'k' outline — the moss art itself is the outline; tiled by drawGateMoss() in game/render.js down the gatekeeper trunk until state.gateSolved
  'tree-plant-1': {
    'z': '#ff5252',
    'Z': '#7a1414',
  },

  // === tree-plant-1b — Gate Moss Remnant ===
  // same red lichen tones as tree-plant-1 — a small leftover scrap left on the
  // gatekeeper trunk after state.gateSolved, drawn by drawGateMossRemnant() in game/render.js
  'tree-plant-1b': {
    'z': '#ff5252',
    'Z': '#7a1414',
  },

  // === tree-plant-2 — Hanging Moss ===
  // leaf light/dark/highlight + shared outline
  // was keyed !/@ in the old flat palette to dodge a collision; reverted back to plain l/L now each sprite has its own object
  // darkened/desaturated to the layer-5 ~32% saturation band (DEPTH-LAYERS.md)
  // — the old pastel mint (#a5d6a7, ~74% lightness) read as an isolated
  // highlight against the muted trunk/water backdrop instead of blending in
  'tree-plant-2': {
    'k': '#1c241f',
    'l': '#325d36',
    'L': '#1f3d22',
    'f': '#47854d',
  },

  // === tree-plant-2b — Hanging Moss (Large) ===
  // leaf light/dark/highlight + shared outline
  // same mossy-clump family and starting tones as tree-plant-2, now its own independently-tunable copy
  'tree-plant-2b': {
    'k': '#1c241f',
    'l': '#325d36',
    'L': '#1f3d22',
    'f': '#47854d',
  },

  // === tree-plant-3 — Spanish Moss ===
  // pale silvery-sage hanging strands
  // no 'k'/'R'/'r' here — the sprite's small bark stub (k/R/r) matches whichever trunk it's mounted on, merged in from that trunk's own bark palette at render time (see drawTreePlants in game/render.js)
  'tree-plant-3': {
    'S': '#b7c4ad',
    'F': '#6d7d68',
  },

  // === tree-plant-4 — Oyster Mushrooms ===
  // muted cool grey-brown ironbark-mushroom caps, deeper cool-brown gill underside
  // same host-trunk bark-stub convention as tree-plant-3 — no k/R/r owned here
  // Pulled further off the original #ece0c8/#c4a878 (pale cream/tan) and its
  // first ironbark pass (#c6b8a9/#936d53, still read too warm/light against
  // the scene's dim cool-teal ambiance) — darker and cooler now so the
  // cluster sits into the backdrop instead of standing out against it.
  // Darkened once more (same hue/sat, ~10% less lightness) off #ad9c90/
  // #765a4c so the cluster reads closer to its host trunk's bark tone.
  'tree-plant-4': {
    'P': '#978172',
    'H': '#5d473c',
  },

  // === tree-plant-5 — Bromeliad Rosette ===
  // spiky blade light/dark + shared outline
  // was keyed #/$ in the old flat palette to dodge a collision; reverted back to plain l/L. Its 'R' bark-blend accent at the base is NOT owned here — merged in from the host trunk's bark palette, same convention as tree-plant-3/4's stub
  'tree-plant-5': {
    'k': '#1a1a1a',
    'l': '#66bb6a',
    'L': '#2e7d32',
  },

  // === tree-plant-slime — Locked Trunk Coating ===
  // dull olive-yellow slime, base/shade/highlight
  // no 'k' outline; muted down from the old (unused) ground-plant-2 yellow so it reads as a sickly coating rather than a bright accent
  'tree-plant-slime': {
    'K': '#8a9a4a',
    'W': '#4f5c28',
    'X': '#c7d17a',
  },

  // === bug-1 — collectible critter bug ===
  // matte black body, pale marking
  // see sprites/bugs/bug-1.js; placed via BUG_PLACEMENTS in world-props.js
  'bug-1': {
    'I': '#262626',
    'O': '#e8e8e8',
  },

  // === trunk-interact-1 — Straight Slim Walnut ===
  // vivid bark: bark/shade/highlight, ladder-driven
  // authored at its native layer 8 (richest/closest tier); also appears at layer 5 — see .layers, built by buildBarkLayers() in ./bark-ladder.js
  'trunk-interact-1': {
    'k': '#1a1a1a',
    layers: buildBarkLayers({ r: '#8f623d', R: '#75561f', h: '#836c53' }, 8, [5, 8]),
  },

  // === trunk-interact-2 — Thick, driftwood, flat (not ladder-driven) ===
  // near-black driftwood bark: bark/shade/highlight
  // same driftwood family as trunk-bg-6a/6b; deliberately fixed, not on the saturation ladder
  'trunk-interact-2': {
    'k': '#1a1a1a',
    '1': '#241a14',
    '2': '#120c09',
    '3': '#4a382c',
  },

  // === trunk-interact-3 — Knotted ===
  // vivid bark: bark/shade/highlight, ladder-driven
  // same r/R/h family and native layer-8 tier as trunk-interact-1 (both read from the same shared bark today), now independently tunable; also appears at layer 5
  'trunk-interact-3': {
    'k': '#1a1a1a',
    layers: buildBarkLayers({ r: '#795024', R: '#614220', h: '#8f683f' }, 8, [5, 8]),
  },

  // === trunk-bg-1a / 2a / 3a / 4a / 5a — muted back-bark family ===
  // back-bark: bark/shade/highlight, ladder-driven
  // authored at native layer 3 (using the old TERRARIUM_PALETTE_LAYER3_TREES q/Q/p values as the richer/native tier); also appears at layer 2. All five silhouettes share the same muted family today; each now has its own independently-tunable copy
  'trunk-bg-1a': {
    'k': '#1a1a1a',
    layers: buildBarkLayers({ q: '#3e6550', Q: '#273f32', p: '#4f8267' }, 3, [2, 3]),
  },
  'trunk-bg-2a': {
    'k': '#1a1a1a',
    layers: buildBarkLayers({ q: '#3e6550', Q: '#273f32', p: '#4f8267' }, 3, [2, 3]),
  },
  'trunk-bg-3a': {
    'k': '#1a1a1a',
    'D': '#3e2723', // knot/scar shade — flat, not part of the ladder
    layers: buildBarkLayers({ q: '#3e6550', Q: '#273f32', p: '#4f8267' }, 3, [2, 3]),
  },
  'trunk-bg-4a': {
    'k': '#1a1a1a',
    layers: buildBarkLayers({ q: '#3e6550', Q: '#273f32', p: '#4f8267' }, 3, [2, 3]),
  },
  'trunk-bg-5a': {
    'k': '#1a1a1a',
    layers: buildBarkLayers({ q: '#3e6550', Q: '#273f32', p: '#4f8267' }, 3, [2, 3]),
  },

  // === trunk-bg-6a — Angled Knotty, driftwood, flat (not ladder-driven) ===
  // near-black driftwood bark: bark/shade/highlight + knot shade
  // deliberately darker/more desaturated than the regular q/Q/p back-bark family so this big diagonal feature tree reads as a shadowed, foreground-scale silhouette rather than just another same-toned trunk
  'trunk-bg-6a': {
    'k': '#1a1a1a',
    '1': '#241a14',
    '2': '#120c09',
    '3': '#4a382c',
    'D': '#3e2723',
  },

  // === trunk-bg-4b / 5b — vivid bark, flat (not ladder-driven) ===
  // bark/shade/highlight
  // currently unplaced in world-props.js — flat single tone, no layer variation needed unless/until placed
  'trunk-bg-4b': {
    'k': '#1a1a1a',
    'r': '#8f6f3d',
    'R': '#57421f',
    'h': '#bd9d7a',
  },
  'trunk-bg-5b': {
    'k': '#1a1a1a',
    'r': '#8f6f3d',
    'R': '#57421f',
    'h': '#bd9d7a',
  },

  // === trunk-bg-6b — Angled Knotty, flat (not ladder-driven) ===
  // vivid bark: bark/shade/highlight + knot shade
  // currently unplaced; deliberately fixed single tone like 4b/5b, plus its own knot marks
  'trunk-bg-6b': {
    'k': '#1a1a1a',
    'r': '#8f6f3d',
    'R': '#57421f',
    'h': '#bd9d7a',
    'D': '#3e2723',
  },

  // === tree-branch-1 / tree-branch-2 — vivid-bark branches ===
  // shared outline only
  // no owned bark color — at render time, merged with whichever trunk-interact-N trunk they're mounted to's resolved bark palette (r/R/h), so a branch always matches its host trunk. See drawTreeBranches() in game/render.js
  'tree-branch-1': {
    'k': '#1a1a1a',
  },
  'tree-branch-2': {
    'k': '#1a1a1a',
  },

  // === tree-branch-3 — driftwood branch ===
  // shared outline only
  // same host-trunk-matching convention as tree-branch-1/2, but for trunk-interact-2's driftwood (1/2/3) bark instead of r/R/h
  'tree-branch-3': {
    'k': '#1a1a1a',
  },

  // === floor.js — Terrarium Substrate ===
  // dirt and pebbles
  'floor': {
    'd': '#5d4037',
    'D': '#3e2723',
    'x': '#8d6e63',
  },

  // === glass-edge-1.js (top rim) ===
  // glass tint + light catch
  'glassEdgeTop': {
    'g': '#bbdefb',
    'w': '#ffffff',
  },

  // === glass-edge-2.js (bottom rim) ===
  // glass tint + light catch
  'glassEdgeBottom': {
    'g': '#bbdefb',
    'w': '#ffffff',
  },

  // === glass-edge-3.js (left rim) ===
  // glass tint only — the light-catch highlight is drawn separately in code (drawGlassEdgeSide, game/render.js), not baked into this tileable body
  'glassEdgeLeft': {
    'g': '#bbdefb',
  },

  // === glass-edge-4.js (right rim) ===
  // glass tint only, same as glassEdgeLeft
  'glassEdgeRight': {
    'g': '#bbdefb',
  },

  // === lightbulb.js — Edison-bulb fixture, unlit ===
  // brass socket + off/unlit glass + cord + glass tint (reused for the bulb's own glass look)
  'lightbulb': {
    'r': '#8f6f3d', // cord
    'k': '#1a1a1a',
    'a': '#a9822f', // brass socket
    'A': '#6b4f1c', // brass socket shade
    'g': '#bbdefb', // bulb glass tint
    'w': '#ffffff', // bulb glass highlight
    'v': '#8d8d8d', // unlit filament / grey glass tint
    'V': '#4a4a4a', // unlit filament shade
  },

  // === lightbulb-2.js — Edison-bulb fixture, lit ===
  // same brass socket + cord as lightbulb, warm glowing glass/filament + halo
  'lightbulb2': {
    'r': '#8f6f3d',
    'k': '#1a1a1a',
    'a': '#a9822f',
    'A': '#6b4f1c',
    'g': '#bbdefb',
    'w': '#ffffff',
    'u': '#fff8dc', // lit glass, bright warm white
    'U': '#ffb300', // lit filament, warm amber
    'i': '#3a2f10', // faint warm glow bleeding into the dark background
  },

  // === lightbulb-3.js — decoy bulb, off state ===
  // pixel-identical art to lightbulb.js (off), own copy since it never swaps to a lit sprite
  'lightbulb3': {
    'r': '#8f6f3d',
    'k': '#1a1a1a',
    'a': '#a9822f',
    'A': '#6b4f1c',
    'g': '#bbdefb',
    'w': '#ffffff',
    'v': '#8d8d8d',
    'V': '#4a4a4a',
  },

  // === light-switch.js — switch lever, off state ===
  // brass frame/arm + black switch head
  'lightSwitch': {
    'a': '#a9822f',
    'k': '#1a1a1a',
    'A': '#6b4f1c',
  },

  // === light-switch-2.js — switch head, on state ===
  // same brass frame/arm as lightSwitch, ruby-lit head
  // distinct from tree-plant-1's z/Z gate moss red so recoloring the switch never touches the gate moss
  'lightSwitch2': {
    'a': '#a9822f',
    'k': '#1a1a1a',
    'A': '#6b4f1c',
    '7': '#8a1322', // switch head, lit ruby
  },

  // === background-texture.js — hidden pixel-digit code ===
  // digit stroke shades 1/2 (warm highlight/amber)
  'backgroundTexture': {
    'j': '#f4e6b8',
    'J': '#d9a441',
  },

  // Leftover/unreferenced keys from the old flat palette — no sprite file
  // currently reads any of these, kept only so the historical hex values
  // aren't lost if a sprite that used them gets reintroduced.
  '_unused': {
    'y': '#fdd835', // ground-plant-2 (yellow bush) leaf light — GROUND_PLANT_2 has no sprite file today (see the intentional gap in TERRARIUM_SPRITES.groundPlant, sprites/index.js)
    'Y': '#f9a825', // ground-plant-2 leaf dark
    's': '#c0c8c6', // light-switch.js lever, off/down — sprite rows never actually reference this key
    '8': '#1c3fa8', // light-switch-2.js sapphire facet glint — sprite rows never actually reference this key
    'G': '#90caf9', // glass tint shade — none of the glass-edge-*.js sprites reference this key
    'o': '#546e7a', // glass frame/seal — none of the glass-edge-*.js sprites reference this key
    '4': '#7d5a30', // trunk-interact-3 walnut bark — an earlier, unused recolor; the sprite's rows use the shared r/R/h vivid bark instead
    '5': '#4c3618', // walnut bark shade
    '6': '#af8a65', // walnut bark highlight
  },
};

if (typeof module !== 'undefined' && module.exports) module.exports = TERRARIUM_PALETTE;
