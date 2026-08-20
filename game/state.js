// Core mutable game state, the canvas/context, and the handful of dev-console
// escape hatches (CHAMELEON_VISIBLE, resetLightbulb).

import { START_POS } from './constants.js';

// The chameleon starts camouflaged — invisible until this is flipped to
// true. It's a plain `window` property (not `const`/`let`) specifically so
// it can be toggled live from the browser console: `CHAMELEON_VISIBLE = true`.
// No in-game hint points at this yet; that'll be added later.
window.CHAMELEON_VISIBLE = false;

export const state = {
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
  gateSolved: false, // the gatekeeper tree's moss puzzle (room 1) — see GATE_TRUNK in game/world-geometry.js
  puzzlesComplete: 0,
  lightOn: false, // flipped by the light switch (LIGHT_SWITCH_PLACEMENT) — see nearLightSwitch()/handleInteractPress()
  lightFlickCount: 0, // times the switch has been flicked since the last bulb reset — see handleInteractPress()
  bulbBroken: false, // true once lightFlickCount hits LIGHT_BREAK_FLICKS; blocks the switch until resetLightbulb() clears it
  codeSolved: false, // the background-texture binary puzzle (room 2) — see CODE_TRUNK in game/world-geometry.js
};

window.resetLightbulb = function () {
  state.lightFlickCount = 0;
  state.bulbBroken = false;
  console.log('Lightbulb reset. The switch works again.');
};

export const canvas = document.getElementById('game-canvas');
export const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

export function resetGame() {
  state.player = { ...START_POS };
  state.vy = 0;
  state.vx = 0;
  state.onGround = true;
  state.climb = null;
  state.branch = null;
  state.recentlyLeftTrunk = null;
  state.branchExitY = null;
}
