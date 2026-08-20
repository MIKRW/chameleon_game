// Shared pixel-art sprite renderer, drawn to <canvas> from small text grids
// of palette-key characters ('.' is transparent). Used by every sprite set
// (sprites/user/player, sprites/*) regardless of which palette they bring.
// No external image assets needed.

// `fade`, when given, fades rows from `minAlpha` (top, row 0) up to
// `maxAlpha` (bottom, last row) — same vertical fade convention as
// drawSpriteBlocky in game/render.js, for sprites that don't need the blocky
// background texture treatment.
function drawSprite(ctx, spriteRows, x, y, scale, palette, fade, flipX, flipY) {
  const lastRow = spriteRows.length - 1;
  for (let row = 0; row < spriteRows.length; row++) {
    const line = spriteRows[row];
    if (fade) {
      const t = lastRow > 0 ? row / lastRow : 1;
      ctx.globalAlpha = fade.minAlpha + (fade.maxAlpha - fade.minAlpha) * t;
    }
    const drawRow = flipY ? lastRow - row : row;
    for (let col = 0; col < line.length; col++) {
      const color = palette[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      const drawCol = flipX ? line.length - 1 - col : col;
      ctx.fillRect(x + drawCol * scale, y + drawRow * scale, scale, scale);
    }
  }
  if (fade) ctx.globalAlpha = 1;
}
