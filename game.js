// Escape the Terrarium — game state machine, movement, and jungle world rendering.
//
// The world is a single capped rectangle — like looking at a real glass
// terrarium from outside: a fixed width and a fixed height, with glass walls
// at both ends, a lid up top, and a soil base at the bottom. The camera pans
// both horizontally (to follow the chameleon along the mossy floor) and
// vertically (when the chameleon jumps toward the canopy).

// The chameleon starts camouflaged — invisible until this is flipped to
// true. It's a plain `window` property (not `const`/`let`) specifically so
// it can be toggled live from the browser console: `CHAMELEON_VISIBLE = true`.
// No in-game hint points at this yet; that'll be added later.
window.CHAMELEON_VISIBLE = false;

const CANVAS_W = 480;
const CANVAS_H = 320;
const SCALE = 4; // sprite pixel scale
const PLAYER_SPEED = 5;
const GRAVITY = 0.7;
const JUMP_VELOCITY = -12;
const CLIMB_SPEED = 3;
const CLIMB_GRAB_MARGIN = 6; // extra px of forgiveness when checking for a trunk to grab
const CLIMB_MIN_AIR_HEIGHT = 16; // min px the player must have jumped above the floor line before a trunk can grab them — keeps a low hop near a trunk's base (where ground plants often sit) from snapping onto the trunk and reading as "stuck" on the plants
const CLIMB_JUMP_KICK = 4; // horizontal push when jumping off a trunk toward a direction
const CLIMB_JUMP_AWAY_KICK = 2; // horizontal push when jumping off with no direction held
const CLIMB_SIDE_PEEK_FRACTION = 0.8; // fraction of player width left visible outside the trunk when side-climbing
const TREE_BRANCH_TRUNK_OVERLAP = 2; // grid cells a branch's base sinks into the trunk's edge, both for the visual join and for its physics base point
const BRANCH_GRAB_MARGIN = 8; // extra px of forgiveness when checking for a branch underside to grab
const BRANCH_HANG_BAND = 10; // px of vertical forgiveness below a branch's underside still counted as "reaching" it

// --- World layout: a capped rectangle, not an endless scroller ---
const WORLD_WIDTH = 3600;
const WORLD_HEIGHT = 640;
const CAMERA_X_MAX = WORLD_WIDTH - CANVAS_W;
const CAMERA_Y_MAX = WORLD_HEIGHT - CANVAS_H;

const GROUND_BAND = 14; // thickness of the mossy floor strip
const GROUND_TOP = WORLD_HEIGHT - GROUND_BAND; // world y where moss starts
const LID_TOP = 20; // where the tank lid sits, just under the top of the world

// Bottom glass rim is rendered at double sprite scale so each tile spans
// more of the tank width — fewer repeats, fewer visible seams/joins.
const GLASS_EDGE_RENDER_SCALE = SCALE * 2;
const GLASS_BOTTOM_TILE_W = GLASS_EDGE_BOTTOM.width * GLASS_EDGE_RENDER_SCALE;
const GLASS_BOTTOM_TILE_H = GLASS_EDGE_BOTTOM.height * GLASS_EDGE_RENDER_SCALE;
// Side walls are as thick as the bottom rim is tall, so all four edges read
// as the same gauge of glass. GLASS_EDGE_LEFT/RIGHT are 2 units wide, so
// scale them up to hit that thickness.
const GLASS_SIDE_THICKNESS = GLASS_BOTTOM_TILE_H;
const GLASS_SIDE_RENDER_SCALE = GLASS_SIDE_THICKNESS / GLASS_EDGE_LEFT.width;
const GLASS_SIDE_TILE_H = GLASS_EDGE_LEFT.height * GLASS_SIDE_RENDER_SCALE;

// Player sprites (SPRITES.player / playerSideLeft / playerSideRight) are 16
// columns x 11 rows.
const PLAYER_W = SCALE * 16;
const PLAYER_H = SCALE * 11;
const FLOOR_Y = GROUND_TOP - PLAYER_H; // player's resting world y (feet on top of the ground/glass line)
const START_POS = { x: 60, y: FLOOR_Y };

const state = {
  player: { ...START_POS },
  vy: 0,
  vx: 0, // residual horizontal velocity from a climb-jump kick; decays while airborne
  onGround: true,
  facing: 'right', // 'left' | 'right' — last non-zero horizontal move, used to mirror the default (non-climb) pose
  keys: {},
  climb: null, // { trunk: <TREE_PLACEMENTS entry>, face: 'front' | 'side' } while attached to a trunk
  branch: null, // { geo: <BRANCH_GEOMETRIES entry>, mode: 'stand' | 'hang' } while on/under a branch
  recentlyLeftTrunk: null, // trunk just jumped off of, ignored by findClimbableTrunk() until cleared
  branchExitY: null, // player.y at the moment they walked off a branch's end (not jumped) — findClimbableTrunk() stays blind to every trunk until they've fallen CLIMB_MIN_AIR_HEIGHT clear of it
  // Manual dev toggle for the trunk-side-swap / branch-traversal skill. Currently
  // set directly via the Yes/No buttons; a real in-game unlock mechanism will
  // replace this later. The movement it unlocks isn't implemented yet either.
  skillUnlocked: false,
  gateSolved: false, // the gatekeeper tree's moss puzzle (room 1) — see GATE_TRUNK below
  levelsComplete: 0,
};

