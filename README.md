**EDITING OF COMMENTS AND CODE ONGOING - remove unnesscary flaourtext, secrets, adjust claudes code ongoing. **

# Escape the Terrarium

Cameron Chameleon wants to escape his terrarium, spot him in his enclosure and 
then help him escape by solving puzzles and collecting bugs. 

## Game Play

### Platforms: 
Web Browser (Desktop)\
Mobile Browser (in development)\

### Controls:
| Action | Keys |
|:------:|:----:|
| Left | A |
| Right | D|
| Up | W |
| Down | s |
| Interact | E |
| Jump | Space |
| Click | Left Mouse Click |

### Buttons:
| Button | What it does |
|:------:|:------------:|
| ↻ | Restart the Game, rest score, puzzles |
| 🛠 | Open devtools (mobile only) |
| Sun / Moon | Switch light/Dark mode |

### Counters / Status Trackers:
| Counter / Status| What it Tracks |
|:-------:|:--------------:|
| 
## Features:

### Art Style
Pixel Art  - test in code no image files

### Sound 
None 

## Development Status / Facts: 

### Development Status:
Main movement and puzzles are completed

Finetuning: code, comments, bug movement patterns, game play feel, hints vs
puzzle difficuilty vs obscurity. 

Currently v1.0\
Mobile compatibility is in development\
Additional Level in planning\

### Browser Compatability:
Games uses widely supported features: canvas, JavaScript, local Storage,
Web Crypto API

Chrome (tested)\
Edge (untested)\
Firefox (untested)\
Safari (untested)\
Opera (untested)\
Samsung Internet (untested)\
Inter Exlorer ( NOT COMPATIBLE)



## Unedited Claude ReadMe Sections. 

### Playing locally

Just open `index.html` in a browser. If you want to test it over `http://`
instead of `file://`, serve the folder with any static server, e.g.:

```
npx serve .
```

or

```
python -m http.server
```

### Embedding in a portfolio

- **Link to it** as its own page (simplest), or
- **`<iframe>` it** inside an existing portfolio page:

```html
<iframe src="https://yourdomain.github.io/chameleon_game/" width="100%" height="480" style="border:0;"></iframe>
```

  A fixed `height` will scroll internally on narrow/mobile viewports,
  since the game's vertical stack doesn't fit 480px at every width. To
  avoid that, listen for a resize message and size the iframe to match:

  ```js
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'content-resize') {
      iframe.style.height = event.data.height + 'px';
    }
  });
  ```

  The game also accepts `?theme=light|dark` on the iframe `src` to pin
  its initial theme, and `iframe.contentWindow.postMessage({ type:
  'set-theme', theme: 'light' }, '*')` to sync it live.

  Add the `allowfullscreen` attribute so the mobile dev-tools button (see
  below) can expand to fill the screen:

  ```html
  <iframe src="..." width="100%" height="480" style="border:0;" allowfullscreen></iframe>
  ```

### Mobile dev tools

Puzzles 1 and 3 expect a player to use real browser devtools (view-source,
storage inspection, a console — see `puzzles/README.md`), which mobile and
tablet browsers don't expose. On a touch device (same `pointer: coarse`
check that swaps in the on-screen D-pad), a 🛠 button appears top-right of
the title. Tapping it lazy-loads [Eruda](https://github.com/liriliri/eruda)
(vendored locally at `vendor/eruda.js`, MIT-licensed, no network calls of
its own) and requests fullscreen so the panel has real room to work with.
Its Elements/Resources/Console tabs cover the same ground a desktop
player's devtools would.

