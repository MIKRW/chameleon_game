// Tunable numbers and derived layout constants shared across the game
// modules. Depends on the sprite globals (GLASS_EDGE_BOTTOM/LEFT, etc.) from
// sprites.js/sprites/*.js, which load as classic scripts before this module
// runs.

export const CANVAS_W = 720;
export const CANVAS_H = 480;
export const SCALE = 4; // sprite pixel scale
export const PLAYER_SPEED = 7;
// Fraction of the gap to the target camera position closed per frame —
// makes the camera ease toward the player instead of snapping 1:1, so
// world scenery (esp. layer 5/7 trunks, which must stay pixel-exact with
// their collision geometry and so can't get their own slower parallax)
// slides by more gently. World positions/collision are untouched — this
// only smooths the camera.x/y used at render time (see draw(), game/render.js).
export const CAMERA_EASE = 0.12;
export const GRAVITY = 0.7;
export const JUMP_VELOCITY = -12;
export const CLIMB_SPEED = 2;
export const CLIMB_GRAB_MARGIN = 6; // extra px of forgiveness when checking for a trunk to grab
export const CLIMB_MIN_AIR_HEIGHT = 16; // min px the player must have jumped above the floor line before a trunk can grab them — keeps a low hop near a trunk's base (where ground plants often sit) from snapping onto the trunk and reading as "stuck" on the plants
export const CLIMB_JUMP_KICK = 4; // horizontal push when jumping off a trunk toward a direction
export const CLIMB_JUMP_AWAY_KICK = 2; // horizontal push when jumping off with no direction held
export const CLIMB_SIDE_PEEK_FRACTION = 0.8; // fraction of player width left visible outside the trunk when side-climbing
export const TREE_BRANCH_TRUNK_OVERLAP = 2; // grid cells a branch's base sinks into the trunk's edge, both for the visual join and for its physics base point
export const TREE_PLANT_TRUNK_OVERLAP = 1; // grid cells a decorative trunk plant's base sinks into the trunk's edge, same idea as TREE_BRANCH_TRUNK_OVERLAP
export const TREE_PLANT_2B_TRUNK_OVERLAP = 4; // tree-plant-2b's wide rounded canopy sinks in deeper than TREE_PLANT_TRUNK_OVERLAP so more of its top reads as overlapping/emerging from the bark, not just touching its edge
export const SLIME_TRUNK_OVERLAP = 3; // grid cells the trunk slime's (4-wide) sprite sinks into the trunk's edge — deliberately deeper than TREE_PLANT_TRUNK_OVERLAP so most of the drip sits over the bark and reads as growing on it, not floating beside it
export const BRANCH_GRAB_MARGIN = 8; // extra px of forgiveness when checking for a branch underside to grab
export const BRANCH_HANG_BAND = 10; // px of vertical forgiveness below a branch's underside still counted as "reaching" it

// px of forgiveness around the player's actual bounding box when checking
// whether an E press catches a nearby bug — deliberately tighter than
// CLIMB_GRAB_MARGIN so catching one takes lining up and timing the press,
// not just walking/jumping through its space (see collectNearbyBug() in
// game/interactions.js).
export const BUG_INTERACT_MARGIN = 4;

// --- World layout: a capped rectangle, not an endless scroller ---
// Temporarily shortened from 3600 to 2650 — the walk felt too long for the
// current mechanics. Lands in the gap between the trunk-interact-2 at
// x2350 (whose branch-3 reaches ~184px right of its own trunk edge) and the
// next tree at x2700, so nothing existing gets visually sliced by the new
// right wall. Everything past this point (trees, branches, plants, the
// second lightbulb) is left in place in world-props.js — the camera clamp
// (CAMERA_X_MAX below) and canvas clipping already make it unreachable and
// invisible without deleting any placements, so restoring the old width
// later brings it all back for free.
export const WORLD_WIDTH = 2650;
export const WORLD_HEIGHT = 640;
export const CAMERA_X_MAX = WORLD_WIDTH - CANVAS_W;
export const CAMERA_Y_MAX = WORLD_HEIGHT - CANVAS_H;