const TOTAL_LEVELS = 4; // one per PUZZLES entry in puzzles.js

// The gatekeeper tree — the first tree right of the player's start position
// (see TREE_PLACEMENTS in world-props.js) — walled off by red gate moss
// (TREE_PLANT_1) until room 1's puzzle is solved.
const GATE_TRUNK = TREE_PLACEMENTS.find((p) => p.x === 550 && p.layer === 6);
const GATE_MOSS_FINGER_MARGIN = 2 * SCALE; // TREE_PLANT_1's 2 leftmost columns are finger tips, not bark overlay
const GATE_INTERACT_RANGE = 60; // px of horizontal slack on either side of the gate trunk that still counts as "at" it
let gatePopupOpen = false;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Front-climb uses the flat, head-on clinging pose; side-climb uses whichever
// left/right-facing pose matches the edge the player attached from (see
// attachToTrunk). Every other state — grounded, mid-air — uses the default
// sprite, which already reverts automatically once jumpOffTrunk() clears
// state.climb.
function playerSpriteForState() {
  if (state.climb) {
    if (state.climb.face === 'front') return SPRITES.playerFront;
    return state.climb.side === 'left' ? SPRITES.playerSideLeft : SPRITES.playerSideRight;
  }
  return SPRITES.player;
}

function playerCenter() {
  return { x: state.player.x + PLAYER_W / 2, y: state.player.y + PLAYER_H / 2 };
}

// While the gatekeeper tree's moss puzzle is unsolved, its trunk acts as a
// solid wall for ground/air horizontal movement, same as the world's glass
// walls — the player can still climb it (climbing moves y, not x, see
// updateClimbing) but can't walk or arc past it. Only applied to the main
// grounded/airborne movement below; climb/branch positioning never crosses
// the gate trunk anyway since it's the trunk being climbed.
function clampPlayerX(nx) {
  let clamped = Math.max(GLASS_SIDE_THICKNESS, Math.min(WORLD_WIDTH - GLASS_SIDE_THICKNESS - PLAYER_W, nx));
  if (!state.gateSolved) {
    const gateRect = treeTrunkRect(GATE_TRUNK);
    clamped = Math.min(clamped, gateRect.left - PLAYER_W);
  }
  return clamped;
}

function update() {
  let dx = 0;
  if (state.keys['arrowleft'] || state.keys['a']) dx -= 1;
  if (state.keys['arrowright'] || state.keys['d']) dx += 1;
  if (dx !== 0) state.facing = dx < 0 ? 'left' : 'right';

  if (state.climb) {
    updateClimbing(dx);
    return;
  }

  if (state.branch) {
    updateBranch(dx);
    return;
  }

  const moveX = dx * PLAYER_SPEED + state.vx;
  if (moveX !== 0) {
    const nx = state.player.x + moveX;
    state.player.x = clampPlayerX(nx);
  }
  state.vx *= 0.85;

  state.vy += GRAVITY;
  const ny = state.player.y + state.vy;
  const landing = state.vy >= 0 ? findStandableBranch(ny) : null;
  if (ny >= FLOOR_Y) {
    state.player.y = FLOOR_Y;
    state.vy = 0;
    state.vx = 0;
    state.onGround = true;
  } else if (landing) {
    state.player.y = landing.surfaceY - PLAYER_H;
    state.vy = 0;
    state.vx = 0;
    state.onGround = false;
    state.branch = { geo: landing.geo, mode: 'stand' };
    return;
  } else {
    state.player.y = ny;
    state.onGround = false;
  }

  if (state.onGround) {
    state.recentlyLeftTrunk = null;
  } else {
    if (state.recentlyLeftTrunk && !rectsOverlap(playerGrabRect(), treeTrunkRect(state.recentlyLeftTrunk))) {
      state.recentlyLeftTrunk = null;
    }
    const trunk = findClimbableTrunk();
    if (trunk) {
      attachToTrunk(trunk);
      return;
    }
    const hang = findHangableBranch();
    if (hang) {
      state.player.y = hang.surfaceY;
      state.vy = 0;
      state.vx = 0;
      state.branch = { geo: hang.geo, mode: 'hang' };
    }
  }
}

// Snaps the player onto a trunk and enters climbing state. `face` is decided
// purely by whichever layer the trunk is already placed on (see world-props.js) —
// layer 4 trunks paint behind the player (front-climb), layer 6 trunks paint
// in front of the player (side-climb), so no extra render logic is needed.
function attachToTrunk(placement) {
  const rect = treeTrunkRect(placement);
  const face = placement.layer === 4 ? 'front' : 'side';

  let targetX;
  let side = null;
  if (face === 'front') {
    // centered on top of the trunk, fully visible
    targetX = rect.left + (rect.right - rect.left) / 2 - PLAYER_W / 2;
  } else {
    // side-climb: offset toward the edge the player approached from, so most
    // of the player tucks behind the (opaque, painted-after-player) trunk
    // but a slice still pokes out — reads as gripping the side, not vanishing
    // behind it. Approach side is whichever side of the trunk's center the
    // player is currently on.
    const trunkCenter = rect.left + (rect.right - rect.left) / 2;
    const approachedFromLeft = state.player.x + PLAYER_W / 2 < trunkCenter;
    side = approachedFromLeft ? 'left' : 'right';
    targetX = approachedFromLeft
      ? rect.left - PLAYER_W * CLIMB_SIDE_PEEK_FRACTION
      : rect.right - PLAYER_W * (1 - CLIMB_SIDE_PEEK_FRACTION);
  }

  state.player.x = Math.max(GLASS_SIDE_THICKNESS, Math.min(WORLD_WIDTH - GLASS_SIDE_THICKNESS - PLAYER_W, targetX));
  state.vy = 0;
  state.vx = 0;
  state.onGround = false;
  state.climb = { trunk: placement, face, side };
}

