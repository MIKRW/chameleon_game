// Palette for the player (chameleon) sprite in sprites/user/player/. Follows
// the same convention as TERRARIUM_PALETTE in ./terrarium-palette.js: '.' is
// transparent, every other character maps to a hex color. Kept separate so
// the player can be themed independently of the terrarium set.
//
// PLAYER_PALETTE_OPTIONS holds a few alternate color sets the player can
// switch between at runtime via setChameleonColor() (see bottom of file) —
// e.g. from the browser console: setChameleonColor('magenta'). Each option
// keeps the same k/e/p (outline/eye white/pupil) so only the body+crest
// tones change. Tones are picked to read as a clear, saturated pop against
// the terrarium's muted teal/green/brown backdrop (TERRARIUM_PALETTE) while
// still echoing hues already present in the scene (amber bulb glow, glass
// teal, ground-plant-4 pink) so the player doesn't look pasted-in.

const PLAYER_PALETTE_OPTIONS = {
  // Amber — golden-yellow body (same hue family as the lit-bulb glass 'u'
  // #fff8dc / filament 'U' #ffb300), teal crest. Orange sat too close on
  // the hue wheel to the gate moss's red lichen (tree-plant-1 'z' #ff5252)
  // and read as clashing when both were on screen together; yellow puts
  // much more hue distance between them while staying just as warm/bright.
  // Teal crest (echoes glassEdge 'g' #bbdefb / tree-plant-3 'F' #6d7d68)
  // keeps the two-tone body/crest contrast the orange version had.
  amber: {
    'g': '#ffb300',
    'G': '#7a4a00',
    'u': '#2dd4bf',
    'U': '#0f4a45',
  },
  // Magenta — jewel-toned pink-magenta body (refines the old bright
  // purple), turquoise crest ties back to the glass/moss teal already in
  // the terrarium palette.
  magenta: {
    'g': '#c026d3',
    'G': '#3d0a45',
    'u': '#40e0d0',
    'U': '#0f4a45',
  },
  // Azure — cool cyan-blue body for a colder pop, warm yellow crest for
  // contrast against its own body color as well as the scene.
  azure: {
    'g': '#2dd4ff',
    'G': '#0a3a4a',
    'u': '#ffee58',
    'U': '#7a6a10',
  },
};

const PLAYER_PALETTE = {
  '.': null,
  'k': '#1a1a1a', // outline
  'e': '#ffffff', // eye white
  'p': '#000000', // pupil
  ...PLAYER_PALETTE_OPTIONS.magenta, // default
};

// Console helper: setChameleonColor('coral' | 'magenta' | 'azure').
// Mutates PLAYER_PALETTE in place so every module holding a reference to it
// (game/render.js) picks up the change on the next frame with no reload.
function setChameleonColor(name) {
  const option = PLAYER_PALETTE_OPTIONS[name];
  if (!option) {
    console.warn(`Unknown chameleon color "${name}". Options: ${Object.keys(PLAYER_PALETTE_OPTIONS).join(', ')}`);
    return;
  }
  Object.assign(PLAYER_PALETTE, option);
  console.log(`Chameleon color set to "${name}".`);
}
if (typeof window !== 'undefined') window.setChameleonColor = setChameleonColor;

if (typeof module !== 'undefined' && module.exports) module.exports = PLAYER_PALETTE;
