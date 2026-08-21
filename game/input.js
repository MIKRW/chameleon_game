// Keyboard and touch input wiring — keydown/keyup, the on-screen D-pad/jump/
// interact buttons, and the restart button.

import { state } from './state.js';
import { handleInteractPress, handleJumpPress, handleSwapSidePress, gatePopupOpen, lightPopupOpen, codePopupOpen, completionPopupOpen, skillPopupOpen, closeGatePopup, closeLightPopup, closeCodePopup, closeCompletionPopup, closeSkillPopup, fullResetGame } from './interactions.js';

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

  // Left/right (arrows or A/D) double as the trunk-side-swap input while side-climbing —
  // see swapTrunkSide() in game/movement.js for why this is a no-op unless
  // it actually changes which face is gripped (so it never fights with
  // normal ground movement's use of the same keys).
  if ((key === 'arrowleft' || key === 'arrowright' || key === 'a' || key === 'd') && !e.repeat) {
    handleSwapSidePress(key === 'arrowleft' || key === 'a' ? -1 : 1);
  }

  if (key === ' ') {
    e.preventDefault(); // stop the page from scrolling
    if (!e.repeat) handleJumpPress();
  }
});

window.addEventListener('keyup', (e) => {
  state.keys[e.key.toLowerCase()] = false;
});

document.getElementById('restart-btn').addEventListener('click', fullResetGame);

// --- Touch controls ---
(function () {
  const dpadButtons = document.querySelectorAll('.dpad [data-key]');
  dpadButtons.forEach((btn) => {
    const key = btn.dataset.key;
    const press = (e) => {
      e.preventDefault();
      state.keys[key] = true;
      // Same left/right-doubles-as-swap behavior as the keyboard handler
      // above — a no-op unless it actually changes the gripped side.
      if (key === 'arrowleft' || key === 'arrowright') {
        handleSwapSidePress(key === 'arrowleft' ? -1 : 1);
      }
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
})();
