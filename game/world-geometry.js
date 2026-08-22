// Sprite resolvers, world-space geometry for placed props (trunks, branches,
// decorative plants), and the "is the player near X" proximity checks that
// both movement and interactions rely on. Kept together because rendering,
// movement, and interactions all need the *same* geometry to stay in sync —
// splitting it further risks the physics and the drawing silently drifting
// apart.

import { SCALE, GROUND_TOP, PLAYER_H, PLAYER_W, TREE_BRANCH_TRUNK_OVERLAP, TREE_PLANT_TRUNK_OVERLAP, TREE_PLANT_2B_TRUNK_OVERLAP, TREE_PLANT_4_TRUNK_OVERLAP, SLIME_TRUNK_OVERLAP, SWITCH_TRUNK_OVERLAP, GATE_INTERACT_RANGE, LIGHT_SWITCH_INTERACT_RANGE, BUG_INTERACT_MARGIN } from './constants.js';
import { state } from './state.js';

// "ground-plant-3" -> TERRARIUM_SPRITES.groundPlant[2]
export function resolveGroundPlantSprite(id) {
  if (TERRARIUM_SPRITES.groundPlantVariants[id]) return TERRARIUM_SPRITES.groundPlantVariants[id];
  const index = Number(id.slice('ground-plant-'.length)) - 1;
  return TERRARIUM_SPRITES.groundPlant[index];
}

export function resolveHangingSprite(id) {
  if (id === 'lightbulb' && state.lightOn) return TERRARIUM_SPRITES.lightbulb2;
  return TERRARIUM_SPRITES[id];
}

// "trunk-bg-4b" -> TERRARIUM_SPRITES.treeTrunk.bg[3].b
// "trunk-interact-1" -> TERRARIUM_SPRITES.treeTrunk.interact[0]
export function resolveTreeTrunkSprite(id) {
  const bgMatch = id.match(/^trunk-bg-(\d+)([ab])$/);
  if (bgMatch) {
    const [, number, variant] = bgMatch;
    return TERRARIUM_SPRITES.treeTrunk.bg[Number(number) - 1][variant];
  }
  const [, number] = id.match(/^trunk-interact-(\d+)$/);
  return TERRARIUM_SPRITES.treeTrunk.interact[Number(number) - 1];
}

export function resolveTreeBranchSprite(id) {
  const index = Number(id.slice('tree-branch-'.length)) - 1;
  return TERRARIUM_SPRITES.treeBranch[index];
}

export function resolveTreePlantSprite(id) {
  if (TERRARIUM_SPRITES.treePlantVariants[id]) return TERRARIUM_SPRITES.treePlantVariants[id];
  const index = Number(id.slice('tree-plant-'.length)) - 1;
  return TERRARIUM_SPRITES.treePlant[index];
}

// "bug-1" -> TERRARIUM_SPRITES.bug[0]
export function resolveBugSprite(id) {
  const index = Number(id.slice('bug-'.length)) - 1;
  return TERRARIUM_SPRITES.bug[index];
}

// Placements within a layer paint in ascending z order, so a higher z sits
// on top wherever two instances' footprints overlap (see world-props.js).
export function byAscendingZ(a, b) {
  return (a.z || 0) - (b.z || 0);
}

// World-space bounding box for a TREE_PLACEMENTS entry, used for climb-attach checks.
export function treeTrunkRect(placement) {
  const sprite = resolveTreeTrunkSprite(placement.sprite);
  const left = placement.x;
  const width = sprite.width * SCALE;
  const top = GROUND_TOP - sprite.height * SCALE;
  return { left, right: left + width, top, bottom: GROUND_TOP };
}

export function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

// World-space geometry for a BRANCH_PLACEMENTS entry (world-props.js),
// shared by both rendering (drawTreeBranches) and branch physics
// (findStandableBranch/findHangableBranch/updateBranch in game/movement.js)
// so the two never drift apart. `originX`/`originY` is the sprite's top-left
// draw origin (before any horizontal flip). `baseX`/`baseY` is the thick end
// where the branch meets the trunk bark (sprite-local bottom-left corner,
// col 0 / row height-1); `tipX`/`tipY` is the thin tapered end (sprite-local
// top-right corner, col width-1 / row 0) — both resolved through the same
// left/right flip drawSprite applies when rendering, so the physics line
// always matches what's on screen.
export function branchGeometry(bp) {
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
    // Host trunk's sprite id, so drawTreeBranches (game/render.js) can merge
    // this branch's own palette entry (just its 'k' outline) with the
    // trunk's resolved bark palette, so the branch always matches whichever
    // trunk it's mounted on (see sprites/palette/terrarium-palette.js).
    trunkSpriteId: trunkPlacement.sprite,
  };
}

