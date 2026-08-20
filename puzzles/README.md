# Puzzles

Each room's puzzle definition lives in its own file (`puzzle-1.js`,
`puzzle-2.js`) rather than one combined file, so a player who opens dev
tools to cheat has to open each room's spoiler separately instead of
reading every answer at once.

`engine.js` holds the shared `PUZZLES` registry and answer-checking logic,
and loads before the `puzzle-N.js` files (see `index.html`).

## Answer checking

Every answer is verified via SHA-256 hash comparison (Web Crypto API,
in-browser) against `answerHash` on each `PUZZLES` entry — never by a
plaintext equality check. `solvedAnswers` is filled in only as each guess
is verified correct, and is never pre-populated or persisted, which is
what lets `getFinalFlag()` assemble the completion flag without the flag
(or its pieces) ever existing in source.

## Per-room clues

Each room deliberately plants its code somewhere findable via the
specific recon technique that room teaches:

| Room | Technique | Where |
|---|---|---|
| 1 — Gatekeeper Tree | View page source | HTML comment |
| 2 — The Warm Light | Binary decoding | 8x8 pixel-digit grid grown into the backdrop (sprites/background-texture.js), only readable while the lightbulb is lit |

That plaintext is each puzzle's intended clue, not a leaked secret.
