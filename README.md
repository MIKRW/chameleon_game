# Escape the Terrarium

A small, self-contained pixel-art game: a chameleon explores a
terrarium — walking, jumping, and climbing trunks/branches through a capped
2D world. No build step, no dependencies — pure HTML/CSS/vanilla JS, so it
runs directly on GitHub Pages.

## Current state

This is a work in progress — core movement is playable, and more mechanics
are still being built out.

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

- **No secrets in the repo.** Anything sensitive to gameplay is verified
  without being stored in plaintext anywhere in the source.
