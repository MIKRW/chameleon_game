// Foliage: floor plants, plants mounted on trunks, and props hanging from
// the lid.

import {
  SCALE, GROUND_TOP, LID_TOP,
  BACKGROUND_PIXEL_BLOCK, BACKGROUND_DECOR_PARALLAX_LAYER2, BACKGROUND_DECOR_PARALLAX_LAYER3,
  TREE_FADE_MIN_ALPHA, TREE_FADE_MAX_ALPHA,
} from '../constants.js';
import { state, ctx } from '../state.js';
import {
  resolveGroundPlantSprite, resolveHangingSprite, resolveTreePlantSprite, byAscendingZ,
  TREE_PLANT_GEOMETRIES,
} from '../world-geometry.js';
import { drawSprite, drawSpriteBlocky, resolveSpritePalette, resolveBarkPalette } from './sprite.js';

// Ground-floor foliage placed from PLANT_PLACEMENTS (world-props.js), split
// across layer 5 (behind the player) and layer 8 (in front of the player)
// so plants can occlude the chameleon as it walks past. Layers 2/3 are two
// further, non-interactive options — cosmetic background foliage that
// shares the layer-2/3 background-decor bands' treatment (their own
// BACKGROUND_DECOR_PARALLAX_LAYER2/3, the same crown-fade as
// drawBackgroundDecor) instead of the opaque 1:1 rendering layers 5/8 get —
// see DEPTH-LAYERS.md. Ground plants have no bark keys, so unlike
// drawBackgroundDecor's trunks this layer doesn't need resolveBarkPalette/a
// saturation step — each plant's own palette entry is used as-is regardless
// of which layer it's drawn on.
export function drawGroundPlants(camera, layer) {
  const isBackgroundLayer = layer === 2 || layer === 3;
  const parallax = layer === 2 ? BACKGROUND_DECOR_PARALLAX_LAYER2 : BACKGROUND_DECOR_PARALLAX_LAYER3;
  const placements = PLANT_PLACEMENTS.filter((p) => p.layer === layer).sort(byAscendingZ);
  for (const placement of placements) {
    const sprite = resolveGroundPlantSprite(placement.sprite);
    const palette = resolveSpritePalette(placement.sprite);
    const scale = SCALE * (sprite.renderScale || 1) * (placement.scaleMultiplier || 1);
    const screenX = isBackgroundLayer
      ? placement.x - camera.x * parallax
      : placement.x - camera.x;
    const screenY = GROUND_TOP - sprite.height * scale - camera.y;
    if (isBackgroundLayer) {
      // ground-plant-1 (and ground-plant-7, its same-shape olive variant)
      // keep full pixel detail at layer 3 (block 1) instead of the usual
      // coarser background sampling — it reads as too mushy otherwise at
      // this sprite's small size/detail level.
      const block = (placement.sprite === 'ground-plant-1' || placement.sprite === 'ground-plant-7') ? 1 : BACKGROUND_PIXEL_BLOCK;
      drawSpriteBlocky(ctx, sprite.rows, screenX, screenY, scale, palette, block, {
        minAlpha: TREE_FADE_MIN_ALPHA,
        maxAlpha: TREE_FADE_MAX_ALPHA,
      });
    } else {
      drawSprite(ctx, sprite.rows, screenX, screenY, scale, palette);
    }
  }
}

// Props that dangle from the glass lid (HANGING_PLACEMENTS, world-props.js)
// instead of standing on the floor — row 0 of the sprite anchors at LID_TOP
// rather than the sprite's bottom snapping to GROUND_TOP.
export function drawHangingProps(camera, layer) {
  const placements = HANGING_PLACEMENTS.filter((p) => p.layer === layer).sort(byAscendingZ);
  for (const placement of placements) {
    const sprite = resolveHangingSprite(placement.sprite);
    // resolveHangingSprite swaps 'lightbulb' -> the lit LIGHTBULB_2 sprite
    // once state.lightOn, but the placement's own id stays 'lightbulb' — so
    // the palette lookup needs the same swap, keyed off the resolved sprite
    // rather than placement.sprite, or the lit bulb would draw with the
    // off-state palette (no u/U/i keys).
    const paletteId = placement.sprite === 'lightbulb' && state.lightOn ? 'lightbulb2' : placement.sprite;
    const palette = resolveSpritePalette(paletteId);
    const scale = SCALE * (sprite.renderScale || 1);
    const screenX = placement.x - camera.x;
    const screenY = LID_TOP - camera.y;
    drawSprite(ctx, sprite.rows, screenX, screenY, scale, palette);
  }
}

// Decorative foliage from TREE_PLANT_PLACEMENTS (world-props.js), mounted
// onto a sparse subset of the trees drawn by drawTreeTrunks (trees.js).
// Drawn right after the branches on the same layer so it picks up the same
// depth treatment and paints on top of the trunk (and any branch) it sits near.
export function drawTreePlants(camera, layer) {
  for (const geo of TREE_PLANT_GEOMETRIES) {
    if (geo.placement.layer !== layer) continue;
    const plantSprite = resolveTreePlantSprite(geo.placement.sprite);
    // Same host-trunk bark-matching convention as drawTreeBranches —
    // tree-plant-3/4/5's small bark-stub accent (k/R/r) comes from whichever
    // trunk this plant is mounted to; tree-plant-1/2/2b/slime have no bark
    // keys at all, so barkPalette contributes nothing for them.
    const ownPalette = resolveSpritePalette(geo.placement.sprite);
    const barkPalette = resolveBarkPalette(geo.trunkSpriteId, layer);
    const palette = { ...barkPalette, ...ownPalette };
    const flipX = geo.placement.side === 'left';
    const screenX = geo.originX - camera.x;
    const screenY = geo.originY - camera.y;
    const scale = SCALE * (geo.placement.scaleMultiplier || 1);
    drawSprite(ctx, plantSprite.rows, screenX, screenY, scale, palette, undefined, flipX);
  }
}
