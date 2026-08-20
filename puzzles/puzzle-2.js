// Puzzle 2: The Warm Light. See ../README.md.
PUZZLES[2] = {
  room: 'terrarium',
  title: 'The Warm Light',
  prompt: 'A grid of 64 pixel-digits is grown into the bark behind the lightbulb, only readable once it\'s lit.',
  // The 64 bits are one binary number, not 8 bytes of encoded text — don't
  // run them through an ASCII/text decoder (that splits into 8-bit chunks
  // and maps each to a character, producing garbage). Read all 64 digits
  // as a single base-2 number and convert straight to base-10.
  hint: 'Read the 8x8 grid of 0s and 1s left-to-right, top-to-bottom as one 64-bit binary number (not 8 separate bytes/characters), then convert that number to decimal.',
  answerHash: 'dff76a6ff5085231e358fcabc19818f1e1f0325eb01fadc4cc27c3be0807cb21',
  useConsole: false,
};