// All branches, resolved once at load time (BRANCH_PLACEMENTS is static).
export const BRANCH_GEOMETRIES = BRANCH_PLACEMENTS.map(branchGeometry).filter(Boolean);

// World-space sprite origin for a TREE_PLANT_PLACEMENTS entry (world-props.js)
// — purely decorative, so unlike branchGeometry above this has no physics
// (base/tip/thickness) to resolve, just where drawTreePlants should paint
// the sprite. Same trunk-lookup and side/attachRow convention as branches.
export function treePlantGeometry(pp) {
  const trunkPlacement = TREE_PLACEMENTS.find((p) => p.layer === pp.layer && p.x === pp.trunkX);
  if (!trunkPlacement) return null;
  const trunkSprite = resolveTreeTrunkSprite(trunkPlacement.sprite);
  const plantSprite = resolveTreePlantSprite(pp.sprite);
  const trunkTopY = GROUND_TOP - trunkSprite.height * SCALE;
  const overlap = pp.sprite === 'tree-plant-2b'
    ? TREE_PLANT_2B_TRUNK_OVERLAP
    : pp.sprite === 'tree-plant-slime'
      ? SLIME_TRUNK_OVERLAP
      : pp.sprite === 'tree-plant-4'
        ? TREE_PLANT_4_TRUNK_OVERLAP
        : TREE_PLANT_TRUNK_OVERLAP;
  const originX = pp.side === 'right'
    ? trunkPlacement.x + trunkSprite.width * SCALE - overlap * SCALE
    : trunkPlacement.x - (plantSprite.width - overlap) * SCALE;
  const originY = trunkTopY + pp.attachRow * SCALE - (plantSprite.height - 1) * SCALE;
  // Host trunk's sprite id, so drawTreePlants (game/render.js) can merge
  // this plant's own palette entry with the trunk's resolved bark palette —
  // tree-plant-3/4/5's small bark-stub accent (k/R/r) matches whichever
  // trunk they're mounted on, the same way branches do (see branchGeometry
  // above and sprites/palette/terrarium-palette.js).
  return { placement: pp, originX, originY, trunkSpriteId: trunkPlacement.sprite };
}

// All decorative trunk plants, resolved once at load time (TREE_PLANT_PLACEMENTS is static).
export const TREE_PLANT_GEOMETRIES = TREE_PLANT_PLACEMENTS.map(treePlantGeometry).filter(Boolean);

// World-space geometry for a BUG_PLACEMENTS entry (world-props.js) — three
// modes: `ground` bugs snap to the floor at `x` like PLANT_PLACEMENTS;
// `trunk` bugs mount onto a trunk's side at `attachRow` the same way
// treePlantGeometry() does, reusing TREE_PLANT_TRUNK_OVERLAP so a bug tucked
// onto a trunk's face reads as perched on the bark rather than floating off
// it; `air` bugs hang at a fixed `x`/`heightAboveFloor` in open space between
// trees, with no prop underneath — reachable by a plain jump (max jump apex
// is JUMP_VELOCITY^2 / (2*GRAVITY), see game/constants.js) rather than by
// climbing.
export function bugGeometry(bp) {
  const sprite = resolveBugSprite(bp.sprite);
  if (bp.mode === 'trunk') {
    const trunkPlacement = TREE_PLACEMENTS.find((p) => p.layer === bp.layer && p.x === bp.trunkX);
    if (!trunkPlacement) return null;
    const trunkSprite = resolveTreeTrunkSprite(trunkPlacement.sprite);
    const trunkTopY = GROUND_TOP - trunkSprite.height * SCALE;
    const originX = bp.side === 'right'
      ? trunkPlacement.x + trunkSprite.width * SCALE - TREE_PLANT_TRUNK_OVERLAP * SCALE
      : trunkPlacement.x - (sprite.width - TREE_PLANT_TRUNK_OVERLAP) * SCALE;
    const originY = trunkTopY + bp.attachRow * SCALE - (sprite.height - 1) * SCALE;
    return { placement: bp, trunkPlacement, originX, originY, width: sprite.width * SCALE, height: sprite.height * SCALE };
  }
  if (bp.mode === 'air') {
    const originX = bp.x;
    const originY = GROUND_TOP - bp.heightAboveFloor - sprite.height * SCALE;
    return { placement: bp, originX, originY, width: sprite.width * SCALE, height: sprite.height * SCALE };
  }
  const originX = bp.x;
  const originY = GROUND_TOP - sprite.height * SCALE;
  return { placement: bp, originX, originY, width: sprite.width * SCALE, height: sprite.height * SCALE };
}