export const GROUND_BAND = 14; // thickness of the mossy floor strip
export const GROUND_TOP = WORLD_HEIGHT - GROUND_BAND; // world y where moss starts
export const LID_TOP = 8; // where the tank lid sits, just under the top of the world (the wall's own top edge)

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
export const GATE_MOSS_BOTTOM_GAP = 10 * SCALE; // keep the lowest moss tile from touching the glass floor line
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

// Depth-layer saturation ladder (see DEPTH-LAYERS.md for the full rationale
// and measured baseline, and sprites/palette/bark-ladder.js for the actual
// LAYER_BARK_SATURATION numbers and the deriveBarkColor() formula that now
// computes each layer's bark tone from a sprite's native color instead of
// hand-tuned per-layer hex tables). Layers 5 and 7 (the interactive trunks)
// are fully opaque, crisp, and never alpha-faded — that vertical crown-fade
// is reserved for the purely cosmetic layer-2/3 background decor (see
// TREE_FADE_MIN_ALPHA below) so climbable trunks always read as clean and
// separate from scenery, regardless of camera position. Depth between
// layers 2/3/5/7 is instead carried entirely by saturation + lightness, each
// layer's bark palette getting progressively richer as it sits closer to
// the camera. See resolveBarkPalette() in game/render.js for how a bark
// sprite's per-layer color is resolved at draw time from
// sprites/palette/terrarium-palette.js's nested `.layers` entries.

// Background decor pixel block size — sampling every Nth row/col (nearest
// neighbor) and drawing it back out at N x the normal cell size makes
// background scenery read as slightly chunkier/lower-res than the crisp
// fore/near-layer sprites, reinforcing that it's further away.
export const BACKGROUND_PIXEL_BLOCK = 2;

// Fraction of camera.x the background-fill texture scrolls by (see
// drawBackgroundSprite() in game/render.js) — far below 1 so it drifts slowly
// under the foreground instead of tracking the camera 1:1, the cue that
// reads as "distant" rather than "stuck to the screen". background-fill.js
// is generated wide enough (CHUNKS_W margin) to cover CAMERA_X_MAX *
// BACKGROUND_PARALLAX of scroll without running out of image at either edge.
export const BACKGROUND_PARALLAX = 0.06;

// Fraction of camera.x the layer-2/3 background-decor trunks (and, for
// layer 3, ground-plant-1 — see drawGroundPlants(), game/render.js) scroll
// by — each faster than BACKGROUND_PARALLAX (the layer-1 backdrop) but
// still under 1:1, so the layers visibly separate as the camera pans:
// 1 (0.06) < 2 (0.45) < 3 (0.6) < layers 5/7/player (1:1). Raised closer to
// 1:1 than earlier passes — at the previous lower values, a layer-3 ground
// plant visibly drifted away from its layer-7 neighbor too fast as the
// camera panned; keeping this nearer 1:1 makes that separation read as
// subtle depth instead of a jarring speed mismatch. BACKGROUND_PLACEMENTS/
// BACKGROUND_LAYER3_PLACEMENTS (world-props.js) place their trunks within
// the screen-x range each
// factor can actually reach (CAMERA_X_MAX * factor + CANVAS_W) rather than
// across the full world width, so nothing sits permanently out of view.
export const BACKGROUND_DECOR_PARALLAX_LAYER2 = 0.72;
export const BACKGROUND_DECOR_PARALLAX_LAYER3 = 0.85;

// Background/decor trunks (layers 2 and 3 only — see above) fade from
// barely-visible at the crown (TREE_FADE_MIN_ALPHA) up to fully opaque at
// the floor (TREE_FADE_MAX_ALPHA), so only the tops of the tallest trunks
// peek out of the haze rather than looming solidly overhead. One shared
// range for both layers — the layers themselves are told apart by
// saturation/parallax speed, not by each having its own fade range.
export const TREE_FADE_MIN_ALPHA = 0.12;
export const TREE_FADE_MAX_ALPHA = 1;
