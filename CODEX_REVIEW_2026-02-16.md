# Codex Review Report

- Project: `text-rpg`
- Reviewer: `Codex (GPT-5 coding agent)`
- Date: `2026-02-16`
- Scope: Static runtime-risk review (game engine + UI flow)

## Findings

### 1) [High] Dialogue can hard-lock when all choices are unavailable

- Files:
  - `src/engine/SceneManager.js:267`
  - `src/engine/SceneManager.js:271`
  - `src/Game.js:429`
  - `src/Game.js:431`
  - `src/Game.js:452`
  - `src/ui/ChoiceButtons.js:45`
  - `src/ui/ChoiceButtons.js:47`
  - `src/ui/ChoiceButtons.js:31`
- Observation:
  - `getAvailableChoices` returns all choices with `available` flag.
  - `Game._playDialogueScene` checks only `choices.length`, not number of available choices.
  - `ChoiceButtons` disables unavailable buttons and only resolves promise on available click.
- Impact:
  - If a scene has choices but all are unavailable, promise never resolves and game flow can freeze.
- Recommended fix:
  - Before calling `showChoices`, filter available options and handle zero-available case (fallback scene or explicit fail-safe choice).

### 2) [Medium] Global keydown listeners are added with anonymous callbacks and never explicitly removed

- Files:
  - `src/ui/DialogueBox.js:55`
  - `src/ui/DialogueLog.js:40`
- Observation:
  - Document-level listeners are created via inline anonymous functions.
  - No teardown method exists to remove these listeners.
- Impact:
  - In multi-instance/HMR scenarios, duplicate key handlers can accumulate and produce duplicate actions.
- Recommended fix:
  - Store handler references on instance (`this._keyHandler`) and remove them in a `destroy()` lifecycle.

### 3) [Low] App root element is not validated before game initialization

- Files:
  - `src/main.js:13`
  - `src/main.js:14`
- Observation:
  - `new Game(app)` is called immediately after `querySelector('#app')` without null guard.
- Impact:
  - If mount element is missing/misnamed, startup fails with less clear runtime error.
- Recommended fix:
  - Add explicit null check and fail-fast message.

## Validation Notes

- `npm run build` could not complete in this environment due `spawn EPERM` (esbuild process spawn), so full build verification was not possible here.
