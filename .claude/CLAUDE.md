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
- Before merging into `main`, run `git pull --ff-only` on it. After
  merging, push straight away. Local and GitHub `main` should never
  diverge
- Tag releases on `main` with annotated `vMAJOR.MINOR.PATCH` tags and a
  short description: MINOR for features or puzzles, PATCH for fixes,
  `v1.0` when the game is complete. Docs or chore-only merges get no tag
- Never add a version tag on my own: suggest the version and message,
  and add it only after the user approves

## Non-version tags

- Only three types: `Feature`, `Known-good`, `Checkpoint`
- Name: `<Type>-<N>`, where N counts up per type (`Feature-1`,
  `Feature-2`, ...). Find the next N with `git tag -l "<Type>-*"`
- Always annotated: `git tag -a <Type>-<N> -m "<why>"`
- Message: why this commit is tagged, based on its changes, in 5 words
  or fewer
- Most commits get no tag (small fixes, tweaks, docs, chores)
- Never add a tag on my own: suggest the tag name and message, and add
  it only after the user approves
- When to suggest each:
  - `Feature`: a commit finishes a puzzle or feature, so it's playable
    start to end (not partial work), e.g. `Feature-3` with
    `-m "Add moss tree puzzle"`
  - `Known-good`: the user confirms something works after testing it,
    e.g. `Known-good-2` with `-m "Mobile layout works"`
  - `Checkpoint`: right before a risky change (refactor across several
    files, rewrite of a system, rebase), suggested before the first
    edit, e.g. `Checkpoint-1` with `-m "Before renderer rewrite"`
- Tags are permanent: never move or delete them
- Push tags along with their commits (`git push --follow-tags`), so
  they show on GitHub and stay on those commits after merging into
  `main`