// All bugs, resolved once at load time (BUG_PLACEMENTS is static). Both
// game/render.js (drawBugs) and game/interactions.js (collectNearbyBug)
// iterate this same array in the same order, using the array index as the id
// for state.bugsFound — so this is the single source of truth for "which bug
// is which".
export const BUG_GEOMETRIES = BUG_PLACEMENTS.map(bugGeometry).filter(Boolean);

export function bugRect(geo) {
  return { left: geo.originX, right: geo.originX + geo.width, top: geo.originY, bottom: geo.originY + geo.height };
}

// A trunk-mounted bug can only be caught while actually side-climbing the
// exact trunk face it's mounted on — not just standing/falling somewhere
// that happens to overlap its (small) hitbox. Without this, a jump that
// arcs past the trunk's far face — e.g. hopping the gap behind a tree from
// its left side to its right side and dropping down the other side — could
// scoop up a right-side bug without ever needing the side-climb skill
// that's supposed to gate that face (see attachToTrunk() in
// game/movement.js). Ground/air bugs have no trunk to grip, so they're
// always reachable by position alone.
export function canReachBug(geo) {
  if (geo.placement.mode !== 'trunk') return true;
  return !!(state.climb && state.climb.trunk === geo.trunkPlacement && state.climb.side === geo.placement.side);
}

// Tight bounding box (barely larger than the player's actual sprite) used to
// check whether an E press catches a nearby bug — see BUG_INTERACT_MARGIN in
// game/constants.js for why this is deliberately narrower than
// playerGrabRect() (game/movement.js), which is forgiving on purpose for
// trunk/branch grabs.
export function bugInteractRect() {
  return {
    left: state.player.x - BUG_INTERACT_MARGIN,
    right: state.player.x + PLAYER_W + BUG_INTERACT_MARGIN,
    top: state.player.y - BUG_INTERACT_MARGIN,
    bottom: state.player.y + PLAYER_H + BUG_INTERACT_MARGIN,
  };
}

// The branch's top-surface world y at a given world x — flat for the first
// geo.tBend fraction of the base-to-tip line (the right-angle launch out of
// the trunk), then linearly interpolated the rest of the way to the tip, so
// this matches the branch's actual flat-then-rising silhouette instead of
// cutting a single straight line across it. Clamped to the branch's actual
// span so a query slightly past either end still returns that end's height
// rather than extrapolating off the branch.
export function branchSurfaceYAt(geo, worldX) {
  const span = geo.tipX - geo.baseX;
  const t = span === 0 ? 0 : Math.max(0, Math.min(1, (worldX - geo.baseX) / span));
  if (t <= geo.tBend) return geo.baseY;
  const riseT = geo.tBend >= 1 ? 0 : (t - geo.tBend) / (1 - geo.tBend);
  return geo.baseY + riseT * (geo.tipY - geo.baseY);
}

// The "Moss Tree" — the second tree the player reaches overall (after the
// x300 layer-5 trunk), and the first reachable layer-7 trunk (see
// TREE_PLACEMENTS in world-props.js, x720 — note WORLD_WIDTH is currently
// shortened to 2650, so x2350 is the last reachable layer-7 trunk, not the
// second) — walled off by red gate moss (TREE_PLANT_1) until room 1's puzzle
// is solved.
export const GATE_TRUNK = TREE_PLACEMENTS.find((p) => p.x === 720 && p.layer === 7);

// The light switch — mounted on the left face of the second tree from the
// far right (see LIGHT_SWITCH_PLACEMENT, world-props.js).
export const LIGHT_SWITCH_TRUNK = TREE_PLACEMENTS.find((p) => p.x === LIGHT_SWITCH_PLACEMENT.trunkX && p.layer === LIGHT_SWITCH_PLACEMENT.layer);

// The branch mounted on the same face LIGHT_SWITCH_PLACEMENT.side names, on
// LIGHT_SWITCH_TRUNK — reachable "for free" once the player has climbed up
// to it, and used by nearLightSwitch() below as the lower end of the
// reachable band (and as its own perch — see onSwitchBranch there).
export const LIGHT_SWITCH_BRANCH = BRANCH_GEOMETRIES.find((g) =>
  g.placement.trunkX === LIGHT_SWITCH_PLACEMENT.trunkX &&
  g.placement.layer === LIGHT_SWITCH_PLACEMENT.layer &&
  g.placement.side === LIGHT_SWITCH_PLACEMENT.side
);

