# Escape the Terrarium

A small, self-contained pixel-art game: a camouflaged chameleon explores a
terrarium — walking, jumping, and climbing trunks/branches through a capped
2D world. No build step, no dependencies — pure HTML/CSS/vanilla JS, so it
runs directly on GitHub Pages.

## Current state

- Movement, jumping, gravity, and trunk/branch climbing are implemented.
- The chameleon starts invisible (camouflaged) — toggle `CHAMELEON_VISIBLE`
  in the browser console to reveal it. No in-game hint points at this yet.
- The terrarium scene (floor, trunks, canopy, vines, plants, glass edges) is
  built from the sprite pages in `sprites/`.
- A "skill unlock" concept (`state.skillUnlocked`, the `#skill-status` label)
  exists as a manual dev toggle; the real unlock mechanism and the
  movement it's meant to gate aren't implemented yet.
- `puzzles.js` contains a scaffolded room/answer system (SHA-256 answer
  checking, a runtime-assembled completion flag) but isn't wired into
  `index.html`/`game.js` yet — no puzzle UI exists in the game yet.

## Playing locally

Just open `index.html` in a browser. If you want to test it over `http://`
instead of `file://`, serve the folder with any static server, e.g.:

```
npx serve .
```

or

```
python -m http.server
```

## Embedding in a portfolio

- **Link to it** as its own page (simplest), or
- **`<iframe>` it** inside an existing portfolio page:

```html
<iframe src="https://yourdomain.github.io/chameleon_game/" width="100%" height="480" style="border:0;"></iframe>
```

## Design notes

- **No secrets in the repo.** `puzzles.js` verifies answers via SHA-256 hash
  comparison, never plaintext equality, and the completion flag is assembled
  at runtime from verified answers rather than stored anywhere.
