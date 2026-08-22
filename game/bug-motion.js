// Motion paths for `path`-mode bugs (BUG_PLACEMENTS in world-props.js,
// resolved by bugGeometry() in game/world-geometry.js) — bugs that aren't
// perched on the ground, a plant, or a tree trunk instead drift through open
// air along one of three closed, repeating shapes. Each path is evaluated in
// a local frame centered on the bug's `pathCenterX/pathCenterY`, so the
// shapes below are pure geometry with no knowledge of world coordinates.
//
// updateBugPaths() is called once per frame from game/main.js and mutates
// each path bug's originX/originY in place (the same fields ground/trunk
// bugs set once at load) so drawBugs() (game/render.js) and the reach checks
// (bugRect/bugInteractRect/canReachBug, game/world-geometry.js) don't need
// to know a bug is animated at all — they just read wherever it currently is.

const TWO_PI = Math.PI * 2;

// Walks the perimeter of a diamond (rotated square) with vertices at
// (0,-size), (size,0), (0,size), (-size,0), adding a sine wobble
// perpendicular to whichever edge is currently being walked so the diamond's
// straight edges read as squiggly rather than ruler-straight.
const DIAMOND_VERTS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
function squiggleDiamondPoint(t, size) {
  const edge = Math.floor(t * 4) % 4;
  const edgeT = (t * 4) % 1;
  const [x0, y0] = DIAMOND_VERTS[edge];
  const [x1, y1] = DIAMOND_VERTS[(edge + 1) % 4];
  const x = x0 + (x1 - x0) * edgeT;
  const y = y0 + (y1 - y0) * edgeT;
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const wobble = Math.sin(t * TWO_PI * 6) * 0.14;
  return { x: (x + nx * wobble) * size, y: (y + ny * wobble) * size };
}

// A circle with a gently breathing radius, so it reads as a lazy, squiggly
// loop rather than a perfectly rigid orbit.
function circlePoint(t, size) {
  const r = size * (1 + Math.sin(t * TWO_PI * 5) * 0.1);
  const angle = t * TWO_PI;
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.6 };
}

// Lemniscate of Gerono — a figure-eight that crosses itself once at the
// center, giving the "intersecting path" shape.
function figureEightPoint(t, size) {
  const angle = t * TWO_PI;
  return { x: Math.cos(angle) * size, y: Math.sin(angle) * Math.cos(angle) * size };
}

const PATH_SHAPES = {
  'squiggle-diamond': squiggleDiamondPoint,
  'circle': circlePoint,
  'figure-eight': figureEightPoint,
};

// `pathSpeed` is loops-per-second (e.g. 0.1 = one full loop every 10s).
// `pathPhase` (0-1) offsets bugs on the same shape so they don't move in
// lockstep.
export function bugPathOffset(pathType, elapsedSeconds, pathSpeed, pathSize, pathPhase) {
  const shape = PATH_SHAPES[pathType];
  if (!shape) return { x: 0, y: 0 };
  const t = (((elapsedSeconds * pathSpeed) + (pathPhase || 0)) % 1 + 1) % 1;
  return shape(t, pathSize);
}

// Advances every `path`-mode bug's live originX/originY. `nowMs` should be a
// timestamp that increases every frame (e.g. from requestAnimationFrame).
export function updateBugPaths(bugGeometries, nowMs) {
  const elapsedSeconds = nowMs / 1000;
  for (const geo of bugGeometries) {
    if (geo.placement.mode !== 'path') continue;
    const offset = bugPathOffset(geo.pathType, elapsedSeconds, geo.pathSpeed, geo.pathSize, geo.pathPhase);
    geo.originX = geo.centerX + offset.x;
    geo.originY = geo.centerY + offset.y;
  }
}
