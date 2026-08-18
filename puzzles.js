// Puzzle definitions and answer-checking logic.
//
// Every answer is verified via SHA-256 hash comparison (Web Crypto API,
// in-browser) against answerHash below — never by a plaintext equality
// check. Three rooms (1, 2, 4) also deliberately *plant* their code
// somewhere findable via the specific recon technique that room teaches
// (an HTML comment, an exposed console object, and localStorage,
// respectively) — that plaintext is the puzzle's clue, not a leaked
// secret. Room 3's code only ever appears Base64-encoded on screen.

const PUZZLES = {
  1: {
    room: 'lobby',
    title: 'The Gatekeeper Tree',
    prompt: 'A colossal tree blocks the path, its bark carved into a keypad. Somewhere on this very page, a note explains the code...',
    hint: 'Try viewing the page source (Ctrl+U) and look for a comment.',
    answerHash: 'abb9f0871e3a1b72c62bcca07e82fe2709eb1fad58011eee5fcaf21225ba051b',
    useConsole: false,
  },
  2: {
    room: 'server',
    title: 'The Signal Tree',
    prompt: 'A strange console is fused into the bark, wrapped in vines. It flickers: "SYSTEM LOCKED. Authorized users may call unlock() from the developer console."',
    hint: 'Open DevTools (F12), go to the Console tab, and type terminalDiagnostics (no parentheses) to inspect what the page exposes. Then call unlock("...") with what you find.',
    answerHash: '6414e639a2e662ae4775ed4f28a15505027d3bb90ec47df96400fa4401cf9527',
    useConsole: true,
    // Planted on window.terminalDiagnostics while this tree is active (see
    // game.js) so the player can find it by inspecting exposed globals in
    // the console — a real-world recon technique (debug objects left
    // exposed in production).
    consoleObjectKey: 'terminalDiagnostics',
    consoleObjectValue: { status: 'LOCKED', accessCode: '3YN5SM' },
  },
  3: {
    room: 'library',
    title: 'The Scroll Tree',
    prompt: 'A scrap of bark-parchment is nailed to the trunk, covered in strange text: SFE1SkQ4',
    hint: 'That looks like Base64. Try decoding it (e.g. an online Base64 decoder, or `atob("...")` in the console).',
    answerHash: '4767460f464c13892d7201c073d151eebef791c186c5e82155efc4ac9395d2b9',
    useConsole: false,
  },
  4: {
    room: 'vault',
    title: 'The Elder Tree',
    prompt: 'Massive roots coil around a stone vault door with no visible keypad. Perhaps something was left behind nearby, saved for later...',
    hint: 'Open DevTools → Application (or Storage) → Local Storage, and look for a key named "chameleon_secret_hint".',
    answerHash: '6a56d96d3322f918eac29ad396b5c678cc47695abf5af4bb40ae5f500ff318b8',
    useConsole: false,
    // Set once the first three trees are solved; see game.js.
    localStorageKey: 'chameleon_secret_hint',
    localStorageValue: 'NBRAB3',
  },
};

async function sha256Hex(text) {
  const normalized = text.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Plaintext answers, keyed by room id, filled in only as each is verified
// correct. Never pre-populated or persisted — this is what lets the final
// flag be assembled without ever storing it (or its pieces) in source.
const solvedAnswers = {};

async function checkAnswer(roomId, guess) {
  const puzzle = PUZZLES[roomId];
  if (!puzzle) return false;
  const hash = await sha256Hex(guess);
  const correct = hash === puzzle.answerHash;
  if (correct) solvedAnswers[roomId] = guess.trim().toLowerCase();
  return correct;
}

// Returns the completion flag once every room has been solved this session,
// or null if any are still outstanding. Built from the verified answers at
// call time rather than stored anywhere, so it can't be read from source.
function getFinalFlag() {
  const roomIds = Object.keys(PUZZLES);
  const allSolved = roomIds.every((id) => solvedAnswers[id] !== undefined);
  if (!allSolved) return null;
  return `FLAG{${roomIds.map((id) => solvedAnswers[id]).join('_')}}`;
}