// Detach and jump off the current trunk, kicking toward whatever direction is
// held so the player can arc toward a neighboring trunk (or straight/away if
// no direction is held). Landing on another trunk mid-arc is handled by the
// same findClimbableTrunk() check update() already runs while airborne.
function jumpOffTrunk() {
  const rect = treeTrunkRect(state.climb.trunk);
  let dx = 0;
  if (state.keys['arrowleft'] || state.keys['a']) dx -= 1;
  if (state.keys['arrowright'] || state.keys['d']) dx += 1;

  state.recentlyLeftTrunk = state.climb.trunk;
  state.climb = null;
  state.vy = JUMP_VELOCITY;
  if (dx !== 0) {
    state.vx = dx * CLIMB_JUMP_KICK;
  } else {
    // no direction held — push away from the trunk so the player doesn't
    // immediately re-attach to the same trunk they just jumped off
    const trunkCenter = rect.left + (rect.right - rect.left) / 2;
    const playerCenterX = state.player.x + PLAYER_W / 2;
    state.vx = (playerCenterX < trunkCenter ? -1 : 1) * CLIMB_JUMP_AWAY_KICK;
  }
  state.onGround = false;
}

// While climbing a trunk, a branch mounted on that same trunk blocks the way
// rather than letting the player pass straight through it. Climbing up runs
// into the branch's underside first (same as jumping up into it in open air
// — see findHangableBranch), so it catches in 'hang' mode; climbing down runs
// into its top surface first (same as falling onto it — see
// findStandableBranch), so it catches in 'stand' mode. To get past a branch
// and keep climbing in the same direction, the player has to press jump
// together with that direction (see passBranchAlongTrunk) rather than just
// walking into it.
//
// Only a branch on the side of the trunk the player is actually gripping
// (state.climb.side, side-climb only — front-climb has no side, it's
// centered on the trunk) can catch them — otherwise a branch mounted on the
// opposite face of the trunk would reach through the bark and pull the
// player around to a side they were never climbing on.
function findBranchCrossedClimbingUp(trunk, climbSide, prevY, nextY) {
  const prevFeetY = prevY + PLAYER_H;
  const nextFeetY = nextY + PLAYER_H;
  for (const geo of BRANCH_GEOMETRIES) {
    if (geo.placement.layer !== trunk.layer || geo.placement.trunkX !== trunk.x) continue;
    if (climbSide && geo.placement.side !== climbSide) continue;
    const underY = geo.baseY + geo.thickness;
    if (nextFeetY <= underY && prevFeetY > underY) return geo;
  }
  return null;
}

function findBranchCrossedClimbingDown(trunk, climbSide, prevY, nextY) {
  const prevFeetY = prevY + PLAYER_H;
  const nextFeetY = nextY + PLAYER_H;
  for (const geo of BRANCH_GEOMETRIES) {
    if (geo.placement.layer !== trunk.layer || geo.placement.trunkX !== trunk.x) continue;
    if (climbSide && geo.placement.side !== climbSide) continue;
    if (nextFeetY >= geo.baseY && prevFeetY < geo.baseY) return geo;
  }
  return null;
}

function updateClimbing(dx) {
  const rect = treeTrunkRect(state.climb.trunk);
  const climbSide = state.climb.face === 'side' ? state.climb.side : null;

  let dy = 0;
  if (state.keys['arrowup'] || state.keys['w']) dy -= 1;
  if (state.keys['arrowdown'] || state.keys['s']) dy += 1;

  if (dy !== 0) {
    const ny = state.player.y + dy * CLIMB_SPEED;

    if (dy < 0) {
      const geo = findBranchCrossedClimbingUp(state.climb.trunk, climbSide, state.player.y, ny);
      if (geo) {
        state.climb = null;
        state.player.x = Math.max(GLASS_SIDE_THICKNESS, Math.min(WORLD_WIDTH - GLASS_SIDE_THICKNESS - PLAYER_W, geo.baseX - PLAYER_W / 2));
        state.player.y = geo.baseY + geo.thickness;
        state.vy = 0;
        state.vx = 0;
        state.onGround = false;
        state.branch = { geo, mode: 'hang' };
        return;
      }
    } else {
      const geo = findBranchCrossedClimbingDown(state.climb.trunk, climbSide, state.player.y, ny);
      if (geo) {
        state.climb = null;
        state.player.x = Math.max(GLASS_SIDE_THICKNESS, Math.min(WORLD_WIDTH - GLASS_SIDE_THICKNESS - PLAYER_W, geo.baseX - PLAYER_W / 2));
        state.player.y = geo.baseY - PLAYER_H;
        state.vy = 0;
        state.vx = 0;
        state.onGround = false;
        state.branch = { geo, mode: 'stand' };
        return;
      }
    }

    if (ny >= FLOOR_Y) {
      // climbed down past the floor line — detach back to grounded
      state.climb = null;
      state.player.y = FLOOR_Y;
      state.vy = 0;
      state.onGround = true;
    } else {
      state.player.y = Math.max(rect.top, ny);
    }
  }
}

