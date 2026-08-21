// All world/tank rendering: glass framing, dirt/floor, background decor,
// tree trunks/branches/plants, hanging props, the player sprite, and the
// per-frame camera that follows them.

import {
  CANVAS_W, CANVAS_H, SCALE, WORLD_WIDTH, WORLD_HEIGHT, GROUND_TOP, LID_TOP,
  GLASS_EDGE_RENDER_SCALE, GLASS_BOTTOM_TILE_W, GLASS_BOTTOM_TILE_H, GLASS_SIDE_THICKNESS,
  GLASS_SIDE_RENDER_SCALE, GLASS_SIDE_TILE_H, PLAYER_H, FLOOR_Y, GLASS_FRONT_TOP_ALPHA,
  GLASS_FRONT_BOTTOM_ALPHA, TREE_FADE_MIN_ALPHA_LAYER4, TREE_FADE_MAX_ALPHA_LAYER4,
  TERRARIUM_PALETTE_LAYER4_TREES, BACKGROUND_PIXEL_BLOCK, TREE_FADE_MIN_ALPHA, TREE_FADE_MAX_ALPHA,
  CAMERA_X_MAX, CAMERA_Y_MAX, GATE_MOSS_FINGER_MARGIN, TREE_PLANT_TRUNK_OVERLAP, SLIME_TRUNK_OVERLAP,
} from './constants.js';
import { state, ctx } from './state.js';
import {
  resolveGroundPlantSprite, resolveHangingSprite, resolveTreeTrunkSprite, resolveTreeBranchSprite,
  resolveTreePlantSprite, resolveBugSprite, byAscendingZ, BRANCH_GEOMETRIES, TREE_PLANT_GEOMETRIES,
  BUG_GEOMETRIES, GATE_TRUNK, treeTrunkRect, lightSwitchOrigin,
} from './world-geometry.js';
import { playerCenter } from './movement.js';

// Front-climb uses the flat, head-on clinging pose; side-climb uses whichever
// left/right-facing pose matches the edge the player attached from (see
// attachToTrunk). Every other state — grounded, mid-air — uses the default
// sprite, which already reverts automatically once jumpOffTrunk() clears
// state.climb.
export function playerSpriteForState() {
  if (state.climb) {
    if (state.climb.face === 'front') return SPRITES.playerFront;
    return state.climb.side === 'left' ? SPRITES.playerSideLeft : SPRITES.playerSideRight;
  }
  return SPRITES.player;
}

