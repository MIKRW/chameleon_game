# Depth-layer color convention

Design rule for how the terrarium's parallax layers should read as distance,
agreed on before implementing the layer-3 background pass. Applies to
`game/render.js` (draw order + fade logic) and `world-props.js` (placements),
plus the palettes in `sprites/palette/`.

## The problem

Depth was previously sold by an ad-hoc mix of alpha fade, hand-picked muted
colors, and blocky rendering, each tuned per layer independently with no
shared rule. Measuring the actual hex values showed some of it working
backwards — e.g. the layer-1 backdrop (`sprites/backgrounds/forest-v5.js`)
measured *more* saturated (~50-56%) than the tree bark it's supposed to sit
behind (~20-25%), because `BRIGHTNESS` there only scales lightness, not
saturation (see "Brightness vs saturation" below).

## The convention

Depth is carried by **saturation + lightness together**, scaling with how
close a layer reads to the camera. Every other depth cue is scoped to one
specific job, not reused as a second depth signal:

| Layer | Role | Saturation | Alpha fade | Parallax |
|---|---|---|---|---|
| 1 | backdrop (`sprites/backgrounds/forest-v5.js`) | **~15%** | own system (baked into the generated noise), not the shared trunk fade | 0.15 (`BACKGROUND_PARALLAX`) |
| 2 | bg decor, non-interactive (`BACKGROUND_PLACEMENTS`) | **~18%** (`q`/`Q`/`p`) | shared vertical crown→floor range, `TREE_FADE_MIN/MAX_ALPHA` (0.12→1) | **0.4** (`BACKGROUND_DECOR_PARALLAX_LAYER2`) |
| 3 | bg decor, non-interactive (`BACKGROUND_LAYER3_PLACEMENTS`, same sprite variety as layer 2, different placements) | **~24%** (`TERRARIUM_PALETTE_LAYER3_TREES`) | same shared range as layer 2 | **0.55** (`BACKGROUND_DECOR_PARALLAX_LAYER3`) |
| 5 | interactive trunk, behind player (`TERRARIUM_PALETTE_LAYER5_TREES`) | **~32%** | **none — fully opaque** | 1:1 with camera (moves with player) |
| 7 | interactive trunk, in front of player (`TERRARIUM_PALETTE`'s `r`/`R`/`h`) | **~42%**, highest of the tree layers | **none — fully opaque** | 1:1 with camera (moves with player) |
| player | — | 91-93% (already in the reserved 85-95% band, unchanged) | — | 1:1 |
| accent sprites (e.g. gate moss) | sprites that deliberately need to pop | 72-100% (already in the reserved 95-100%+ band, unchanged) | — | matches whatever it's mounted on |

Plants/foliage mounted on a given trunk layer should match that layer's
saturation ±10, for a bit of natural variation without breaking the band.

### Why layers 5/7 get no alpha fade

They're climbable/interactive — the player needs to read them as solid,
clean, and clearly separated from the purely decorative background, at any
camera position. A crown-fade that looks fine on cosmetic scenery reads as
"unreliable" on something you're meant to jump onto.

### Alpha fade's one remaining job

Previously alpha fade did two jobs at once: the intra-sprite vertical
crown→floor gradient (so a tall trunk fades into haze at the top), *and* a
second, separate per-layer range used purely to signal "this layer is
further back" (layer 2 dramatic, layer 5 subtle, layer 7 none). That's
redundant once saturation/lightness carries the layer-to-layer signal —
stacking multiple independently-tuned depth cues risks either over-crushing
distant layers into near-invisibility, or the cues fighting each other.
Alpha fade now only does the vertical gradient, with one shared range across
whichever layers use it (2 and 3), not a per-layer range.

### Brightness vs saturation

- **Saturation**: how vivid vs. gray a color is at the same lightness.
- **Lightness/brightness**: how close a color sits to black/white,
  independent of vividness.

`BRIGHTNESS` scalars (e.g. in `forest-v5.js`) only multiply RGB channels
toward zero — they dim a color without graying it. True atmospheric-distance
desaturation needs to also pull saturation down toward neutral, which a
brightness-only scalar can't do. This is why the backdrop currently reads as
"vivid but dark" rather than "hazy."

## Measured baseline (before this pass)

For reference when picking new numbers — approximate HSL saturation of what
existed going into this change:

- Layer 1 backdrop (forest-v5 `BASE_COLORS`, post `BRIGHTNESS`): ~50-56%
- Layer 2 bg decor bark (`q`/`Q`/`p`): ~20%
- Layer 5 trunk bark (darkened `r`/`R`/`h`): ~25%
- Layer 7 trunk bark (`r`/`R`/`h`): ~25%
- Ground/tree plant foliage (`l`/`L`/`f`, `e`/`E`): ~34-47%
- Gate moss (`z`/`Z`): ~72-100% (already an accent-tier outlier)
- Player body/crest (`g`, `u`): ~91-93%

### Parallax coverage — why layer 2/3 x positions aren't the raw world x

A discrete placement (unlike the tiling layer-1 backdrop) only ever becomes
visible if some camera position brings it within the canvas. At parallax
rate `factor`, the highest screen-x a placement can reach is
`CAMERA_X_MAX * factor + CANVAS_W`. For layer 2 (factor 0.4) that's 1872px,
for layer 3 (factor 0.55) it's 2304px — both well short of the full
3600px world width the interactive (1:1) layers use. `BACKGROUND_PLACEMENTS`
x values are the original 1:1 layout scaled down to fit inside that 1872px
window (same relative order/spacing, just compressed);
`BACKGROUND_LAYER3_PLACEMENTS` is scaled the same way inside its 2304px
window, offset from layer 2's positions so the two bands don't sit directly
behind one another.

### Why 0.4/0.55 instead of the original 0.6/0.8

First pass used 0.6/0.8, tuned by the relative-fraction math alone. In
practice that read as background moving too fast — because a layer's
*absolute* on-screen speed is its fraction of however fast the camera is
actually panning, and `PLAYER_SPEED` was raised (5→6, briefly 7) earlier in the same
session, which raised every layer's real px/sec along with it, background
included. 0.6/0.8 were relative-only numbers picked before that speed
change; 0.4/0.55 accounts for it, and also widens the separation from the
1:1 foreground layers, reinforcing the depth read.

## Status

Implemented — see `sprites/palette/terrarium-palette.js`, `game/constants.js`
(`TERRARIUM_PALETTE_LAYER5_TREES`, `TERRARIUM_PALETTE_LAYER3_TREES`,
`BACKGROUND_DECOR_PARALLAX_LAYER2/3`), `sprites/backgrounds/forest-v5.js`,
`world-props.js` (`BACKGROUND_LAYER3_PLACEMENTS`), and `game/render.js`
(`drawBackgroundDecor`, `drawTreeTrunks`/`drawTreeBranches`/`drawTreePlants`).
