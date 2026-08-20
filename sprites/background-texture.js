// === Background Texture ===
// Theme: a hidden pixel-digit grid, grown into the terrarium backdrop like a
// blight of scraggly vine tendrils rather than a printed font — 8 rows of 8
// binary digits (64 cells total), each digit built from the shared 3x5 '0'/
// '1' glyph but with its "on" pixels split across two dark green tones so
// the strokes read as tangled vine rather than a clean typeface.
//
// Every non-digit cell is left transparent ('.') rather than painted with an
// explicit fill — that's deliberate: this sprite draws on layer 2
// (world-props.js / game/render.js scene stack), directly on top of the flat
// layer-1 backdrop fill (#132218, see draw() in game/render.js), so the two colors
// already match without duplicating the hex here. The digit strokes ('j'/'J'
// in palette/terrarium-palette.js) are bright warm tones against that dark backdrop, so the
// grid reads clearly once drawn. It's only drawn once lightbulb-2's warm
// light is up (see lightbulb-2.js and light-switch.js/light-switch-on.js) —
// that reveal is a lighting/visibility decision made where this sprite gets
// drawn, not anything encoded in this file.
//
// Anchors at row 0 (top), hung directly under the lightbulb prop rather than
// sitting on the floor (see drawBackgroundTexture() in game/render.js). Digit
// columns run left-to-right, same as normal reading order. Size: 35x51
// (grid units, multiply by render scale). Uses the shared TERRARIUM_PALETTE
// from palette/terrarium-palette.js.

const BACKGROUND_TEXTURE = {
  name: 'Background Texture',
  theme: 'hidden pixel-digit grid grown into the backdrop like vine blight, legible only once lit',
  behavior: {
    type: 'static',
    layer: 'background',
    collision: false,
    placement: 'backdrop',
    animated: false,
  },
  width: 35,
  height: 51,
  rows: [
    '...................................',
    '...................................',
    '..jJj..j...j...J..Jjj.jjJ.jJj..j...',
    '..J.j.jj..jJ..Jj..j.J.j.j.J.j.jj...',
    '..j.J..J...j...j..j.j.J.j.j.J..J...',
    '..j.j..j...j...J..J.j.j.J.j.j..j...',
    '..Jjj.jjJ.jJj.Jjj.jjJ.jJj.Jjj.jjJ..',
    '...................................',
    '..Jjj.jjJ..J...j..jjJ..J...j...j...',
    '..j.J.j.j.Jj..jj..j.j.Jj..jj..jJ...',
    '..j.j.J.j..j...J..J.j..j...J...j...',
    '..J.j.j.J..J...j..j.J..J...j...j...',
    '..jjJ.jJj.Jjj.jjJ.jJj.Jjj.jjJ.jJj..',
    '...................................',
    '..jjJ.jJj..j..jjJ.jJj.Jjj..j...J...',
    '..j.j.J.j.jj..j.j.J.j.j.J.jJ..Jj...',
    '..J.j.j.J..J..J.j.j.J.j.j..j...j...',
    '..j.J.j.j..j..j.J.j.j.J.j..j...J...',
    '..jJj.Jjj.jjJ.jJj.Jjj.jjJ.jJj.Jjj..',
    '...................................',
    '..jJj..j..jjJ..J..Jjj..j..jJj.Jjj..',
    '..J.j.jj..j.j.Jj..j.J.jJ..J.j.j.J..',
    '..j.J..J..J.j..j..j.j..j..j.J.j.j..',
    '..j.j..j..j.J..J..J.j..j..j.j.J.j..',
    '..Jjj.jjJ.jJj.Jjj.jjJ.jJj.Jjj.jjJ..',
    '...................................',
    '..Jjj.jjJ..J...j..jjJ.jJj..j..jjJ..',
    '..j.J.j.j.Jj..jj..j.j.J.j.jj..j.j..',
    '..j.j.J.j..j...J..J.j.j.J..J..J.j..',
    '..J.j.j.J..J...j..j.J.j.j..j..j.J..',
    '..jjJ.jJj.Jjj.jjJ.jJj.Jjj.jjJ.jJj..',
    '...................................',
    '..jjJ.jJj..j..jjJ.jJj.Jjj.jjJ..J...',
    '..j.j.J.j.jj..j.j.J.j.j.J.j.j.Jj...',
    '..J.j.j.J..J..J.j.j.J.j.j.J.j..j...',
    '..j.J.j.j..j..j.J.j.j.J.j.j.J..J...',
    '..jJj.Jjj.jjJ.jJj.Jjj.jjJ.jJj.Jjj..',
    '...................................',
    '..jJj..j...j...J...j..jjJ..J..Jjj..',
    '..J.j.jj..jJ..Jj..jj..j.j.Jj..j.J..',
    '..j.J..J...j...j...J..J.j..j..j.j..',
    '..j.j..j...j...J...j..j.J..J..J.j..',
    '..Jjj.jjJ.jJj.Jjj.jjJ.jJj.Jjj.jjJ..',
    '...................................',
    '..Jjj..j..jJj.Jjj..j..jJj..j...j...',
    '..j.J.jJ..J.j.j.J.jJ..J.j.jj..jJ...',
    '..j.j..j..j.J.j.j..j..j.J..J...j...',
    '..J.j..j..j.j.J.j..j..j.j..j...j...',
    '..jjJ.jJj.Jjj.jjJ.jJj.Jjj.jjJ.jJj..',
    '...................................',
    '...................................',
  ],
};

if (typeof module !== 'undefined' && module.exports) module.exports = BACKGROUND_TEXTURE;
