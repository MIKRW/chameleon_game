// Things the player sees and touches: the chameleon, bugs, and the light
// switch.

import { SCALE } from '../constants.js';
import { state, ctx } from '../state.js';
import {
  resolveBugSprite, BUG_GEOMETRIES, isBugUnlocked, LIGHT_SWITCH_TRUNK, lightSwitchOrigin,
} from '../world-geometry.js';
import { drawSprite, resolveSpritePalette } from './sprite.js';

// Front-climb uses the flat, head-on clinging pose; Cling to Sides uses the
// side pose (drawn for the right edge, see playerFlipForState). Every other
// state — grounded, mid-air — uses the default sprite, which already reverts
// automatically once jumpOffTrunk() clears state.climb.
export function playerSpriteForState() {
  if (state.climb) {
    return state.climb.face === 'front' ? SPRITES.playerClimbFront : SPRITES.playerClimbSide;
  }
  return SPRITES.playerDefault;
}

// Both mirrored poses are drawn facing right: the default pose flips when
// facing left, the side pose flips when clinging to a trunk's left edge.
function playerFlipForState() {
  if (state.climb) return state.climb.face === 'side' && state.climb.side === 'left';
  return state.facing === 'left';
}

// Layer 7 — invisible until CHAMELEON_VISIBLE is flipped on (see game/state.js).
export function drawPlayer(camera) {
  if (!window.CHAMELEON_VISIBLE) return;
  const hanging = state.branch && state.branch.mode === 'hang';
  drawSprite(ctx, playerSpriteForState(), state.player.x - camera.x, state.player.y - camera.y, SCALE, PLAYER_PALETTE, undefined, playerFlipForState(), hanging);
}

// Bugs from BUG_GEOMETRIES (game/world-geometry.js) — the last
// BUG_LOCKED_START_INDEX-and-later bugs (game/constants.js) stay undrawn
// until Cling to Sides is unlocked (see isBugUnlocked()), so they can't be
// spotted, let alone caught, before that puzzle is solved. `layer` here is
// the bug's own placement.layer: ground/air/path bugs use the dedicated
// layer 6 (drawn once, between the far/near plant passes); trunk-mode
// bugs instead carry their host trunk's layer (5 or 8, to match the
// TREE_PLACEMENTS lookup in bugGeometry()) and are drawn from that layer's
// own call, right after that layer's drawTreeTrunks, so they paint on top of
// the bark instead of underneath it.
export function drawBugs(camera, layer) {
  BUG_GEOMETRIES.forEach((geo, i) => {
    if (geo.placement.layer !== layer || state.bugsFound[i] || !isBugUnlocked(i)) return;
    const sprite = resolveBugSprite(geo.placement.sprite);
    const palette = resolveSpritePalette(geo.placement.sprite);
    const screenX = geo.originX - camera.x;
    const screenY = geo.originY - camera.y;
    const scale = SCALE * (geo.placement.scaleMultiplier || 1);
    drawSprite(ctx, sprite.rows, screenX, screenY, scale, palette);
  });
}

// The light switch prop (LIGHT_SWITCH_PLACEMENT, world-props.js) — mounted
// on a trunk rather than standing on the floor, swapping art between
// light-switch.js/light-switch-2.js based on state.lightOn. The art is
// drawn arm-into-bark on its right edge (a left-face mount); flipped
// horizontally when LIGHT_SWITCH_PLACEMENT.side is 'right', same convention
// drawTreeBranches uses for its side flip.
export function drawLightSwitch(camera) {
  if (!LIGHT_SWITCH_TRUNK) return;
  const sprite = state.lightOn ? TERRARIUM_SPRITES.lightSwitch2 : TERRARIUM_SPRITES.lightSwitch;
  const palette = state.lightOn ? TERRARIUM_PALETTE.lightSwitch2 : TERRARIUM_PALETTE.lightSwitch;
  const origin = lightSwitchOrigin();
  const screenX = origin.x - camera.x;
  const screenY = origin.y - camera.y;
  const flipX = LIGHT_SWITCH_PLACEMENT.side === 'right';
  drawSprite(ctx, sprite.rows, screenX, screenY, SCALE, palette, undefined, flipX);
}