// The background-texture binary puzzle — no physical prop, just the lit
// pixel-digit grid (sprites/background-texture.js) hanging under the
// lightbulb at x150. Read from the closest climbable tree (Tree Trunk Fore 3
// at x320, layer 7 — see TREE_PLACEMENTS in world-props.js), side-climbed on
// its left face so the player is looking back toward the bulb/texture
// cluster. Same interaction convention as LIGHT_SWITCH_TRUNK above.
export const CODE_TRUNK = TREE_PLACEMENTS.find((p) => p.x === 320 && p.layer === 7);

// True while the player is close enough to the gatekeeper tree — standing on
// the ground within reach, or gripping that exact trunk — to press E and
// open its keypad popup.
export function nearGate() {
  if (!GATE_TRUNK) return false;
  const rect = treeTrunkRect(GATE_TRUNK);
  const centerX = state.player.x + PLAYER_W / 2;
  const inRange = centerX >= rect.left - GATE_INTERACT_RANGE && centerX <= rect.right + GATE_INTERACT_RANGE;
  const stationary = state.onGround || (state.climb && state.climb.trunk === GATE_TRUNK);
  return inRange && stationary;
}

// World-space top-left origin for the light switch, mounted into whichever
// face of LIGHT_SWITCH_TRUNK LIGHT_SWITCH_PLACEMENT.side names, at
// LIGHT_SWITCH_PLACEMENT.attachRow — same row/overlap approach
// branchGeometry() uses for a branch's base (see its side==='right' vs
// default split above).
export function lightSwitchOrigin() {
  const rect = treeTrunkRect(LIGHT_SWITCH_TRUNK);
  const sprite = TERRARIUM_SPRITES.lightSwitch;
  const x = LIGHT_SWITCH_PLACEMENT.side === 'right'
    ? rect.right - SWITCH_TRUNK_OVERLAP * SCALE
    : rect.left - (sprite.width - SWITCH_TRUNK_OVERLAP) * SCALE;
  const y = rect.top + LIGHT_SWITCH_PLACEMENT.attachRow * SCALE;
  return { x, y, width: sprite.width * SCALE, height: sprite.height * SCALE };
}

// True while the player can reach the light switch: either side-climbing
// LIGHT_SWITCH_TRUNK on the switch's face, anywhere from just above the
// switch down to LIGHT_SWITCH_BRANCH's height (so the whole stretch of trunk
// between the branch and the switch works, not just a narrow band centered
// on the switch), or standing/hanging on LIGHT_SWITCH_BRANCH itself near its
// trunk end. Both are the same side of the tree as the switch by
// construction — LIGHT_SWITCH_BRANCH is looked up with that same side.
export function nearLightSwitch() {
  const origin = lightSwitchOrigin();
  const switchCenterY = origin.y + origin.height / 2;
  const playerCenterY = state.player.y + PLAYER_H / 2;

  const onTrunkSide = state.climb && state.climb.trunk === LIGHT_SWITCH_TRUNK && state.climb.side === LIGHT_SWITCH_PLACEMENT.side;
  if (onTrunkSide) {
    const topBound = switchCenterY - LIGHT_SWITCH_INTERACT_RANGE;
    const bottomBound = (LIGHT_SWITCH_BRANCH ? LIGHT_SWITCH_BRANCH.baseY : switchCenterY) + LIGHT_SWITCH_INTERACT_RANGE;
    return playerCenterY >= topBound && playerCenterY <= bottomBound;
  }

  const onSwitchBranch = LIGHT_SWITCH_BRANCH && state.branch && state.branch.geo === LIGHT_SWITCH_BRANCH;
  if (onSwitchBranch) {
    const playerCenterX = state.player.x + PLAYER_W / 2;
    return Math.abs(playerCenterX - LIGHT_SWITCH_BRANCH.baseX) <= LIGHT_SWITCH_INTERACT_RANGE;
  }

  return false;
}

// True while the player is side-climbing CODE_TRUNK on its left face — the
// face looking back toward the bulb/background-texture cluster — regardless
// of height on the trunk, since there's no mounted prop/row to be "at". Only
// the light being on actually makes the grid legible; that's enforced in
// handleInteractPress() rather than here so this stays a pure position check.
export function nearBackgroundTexture() {
  return !!(state.climb && state.climb.trunk === CODE_TRUNK && state.climb.side === 'left');
}
