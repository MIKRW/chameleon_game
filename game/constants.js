// Tunable numbers and derived layout constants shared across the game
// modules. Depends on the sprite globals (GLASS_EDGE_BOTTOM/LEFT, etc.) from
// sprites.js/sprites/*.js, which load as classic scripts before this module
// runs.

export const CANVAS_W = 720;
export const CANVAS_H = 480;
export const SCALE = 4; // sprite pixel scale
export const PLAYER_SPEED = 5;
export const GRAVITY = 0.7;
export const JUMP_VELOCITY = -12;
export const CLIMB_SPEED = 3;
export const CLIMB_GRAB_MARGIN = 6; // extra px of forgiveness when checking for a trunk to grab
export const CLIMB_MIN_AIR_HEIGHT = 16; // min px the player must have jumped above the floor line before a trunk can grab them — keeps a low hop near a trunk's base (where ground plants often sit) from snapping onto the trunk and reading as "stuck" on the plants
export const CLIMB_JUMP_KICK = 4; // horizontal push when jumping off a trunk toward a direction
export const CLIMB_JUMP_AWAY_KICK = 2; // horizontal push when jumping off with no direction held
export const CLIMB_SIDE_PEEK_FRACTION = 0.8; // fraction of player width left visible outside the trunk when side-climbing
export const TREE_BRANCH_TRUNK_OVERLAP = 2; // grid cells a branch's base sinks into the trunk's edge, both for the visual join and for its physics base point
export const TREE_PLANT_TRUNK_OVERLAP = 1; // grid cells a decorative trunk plant's base sinks into the trunk's edge, same idea as TREE_BRANCH_TRUNK_OVERLAP
export const BRANCH_GRAB_MARGIN = 8; // extra px of forgiveness when checking for a branch underside to grab
export const BRANCH_HANG_BAND = 10; // px of vertical forgiveness below a branch's underside still counted as "reaching" it

// --- World layout: a capped rectangle, not an endless scroller ---
export const WORLD_WIDTH = 3600;
export const WORLD_HEIGHT = 640;
export const CAMERA_X_MAX = WORLD_WIDTH - CANVAS_W;
export const CAMERA_Y_MAX = WORLD_HEIGHT - CANVAS_H;

export const GROUND_BAND = 14; // thickness of the mossy floor strip
export const GROUND_TOP = WORLD_HEIGHT - GROUND_BAND; // world y where moss starts
export const LID_TOP = 20; // where the tank lid sits, just under the top of the world

// Bottom glass rim is rendered at double sprite scale so each tile spans
// more of the tank width — fewer repeats, fewer visible seams/joins.
export const GLASS_EDGE_RENDER_SCALE = SCALE * 2;
export const GLASS_BOTTOM_TILE_W = GLASS_EDGE_BOTTOM.width * GLASS_EDGE_RENDER_SCALE;
export const GLASS_BOTTOM_TILE_H = GLASS_EDGE_BOTTOM.height * GLASS_EDGE_RENDER_SCALE;
// Side walls are as thick as the bottom rim is tall, so all four edges read
// as the same gauge of glass. GLASS_EDGE_LEFT/RIGHT are 2 units wide, so
// scale them up to hit that thickness.
export const GLASS_SIDE_THICKNESS = GLASS_BOTTOM_TILE_H;
export const GLASS_SIDE_RENDER_SCALE = GLASS_SIDE_THICKNESS / GLASS_EDGE_LEFT.width;
export const GLASS_SIDE_TILE_H = GLASS_EDGE_LEFT.height * GLASS_SIDE_RENDER_SCALE;

// Player sprites (SPRITES.player / playerSideLeft / playerSideRight) are 16
// columns x 11 rows.
export const PLAYER_W = SCALE * 16;
export const PLAYER_H = SCALE * 11;
export const FLOOR_Y = GROUND_TOP - PLAYER_H; // player's resting world y (feet on top of the ground/glass line)
export const START_POS = { x: 60, y: FLOOR_Y };

