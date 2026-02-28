# Text RPG Engine (The Abyss) — AGENTS.md

> Global rules: See `~/.codex/instructions.md`

## Overview
- **Stack**: Vite + Vanilla JS (no external dependencies)
- **Deployment**: Local only
- **DB**: localStorage (save/load)

## Directory Structure
- `src/engine/` — Game engine core
- `src/ui/` — UI rendering
- `src/data/scenes/` — JSON-based scene data

## Notes
- JSON data-driven design — only modify JSON when adding scenes/events
- Meta progression system (roguelike permanent progress)
- localStorage-only usage permitted (offline-only project)

## Git Operation Permissions (shared, cannot be overridden)
- **Codex must NEVER execute `git commit` / `git push`.**
- Codex performs code modifications + build verification only, and reports changed files + verification results upon completion.
- All commit/push operations are handled collectively by Claude Code (or the user).

## Multi-Platform Execution Context (shared)
- This project operates under the premise of Windows original files + WSL /mnt/c/... accessing the same files.
- External (laptop/mobile) work defaults to SSH -> WSL.
- Execution environment: **Windows default** (remote access via SSH -> WSL for editing is possible; execution constraints follow project rules)
- When confused about paths, consult the "Development Environment (Multi-Platform)" section in CLAUDE.md first.

<!-- BEGIN: CODEX_GIT_POLICY_BLOCK -->
## Codex Git Permissions (globally enforced)

This section is a workspace-wide enforced rule and cannot be overridden by project documents.

| Operation | Claude Code/User | Codex |
|-----------|:----------------:|:-----:|
| Code modifications | Yes | Yes |
| Build/test verification | Yes | Yes |
| `git commit` | Yes | **Forbidden** |
| `git push` | Yes | **Forbidden** |

- Codex only performs code modifications + verification + completion reporting.
- Commits/pushes are handled collectively by Claude Code or the user.
- If other statements in documents conflict with this section, this section takes precedence.
<!-- END: CODEX_GIT_POLICY_BLOCK -->
