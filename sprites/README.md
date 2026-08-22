# Terrarium Sprites

Static, hand-defined pixel-art "pages" for building out the terrarium scene
and the player — one small file per prop/pose, following the same text-grid
convention as the shared [`../sprites.js`](../sprites.js) (`drawSprite` works
unchanged on all of these). No build step: each file just assigns a `const`,
so in the browser they're loaded via `<script>` tags in file order and
become globals; in Node each file also does a guarded `module.exports` for
testing/tooling.

## Layout

Sprites are grouped into one subfolder per prop category; shared/aggregate
files stay at the top level.

| File(s) | What | Size (w x h) | Layer |
|---|---|---|---|
| `palette/terrarium-palette.js` | Shared color table for props (`TERRARIUM_PALETTE`) | — | — |
| `palette/player-palette.js` | Color table for the player sprite (`PLAYER_PALETTE`) | — | — |
| `user/player/player.js` | Default/grounded pose (`PLAYER`) | 16x11 | — |
| `user/player/player-front.js` | Front-climb pose (`PLAYER_FRONT`) | 16x11 | — |
| `user/player/player-side-left.js`, `player-side-right.js` | Side-climb poses (`PLAYER_SIDE_LEFT`/`RIGHT`) | 16x11 | — |
| `user/player/index.js` | Aggregates the poses into `SPRITES` | — | — |
| `ground-plants/ground-plant-1.js` … `ground-plant-5.js` | Ground foliage variants | 12x10 (ground-plant-3 is 12x20, green-mauve) | mid-ground, on floor |
| `tree-plants/tree-plant-1.js` … `tree-plant-5.js` | Trunk-mounted foliage variants | 8x8 | background, mounts to a trunk knot row |
| `tree-trunks-interact/trunk-interact-1.js` … `trunk-interact-3.js` | Climbable trunk variants (silhouettes 1-3), full-saturation bark | 8x14 (interact-1 is 11x151, full floor-to-lid height) | climbable, on floor |
| `tree-trunks-bg/trunk-bg-1a.js` … `trunk-bg-6b.js` | Non-interactive background-decor trunks, one entry per silhouette family (1-6) x bark variant (a = muted, b = vivid, not every family has both); bg-6b angles out from the floor and twists/knobbles as it rises instead of running straight up | 12x152 (bg-1a, widened + floor-to-lid), 5x80/90 (bg-2a/3a, narrowed), 8x110/100 (bg-4a/5a), 17x151 (bg-6a/6b) — all ≥ half the terrarium's max (floor-to-lid) height | background, on floor |
| `tree-branches/tree-branch-1.js`, `tree-branch-2.js`, `tree-branch-3.js` | Branches mounted onto trunks (branch-3 is branch-2's shape recolored to driftwood bark, for trunk-interact-2/trunk-bg-6a/6b) | varies | background |
| `lights/lightbulb.js` | Hanging Edison bulb, brass socket, off (dark/grey) glass | 10x18 | foreground, hangs from above |
| `lights/lightbulb-2.js` | Same fixture, lit — warm glass/filament + faint glow halo | 12x18 | foreground, hangs from above |
| `background-texture.js` | Hidden pixel-digit grid grown into the backdrop like vine blight; legible only once lit | 35x51 | background (layer 2), backdrop |
| `lights/light-switch.js` | Weathered rocker switch bolted to bark, off (nub down) | 5x8 | foreground, mounted on a trunk |
| `lights/light-switch-2.js` | Same switch, on (nub up, amber indicator lit) | 5x8 | foreground, mounted on a trunk |
| `floor.js` | Substrate ground tile | 24x4 | background, tiles horizontally |
| `glass-edges/glass-edge-1.js` … `glass-edge-4.js` | Terrarium glass frame (top/bottom/left/right) | varies | foreground, tiles along its edge |
| `index.js` | Aggregates everything into `TERRARIUM_SPRITES` | — | — |

## Sprite object shape

Every page exports one object:

```js
const GROUND_PLANT_1 = {
  name: 'Ground Plant 1 - Small Fern',
  theme: 'ground foliage, feathery fronds',
  behavior: {
    type: 'static',       // all current sprites are static (no animation frames)
    layer: 'mid-ground',  // background | mid-ground | foreground
    collision: false,     // true only for floor.js, which the player stands on
    placement: 'floor',   // where in the scene this anchors
    animated: false,
  },
  width: 12,
  height: 10,
  rows: [ /* text grid, one char per cell, see palette.js */ ],
};
```

`rows` uses the same `'.'` = transparent convention as the player sprites.
Colors come from `TERRARIUM_PALETTE` (in `palette/terrarium-palette.js`),
kept separate from `PLAYER_PALETTE` (in `palette/player-palette.js`) so the
two themes can evolve independently.

## Design rules / conventions

- **Ground props** (plants, trunks, floor) put their floor-contact row last,
  often marked with an all-`k` row, so they can be snapped to the same
  ground line without per-sprite offset math.
- **Hanging props** (lightbulbs) anchor at row 0 (top) instead, since they
  attach to the ceiling rather than the floor.
- Trunks with an off-center or multi-branch top (`trunk-bg-4a.js`/`4b.js`,
  `trunk-bg-5a.js`/`5b.js`) note their attach point(s) in `behavior`.
- **Trunk naming** (`trunk-bg-Na`/`Nb`, `trunk-interact-N`) splits on two
  independent axes: the number is a silhouette family, the letter (bg only)
  is a bark-tone variant within it — `a` muted (`q`/`Q`/`p`) for atmospheric
  depth, `b` full-saturation (`r`/`R`/`h`). `interact-N` trunks are numbered
  on their own track, unrelated to the bg family numbers. None of this says
  anything about which world-props.js `layer` (2, 5, or 7) or `z` a given
  instance is placed on — bg trunks are cosmetic-only by convention, not by
  the sprite id itself.
- **Tileable props** (`floor.js`, `glass-edge-*.js`) declare
  `behavior.tileable: 'horizontal' | 'vertical'` — repeat them edge-to-edge
  rather than stretching.
- Everything here is currently `animated: false`. If a prop later needs
  motion (e.g. a hanging prop's sway), add an `animated: true` sprite page with a
  `frames` array instead of `rows`, rather than overloading this format.

## Using these to populate the terrarium

Once wired into `index.html` (script tags, same pattern as the existing
`sprites.js` include) and `index.js` loaded last, `TERRARIUM_SPRITES` gives a
single place to pull from when laying out the scene, e.g.:

```js
drawSprite(ctx, TERRARIUM_SPRITES.floor.rows, 0, groundY, scale);
drawSprite(ctx, TERRARIUM_SPRITES.treeTrunk[1].rows, trunkX, trunkY, scale);
drawSprite(ctx, TERRARIUM_SPRITES.groundPlant[2].rows, plantX, groundY, scale);
```

Swapping which variant goes where (e.g. `plant[2]` → `plant[4]`) is then a
one-line change per prop, and new variants can be added as new numbered
pages without touching the others.
