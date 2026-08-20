// Interact/jump input handling, the skill/puzzle status displays, and the
// three popups (gatekeeper keypad, light-switch warning, background-texture
// code) they can open.

import { JUMP_VELOCITY, LIGHT_WARNING_FLICKS, LIGHT_BREAK_FLICKS, TOTAL_PUZZLES } from './constants.js';
import { state } from './state.js';
import { nearGate, nearLightSwitch, nearBackgroundTexture } from './world-geometry.js';
import { jumpOffTrunk, jumpOffBranch, passBranchAlongTrunk } from './movement.js';

// Edge-triggered (fire once per press, not per repeat/hold) so keyboard
// and touch buttons can share the same logic.
export function handleInteractPress() {
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
// Reflects state.skillUnlocked; flipped by the real unlock mechanism (TODO)
// once it exists, not by direct user input.
const skillStatusEl = document.getElementById('skill-status');

// Module-scoped, unlike CHAMELEON_VISIBLE/resetLightbulb (see game/state.js)
// — this one gates real puzzle progress, so it deliberately isn't exposed on
// `window` for the console to call.
export function setSkillUnlocked(unlocked) {
  state.skillUnlocked = unlocked;
  skillStatusEl.textContent = `Skill unlocked: ${unlocked ? 'YES' : 'NO'}`;
}

// --- Level counter display ---
const puzzleStatusEl = document.getElementById('puzzle-status');

export function setPuzzlesComplete(n) {
  state.puzzlesComplete = n;
  puzzleStatusEl.textContent = `Puzzles complete: ${n} / ${TOTAL_PUZZLES}`;
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