// px of clearance put between the player and a branch's contact line
// (top surface when passing up, underside when passing down) after
// passBranchAlongTrunk repositions them back onto the trunk — just enough
// that next frame's findBranchCrossedClimbingUp/Down doesn't immediately
// re-trigger on the same branch.
const BRANCH_PASS_MARGIN = 4;

// Jump (space) held together with up/down while on a branch (stand or hang,
// however it was reached) detaches the player and puts them back on the
// branch's trunk, past its contact line in that direction, so they can keep
// climbing — the deliberate way past a branch that would otherwise auto-catch
// them (see findBranchCrossedClimbingUp/Down above and updateBranch below).
function passBranchAlongTrunk(direction) {
  const { geo } = state.branch;
  const trunkPlacement = TREE_PLACEMENTS.find((p) => p.layer === geo.placement.layer && p.x === geo.placement.trunkX);
  if (!trunkPlacement) {
    jumpOffBranch();
    return;
  }

  const face = trunkPlacement.layer === 4 ? 'front' : 'side';
  const side = face === 'side' ? geo.placement.side : null;
  const rect = treeTrunkRect(trunkPlacement);
  const targetX = face === 'front'
    ? rect.left + (rect.right - rect.left) / 2 - PLAYER_W / 2
    : side === 'left'
      ? rect.left - PLAYER_W * CLIMB_SIDE_PEEK_FRACTION
      : rect.right - PLAYER_W * (1 - CLIMB_SIDE_PEEK_FRACTION);
  const targetY = direction < 0
    ? geo.baseY - PLAYER_H - BRANCH_PASS_MARGIN
    : geo.baseY + geo.thickness + BRANCH_PASS_MARGIN;

  state.branch = null;
  state.player.x = Math.max(GLASS_SIDE_THICKNESS, Math.min(WORLD_WIDTH - GLASS_SIDE_THICKNESS - PLAYER_W, targetX));
  state.vy = 0;
  state.vx = 0;
  state.onGround = false;

  if (targetY >= FLOOR_Y) {
    // passing down landed at/past the floor line — just stand up instead of climbing
    state.player.y = FLOOR_Y;
    state.onGround = true;
  } else {
    state.player.y = Math.max(rect.top, targetY);
    state.climb = { trunk: trunkPlacement, face, side };
  }
}

// Horizontal speed while on/under a branch — a bit brisker than trunk
// climbing since a branch run is meant to read as a dash along a limb, not
// a careful climb.
const BRANCH_SPEED = 4;

// Detach from the current branch (stand or hang) and jump upward, kicking
// toward whatever direction is held — mirrors jumpOffTrunk so a branch jump
// feels consistent with a trunk jump. Landing on another branch/trunk mid-arc
// is handled by the same findStandableBranch/findHangableBranch/
// findClimbableTrunk checks update() already runs while airborne.
function jumpOffBranch() {
  let dx = 0;
  if (state.keys['arrowleft'] || state.keys['a']) dx -= 1;
  if (state.keys['arrowright'] || state.keys['d']) dx += 1;

  state.branch = null;
  state.vy = JUMP_VELOCITY;
  state.vx = dx * CLIMB_JUMP_KICK;
  state.onGround = false;
}

// Standing (mode 'stand') walks along the branch's top surface like a sloped
// floor; hanging (mode 'hang') shimmies along its underside like a monkey
// bar. Both share the same left/right traversal — dx moves the player's
// center along the branch's base-to-tip line, and the player's y is
// re-derived from wherever that puts them (surface for standing, a
// thickness below it for hanging). Walking past either end lets go and
// drops the player into normal airborne physics, matching how simply
// walking off a platform ledge would work.
function updateBranch(dx) {
  const { geo, mode } = state.branch;

  if (dx !== 0) {
    const centerX = state.player.x + PLAYER_W / 2 + dx * BRANCH_SPEED;
    if (centerX < geo.minX || centerX > geo.maxX) {
      state.branch = null;
      state.onGround = false;
      state.player.x = Math.max(GLASS_SIDE_THICKNESS, Math.min(WORLD_WIDTH - GLASS_SIDE_THICKNESS - PLAYER_W, centerX - PLAYER_W / 2));
      // Walking off the end this way is an incidental step off a ledge, not a
      // deliberate leap (that's jumpOffBranch, via space) — suppress grabbing
      // any trunk that happens to be within reach until the player has
      // actually fallen clear of the branch, so simply walking along a
      // branch toward a neighboring tree doesn't auto-grab it.
      state.branchExitY = state.player.y;
      return;
    }
    state.player.x = centerX - PLAYER_W / 2;
  }

  const centerX = state.player.x + PLAYER_W / 2;
  const surfaceY = branchSurfaceYAt(geo, centerX);
  state.player.y = mode === 'stand' ? surfaceY - PLAYER_H : surfaceY + geo.thickness;
}

