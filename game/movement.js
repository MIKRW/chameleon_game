// Player movement: grounded walk/fall, trunk climbing, and branch
// stand/hang traversal, plus the jump/attach/detach transitions between them.

import {
  PLAYER_SPEED, GRAVITY, JUMP_VELOCITY, CLIMB_SPEED, CLIMB_GRAB_MARGIN, CLIMB_MIN_AIR_HEIGHT,
  CLIMB_JUMP_KICK, CLIMB_JUMP_AWAY_KICK, CLIMB_SIDE_PEEK_FRACTION, BRANCH_GRAB_MARGIN, BRANCH_HANG_BAND,
  BRANCH_PASS_MARGIN, BRANCH_SPEED, WORLD_WIDTH, GLASS_SIDE_THICKNESS, PLAYER_W, PLAYER_H, FLOOR_Y,
} from './constants.js';
import { state } from './state.js';
import { GATE_TRUNK, BRANCH_GEOMETRIES, treeTrunkRect, rectsOverlap, branchSurfaceYAt } from './world-geometry.js';

export function playerCenter() {
  return { x: state.player.x + PLAYER_W / 2, y: state.player.y + PLAYER_H / 2 };
}

// While the gatekeeper tree's moss puzzle is unsolved, its trunk acts as a
// solid wall for ground/air horizontal movement, same as the world's glass
// walls — the player can still climb it (climbing moves y, not x, see
// updateClimbing) but can't walk or arc past it. Only applied to the main
// grounded/airborne movement below; climb/branch positioning never crosses
// the gate trunk anyway since it's the trunk being climbed.
export function clampPlayerX(nx) {
  let clamped = Math.max(GLASS_SIDE_THICKNESS, Math.min(WORLD_WIDTH - GLASS_SIDE_THICKNESS - PLAYER_W, nx));
  if (!state.gateSolved) {
    const gateRect = treeTrunkRect(GATE_TRUNK);
    clamped = Math.min(clamped, gateRect.left - PLAYER_W);
  }
  return clamped;
}

export function update() {
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
export function attachToTrunk(placement) {
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
export function jumpOffTrunk() {
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
export function findBranchCrossedClimbingUp(trunk, climbSide, prevY, nextY) {
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

export function findBranchCrossedClimbingDown(trunk, climbSide, prevY, nextY) {
  const prevFeetY = prevY + PLAYER_H;
  const nextFeetY = nextY + PLAYER_H;
  for (const geo of BRANCH_GEOMETRIES) {
    if (geo.placement.layer !== trunk.layer || geo.placement.trunkX !== trunk.x) continue;
    if (climbSide && geo.placement.side !== climbSide) continue;
    if (nextFeetY >= geo.baseY && prevFeetY < geo.baseY) return geo;
  }
  return null;
}

export function updateClimbing(dx) {
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

// Jump (space) held together with up/down while on a branch (stand or hang,
// however it was reached) detaches the player and puts them back on the
// branch's trunk, past its contact line in that direction, so they can keep
// climbing — the deliberate way past a branch that would otherwise auto-catch
// them (see findBranchCrossedClimbingUp/Down above and updateBranch below).
export function passBranchAlongTrunk(direction) {
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

// Detach from the current branch (stand or hang) and jump upward, kicking
// toward whatever direction is held — mirrors jumpOffTrunk so a branch jump
// feels consistent with a trunk jump. Landing on another branch/trunk mid-arc
// is handled by the same findStandableBranch/findHangableBranch/
// findClimbableTrunk checks update() already runs while airborne.
export function jumpOffBranch() {
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
export function updateBranch(dx) {
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

// While falling (or level), catch the player onto any branch whose surface
// their feet are about to cross this frame — same "did we cross the line"
// test the FLOOR_Y check above uses, just for a sloped line instead of a
// flat one. `nextY` is the player's would-be top-of-sprite y after this
// frame's gravity is applied (i.e. state.player.y + state.vy).
export function findStandableBranch(nextY) {
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
export function findHangableBranch() {
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

export function playerGrabRect() {
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
export function findClimbableTrunk() {
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
export function horizontalTravelDirection() {
  if (state.keys['arrowleft'] || state.keys['a']) return -1;
  if (state.keys['arrowright'] || state.keys['d']) return 1;
  if (Math.abs(state.vx) > 0.1) return state.vx > 0 ? 1 : -1;
  return 0;
}

// A trunk only counts as "ahead" if its center sits on the travel-direction
// side of the player's center (or is straight overlapping it) — a trunk
// whose center is fully behind the player relative to dirX is excluded.
export function trunkInTravelDirection(trunkRect, playerRect, dirX) {
  const playerCenterX = (playerRect.left + playerRect.right) / 2;
  const trunkCenterX = (trunkRect.left + trunkRect.right) / 2;
  return dirX > 0 ? trunkCenterX >= playerCenterX : trunkCenterX <= playerCenterX;
}
