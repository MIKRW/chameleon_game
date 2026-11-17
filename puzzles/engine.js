// PUZZLES is a nested object: each outer key is a puzzle number (puzzleKey).
// Each value is an inner object with title, description and answerHash as keys,
// and string values.
// Used in the puzzle.1/2/3/ect.js files 
const PUZZLES = {};

// Hashes the player's guess using the browser's built-in crypto API.
// Only works on HTTPS or localhost; opening via file:// causes an error.
async function sha256Hex(text) {
  const normalized = text.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Stores the player's correct answer for each solved puzzle, by puzzleKey.
// Used to build the final flag once all puzzles are solved.
const solvedAnswers = {};

// Checks whether the player's guess is correct for the given puzzle.
// puzzleKey is the outer key in PUZZLES (e.g. 1 for PUZZLES[1]).
async function checkAnswer(puzzleKey, guess) {
  const puzzle = PUZZLES[puzzleKey];
  if (!puzzle) return false;
  const hash = await sha256Hex(guess);
  const correct = hash === puzzle.answerHash;
  if (correct) solvedAnswers[puzzleKey] = guess.trim().toLowerCase();
  return correct;
}

// Returns the final flag once every puzzle is solved, otherwise null.
function getFinalFlag() {
  const puzzleKeys = Object.keys(PUZZLES);
  const allSolved = puzzleKeys.every((key) => solvedAnswers[key] !== undefined);
  if (!allSolved) return null;
  return `FLAG{${puzzleKeys.map((key) => solvedAnswers[key]).join('_')}}`;
}
