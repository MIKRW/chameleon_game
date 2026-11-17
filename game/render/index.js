// Per-frame draw: eases the camera toward the player, then paints the scene
// back to front (layers 1-9, see DEPTH-LAYERS.md). Each layer's drawing
// lives in the sibling files by what it draws.

import {
  CANVAS_W, CANVAS_H, LID_TOP, CAMERA_X_MAX, CAMERA_Y_MAX, CAMERA_EASE,
  BACKGROUND_DECOR_PARALLAX_LAYER2, BACKGROUND_DECOR_PARALLAX_LAYER3,
} from '../constants.js';
import { state, ctx } from '../state.js';
import { playerCenter } from '../movement.js';
import { drawTankFraming, drawGlassFront, drawDirtLayer, drawGlassEdgeBottom } from './tank.js';
import { drawBackgroundSprite, drawBackgroundDecor, drawBackgroundTexture } from './background.js';
import { drawGroundPlants, drawHangingProps, drawTreePlants } from './plants.js';
import { drawTreeTrunks, drawTreeBranches, drawGateMoss, drawGateMossRemnant, drawTrunkSlime } from './trees.js';
import { drawPlayer, drawBugs, drawLightSwitch } from './actors.js';

export function draw() {
  const p = playerCenter();
  // Rounded to whole pixels — fractional camera position pushes every
  // sprite's fillRect calls onto fractional coordinates, which the canvas
  // anti-aliases at each cell's edge. Adjacent opaque cells then show a
  // thin seam of blended color between them instead of butting up cleanly,
  // most visible as gaps in high-contrast sprites (e.g. near-black bark
  // next to the bright player) even though every cell is fully opaque.
  const targetX = Math.max(0, Math.min(CAMERA_X_MAX, p.x - CANVAS_W / 2));
  const targetY = Math.max(0, Math.min(CAMERA_Y_MAX, p.y - CANVAS_H / 2));
  if (!state.camera) {
    // First frame (or just after a restart) — snap straight to the target
    // instead of easing in from 0,0.
    state.camera = { x: targetX, y: targetY };
  } else {
    state.camera.x += (targetX - state.camera.x) * CAMERA_EASE;
    state.camera.y += (targetY - state.camera.y) * CAMERA_EASE;
  }
  const camera = {
    x: Math.round(state.camera.x),
    y: Math.round(state.camera.y),
  };

  // Nothing else here clears the canvas — every layer used to paint the
  // full frame unconditionally, so stale pixels never showed. Now that the
  // clip below can leave the strip above the lid unpainted on any given
  // frame, that strip needs a real clear or it keeps whatever was drawn
  // there before the clip started excluding it (e.g. earlier frames where
  // the camera was low enough that the clip rect covered the whole canvas).
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Clip everything below (backdrop, decor, trunks, hanging props, player,
  // ...) to below the lid line so nothing can ever poke out above it — the
  // glass walls (drawTankFraming, layer 9) are drawn afterward, unclipped,
  // since their own top edge is the true top of the tank and sits above the
  // lid on purpose.
  const lidY = LID_TOP - camera.y;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, Math.max(0, lidY), CANVAS_W, CANVAS_H);
  ctx.clip();

  // layer 1: terrarium backdrop texture
  drawBackgroundSprite(camera);

  // layer 2: cosmetic background decor, furthest back, painted before
  // anything the player can interact with or be occluded by
  drawBackgroundDecor(camera, BACKGROUND_PLACEMENTS, 2, BACKGROUND_DECOR_PARALLAX_LAYER2);
  drawGroundPlants(camera, 2);

  // layer 3: second cosmetic background decor band, same idea as layer 2 —
  // a step closer/faster/more saturated (see DEPTH-LAYERS.md)
  // TEMP: trunk band hidden while tuning parallax — layer 3's faster scroll rate reads as
  // too much background motion; restore once BACKGROUND_DECOR_PARALLAX_LAYER3 is tuned down
  // drawBackgroundDecor(camera, BACKGROUND_LAYER3_PLACEMENTS, 3, BACKGROUND_DECOR_PARALLAX_LAYER3);
  drawGroundPlants(camera, 3);

  // layer 4: dirt bed behind the glass, then the glass rim itself — both sit under the player
  drawDirtLayer(camera);
  drawGlassEdgeBottom(camera);

  // layer 5: far plants and tree trunks, behind the player
  // hanging props paint first so they sit behind the tree trunks, not on top
  // of them; trunks paint next so they sit behind the ground plants
  drawHangingProps(camera, 5);
  drawTreeTrunks(camera, 5);
  // trunk-mounted bugs on a layer-5 trunk (see BUG_PLACEMENTS, world-props.js)
  // paint right after that trunk so they sit on top of the bark, not behind it
  drawBugs(camera, 5);
  drawTreeBranches(camera, 5);
  drawTreePlants(camera, 5);
  drawGroundPlants(camera, 5);

  // layer 6: ground/air/path bugs — own layer between the far/near plant
  // passes so a bug never gets buried under foliage or the player
  drawBugs(camera, 6);

  // layer 7: player
  drawPlayer(camera);

  // layer 8: near plants and tree trunks, in front of the player
  drawGroundPlants(camera, 8);
  drawTreeTrunks(camera, 8);
  // trunk-mounted bugs on a layer-8 (Cling to Sides) trunk, same reasoning as
  // the layer-5 call above — paint right after that trunk so they're on top
  drawBugs(camera, 8);
  drawGateMoss(camera); // Moss Tree (GATE_TRUNK, x720) — Moss Tree puzzle
  drawGateMossRemnant(camera); // leftover moss scraps once state.gateSolved
  // drawTrunkSlime(camera); // disabled, not applied to any trunks right now
  drawTreeBranches(camera, 8);
  drawTreePlants(camera, 8);

  // layer 8: hidden pixel-digit backdrop, painted alongside the light
  // switch (only visible once the light is on)
  drawBackgroundTexture(camera);

  // light switch — mounted on a trunk (see LIGHT_SWITCH_PLACEMENT,
  // world-props.js), drawn last so it always sits on top of that trunk's
  // bark and any layer-5/8 foliage near it.
  drawLightSwitch(camera);

  ctx.restore();

  // layer 9: glass edges (tank framing), then the front pane haze on top of everything
  drawTankFraming(camera);
  drawGlassFront(playerCenter().y);
}
