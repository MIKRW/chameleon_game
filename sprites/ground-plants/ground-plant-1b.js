// === Ground Plant 1b - Split-Leaf Philodendron (Side-View, Three-Leaf) ===
// Theme: ground foliage, large fenestrated leaves, rainforest-style
//
// Side-view variant of ground-plant-1 (GROUND_PLANT_1): three small tapered
// leaves (rounded highlight tip, vein-lined body, forked fenestration
// notch) branching off ONE straight central stem, each on its own short
// angled petiole — rather than the earlier version's zigzagging stem that
// leaves just sat next to. Leaves are ~1/3 smaller than that earlier
// version (11x9 template vs 16x13) and their fill is dithered (speckled
// L/f flecks scattered through the l base, not a flat solid green) so they
// don't read as flat blocks. The grid was authored at 34x44 (leaf template
// stamped 3x, alternating sides, each wired to the stem by a diagonal
// petiole) then given one gentle 2x nearest-neighbor upscale to 68x88.
// Keeps its own independent l/L/f/v palette entry (plain greens, same
// family as ground-plant-1) rather than ground-plant-6's deeper e/E tones,
// so the two read as siblings, not duplicates.
// renderScale is 1.3 -> 30% larger than ground-plant-1's implicit 1x.
// Size: 68x88 (grid units; multiply by render scale x renderScale)
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const GROUND_PLANT_1B = {
  name: 'Ground Plant 1b - Split-Leaf Philodendron (Side-View, Three-Leaf)',
  theme: 'ground foliage, large fenestrated leaves, rainforest-style, side profile',
  behavior: {
    type: "static",
    layer: "mid-ground",
    collision: false,
    placement: "floor",
    animated: false
  },
  width: 68,
  height: 88,
  renderScale: 1.3, // 30% larger than ground-plant-1's 1x
  rows: [
    '............ff..................kk..................................',
    '............ff..................kk..................................',
    '..........ffffff...............kkkk.................................',
    '..........ffffff...............kkkk.................................',
    '........LLllffllLL............kkkkkk................................',
    '........LLllffllLL............kkkkkk................................',
    '......LLLLllvvffllLL..........kkkkkk................................',
    '......LLLLllvvffllLL..........kkkkkk................................',
    '....LLllllLLllvvllllLL........kkkkkk................................',
    '....LLllllLLllvvllllLL........kkkkkk................................',
    '..LLllllllllvvllllllllLL......kkkkkk................................',
    '..LLllllllllvvllllllllLL......kkkkkk................................',
    '..LLLLllllll....llllllLL......kkkkkk................................',
    '..LLLLllllll....llllllLL......kkkkkk................................',
    '....LLLLll....llLLllLL........kkkkkk................................',
    '....LLLLll....llLLllLL........kkkkkk................................',
    '......LLLLllkkkkkkLL..........kkkkkk................................',
    '......LLLLllkkkkkkLL..........kkkkkk................................',
    '................kkkkkkkk......kkkkkk................................',
    '................kkkkkkkk......kkkkkk................................',
    '......................kkkkkkkkkkkkkk................................',
    '......................kkkkkkkkkkkkkk................................',
    '............................kkkkkkkk................................',
    '............................kkkkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................ff..............',
    '..............................kkkkkk................ff..............',
    '..............................kkkkkk..............ffffff............',
    '..............................kkkkkk..............ffffff............',
    '..............................kkkkkk............LLllffllLL..........',
    '..............................kkkkkk............LLllffllLL..........',
    '..............................kkkkkk..........LLLLllvvffllLL........',
    '..............................kkkkkk..........LLLLllvvffllLL........',
    '..............................kkkkkk........LLllllLLllvvllllLL......',
    '..............................kkkkkk........LLllllLLllvvllllLL......',
    '..............................kkkkkk......LLllllllllvvllllllllLL....',
    '..............................kkkkkk......LLllllllllvvllllllllLL....',
    '..............................kkkkkk......LLLLllllll....llllllLL....',
    '..............................kkkkkk......LLLLllllll....llllllLL....',
    '......ff......................kkkkkk........LLLLll....llLLllLL......',
    '......ff......................kkkkkk........LLLLll....llLLllLL......',
    '.....ffffff...................kkkkkk..........LLkkkkkkkkllLL........',
    '.....ffffff...................kkkkkk..........LLkkkkkkkkllLL........',
    '...LLllffllLL.................kkkkkk....kkkkkkkkkk..................',
    '...LLllffllLL.................kkkkkk....kkkkkkkkkk..................',
    '..LLLLllvvffllLL..............kkkkkkkkkkkk..........................',
    '..LLLLllvvffllLL..............kkkkkkkkkkkk..........................',
    '.LLllllLLllvvllllLL...........kkkkkk................................',
    '.LLllllLLllvvllllLL...........kkkkkk................................',
    'LLllllllllvvllllllllLL........kkkkkk................................',
    'LLllllllllvvllllllllLL........kkkkkk................................',
    'LLLLllllll....llllllLL........kkkkkk................................',
    'LLLLllllll....llllllLL........kkkkkk................................',
    '..LLLLll....llLLllLL..........kkkkkk................................',
    '..LLLLll....llLLllLL..........kkkkkk................................',
    '.....LLLLllkkkkkkkk...........kkkkkk................................',
    '.....LLLLllkkkkkkkk...........kkkkkk................................',
    '.................kkkkkkkkkk...kkkkkk................................',
    '.................kkkkkkkkkk...kkkkkk................................',
    '..........................kkkkkkkkkk................................',
    '..........................kkkkkkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '..............................kkkkkk................................',
    '.............................kkkkkkkk...............................',
    '.............................kkkkkkkk...............................',
    '............................kkkkkkkkkk..............................',
    '............................kkkkkkkkkk..............................',
    '............................kkkkkkkkkk..............................',
    '............................kkkkkkkkkk..............................',
    '............................kkkkkkkkkk..............................',
    '............................kkkkkkkkkk..............................'
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = GROUND_PLANT_1B;
