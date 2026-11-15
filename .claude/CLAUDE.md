# Git conventions

## Commit messages

- Use [Conventional Commits](https://www.conventionalcommits.org/):
  `type(optional scope): summary`, e.g.
  `fix(input): ignore touch-scroll when switching controls`
- Last line is the attribution trailer:
  - Claude wrote or co-wrote the changes:
    `Co-Authored-By: Claude <model> <noreply@anthropic.com>`
  - The user wrote the changes: `Committed-by: Claude` (no email)
  - Code Claude gave in chat that the user adapted counts as the user's
- For "commit all changes", split into commits by topic, then pick the
  trailer per commit
- If authorship is unclear (e.g. edits from an earlier session), ask

## Process

- Stage only what was asked for; for a specific named change, stage
  only that hunk
- Never push unless asked
- Don't run extra shell commands beyond what the task needs

## Branches and versions

- `main` is live on GitHub Pages: merge only finished versions into it
- Day-to-day work happens on `dev`
- Tag releases on `main` with annotated `vMAJOR.MINOR.PATCH` tags and a
  short description: MINOR for features or puzzles, PATCH for fixes,
  `v1.0` when the game is complete
