// Interact/jump input handling, the skill/puzzle status displays, and the
// three popups (gatekeeper keypad, light-switch warning, background-texture
// code) they can open.

import { JUMP_VELOCITY, LIGHT_WARNING_FLICKS, LIGHT_BREAK_FLICKS, TOTAL_PUZZLES, BUGS_REQUIRED } from './constants.js';
import { state, resetGame } from './state.js';
import { nearGate, nearLightSwitch, nearBackgroundTexture, BUG_GEOMETRIES, bugRect, canReachBug, bugInteractRect, rectsOverlap } from './world-geometry.js';
import { jumpOffTrunk, jumpOffBranch, passBranchAlongTrunk } from './movement.js';

// Edge-triggered (fire once per press, not per repeat/hold) so keyboard
// and touch buttons can share the same logic.
export function handleInteractPress() {
  if (collectNearbyBug()) return;
  if (!state.gateSolved && nearGate()) {
    openGatePopup();
    return;
  }
  if (nearLightSwitch()) {
    if (state.bulbBroken) return;
    state.lightOn = !state.lightOn;
    state.lightFlickCount++;
    if (state.lightFlickCount === LIGHT_BREAK_FLICKS) {
      state.bulbBroken = true;
      state.lightOn = false;
      openLightPopup('Fizzzzz... kcckk... there goes the bulb.');
    } else if (state.lightFlickCount === LIGHT_WARNING_FLICKS) {
      openLightPopup('Careful! The lightbulbs are delicate.');
    }
    return;
  }
  if (!state.codeSolved && state.lightOn && nearBackgroundTexture()) {
    openCodePopup();
  }
}

export function handleJumpPress() {
  if (state.climb) {
    jumpOffTrunk();
  } else if (state.branch) {
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
  } else if (state.onGround) {
    state.vy = JUMP_VELOCITY;
    state.onGround = false;
  }
}

// --- Skill status display ---
// Reflects state.skillUnlocked; flipped by skillUnlockPasscode() below, not
// by direct user input.
const skillStatusEl = document.getElementById('skill-status');

// Module-scoped, unlike CHAMELEON_VISIBLE/resetLightbulb (see game/state.js)
// — this one gates real puzzle progress, so it deliberately isn't exposed on
// `window` for the console to call.
export function setSkillUnlocked(unlocked) {
  state.skillUnlocked = unlocked;
  skillStatusEl.textContent = `Side climb: ${unlocked ? 'Yes' : 'No'}`;
  if (unlocked) {
    // The right-hand side of every side-climbable (layer-7) trunk was locked
    // until now — see attachToTrunk() in game/movement.js.
    openSkillPopup('Wow, this new skill will make it easier to find bugs!');
  }
}

// --- Side-climb skill unlock (puzzle 3) ---
// No popup — the passcode lives in localStorage (see game/state.js) rather
// than anywhere on screen, so it's submitted straight from the console.
window.skillUnlockPasscode = async function (guess) {
  if (state.skillUnlocked) {
    console.log('Skill already unlocked.');
    return;
  }
  const correct = await checkAnswer(3, guess);
  if (correct) {
    setSkillUnlocked(true);
    setPuzzlesComplete(state.puzzlesComplete + 1);
    console.log('Skill unlocked: both-sides tree climbing.');
  } else {
    console.log('Incorrect passcode.');
  }
};

// --- Level counter display ---
const puzzleStatusEl = document.getElementById('puzzle-status');

export function setPuzzlesComplete(n) {
  state.puzzlesComplete = n;
  puzzleStatusEl.textContent = `Puzzles complete: ${n} / ${TOTAL_PUZZLES}`;
  maybeShowCompletion();
}

// --- Bug collection (a fourth, non-devtools puzzle) ---
// Currently empty (see BUG_PLACEMENTS in world-props.js — the bug/fly sprite
// has been pulled for now), so BUGS_REQUIRED is 0 and this is trivially
// satisfied without affecting maybeShowCompletion() below. Left in place so
// bug placements can be reintroduced later. Unlike most props, a bug isn't
// caught just by touching it — it takes an E press while lined up (see
// bugInteractRect() in game/world-geometry.js), so catching one is a
// deliberately timed action rather than an automatic walk/jump-through.
// Called from handleInteractPress() above, not polled every frame.
const bugStatusEl = document.getElementById('bug-status');
bugStatusEl.textContent = `Bugs found: 0 / ${BUGS_REQUIRED}`;

function collectNearbyBug() {
  const interactRect = bugInteractRect();
  for (let i = 0; i < BUG_GEOMETRIES.length; i++) {
    if (state.bugsFound[i]) continue;
    const geo = BUG_GEOMETRIES[i];
    if (!canReachBug(geo)) continue;
    if (!rectsOverlap(interactRect, bugRect(geo))) continue;
    state.bugsFound[i] = true;
    state.bugsCollectedCount++;
    bugStatusEl.textContent = `Bugs found: ${state.bugsCollectedCount} / ${BUGS_REQUIRED}`;
    maybeShowCompletion();
    return true;
  }
  return false;
}

// --- Skill-unlock toast ---
// Styled the same as #light-popup — just a message and a close button.
const skillPopupEl = document.getElementById('skill-popup');
const skillPopupTextEl = document.getElementById('skill-popup-text');
const skillCloseBtn = document.getElementById('skill-close-btn');

export let skillPopupOpen = false;

