// Escape the Terrarium — entry point. Wires up the update/draw loop and
// pulls in the input/interactions modules for their side-effecting event
// listeners.
//
// The world is a single capped rectangle — like looking at a real glass
// terrarium from outside: a fixed width and a fixed height, with glass walls
// at both ends, a lid up top, and a soil base at the bottom. The camera pans
// both horizontally (to follow the chameleon along the mossy floor) and
// vertically (when the chameleon jumps toward the canopy).

import { update } from './movement.js';
import { draw } from './render.js';
import { updateBugPaths } from './bug-motion.js';
import { BUG_GEOMETRIES } from './world-geometry.js';
import './input.js';

function loop(now) {
  update();
  updateBugPaths(BUG_GEOMETRIES, now);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
