// Keyboard and touch input wiring — keydown/keyup, the on-screen D-pad/jump/
// interact buttons, and the restart button.

import { state, resetGame } from './state.js';
import { handleInteractPress, handleJumpPress, handleSwapSidePress, gatePopupOpen, lightPopupOpen, codePopupOpen, completionPopupOpen, skillPopupOpen, closeGatePopup, closeLightPopup, closeCodePopup, closeCompletionPopup, closeSkillPopup } from './interactions.js';

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (gatePopupOpen) {
    // Let the input field handle its own typing; only Escape reaches the
    // game while the popup is up, and nothing here should move the player.
    if (key === 'escape') closeGatePopup();
    return;
  }

  if (lightPopupOpen) {
    if (key === 'escape') closeLightPopup();
    return;
  }

  if (codePopupOpen) {
    if (key === 'escape') closeCodePopup();
    return;
  }

  if (completionPopupOpen) {
    if (key === 'escape') closeCompletionPopup();
    return;
  }

  if (skillPopupOpen) {
    if (key === 'escape') closeSkillPopup();
    return;
  }

  state.keys[key] = true;

  if (key === 'e' && !e.repeat) {
    e.preventDefault();
    handleInteractPress();
  }

  if (key === 'q' && !e.repeat) {
    e.preventDefault();
    handleSwapSidePress();
  }

  if (key === ' ') {
    e.preventDefault(); // stop the page from scrolling
    if (!e.repeat) handleJumpPress();
  }
});

window.addEventListener('keyup', (e) => {
  state.keys[e.key.toLowerCase()] = false;
});

document.getElementById('restart-btn').addEventListener('click', resetGame);

// --- Touch controls ---
(function () {
  const dpadButtons = document.querySelectorAll('.dpad [data-key]');
  dpadButtons.forEach((btn) => {
    const key = btn.dataset.key;
    const press = (e) => {
      e.preventDefault();
      state.keys[key] = true;
    };
    const release = (e) => {
      e.preventDefault();
      state.keys[key] = false;
    };
    btn.addEventListener('pointerdown', press);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('pointerleave', release);
  });

  const jumpBtn = document.getElementById('touch-jump-btn');
  jumpBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handleJumpPress();
  });

  const interactBtn = document.getElementById('touch-interact-btn');
  interactBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handleInteractPress();
  });

  const swapBtn = document.getElementById('touch-swap-btn');
  swapBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handleSwapSidePress();
  });
})();
