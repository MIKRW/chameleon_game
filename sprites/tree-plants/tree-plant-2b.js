// === Tree Plant 2b - Hanging Moss (Large) ===
// Theme: same mossy clump/tendril family as Tree Plant 2, but hand-drawn
// bigger with more hanging fronds so the extra size reads as a fuller plant
// rather than the same silhouette blown up.
// Size: 18x24 (grid units; multiply by render scale) — 2x Tree Plant 2's
// 9x12, with 6 tendrils (vs. Tree Plant 2's 3) of varied length.
// Like Tree Plant 2, the clump is rooted flush against column 0 (bark
// contact on the left) so a 'right' mount reads as growing out of the trunk
// face instead of floating beside it; 'left' mounts flip it the same way.
// The top is a rounded oval canopy (nested ellipses, not a stepped wedge)
// hugging the bark so it curves smoothly out of the trunk instead of
// presenting hard diagonal edges; its fill is mottled (light/dark/highlight
// speckle, not flat rings) for texture. Tendrils sway in a gentle sine-wave
// drape rather than stepping sideways in whole-pixel jumps, so they read as
// soft hanging strands instead of rigid zigzag lines. Mounted with a deeper
// trunk overlap than the other tree-plants (TREE_PLANT_2B_TRUNK_OVERLAP,
// game/constants.js) so the canopy visibly sinks into the bark instead of
// just touching its edge.
// Uses the shared TERRARIUM_PALETTE from palette/terrarium-palette.js.

const TREE_PLANT_2B = {
  name: 'Tree Plant 2b - Hanging Moss (Large)',
  theme: 'trunk-mounted foliage, hanging moss with dangling tendrils, large',
  behavior: {
    type: "static",
    layer: "background",
    collision: false,
    placement: "branch",
    animated: false,
    mounts_to: "tree-trunk",
    attach_side: "right"
  },
  width: 18,
  height: 24,
  rows: [
    'kLLLLLfkk.........',
    'klLklLlLfkk.......',
    'klLLlLLfLkkk......',
    'klLfLlLlLlkk......',
    'kLflLLllLLkk......',
    'kllfLLLLLkk.......',
    'klllflLkk.........',
    '.l..L..l..L.l.L...',
    '.l..l..L..L.l.l...',
    '.L..l..l.l...LL...',
    '.l..L..l.L...Ll...',
    '.L..l..L.l...lL...',
    '.L..L..L.l...Ll...',
    '.l..L..l.L...lf...',
    '.f..l..Ll....L....',
    '....L.l.L....L....',
    '...l..L.L....l....',
    '...L..l.f....L....',
    '...L..L.....l.....',
    '...f..L.....L.....',
    '.....l......f.....',
    '.....L............',
    '.....f............',
    '..................',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = TREE_PLANT_2B;