// Flicking the switch back and forth too fast is meant to feel risky: a
// warning at LIGHT_WARNING_FLICKS, then the bulb pops at LIGHT_BREAK_FLICKS
// and the switch stops responding until a player resets it from the
// console — `resetLightbulb()`, mirroring the CHAMELEON_VISIBLE convention
// in game/state.js — same idea as a "secret" reset a player has to go find
// out about.
export const LIGHT_WARNING_FLICKS = 10;
export const LIGHT_BREAK_FLICKS = 12;

export const TOTAL_PUZZLES = 3; // one per PUZZLES entry in puzzles/puzzle-N.js
export const BUGS_REQUIRED = BUG_PLACEMENTS.length; // see world-props.js

export const GATE_MOSS_FINGER_MARGIN = 2 * SCALE; // TREE_PLANT_1's 2 leftmost columns are finger tips, not bark overlay
export const GATE_INTERACT_RANGE = 60; // px of horizontal slack on either side of the gate trunk that still counts as "at" it

export const SWITCH_TRUNK_OVERLAP = 1; // grid cells the switch sinks into the trunk's edge, same idea as TREE_BRANCH_TRUNK_OVERLAP
export const LIGHT_SWITCH_INTERACT_RANGE = 40; // px of vertical slack above/below the switch's mounted row that still counts as "at" it

// px of clearance put between the player and a branch's contact line
// (top surface when passing up, underside when passing down) after
// passBranchAlongTrunk repositions them back onto the trunk — just enough
// that next frame's findBranchCrossedClimbingUp/Down doesn't immediately
// re-trigger on the same branch.
export const BRANCH_PASS_MARGIN = 4;

// Horizontal speed while on/under a branch — a bit brisker than trunk
// climbing since a branch run is meant to read as a dash along a limb, not
// a careful climb.
export const BRANCH_SPEED = 4;

export const GLASS_FRONT_TOP_ALPHA = 0.05; // near-clear at the top, even at the floor
export const GLASS_FRONT_BOTTOM_ALPHA = 0.5; // hazy near the bottom, even at the floor

// Layer-4 trunks (behind the player) get the same top-to-bottom vertical
// fade as the layer-3 background trunks (see TREE_FADE_MIN_ALPHA below),
// just much less dramatic — still clearly readable as trees, just a touch
// hazier than the fully-opaque layer-6 trunks in front of the player so
// depth still reads between the two.
export const TREE_FADE_MIN_ALPHA_LAYER4 = 0.45;
export const TREE_FADE_MAX_ALPHA_LAYER4 = 1;

// Layer-4 trunks also get a slightly darkened bark palette (on top of the
// alpha fade above) so they read as further back even where the fade is at
// its least dramatic (near the bottom, maxAlpha) — same 'r'/'R'/'h' bark
// keys as TERRARIUM_PALETTE, just ~15% darker.
export const TERRARIUM_PALETTE_LAYER4_TREES = {
  ...TERRARIUM_PALETTE,
  'r': '#765347', // bark, darkened
  'R': '#4d332d', // bark shade, darkened
  'h': '#9d857c', // bark highlight, darkened
};

// Background decor pixel block size — sampling every Nth row/col (nearest
// neighbor) and drawing it back out at N x the normal cell size makes
// background scenery read as slightly chunkier/lower-res than the crisp
// fore/near-layer sprites, reinforcing that it's further away.
export const BACKGROUND_PIXEL_BLOCK = 2;

// Background trunks fade from barely-visible at the crown (TREE_FADE_MIN_ALPHA)
// up to fully opaque at the floor (TREE_FADE_MAX_ALPHA), so only the tops of
// the tallest trunks peek out of the haze rather than looming solidly overhead.
export const TREE_FADE_MIN_ALPHA = 0.12;
export const TREE_FADE_MAX_ALPHA = 1;
