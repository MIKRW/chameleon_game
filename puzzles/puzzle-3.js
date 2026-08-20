// Puzzle 3: the trunk-side-swap skill unlock. See ../README.md.
// No in-world trigger — the passcode lives in localStorage (see
// game/state.js), findable via the Application/Storage devtools panel, and
// is submitted through the console via skillUnlockPasscode() (see
// game/interactions.js) rather than a popup.
PUZZLES[3] = {
  room: null,
  title: 'Trunk-Side Traversal',
  prompt: 'No gate, no switch — just a status line that says "NO". The passcode is sitting in storage, not on screen.',
  hint: 'Check the Application/Storage tab in devtools for a value stored next to the theme preference, then call skillUnlockPasscode(\'...\') from the console.',
  answerHash: 'ff7b676cdada9bca54a59647777a1c1d964c1b756d2c60ad27282c9df55c0387',
  useConsole: true,
};