// Glass walls at the world's left/right edges and a lid at the top — the
// visible frame of the terrarium tank.
function drawTankFraming(camera) {
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

const GLASS_FRONT_TOP_ALPHA = 0.05; // near-clear at the top, even at the floor
const GLASS_FRONT_BOTTOM_ALPHA = 0.5; // hazy near the bottom, even at the floor

// The pane of glass between the viewer and the tank itself — not a placed
// sprite, since it isn't part of the world, it's the screen you're looking
// through. A vertical gradient: clear near the top, hazier toward the
// bottom. Its overall strength also fades the closer the chameleon gets to
// the lid, so the whole tank reads clearer the nearer it is to escaping.
function drawGlassFront(playerWorldY) {
  const climbT = Math.max(0, Math.min(1, (FLOOR_Y - playerWorldY) / (FLOOR_Y - LID_TOP)));
  const fade = 1 - climbT; // 1 at the floor, 0 right at the lid

  const front = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  front.addColorStop(0, `rgba(220, 245, 255, ${GLASS_FRONT_TOP_ALPHA * fade})`);
  front.addColorStop(1, `rgba(220, 245, 255, ${GLASS_FRONT_BOTTOM_ALPHA * fade})`);
  ctx.fillStyle = front;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function pseudoRandom(i) {
  const x = Math.sin(i * 999.77) * 10000;
  return x - Math.floor(x);
}

// A rough dirt bed sitting behind the glass rim, its top edge rising and
// falling across the width of the tank so it doesn't read as a flat slab.
function drawDirtLayer(camera) {
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
function drawGlassEdgeSide(camera, sprite, screenX) {
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
function drawGlassEdgeBottom(camera) {
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

// "ground-plant-3" -> TERRARIUM_SPRITES.groundPlant[2]
function resolveGroundPlantSprite(id) {
  const index = Number(id.slice('ground-plant-'.length)) - 1;
  return TERRARIUM_SPRITES.groundPlant[index];
}

// Placements within a layer paint in ascending z order, so a higher z sits
// on top wherever two instances' footprints overlap (see world-props.js).
function byAscendingZ(a, b) {
  return (a.z || 0) - (b.z || 0);
}

// Ground-floor foliage placed from PLANT_PLACEMENTS (world-props.js), split
// across layer 4 (behind the player) and layer 6 (in front of the player)
// so plants can occlude the chameleon as it walks past.
function drawGroundPlants(camera, layer) {
  const placements = PLANT_PLACEMENTS.filter((p) => p.layer === layer).sort(byAscendingZ);
  for (const placement of placements) {
    const sprite = resolveGroundPlantSprite(placement.sprite);
    const scale = SCALE * (sprite.renderScale || 1);
    const screenX = placement.x - camera.x;
    const screenY = GROUND_TOP - sprite.height * scale - camera.y;
    drawSprite(ctx, sprite.rows, screenX, screenY, scale, TERRARIUM_PALETTE);
  }
}

// "tree-trunk-fore-1" -> TERRARIUM_SPRITES.treeTrunk.fore[0]
// "tree-trunk-back-3" -> TERRARIUM_SPRITES.treeTrunk.back[2]
function resolveTreeTrunkSprite(id) {
  const match = id.match(/^tree-trunk-(fore|back)-(\d+)$/);
  const [, variant, number] = match;
  return TERRARIUM_SPRITES.treeTrunk[variant][Number(number) - 1];
}

function resolveTreeBranchSprite(id) {
  const index = Number(id.slice('tree-branch-'.length)) - 1;
  return TERRARIUM_SPRITES.treeBranch[index];
}

// World-space bounding box for a TREE_PLACEMENTS entry, used for climb-attach checks.
function treeTrunkRect(placement) {
  const sprite = resolveTreeTrunkSprite(placement.sprite);
  const left = placement.x;
  const width = sprite.width * SCALE;
  const top = GROUND_TOP - sprite.height * SCALE;
  return { left, right: left + width, top, bottom: GROUND_TOP };
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

// True while the player is close enough to the gatekeeper tree — standing on
// the ground within reach, or gripping that exact trunk — to press E and
// open its keypad popup.
function nearGate() {
  const rect = treeTrunkRect(GATE_TRUNK);
  const centerX = state.player.x + PLAYER_W / 2;
  const inRange = centerX >= rect.left - GATE_INTERACT_RANGE && centerX <= rect.right + GATE_INTERACT_RANGE;
  const stationary = state.onGround || (state.climb && state.climb.trunk === GATE_TRUNK);
  return inRange && stationary;
}

// World-space geometry for a BRANCH_PLACEMENTS entry (world-props.js),
// shared by both rendering (drawTreeBranches) and branch physics
// (findStandableBranch/findHangableBranch/updateBranch below) so the two
// never drift apart. `originX`/`originY` is the sprite's top-left draw
// origin (before any horizontal flip) — the same value drawTreeBranches
// used to compute before this refactor. `baseX`/`baseY` is the thick end
// where the branch meets the trunk bark (sprite-local bottom-left corner,
// col 0 / row height-1); `tipX`/`tipY` is the thin tapered end (sprite-local
// top-right corner, col width-1 / row 0) — both resolved through the same
// left/right flip drawSprite applies when rendering, so the physics line
// always matches what's on screen.
function branchGeometry(bp) {
  const trunkPlacement = TREE_PLACEMENTS.find((p) => p.layer === bp.layer && p.x === bp.trunkX);
  if (!trunkPlacement) return null;
  const trunkSprite = resolveTreeTrunkSprite(trunkPlacement.sprite);
  const branchSprite = resolveTreeBranchSprite(bp.sprite);
  const trunkTopY = GROUND_TOP - trunkSprite.height * SCALE;
  const originX = bp.side === 'right'
    ? trunkPlacement.x + trunkSprite.width * SCALE - TREE_BRANCH_TRUNK_OVERLAP * SCALE
    : trunkPlacement.x - (branchSprite.width - TREE_BRANCH_TRUNK_OVERLAP) * SCALE;
  const originY = trunkTopY + bp.attachRow * SCALE - (branchSprite.height - 1) * SCALE;
  const w = branchSprite.width * SCALE;
  const h = branchSprite.height * SCALE;
  const baseX = bp.side === 'right' ? originX : originX + w - SCALE;
  const tipX = bp.side === 'right' ? originX + w - SCALE : originX;
  // The branch's solid base band (branchSprite.thickness, grid units) sits
  // flush with the bottom of the sprite's bounding box, tapering away toward
  // the tip — so its bottom edge is the sprite's bottom edge (originY + h),
  // and its top edge (thickness above that) is the standing surface. Using
  // the full sprite height here instead of the local band thickness would
  // put both of those lines way off: the bounding box also covers the
  // tapered reach out to the tip, well above where the bark actually is at
  // the trunk-contact end.
  const thickness = (branchSprite.thickness || branchSprite.height) * SCALE;
  const spriteBottom = originY + h;
  // The branch sprite stays level for its first branchSprite.flatCols columns
  // (the right-angle launch out of the trunk) before it starts rising toward
  // the tip (see the sprite files' generator comments) — so the walkable
  // surface isn't one straight line from base to tip, it's flat, then a
  // rise. tBend is where that bend falls along the base(0)-to-tip(1) line;
  // branchSurfaceYAt below uses it so standing/hanging movement tracks the
  // branch's actual silhouette instead of cutting the corner across it.
  const flatCols = branchSprite.flatCols || 0;
  const tBend = branchSprite.width > 1 ? Math.min(1, flatCols / (branchSprite.width - 1)) : 0;
  return {
    placement: bp,
    originX, originY,
    baseX, baseY: spriteBottom - thickness, tipX, tipY: originY,
    minX: Math.min(baseX, tipX),
    maxX: Math.max(baseX, tipX),
    thickness,
    tBend,
  };
}

// All branches, resolved once at load time (BRANCH_PLACEMENTS is static).
const BRANCH_GEOMETRIES = BRANCH_PLACEMENTS.map(branchGeometry).filter(Boolean);

// The branch's top-surface world y at a given world x — flat for the first
// geo.tBend fraction of the base-to-tip line (the right-angle launch out of
// the trunk), then linearly interpolated the rest of the way to the tip, so
// this matches the branch's actual flat-then-rising silhouette instead of
// cutting a single straight line across it. Clamped to the branch's actual
// span so a query slightly past either end still returns that end's height
// rather than extrapolating off the branch.
function branchSurfaceYAt(geo, worldX) {
  const span = geo.tipX - geo.baseX;
  const t = span === 0 ? 0 : Math.max(0, Math.min(1, (worldX - geo.baseX) / span));
  if (t <= geo.tBend) return geo.baseY;
  const riseT = geo.tBend >= 1 ? 0 : (t - geo.tBend) / (1 - geo.tBend);
  return geo.baseY + riseT * (geo.tipY - geo.baseY);
}

// While falling (or level), catch the player onto any branch whose surface
// their feet are about to cross this frame — same "did we cross the line"
// test the FLOOR_Y check above uses, just for a sloped line instead of a
// flat one. `nextY` is the player's would-be top-of-sprite y after this
// frame's gravity is applied (i.e. state.player.y + state.vy).
function findStandableBranch(nextY) {
  const centerX = state.player.x + PLAYER_W / 2;
  const feetY = state.player.y + PLAYER_H;
  const nextFeetY = nextY + PLAYER_H;
  for (const geo of BRANCH_GEOMETRIES) {
    if (centerX < geo.minX || centerX > geo.maxX) continue;
    const surfaceY = branchSurfaceYAt(geo, centerX);
    if (feetY <= surfaceY + 1 && nextFeetY >= surfaceY) {
      return { geo, surfaceY };
    }
  }
  return null;
}

// While airborne, reaching (holding up) lets the player grab the underside
// of any overlapping branch to hang and shimmy along it — deliberate, so
// jumping past a branch's underside doesn't snag on it by accident the way
// landing on top does automatically.
function findHangableBranch() {
  if (!(state.keys['arrowup'] || state.keys['w'])) return null;
  const centerX = state.player.x + PLAYER_W / 2;
  const headY = state.player.y - BRANCH_GRAB_MARGIN;
  const reachY = state.player.y + BRANCH_HANG_BAND;
  for (const geo of BRANCH_GEOMETRIES) {
    if (centerX < geo.minX || centerX > geo.maxX) continue;
    const surfaceY = branchSurfaceYAt(geo, centerX);
    const underY = surfaceY + geo.thickness;
    if (headY <= underY && reachY >= underY) {
      return { geo, surfaceY: underY };
    }
  }
  return null;
}

function playerGrabRect() {
  return {
    left: state.player.x - CLIMB_GRAB_MARGIN,
    right: state.player.x + PLAYER_W + CLIMB_GRAB_MARGIN,
    top: state.player.y - CLIMB_GRAB_MARGIN,
    bottom: state.player.y + PLAYER_H + CLIMB_GRAB_MARGIN,
  };
}

// While airborne, look for a trunk the player's (slightly expanded) bounding
// box overlaps so a jump toward it grabs on. Reused both for the initial
// attach and for tree-to-tree jumps, since both are "airborne + overlapping".
// Skips state.recentlyLeftTrunk — right after a jump-off the player is still
// overlapping the trunk they just left, and without this they'd instantly
// re-attach to it instead of actually jumping away.
function findClimbableTrunk() {
  if (state.player.y > FLOOR_Y - CLIMB_MIN_AIR_HEIGHT) return null;
  if (state.branchExitY !== null) {
    if (state.player.y - state.branchExitY < CLIMB_MIN_AIR_HEIGHT) return null;
    state.branchExitY = null;
  }
  const playerRect = playerGrabRect();
  const dirX = horizontalTravelDirection();
  for (const placement of TREE_PLACEMENTS) {
    if (placement === state.recentlyLeftTrunk) continue;
    const rect = treeTrunkRect(placement);
    if (!rectsOverlap(playerRect, rect)) continue;
    if (dirX !== 0 && !trunkInTravelDirection(rect, playerRect, dirX)) continue;
    return placement;
  }
  return null;
}

// Which way the player is currently traveling horizontally, so a jump away
// from one trunk can't snap onto a different trunk sitting on the opposite
// side (e.g. two trunks placed close together). Held movement keys take
// priority; failing that, fall back to the residual climb-jump kick (vx) so
// a direction-less jump-off (which pushes away from the trunk, see
// jumpOffTrunk) still only looks for trunks ahead of that push, not behind it.
function horizontalTravelDirection() {
  if (state.keys['arrowleft'] || state.keys['a']) return -1;
  if (state.keys['arrowright'] || state.keys['d']) return 1;
  if (Math.abs(state.vx) > 0.1) return state.vx > 0 ? 1 : -1;
  return 0;
}

// A trunk only counts as "ahead" if its center sits on the travel-direction
// side of the player's center (or is straight overlapping it) — a trunk
// whose center is fully behind the player relative to dirX is excluded.
function trunkInTravelDirection(trunkRect, playerRect, dirX) {
  const playerCenterX = (playerRect.left + playerRect.right) / 2;
  const trunkCenterX = (trunkRect.left + trunkRect.right) / 2;
  return dirX > 0 ? trunkCenterX >= playerCenterX : trunkCenterX <= playerCenterX;
}

// Layer-4 trunks (behind the player) get the same top-to-bottom vertical
// fade as the layer-3 background trunks (see TREE_FADE_MIN_ALPHA above),
// just much less dramatic — still clearly readable as trees, just a touch
// hazier than the fully-opaque layer-6 trunks in front of the player so
// depth still reads between the two.
const TREE_FADE_MIN_ALPHA_LAYER4 = 0.45;
const TREE_FADE_MAX_ALPHA_LAYER4 = 1;

// Layer-4 trunks also get a slightly darkened bark palette (on top of the
// alpha fade above) so they read as further back even where the fade is at
// its least dramatic (near the bottom, maxAlpha) — same 'r'/'R'/'h' bark
// keys as TERRARIUM_PALETTE, just ~15% darker.
const TERRARIUM_PALETTE_LAYER4_TREES = {
  ...TERRARIUM_PALETTE,
  'r': '#765347', // bark, darkened
  'R': '#4d332d', // bark shade, darkened
  'h': '#9d857c', // bark highlight, darkened
};

// Tree trunks placed from TREE_PLACEMENTS (world-props.js), keyed by layer
// and z-ordered the same way ground plants are. A trunk's fore/back name is
// purely a bark-color choice (see sprites/README.md) and doesn't dictate
// which layer/z it's placed on.
function drawTreeTrunks(camera, layer) {
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
// world-space sprite origin (see below) so the rendered sprite and the
// standable/hangable physics region it's derived from always agree.
function drawTreeBranches(camera, layer) {
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

// Background decor pixel block size — sampling every Nth row/col (nearest
// neighbor) and drawing it back out at N x the normal cell size makes
// background scenery read as slightly chunkier/lower-res than the crisp
// fore/near-layer sprites, reinforcing that it's further away.
const BACKGROUND_PIXEL_BLOCK = 2;

// `fade`, when given, fades rows from `minAlpha` (top, row 0) up to
// `maxAlpha` (bottom, last row) so a tall background trunk reads as
// vanishing into haze near its top instead of cutting off sharply.
function drawSpriteBlocky(ctx, spriteRows, x, y, scale, palette, block, fade) {
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

// Background trunks fade from barely-visible at the crown (TREE_FADE_MIN_ALPHA)
// up to fully opaque at the floor (TREE_FADE_MAX_ALPHA), so only the tops of
// the tallest trunks peek out of the haze rather than looming solidly overhead.
const TREE_FADE_MIN_ALPHA = 0.12;
const TREE_FADE_MAX_ALPHA = 1;

// Tiles the gate moss sprite (TREE_PLANT_1) down the gatekeeper tree's full
// height, the same tiling approach drawGlassEdgeSide uses for the tank
// walls. Skipped entirely once the tree's puzzle is solved.
function drawGateMoss(camera) {
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
function drawBackgroundDecor(camera) {
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

function draw() {
  const p = playerCenter();
  const camera = {
    x: Math.max(0, Math.min(CAMERA_X_MAX, p.x - CANVAS_W / 2)),
    y: Math.max(0, Math.min(CAMERA_Y_MAX, p.y - CANVAS_H / 2)),
  };

  // flat background
  ctx.fillStyle = '#132218';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

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
  drawGroundPlants(camera, 4);

  // player — invisible until CHAMELEON_VISIBLE is flipped on (see top of file)
  if (window.CHAMELEON_VISIBLE) {
    const playerSprite = playerSpriteForState();
    const hanging = state.branch && state.branch.mode === 'hang';
    const flipDefaultPose = !state.climb && state.facing === 'left';
    drawSprite(ctx, playerSprite, state.player.x - camera.x, state.player.y - camera.y, SCALE, PALETTE, undefined, flipDefaultPose, hanging);
  }

  // layer 6: near plants and tree trunks, in front of the player
  drawGroundPlants(camera, 6);
  drawTreeTrunks(camera, 6);
  drawGateMoss(camera);
  drawTreeBranches(camera, 6);

  drawTankFraming(camera);
  drawGlassFront(state.player.y);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function resetGame() {
  state.player = { ...START_POS };
  state.vy = 0;
  state.vx = 0;
  state.onGround = true;
  state.climb = null;
  state.branch = null;
  state.recentlyLeftTrunk = null;
  state.branchExitY = null;
}

// --- Input handling ---
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (gatePopupOpen) {
    // Let the input field handle its own typing; only Escape reaches the
    // game while the popup is up, and nothing here should move the player.
    if (key === 'escape') closeGatePopup();
    return;
  }

  state.keys[key] = true;

  if (key === 'e' && !e.repeat && !state.gateSolved && nearGate()) {
    e.preventDefault();
    openGatePopup();
  }

  if (key === ' ') {
    e.preventDefault(); // stop the page from scrolling
    if (!e.repeat && state.climb) {
      jumpOffTrunk();
    } else if (!e.repeat && state.branch) {
      // Jump held together with up/down passes the player back onto the
      // branch's trunk beyond its contact line, continuing the climb in that
      // direction; jump alone leaps off the branch into open air instead.
      if (state.keys['arrowup'] || state.keys['w']) {
        passBranchAlongTrunk(-1);
      } else if (state.keys['arrowdown'] || state.keys['s']) {
        passBranchAlongTrunk(1);
      } else {
        jumpOffBranch();
      }
    } else if (!e.repeat && state.onGround) {
      state.vy = JUMP_VELOCITY;
      state.onGround = false;
    }
  }
});

window.addEventListener('keyup', (e) => {
  state.keys[e.key.toLowerCase()] = false;
});

document.getElementById('restart-btn').addEventListener('click', resetGame);

// --- Skill status display ---
// Reflects state.skillUnlocked; flipped by the real unlock mechanism (TODO)
// once it exists, not by direct user input.
const skillStatusEl = document.getElementById('skill-status');

function setSkillUnlocked(unlocked) {
  state.skillUnlocked = unlocked;
  skillStatusEl.textContent = `Skill unlocked: ${unlocked ? 'YES' : 'NO'}`;
}

// --- Level counter display ---
const levelStatusEl = document.getElementById('level-status');

function setLevelsComplete(n) {
  state.levelsComplete = n;
  levelStatusEl.textContent = `Levels complete: ${n} / ${TOTAL_LEVELS}`;
}

// --- Gatekeeper tree popup (room 1) ---
// Styled and structured the same as #start-screen (see index.html/style.css:
// .popup-overlay/.popup-content), plus the input/feedback markup already
// defined in style.css for puzzle dialogs (.dialog-form/.dialog-feedback).
const gatePopupEl = document.getElementById('gate-popup');
const gateFormEl = document.getElementById('gate-form');
const gateInputEl = document.getElementById('gate-input');
const gateFeedbackEl = document.getElementById('gate-feedback');
const gateCloseBtn = document.getElementById('gate-close-btn');

function openGatePopup() {
  gatePopupOpen = true;
  gateFeedbackEl.textContent = '';
  gateInputEl.value = '';
  gatePopupEl.classList.remove('hidden');
  gateInputEl.focus();
}

function closeGatePopup() {
  gatePopupOpen = false;
  gatePopupEl.classList.add('hidden');
}

gateCloseBtn.addEventListener('click', closeGatePopup);

gateFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const correct = await checkAnswer(1, gateInputEl.value);
  if (correct) {
    state.gateSolved = true;
    closeGatePopup();
    setLevelsComplete(state.levelsComplete + 1);
  } else {
    gateFeedbackEl.textContent = 'Incorrect code. Try again.';
    gateInputEl.value = '';
    gateInputEl.focus();
  }
});

// --- Init ---
requestAnimationFrame(loop);