// Glass walls at the world's left/right edges and a lid at the top — the
// visible frame of the terrarium tank.
export function drawTankFraming(camera) {
  const leftX = 0 - camera.x;
  const rightX = WORLD_WIDTH - camera.x - GLASS_SIDE_THICKNESS;
  drawGlassEdgeSide(camera, GLASS_EDGE_LEFT, leftX);
  drawGlassEdgeSide(camera, GLASS_EDGE_RIGHT, rightX);

  const lidY = LID_TOP - camera.y;
  if (lidY > -20 && lidY < CANVAS_H) {
    ctx.fillStyle = 'rgba(200, 220, 180, 0.6)';
    ctx.fillRect(0, lidY, CANVAS_W, 4);
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
  front.addColorStop(0, `rgba(220, 245, 255, ${GLASS_FRONT_TOP_ALPHA * fade})`);
  front.addColorStop(1, `rgba(220, 245, 255, ${GLASS_FRONT_BOTTOM_ALPHA * fade})`);
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
export function drawGlassEdgeSide(camera, sprite, screenX) {
  if (screenX < -GLASS_SIDE_THICKNESS || screenX > CANVAS_W) return;

  const startTile = Math.floor(camera.y / GLASS_SIDE_TILE_H) - 1;
  const endTile = Math.ceil((camera.y + CANVAS_H) / GLASS_SIDE_TILE_H) + 1;
  ctx.save();
  ctx.globalAlpha = sprite.behavior.opacity;
  for (let i = startTile; i <= endTile; i++) {
    const wy = i * GLASS_SIDE_TILE_H;
    if (wy + GLASS_SIDE_TILE_H < 0 || wy > WORLD_HEIGHT) continue;
    drawSprite(ctx, sprite.rows, screenX, wy - camera.y, GLASS_SIDE_RENDER_SCALE, TERRARIUM_PALETTE);
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
    drawSprite(ctx, GLASS_EDGE_BOTTOM.rows, wx - camera.x, screenY, GLASS_EDGE_RENDER_SCALE, TERRARIUM_PALETTE);
  }
  ctx.restore();
}

// Ground-floor foliage placed from PLANT_PLACEMENTS (world-props.js), split
// across layer 4 (behind the player) and layer 6 (in front of the player)
// so plants can occlude the chameleon as it walks past.
export function drawGroundPlants(camera, layer) {
  const placements = PLANT_PLACEMENTS.filter((p) => p.layer === layer).sort(byAscendingZ);
  for (const placement of placements) {
    const sprite = resolveGroundPlantSprite(placement.sprite);
    const scale = SCALE * (sprite.renderScale || 1);
    const screenX = placement.x - camera.x;
    const screenY = GROUND_TOP - sprite.height * scale - camera.y;
    drawSprite(ctx, sprite.rows, screenX, screenY, scale, TERRARIUM_PALETTE);
  }
}

// Layer 2 — hidden pixel-digit backdrop (sprites/background-texture.js),
// painted straight onto the flat layer-1 fill, before any other scenery.
// Only drawn while the light is on; at rest its digit strokes are dark
// enough against the same backdrop color to be effectively invisible anyway,
// but skipping the draw entirely avoids even a flat-diff giveaway in a
// screenshot/pixel-inspector.
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
  drawSprite(ctx, sprite.rows, screenX, screenY, SCALE, TERRARIUM_PALETTE);
}

// The light switch prop (LIGHT_SWITCH_PLACEMENT, world-props.js) — mounted
// on a trunk rather than standing on the floor, swapping art between
// light-switch.js/light-switch-2.js based on state.lightOn.
export function drawLightSwitch(camera) {
  const sprite = state.lightOn ? TERRARIUM_SPRITES.lightSwitch2 : TERRARIUM_SPRITES.lightSwitch;
  const origin = lightSwitchOrigin();
  const screenX = origin.x - camera.x;
  const screenY = origin.y - camera.y;
  drawSprite(ctx, sprite.rows, screenX, screenY, SCALE, TERRARIUM_PALETTE);
}

// Props that dangle from the glass lid (HANGING_PLACEMENTS, world-props.js)
// instead of standing on the floor — row 0 of the sprite anchors at LID_TOP
// rather than the sprite's bottom snapping to GROUND_TOP.
export function drawHangingProps(camera, layer) {
  const placements = HANGING_PLACEMENTS.filter((p) => p.layer === layer).sort(byAscendingZ);
  for (const placement of placements) {
    const sprite = resolveHangingSprite(placement.sprite);
    const scale = SCALE * (sprite.renderScale || 1);
    const screenX = placement.x - camera.x;
    const screenY = LID_TOP - camera.y;
    drawSprite(ctx, sprite.rows, screenX, screenY, scale, TERRARIUM_PALETTE);
  }
}

// Tree trunks placed from TREE_PLACEMENTS (world-props.js), keyed by layer
// and z-ordered the same way ground plants are. A trunk's fore/back name is
// purely a bark-color choice (see sprites/README.md) and doesn't dictate
// which layer/z it's placed on.
export function drawTreeTrunks(camera, layer) {
  const placements = TREE_PLACEMENTS.filter((p) => p.layer === layer).sort(byAscendingZ);
  const fade = layer === 4
    ? { minAlpha: TREE_FADE_MIN_ALPHA_LAYER4, maxAlpha: TREE_FADE_MAX_ALPHA_LAYER4 }
    : undefined;
  const palette = layer === 4 ? TERRARIUM_PALETTE_LAYER4_TREES : TERRARIUM_PALETTE;
  for (const placement of placements) {
    const sprite = resolveTreeTrunkSprite(placement.sprite);
    const screenX = placement.x - camera.x;
    const screenY = GROUND_TOP - sprite.height * SCALE - camera.y;
    drawSprite(ctx, sprite.rows, screenX, screenY, SCALE, palette, fade);
  }
}

// Branches from BRANCH_PLACEMENTS (world-props.js), mounted onto a sparse
// subset of the trees drawn by drawTreeTrunks above. Drawn right after the
// trunks on the same layer so they pick up the same depth treatment (the
// layer-4 fade + darkened bark palette, or full-strength layer-6 bark) and
// paint on top of the trunk they're attached to. Reuses branchGeometry's
// world-space sprite origin (see game/world-geometry.js) so the rendered
// sprite and the standable/hangable physics region it's derived from always
// agree.
export function drawTreeBranches(camera, layer) {
  const fade = layer === 4
    ? { minAlpha: TREE_FADE_MIN_ALPHA_LAYER4, maxAlpha: TREE_FADE_MAX_ALPHA_LAYER4 }
    : undefined;
  const palette = layer === 4 ? TERRARIUM_PALETTE_LAYER4_TREES : TERRARIUM_PALETTE;
  for (const geo of BRANCH_GEOMETRIES) {
    if (geo.placement.layer !== layer) continue;
    const branchSprite = resolveTreeBranchSprite(geo.placement.sprite);
    const flipX = geo.placement.side === 'left';
    const screenX = geo.originX - camera.x;
    const screenY = geo.originY - camera.y;
    drawSprite(ctx, branchSprite.rows, screenX, screenY, SCALE, palette, fade, flipX);
  }
}

// Decorative foliage from TREE_PLANT_PLACEMENTS (world-props.js), mounted
// onto a sparse subset of the trees drawn by drawTreeTrunks above. Drawn
// right after the branches on the same layer so it picks up the same depth
// treatment and paints on top of the trunk (and any branch) it sits near.
export function drawTreePlants(camera, layer) {
  const fade = layer === 4
    ? { minAlpha: TREE_FADE_MIN_ALPHA_LAYER4, maxAlpha: TREE_FADE_MAX_ALPHA_LAYER4 }
    : undefined;
  const palette = layer === 4 ? TERRARIUM_PALETTE_LAYER4_TREES : TERRARIUM_PALETTE;
  for (const geo of TREE_PLANT_GEOMETRIES) {
    if (geo.placement.layer !== layer) continue;
    const plantSprite = resolveTreePlantSprite(geo.placement.sprite);
    const flipX = geo.placement.side === 'left';
    const screenX = geo.originX - camera.x;
    const screenY = geo.originY - camera.y;
    drawSprite(ctx, plantSprite.rows, screenX, screenY, SCALE, palette, fade, flipX);
  }
}

// Bugs from BUG_GEOMETRIES (game/world-geometry.js) — ground ones stand in
// the open the whole game, trunk ones sit past the slime coating
// (drawSkillSlime below) until skillUnlocked. Drawn regardless of that flag
// (a slime-locked bug is meant to be visible-but-unreachable, a teaser); a
// collected bug (state.bugsFound[i]) just stops being drawn.
export function drawBugs(camera, layer) {
  BUG_GEOMETRIES.forEach((geo, i) => {
    if (geo.placement.layer !== layer || state.bugsFound[i]) return;
    const sprite = resolveBugSprite(geo.placement.sprite);
    const screenX = geo.originX - camera.x;
    const screenY = geo.originY - camera.y;
    drawSprite(ctx, sprite.rows, screenX, screenY, SCALE, TERRARIUM_PALETTE);
  });
}

// Yellow slime (tree-plant-slime.js) tiled down the right-hand edge of every
// side-climbable trunk (layer 6 — layer-4 trunks are front-climb only, no
// side to lock) while the trunk-side-swap skill is still locked. Removed the
// moment skillUnlocked flips, same as drawGateMoss() removing the gate moss
// once state.gateSolved flips. See the attach gating in game/movement.js for
// the actual movement restriction this is signaling.
export function drawSkillSlime(camera) {
  if (state.skillUnlocked) return;
  const tileH = TREE_PLANT_SLIME.height * SCALE;
  for (const placement of TREE_PLACEMENTS) {
    if (placement.layer !== 6) continue;
    const rect = treeTrunkRect(placement);
    const screenX = rect.right - SLIME_TRUNK_OVERLAP * SCALE - camera.x;
    for (let y = rect.top; y < rect.bottom; y += tileH) {
      drawSprite(ctx, TREE_PLANT_SLIME.rows, screenX, y - camera.y, SCALE, TERRARIUM_PALETTE);
    }
  }
}

// `fade`, when given, fades rows from `minAlpha` (top, row 0) up to
// `maxAlpha` (bottom, last row) so a tall background trunk reads as
// vanishing into haze near its top instead of cutting off sharply.
export function drawSpriteBlocky(ctx, spriteRows, x, y, scale, palette, block, fade) {
  const cell = scale * block;
  const lastRow = spriteRows.length - 1;
  for (let row = 0; row <= lastRow; row += block) {
    const line = spriteRows[row];
    if (fade) {
      const t = lastRow > 0 ? row / lastRow : 1;
      ctx.globalAlpha = fade.minAlpha + (fade.maxAlpha - fade.minAlpha) * t;
    }
    for (let col = 0; col < line.length; col += block) {
      const color = palette[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + (col / block) * cell, y + (row / block) * cell, cell, cell);
    }
  }
  if (fade) ctx.globalAlpha = 1;
}

// Tiles the gate moss sprite (TREE_PLANT_1) down the gatekeeper tree's full
// height, the same tiling approach drawGlassEdgeSide uses for the tank
// walls. Skipped entirely once the tree's puzzle is solved.
export function drawGateMoss(camera) {
  if (state.gateSolved) return;
  const rect = treeTrunkRect(GATE_TRUNK);
  const tileH = TREE_PLANT_1.height * SCALE;
  const screenX = rect.left - GATE_MOSS_FINGER_MARGIN - camera.x;
  for (let y = rect.top; y < rect.bottom; y += tileH) {
    drawSprite(ctx, TREE_PLANT_1.rows, screenX, y - camera.y, SCALE, TERRARIUM_PALETTE);
  }
}

// Purely cosmetic background scenery from BACKGROUND_PLACEMENTS (layer 3,
// world-props.js) — painted before the far-plants pass, with no floor
// occlusion/interaction logic, just depth. Reuses the tree-trunk resolver
// since background decor is currently trunk-only.
export function drawBackgroundDecor(camera) {
  const placements = [...BACKGROUND_PLACEMENTS].sort(byAscendingZ);
  for (const placement of placements) {
    const sprite = resolveTreeTrunkSprite(placement.sprite);
    const screenX = placement.x - camera.x;
    const screenY = GROUND_TOP - sprite.height * SCALE - camera.y;
    drawSpriteBlocky(ctx, sprite.rows, screenX, screenY, SCALE, TERRARIUM_PALETTE, BACKGROUND_PIXEL_BLOCK, {
      minAlpha: TREE_FADE_MIN_ALPHA,
      maxAlpha: TREE_FADE_MAX_ALPHA,
    });
  }
}

export function draw() {
  const p = playerCenter();
  const camera = {
    x: Math.max(0, Math.min(CAMERA_X_MAX, p.x - CANVAS_W / 2)),
    y: Math.max(0, Math.min(CAMERA_Y_MAX, p.y - CANVAS_H / 2)),
  };

  // flat background
  ctx.fillStyle = '#132218';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // layer 2: hidden pixel-digit backdrop, only visible once the light is on
  drawBackgroundTexture(camera);

  // ground line
  ctx.fillStyle = '#12200f';
  ctx.fillRect(0, GROUND_TOP - camera.y, CANVAS_W, WORLD_HEIGHT - GROUND_TOP);

  // layer 3: cosmetic background decor, furthest back, painted before
  // anything the player can interact with or be occluded by
  drawBackgroundDecor(camera);

  // dirt bed behind the glass, then the glass rim itself — both sit under the player
  drawDirtLayer(camera);
  drawGlassEdgeBottom(camera);

  // layer 4: far plants and tree trunks, behind the player
  // trunks paint first so they sit behind the ground plants, not on top of them
  drawTreeTrunks(camera, 4);
  drawTreeBranches(camera, 4);
  drawTreePlants(camera, 4);
  drawGroundPlants(camera, 4);
  drawBugs(camera, 4);
  drawHangingProps(camera, 4);

  // player — invisible until CHAMELEON_VISIBLE is flipped on (see game/state.js)
  if (window.CHAMELEON_VISIBLE) {
    const playerSprite = playerSpriteForState();
    const hanging = state.branch && state.branch.mode === 'hang';
    const flipDefaultPose = !state.climb && state.facing === 'left';
    drawSprite(ctx, playerSprite, state.player.x - camera.x, state.player.y - camera.y, SCALE, PLAYER_PALETTE, undefined, flipDefaultPose, hanging);
  }

  // layer 6: near plants and tree trunks, in front of the player
  drawGroundPlants(camera, 6);
  drawBugs(camera, 6);
  drawTreeTrunks(camera, 6);
  drawGateMoss(camera);
  drawSkillSlime(camera);
  drawTreeBranches(camera, 6);
  drawTreePlants(camera, 6);

  // light switch — mounted on a trunk (see LIGHT_SWITCH_PLACEMENT,
  // world-props.js), drawn last so it always sits on top of that trunk's
  // bark and any layer-4/6 foliage near it.
  drawLightSwitch(camera);

  drawTankFraming(camera);
  drawGlassFront(state.player.y);
}
