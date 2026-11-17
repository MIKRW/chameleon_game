// Interactive trees: trunks, branches, and the moss/slime coatings on them.

import {
  SCALE, GROUND_TOP, GATE_MOSS_FINGER_MARGIN, GATE_MOSS_BOTTOM_GAP, SLIME_TRUNK_OVERLAP,
} from '../constants.js';
import { state, ctx } from '../state.js';
import {
  resolveTreeTrunkSprite, resolveTreeBranchSprite, byAscendingZ, BRANCH_GEOMETRIES,
  GATE_TRUNK, treeTrunkRect,
} from '../world-geometry.js';
import { drawSprite, resolveSpritePalette, resolveBarkPalette } from './sprite.js';

// Tree trunks placed from TREE_PLACEMENTS (world-props.js), keyed by layer
// and z-ordered the same way ground plants are. A trunk's fore/back name is
// purely a bark-color choice (see sprites/README.md) and doesn't dictate
// which layer/z it's placed on.
export function drawTreeTrunks(camera, layer) {
  const placements = TREE_PLACEMENTS.filter((p) => p.layer === layer).sort(byAscendingZ);
  // Interactive trunks (layers 5/8) are never alpha-faded — see
  // DEPTH-LAYERS.md: they need to read as clean and climbable at any camera
  // position, so depth between them comes entirely from the saturation
  // ladder, not opacity.
  for (const placement of placements) {
    const sprite = resolveTreeTrunkSprite(placement.sprite);
    const palette = resolveBarkPalette(placement.sprite, placement.layer);
    const screenX = placement.x - camera.x;
    const screenY = GROUND_TOP - sprite.height * SCALE - camera.y;
    drawSprite(ctx, sprite.rows, screenX, screenY, SCALE, palette);
  }
}

// Branches from BRANCH_PLACEMENTS (world-props.js), mounted onto a sparse
// subset of the trees drawn by drawTreeTrunks above. Drawn right after the
// trunks on the same layer so they pick up the same depth treatment (the
// layer-5 fade + darkened bark palette, or full-strength layer-8 bark) and
// paint on top of the trunk they're attached to. Reuses branchGeometry's
// world-space sprite origin (see game/world-geometry.js) so the rendered
// sprite and the standable/hangable physics region it's derived from always
// agree.
export function drawTreeBranches(camera, layer) {
  for (const geo of BRANCH_GEOMETRIES) {
    if (geo.placement.layer !== layer) continue;
    const branchSprite = resolveTreeBranchSprite(geo.placement.sprite);
    // A branch owns no bark color of its own (just its 'k' outline, see
    // sprites/palette/terrarium-palette.js) — its r/R/h or 1/2/3 bark keys
    // come from whichever trunk it's mounted to, so it always matches that
    // trunk's resolved depth-layer tone. Key namespaces never collide: bark
    // keys only ever come from the trunk, everything else only from the
    // branch's own entry.
    const ownPalette = resolveSpritePalette(geo.placement.sprite);
    const barkPalette = resolveBarkPalette(geo.trunkSpriteId, layer);
    // Own entry spread last so its 'k' outline (and any other non-bark key)
    // always wins over the host trunk's own 'k' — bark keys (r/R/h/1/2/3)
    // never collide since the branch's own entry never defines them.
    const palette = { ...barkPalette, ...ownPalette };
    const flipX = geo.placement.side === 'left';
    const screenX = geo.originX - camera.x;
    const screenY = geo.originY - camera.y;
    drawSprite(ctx, branchSprite.rows, screenX, screenY, SCALE, palette, undefined, flipX);
  }
}

// Yellow slime (tree-plant-slime.js) tiled down both edges of every
// layer-8 trunk (layer-5 trunks are front-climb only, no side to coat) —
// purely decorative, unrelated to Cling to Sides or any puzzle state. Stays
// on the trees regardless of whether Cling to Sides is unlocked.
export function drawTrunkSlime(camera) {
  const tileH = TREE_PLANT_SLIME.height * SCALE;
  const tileW = TREE_PLANT_SLIME.width * SCALE;
  for (const placement of TREE_PLACEMENTS) {
    if (placement.layer !== 8) continue;
    const rect = treeTrunkRect(placement);
    const leftX = rect.left - (tileW - SLIME_TRUNK_OVERLAP * SCALE) - camera.x;
    const rightX = rect.right - SLIME_TRUNK_OVERLAP * SCALE - camera.x;
    for (let y = rect.top; y < rect.bottom; y += tileH) {
      const screenY = y - camera.y;
      drawSprite(ctx, TREE_PLANT_SLIME.rows, leftX, screenY, SCALE, TERRARIUM_PALETTE['tree-plant-slime'], undefined, true);
      drawSprite(ctx, TREE_PLANT_SLIME.rows, rightX, screenY, SCALE, TERRARIUM_PALETTE['tree-plant-slime']);
    }
  }
}