export function openSkillPopup(message) {
  skillPopupOpen = true;
  skillPopupTextEl.textContent = message;
  skillPopupEl.classList.remove('hidden');
}

export function closeSkillPopup() {
  skillPopupOpen = false;
  skillPopupEl.classList.add('hidden');
}

skillCloseBtn.addEventListener('click', closeSkillPopup);

// The final flag is only revealed once every dev-tool puzzle is solved AND
// every bug is found — called from both setPuzzlesComplete() and
// collectNearbyBug() above, since either can be the one that finishes last.
function maybeShowCompletion() {
  if (state.puzzlesComplete !== TOTAL_PUZZLES || state.bugsCollectedCount !== BUGS_REQUIRED) return;
  // getFinalFlag() is a global from puzzles/engine.js (classic script, same
  // convention as checkAnswer() above) — every checkAnswer() call that got
  // puzzlesComplete here has already awaited and recorded its solvedAnswers
  // entry, so this is guaranteed non-null.
  const flag = getFinalFlag();
  if (flag) openCompletionPopup(flag);
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

export let gatePopupOpen = false;

export function openGatePopup() {
  gatePopupOpen = true;
  gateFeedbackEl.textContent = '';
  gateInputEl.value = '';
  gatePopupEl.classList.remove('hidden');
  gateInputEl.focus();
}

export function closeGatePopup() {
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
    setPuzzlesComplete(state.puzzlesComplete + 1);
  } else {
    gateFeedbackEl.textContent = 'Incorrect code. Try again.';
    gateInputEl.value = '';
    gateInputEl.focus();
  }
});

// --- Light switch warning popup ---
// Styled the same as #gate-popup, minus the form — just a message and a
// close button. See LIGHT_WARNING_FLICKS/LIGHT_BREAK_FLICKS in game/constants.js.
const lightPopupEl = document.getElementById('light-popup');
const lightPopupTextEl = document.getElementById('light-popup-text');
const lightCloseBtn = document.getElementById('light-close-btn');

export let lightPopupOpen = false;

export function openLightPopup(message) {
  lightPopupOpen = true;
  lightPopupTextEl.textContent = message;
  lightPopupEl.classList.remove('hidden');
}

export function closeLightPopup() {
  lightPopupOpen = false;
  lightPopupEl.classList.add('hidden');
}

lightCloseBtn.addEventListener('click', closeLightPopup);

// --- Background-texture binary puzzle (room 2) ---
// Styled the same as #gate-popup, but a wrong guess doesn't just show
// feedback and let the player retry inline — it closes the popup outright
// and kills the light (see nearBackgroundTexture()/CODE_TRUNK in
// game/world-geometry.js), so brute-forcing the code means climbing back to
// the switch and cycling it off/on for every attempt.
const codePopupEl = document.getElementById('code-popup');
const codePopupTextEl = document.getElementById('code-popup-text');
const codeFormEl = document.getElementById('code-form');
const codeInputEl = document.getElementById('code-input');
const codeFeedbackEl = document.getElementById('code-feedback');
const codeCloseBtn = document.getElementById('code-close-btn');

export let codePopupOpen = false;

export function openCodePopup() {
  codePopupOpen = true;
  codePopupTextEl.textContent = 'Enter the code to keep the Lights on';
  codeFormEl.style.display = '';
  codeFeedbackEl.textContent = '';
  codeInputEl.value = '';
  codePopupEl.classList.remove('hidden');
  codeInputEl.focus();
}

export function closeCodePopup() {
  codePopupOpen = false;
  codePopupEl.classList.add('hidden');
}

codeCloseBtn.addEventListener('click', closeCodePopup);

codeFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const correct = await checkAnswer(2, codeInputEl.value);
  if (correct) {
    state.codeSolved = true;
    codePopupTextEl.textContent = 'You feel nice and cozy in the warm light';
    codeFormEl.style.display = 'none';
    codeFeedbackEl.textContent = '';
    setPuzzlesComplete(state.puzzlesComplete + 1);
  } else {
    state.lightOn = false;
    closeCodePopup();
  }
});

// --- Completion / flag-reveal popup (all TOTAL_PUZZLES solved) ---
// Styled the same as the other popups, using the .win-flag/.win-note classes
// already defined in style.css for this. Opened from setPuzzlesComplete()
// above, not from a specific room.
const completionPopupEl = document.getElementById('completion-popup');
const completionFlagEl = document.getElementById('completion-flag');
const completionCloseBtn = document.getElementById('completion-close-btn');

export let completionPopupOpen = false;

export function openCompletionPopup(flag) {
  completionPopupOpen = true;
  completionFlagEl.textContent = flag;
  completionPopupEl.classList.remove('hidden');
}

export function closeCompletionPopup() {
  completionPopupOpen = false;
  completionPopupEl.classList.add('hidden');
}

completionCloseBtn.addEventListener('click', closeCompletionPopup);

// --- Full restart (restart button) ---
// resetGame() (game/state.js) only resets movement/progress flags; this also
// closes any open popup and puts the status displays back to their initial
// text, since those aren't derived from state on every frame.
export function fullResetGame() {
  resetGame();
  closeGatePopup();
  closeLightPopup();
  closeCodePopup();
  closeCompletionPopup();
  closeSkillPopup();
  skillStatusEl.textContent = 'Side climb: No';
  puzzleStatusEl.textContent = `Puzzles complete: 0 / ${TOTAL_PUZZLES}`;
  bugStatusEl.textContent = `Bugs found: 0 / ${BUGS_REQUIRED}`;
}
