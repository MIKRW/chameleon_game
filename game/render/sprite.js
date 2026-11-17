// Sprite drawing primitives and palette lookups shared by every render file.
// Sprites are text grids of palette-key characters ('.' is transparent).

// `fade`, when given, fades rows from `minAlpha` (top, row 0) up to
// `maxAlpha` (bottom, last row) — same vertical fade convention as
// drawSpriteBlocky below, for sprites that don't need the blocky
// background texture treatment.
export function drawSprite(ctx, spriteRows, x, y, scale, palette, fade, flipX, flipY) {
  // Rounded to whole pixels — fractional x/y (e.g. from parallax offsets)
  // makes the canvas anti-alias each cell's fillRect independently, leaving
  // faint seams between adjacent cells. Same fix as drawSpriteBlocky below.
  x = Math.round(x);
  y = Math.round(y);
  const lastRow = spriteRows.length - 1;
  for (let row = 0; row < spriteRows.length; row++) {
    const line = spriteRows[row];
    if (fade) {
      const t = lastRow > 0 ? row / lastRow : 1;
      ctx.globalAlpha = fade.minAlpha + (fade.maxAlpha - fade.minAlpha) * t;
    }
    const drawRow = flipY ? lastRow - row : row;
    // Each cell's screen-space bounds are rounded independently (rather than
    // rounding x/y once and reusing a fixed `scale` width/height) so a
    // fractional scale (e.g. a sprite's renderScale — see drawGroundPlants,
    // plants.js) still tiles with no sub-pixel gaps between cells:
    // adjacent cells' rounded edges always coincide.
    const rowTop = y + Math.round(drawRow * scale);
    const rowBottom = y + Math.round((drawRow + 1) * scale);
    for (let col = 0; col < line.length; col++) {
      const color = palette[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      const drawCol = flipX ? line.length - 1 - col : col;
      const colLeft = x + Math.round(drawCol * scale);
      const colRight = x + Math.round((drawCol + 1) * scale);
      ctx.fillRect(colLeft, rowTop, colRight - colLeft, rowBottom - rowTop);
    }
  }
  if (fade) ctx.globalAlpha = 1;
}

// `fade`, when given, fades rows from `minAlpha` (top, row 0) up to
// `maxAlpha` (bottom, last row) so a tall background trunk reads as
// vanishing into haze near its top instead of cutting off sharply.
export function drawSpriteBlocky(ctx, spriteRows, x, y, scale, palette, block, fade) {
  // Rounded to whole pixels — fractional x/y here (e.g. from parallax
  // offsets like camera.x * BACKGROUND_PARALLAX) makes the canvas
  // anti-alias each cell's fillRect independently, leaving faint seams
  // between adjacent cells that shimmer into visible lines while panning.
  x = Math.round(x);
  y = Math.round(y);
  const cell = scale * block;
  const lastRow = spriteRows.length - 1;
  for (let row = 0; row <= lastRow; row += block) {
    const line = spriteRows[row];
    if (fade) {
      const t = lastRow > 0 ? row / lastRow : 1;
      ctx.globalAlpha = fade.minAlpha + (fade.maxAlpha - fade.minAlpha) * t;
    }
    for (let col = 0; col < line.length; col += block) {
      const color = palette[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + (col / block) * cell, y + (row / block) * cell, cell, cell);
    }
  }
  if (fade) ctx.globalAlpha = 1;
}

// A sprite's own nested palette entry (sprites/palette/terrarium-palette.js)
// — for sprites with no depth-layer bark variation, this is the whole
// palette to draw with. Returns undefined for an unknown id, same as a bare
// TERRARIUM_PALETTE[id] lookup would.
export function resolveSpritePalette(id) {
  return TERRARIUM_PALETTE[id];
}

// A bark-owning sprite's palette resolved for one depth layer. Ladder-driven
// entries (trunk-interact-1/3, trunk-bg-1a/2a/3a/4a/5a — see
// sprites/palette/terrarium-palette.js) carry a `.layers[layerNumber]`
// table built by buildBarkLayers() (sprites/palette/bark-ladder.js); this
// merges that layer's colors over the entry's non-varying keys (k, D, ...).
// Flat (non-ladder) bark entries and everything else are returned as-is.
export function resolveBarkPalette(id, layer) {
  const entry = TERRARIUM_PALETTE[id];
  if (!entry) return entry;
  if (entry.layers) {
    const { layers, ...base } = entry;
    return { '.': null, ...base, ...layers[layer] };
  }
  return entry;
}
