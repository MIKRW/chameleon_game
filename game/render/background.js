// Non-interactive scenery behind the play area: the layer-1 backdrop, the
// layer-2/3 decor bands, and the hidden digit texture under the lightbulb.

import {
  CANVAS_W, CANVAS_H, SCALE, GROUND_TOP, LID_TOP,
  BACKGROUND_PIXEL_BLOCK, BACKGROUND_PARALLAX, TREE_FADE_MIN_ALPHA, TREE_FADE_MAX_ALPHA,
} from '../constants.js';
import { state, ctx } from '../state.js';
import { resolveTreeTrunkSprite, byAscendingZ } from '../world-geometry.js';
import { drawSprite, drawSpriteBlocky, resolveBarkPalette } from './sprite.js';

// Layer 1 — the terrarium backdrop itself (sprites/backgrounds/*.js), a
// generated gradient+noise texture drawn blocky/chunky (same lo-fi treatment
// as drawBackgroundDecor) so it reads as hazy depth rather than a flat fill.
// Draws whichever variant sprites/backgrounds/index.js currently points
// ACTIVE_BACKGROUND_KEY at, using that variant's own palette rather than
// TERRARIUM_PALETTE — see that file to swap versions.
// Scrolls at BACKGROUND_PARALLAX of both camera.x and camera.y rather than
// 1:1 or not at all — a flat fill could get away with being screen-fixed
// (any offset looks identical), but this texture has visible structure, so
// leaving either axis screen-fixed reads as "stuck" the moment the
// foreground scrolls past it (most noticeable on a climbing trunk, where the
// camera keeps the player near a fixed screen position — any screen-fixed
// background pixel then reads as glued to the player). Each variant's
// sprite is generated larger than the canvas in both dimensions
// specifically to cover this offset range without ever exposing an edge.
export function drawBackgroundSprite(camera) {
  const variant = BACKGROUND_VARIANTS[ACTIVE_BACKGROUND_KEY];
  if (variant.solidColor) {
    ctx.fillStyle = variant.solidColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    return;
  }
  const offsetX = -(camera.x * BACKGROUND_PARALLAX);
  const offsetY = -(camera.y * BACKGROUND_PARALLAX);
  drawSpriteBlocky(ctx, variant.sprite.rows, offsetX, offsetY, SCALE, variant.palette, BACKGROUND_PIXEL_BLOCK);
}

// Purely cosmetic background scenery from BACKGROUND_PLACEMENTS/
// BACKGROUND_LAYER3_PLACEMENTS (layers 2/3, world-props.js) — painted before
// the far-plants pass, with no floor occlusion/interaction logic, just
// depth. Reuses the tree-trunk resolver since background decor is currently
// trunk-only. `layer` and `parallax` are per-layer (see DEPTH-LAYERS.md):
// layer 3 sits a step further up the saturation ladder (resolveBarkPalette,
// per placement below) and scrolls at a faster parallax rate than layer 2,
// everything else about the two layers' rendering is identical — same
// shared vertical alpha fade, same blocky/chunky treatment.
export function drawBackgroundDecor(camera, placements, layer, parallax) {
  const sorted = [...placements].sort(byAscendingZ);
  for (const placement of sorted) {
    const sprite = resolveTreeTrunkSprite(placement.sprite);
    const palette = resolveBarkPalette(placement.sprite, layer);
    const screenX = placement.x - camera.x * parallax;
    const screenY = GROUND_TOP - sprite.height * SCALE - camera.y;
    drawSpriteBlocky(ctx, sprite.rows, screenX, screenY, SCALE, palette, BACKGROUND_PIXEL_BLOCK, {
      minAlpha: TREE_FADE_MIN_ALPHA,
      maxAlpha: TREE_FADE_MAX_ALPHA,
    });
  }
}

// Layer 8 — hidden pixel-digit backdrop (sprites/backgrounds/background-texture.js),
// painted alongside the light switch (same point in the draw order as
// drawLightSwitch, right before tank framing) rather than with the rest of
// the background scenery. Only drawn while the light is on; at rest its
// digit strokes are dark enough against the same backdrop color to be
// effectively invisible anyway, but skipping the draw entirely avoids even a
// flat-diff giveaway in a screenshot/pixel-inspector.
// Hangs from the lid directly under the lightbulb prop (HANGING_PLACEMENTS)
// rather than sitting on the floor, so it reads as something the bulb is
// illuminating; row 0 anchors at the bulb's bottom edge instead of the
// bottom-up floor convention other background props use.
export function drawBackgroundTexture(camera) {
  if (!state.lightOn) return;
  const bulbPlacement = HANGING_PLACEMENTS.find((p) => p.sprite === 'lightbulb');
  const bulbSprite = TERRARIUM_SPRITES.lightbulb;
  const sprite = TERRARIUM_SPRITES.backgroundTexture;
  const bulbCenterX = bulbPlacement.x + (bulbSprite.width * SCALE) / 2;
  const screenX = bulbCenterX - (sprite.width * SCALE) / 2 - camera.x;
  const screenY = LID_TOP + bulbSprite.height * SCALE - camera.y;
  drawSprite(ctx, sprite.rows, screenX, screenY, SCALE, TERRARIUM_PALETTE.backgroundTexture);
}
