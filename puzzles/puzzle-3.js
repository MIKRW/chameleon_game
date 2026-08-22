// Puzzle 3: the Cling to Sides unlock. See ../README.md.
// No in-world trigger — the passcode lives in localStorage (see
// game/state.js), findable via the Application/Storage devtools panel, and
// is submitted through the console via clingToSidesPasscode() (see
// game/interactions.js) rather than a popup.
PUZZLES[3] = {
  room: null,
  title: 'Trunk-Side Traversal',
  prompt: 'No gate, no switch — just a status line that says "NO". The passcode is sitting in storage, not on screen.',
  hint: 'Check the Application/Storage tab in devtools for a value stored next to the theme preference, then call clingToSidesPasscode(\'...\') from the console.',
  answerHash: '64454603689cbfeb2fb1ac98371df767da142c3b2c1322f156b36d4b24249e84',
  useConsole: true,
};