// Tiles the gate moss sprite (TREE_PLANT_1, now an edge strip rather than a
// full-width span — see that file) down both edges of the Moss Tree's
// (GATE_TRUNK) full height, the same tiling approach drawGlassEdgeSide uses
// for the tank walls. Drawn twice per row: once flush against the trunk's
// left edge as-is, once flush against the right edge mirrored (flipX), so
// moss overlaps the bark from both sides and wide trunks show bare bark
// down the middle instead of the moss stretching to cover it. Stops
// GATE_MOSS_BOTTOM_GAP short of the trunk's base so the lowest tile doesn't
// touch the glass floor line. Skipped entirely once the tree's puzzle is
// solved.
export function drawGateMoss(camera) {
  if (state.gateSolved) return;
  const rect = treeTrunkRect(GATE_TRUNK);
  const tileH = TREE_PLANT_1.height * SCALE;
  const stripW = TREE_PLANT_1.width * SCALE;
  const barkSpan = stripW - GATE_MOSS_FINGER_MARGIN;
  const leftX = rect.left - GATE_MOSS_FINGER_MARGIN - camera.x;
  const rightX = rect.right - barkSpan - camera.x;
  const bottom = rect.bottom - GATE_MOSS_BOTTOM_GAP;
  for (let y = rect.top; y < bottom; y += tileH) {
    const screenY = y - camera.y;
    drawSprite(ctx, TREE_PLANT_1.rows, leftX, screenY, SCALE, TERRARIUM_PALETTE['tree-plant-1']);
    drawSprite(ctx, TREE_PLANT_1.rows, rightX, screenY, SCALE, TERRARIUM_PALETTE['tree-plant-1'], undefined, true);
  }
}

// Scatter layout for drawGateMossRemnant, computed once (not per-frame) so
// the scraps don't jitter — a handful of clusters of 2-3 remnants each,
// placed via a fixed-seed PRNG so the layout is random-looking but stable
// across reloads. Each entry is a fraction of the trunk's height plus which
// edge (mirrored = right edge, flipped) it clings to.
const GATE_MOSS_REMNANT_LAYOUT = (() => {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };
  const placements = [];
  const clusterCount = 6;
  for (let c = 0; c < clusterCount; c++) {
    const centerFrac = (c + 0.5) / clusterCount + (rand() - 0.5) * 0.15;
    const clusterSize = 2 + Math.floor(rand() * 2); // 2-3 per cluster
    for (let i = 0; i < clusterSize; i++) {
      placements.push({
        frac: Math.min(0.95, Math.max(0.05, centerFrac + (rand() - 0.5) * 0.14)),
        mirrored: rand() > 0.5,
      });
    }
  }
  return placements;
})();

// Once state.gateSolved flips, drawGateMoss above stops drawing the full
// climbing moss — this leaves scattered scraps (TREE_PLANT_1B) clinging to
// the trunk in a few loose clusters (GATE_MOSS_REMNANT_LAYOUT) as
// decoration, so the solved puzzle doesn't read as if the moss vanished
// without a trace.
export function drawGateMossRemnant(camera) {
  if (!state.gateSolved) return;
  const rect = treeTrunkRect(GATE_TRUNK);
  const remnantH = TREE_PLANT_1B.height * SCALE;
  const stripW = TREE_PLANT_1B.width * SCALE;
  const barkSpan = stripW - GATE_MOSS_FINGER_MARGIN;
  const leftX = rect.left - GATE_MOSS_FINGER_MARGIN - camera.x;
  const rightX = rect.right - barkSpan - camera.x;
  const trunkSpan = rect.bottom - rect.top - remnantH;
  for (const { frac, mirrored } of GATE_MOSS_REMNANT_LAYOUT) {
    const screenY = rect.top + frac * trunkSpan - camera.y;
    const screenX = mirrored ? rightX : leftX;
    drawSprite(ctx, TREE_PLANT_1B.rows, screenX, screenY, SCALE, TERRARIUM_PALETTE['tree-plant-1b'], undefined, mirrored);
  }
}
