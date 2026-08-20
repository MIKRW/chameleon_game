// Shared PUZZLES registry and answer-checking logic — see README.md.
const PUZZLES = {};

async function sha256Hex(text) {
  const normalized = text.trim().toLowerCase();
  const data = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const solvedAnswers = {};

async function checkAnswer(roomId, guess) {
  const puzzle = PUZZLES[roomId];
  if (!puzzle) return false;
  const hash = await sha256Hex(guess);
  const correct = hash === puzzle.answerHash;
  if (correct) solvedAnswers[roomId] = guess.trim().toLowerCase();
  return correct;
}

function getFinalFlag() {
  const roomIds = Object.keys(PUZZLES);
  const allSolved = roomIds.every((id) => solvedAnswers[id] !== undefined);
  if (!allSolved) return null;
  return `FLAG{${roomIds.map((id) => solvedAnswers[id]).join('_')}}`;
}
