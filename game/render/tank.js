// The terrarium tank itself: glass walls, lid, bottom rim, front pane haze,
// and the dirt bed behind the rim.

import {
  CANVAS_W, CANVAS_H, WORLD_WIDTH, WORLD_HEIGHT, GROUND_TOP, LID_TOP, FLOOR_Y,
  GLASS_EDGE_RENDER_SCALE, GLASS_BOTTOM_TILE_W, GLASS_BOTTOM_TILE_H, GLASS_SIDE_THICKNESS,
  GLASS_SIDE_RENDER_SCALE, GLASS_SIDE_TILE_H, GLASS_FRONT_TOP_ALPHA, GLASS_FRONT_BOTTOM_ALPHA,
} from '../constants.js';
import { ctx } from '../state.js';
import { drawSprite } from './sprite.js';

// Glass walls at the world's left/right edges and a lid at the top — the
// visible frame of the terrarium tank.
export function drawTankFraming(camera) {
  const leftX = 0 - camera.x;
  const rightX = WORLD_WIDTH - camera.x - GLASS_SIDE_THICKNESS;
  drawGlassEdgeSide(camera, GLASS_EDGE_LEFT, leftX, TERRARIUM_PALETTE.glassEdgeLeft);
  drawGlassEdgeSide(camera, GLASS_EDGE_RIGHT, rightX, TERRARIUM_PALETTE.glassEdgeRight);

  const lidY = LID_TOP - camera.y;
  if (lidY > -3 && lidY < CANVAS_H) {
    ctx.fillStyle = '#c8dcb4';
    ctx.fillRect(0, lidY, CANVAS_W, 3);
  }
}

// The pane of glass between the viewer and the tank itself — not a placed
// sprite, since it isn't part of the world, it's the screen you're looking
// through. A vertical gradient: clear near the top, hazier toward the
// bottom. Its overall strength also fades the closer the chameleon gets to
// the lid, so the whole tank reads clearer the nearer it is to escaping.
export function drawGlassFront(playerWorldY) {
  const climbT = Math.max(0, Math.min(1, (FLOOR_Y - playerWorldY) / (FLOOR_Y - LID_TOP)));
  const fade = 1 - climbT; // 1 at the floor, 0 right at the lid

  const front = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  front.addColorStop(0, `rgba(180, 215, 255, ${GLASS_FRONT_TOP_ALPHA * fade})`);
  front.addColorStop(1, `rgba(180, 215, 255, ${GLASS_FRONT_BOTTOM_ALPHA * fade})`);
  ctx.fillStyle = front;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

export function pseudoRandom(i) {
  const x = Math.sin(i * 999.77) * 10000;
  return x - Math.floor(x);
}

// A rough dirt bed sitting behind the glass rim, its top edge rising and
// falling across the width of the tank so it doesn't read as a flat slab.
export function drawDirtLayer(camera) {
  const bucket = 20; // world-space column width
  const maxRise = 12; // how far a mound can climb above the floor line
  const start = Math.floor(camera.x / bucket) - 1;
  const end = Math.ceil((camera.x + CANVAS_W) / bucket) + 1;

  for (let i = start; i <= end; i++) {
    const wx = i * bucket;
    const sx = wx - camera.x;
    const rise = 4 + pseudoRandom(i * 13 + 4) * maxRise;
    const topWorldY = GROUND_TOP - rise;
    const topScreenY = topWorldY - camera.y;

    ctx.fillStyle = '#3e2723'; // dirt shade
    ctx.fillRect(sx, topScreenY, bucket + 1, WORLD_HEIGHT - topWorldY);
    ctx.fillStyle = '#5d4037'; // dirt
    ctx.fillRect(sx, topScreenY, bucket + 1, 3);
  }
}

// A side wall of the glass tank, tiled vertically down the world so it
// covers the full height regardless of how far the camera has panned.
export function drawGlassEdgeSide(camera, sprite, screenX, palette) {
  if (screenX < -GLASS_SIDE_THICKNESS || screenX > CANVAS_W) return;

  const startTile = Math.floor(camera.y / GLASS_SIDE_TILE_H) - 1;
  const endTile = Math.ceil((camera.y + CANVAS_H) / GLASS_SIDE_TILE_H) + 1;
  ctx.save();
  ctx.globalAlpha = sprite.behavior.opacity;
  for (let i = startTile; i <= endTile; i++) {
    const wy = i * GLASS_SIDE_TILE_H;
    if (wy + GLASS_SIDE_TILE_H < 0 || wy > WORLD_HEIGHT) continue;
    drawSprite(ctx, sprite.rows, screenX, wy - camera.y, GLASS_SIDE_RENDER_SCALE, palette);
  }
  ctx.restore();

  // one light-catch highlight near the top of the wall, not repeated per tile
  const highlightScreenY = 0 - camera.y;
  if (highlightScreenY > -20 && highlightScreenY < CANVAS_H) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(screenX, highlightScreenY, GLASS_SIDE_THICKNESS, 10);
  }
}

// Bottom rim of the glass tank, tiled horizontally along the world so it
// sits flush with the mossy floor and lines up with the side walls.
export function drawGlassEdgeBottom(camera) {
  const worldY = GROUND_TOP; // starts right where the mossy floor begins, sitting over the dirt
  const screenY = worldY - camera.y;
  if (screenY < -GLASS_BOTTOM_TILE_H || screenY > CANVAS_H) return;

  const startTile = Math.floor(camera.x / GLASS_BOTTOM_TILE_W) - 1;
  const endTile = Math.ceil((camera.x + CANVAS_W) / GLASS_BOTTOM_TILE_W) + 1;
  ctx.save();
  ctx.globalAlpha = GLASS_EDGE_BOTTOM.behavior.opacity;
  for (let i = startTile; i <= endTile; i++) {
    const wx = i * GLASS_BOTTOM_TILE_W;
    if (wx + GLASS_BOTTOM_TILE_W < 0 || wx > WORLD_WIDTH) continue;
    drawSprite(ctx, GLASS_EDGE_BOTTOM.rows, wx - camera.x, screenY, GLASS_EDGE_RENDER_SCALE, TERRARIUM_PALETTE.glassEdgeBottom);
  }
  ctx.restore();
}
