# Changelog

## [2026-02-21] System Stabilization/Operability Improvements (no story additions)

### Core Stabilization
- Replaced `Game.playScene` transition lock logic from timer-based (200ms) to `try/finally + queue` approach
  - Additional calls during transition queue the last `sceneId` for lossless sequential processing
- Removed **condition-unmet choice bypass execution** in dialogue scenes
  - Before: fallback choice's effect/nextScene could execute even when conditions were unmet
  - After: Safe return to hub (or start scene) + warning toast displayed
- Autosave failures now show an error toast instead of being silently ignored

### UI/Input Reliability
- Title slot load failure now immediately displays status message (`title-status`)
- Added menu bar manual save failure handling (`onSaveError` callback)
- Fixed continue button `disabled` class synchronization bug
- Strengthened global key input guards
  - `ChoiceButtons`, `CombatUI`, `DialogueBox` now ignore hidden/repeat/input-target cases
  - `ChoiceButtons.hide()` now reliably detaches keydown handler

### System Information Display Improvements
- Added progress summary to Map UI: `Unlocked X/Y · Purified X/Y`
- Locked zones now show unlock hint text (`unlockFlag` or config hints)
- Added summary info to Upgrade UI
  - Number of upgradeable stats, minimum cost, insufficient engrams display
- Added toast feedback on upgrade success

### Validation Automation
- Added `scripts/validate-scenes.mjs`
  - Validates duplicate IDs, broken references (next/victory), type/choices/rounds consistency
  - Condition-only scenes/unreachable scenes reported as warnings
- Added `npm run validate:scenes` script

### Notes
- This change is **system quality improvement only** — no story/content JSON expansions
- Existing save data format (version 1) is preserved

## [2026-02-11] Massive Content Expansion — 146 scenes -> 217 scenes (+71 scenes)

### Goal
- Playtime ~1 hour 45 min -> ~3 hours (thorough exploration basis)

### Chapter 1 Expansion (20->27 scenes)
- **ACT 1 +3 scenes**: Emotion pipeline demonstration (ch1_02b), engram/guide explanation (ch1_03b), the guide's memory (ch1_04b)
- **ACT 2 +4 exploration points**: Sleeping child spirit (ch1_child), graffiti wall (ch1_graffiti), queue (ch1_queue), weary spirit follow-up dialogue (ch1_weary_02)

### District A Expansion (19->35 scenes)
- **4 new explorations**: WhisperNet (whisper_net), Censorship Museum (museum), Sound Garden (sound_garden), Daughter's Room (daughter_room)
- **Soyeon companion quest 6 scenes**: Archives -> Editor-in-chief confrontation -> forgiveness/choice branch (soyeon_quest_*)

### District B Expansion (25->39 scenes)
- **4 new explorations**: Break room (breakroom), Server room (server_room), Floor 99 (floor99), Resistance group (resistance)
- **Minjun companion quest 6 scenes**: Server -> memory discovery -> destruction/code branch (minjun_quest_*)

### District C Expansion (17->33 scenes)
- **5 new explorations**: Crystal cave (crystal_trail), Playground (playground), Apt 707 (apt707), Mailbox (mailbox), Management office (management)
- **New combat**: Frost Drone (frost_drone) — candle special attack

### District D Expansion (21->31 scenes)
- **4 new explorations**: Mural (mural), Support group (support_group), Forge (forge), Old restaurant (old_restaurant)

### Hub Expansion (8->16 scenes)
- **Guide progress dialogue 4 stages**: Early/after A clear/after B clear/final (guide_progress -> guide_early/after_a/after_b/final)
- **3 freed soul NPCs**: District A (freed_soul_a), District B (freed_soul_b), District D chef stall (chef_stall, HP+10)

### Verification
- `npm run build` succeeded
- All 393 nextScene references valid (excluding 7 special tokens)
- Total 217 scenes, 12 combats

---

## [2026-02-11] Chapter 1: Rules of Platform 0

### Added
- **Chapter 1 story** (`chapter1.json`) — 20 scenes
  - ACT 1: Guide's Tent (5 scenes) — Abyss/district/memory/death lore exposition
  - ACT 2: Platform 0 Exploration (5 scenes) — Weary spirit, vending machine human, brick NPC dialogue
  - ACT 3: Classification Exam (8 scenes) — 3 non-combat exam questions + boss battle 2 rounds
  - ACT 4: Chapter End (2 scenes) — Gate opening + guide farewell
- **New enemy**: Classification Examiner (classification_examiner) — elite tier, threatLevel 2
- **Subway unlock condition**: Requires subway_unlocked flag in hub

### Changed
- Prologue (prologue_12) -> direct to hub changed to -> via Chapter 1 (ch1_01)
- Game.js: b1_pain -> chapter1 scene loading replaced

### Removed
- B1 Floor of Pain (`b1_pain.json`) — all 43 scenes removed (Corridor of Memories, Room of Tears, Path of Silence, Collector boss)

---

## [2026-02-11] Session: Polish Pass — 7-Stage UX/UI

### Completed
- **Mobile responsive**: CSS variables + 3-tier media queries (default/tablet<=820px/phone<=480px), all 5 CSS files fully responsive
- **Audio system**: AudioManager.js — HTMLAudioElement-based BGM (loop)/SFX (oneshot), graceful degradation when files are missing
- **Settings menu**: SettingsPanel.js — Text speed (10-80ms), BGM/SFX volume, global mute, autosave toggle, save slot deletion
- **Dialogue log**: DialogueLog.js — Max 50 entry scrollback, menu button + L key toggle, ESC close
- **Accessibility**: focus-visible global styles, aria-label/aria-live/role="dialog" (MenuBar, ChoiceButtons, CombatUI, TitleScreen, InventoryPanel, CompanionPanel, Toast)
- **Autosave indicator**: save-pulse animation (displayed for 1.5s on save)
- **Scene transition effects**: 2-stage overlay (fade in -> background swap -> fade out), 3 types (fade=black 300ms, combat=red 150ms, glitch=stripe 150ms)
- **Menu bar expansion**: 6 buttons + save indicator

### Next Session
- Expand to 10 companions (add JSON after user character setup)
- Image integration (portraits/backgrounds/sprites)
- Audio file additions (public/audio/bgm/, public/audio/sfx/)
- Balancing (DC adjustments, engram acquisition rates)

---

## [2026-02-11] Session: Engine Infrastructure Reinforcement

### Completed
- Companion system expansion: Skill data (characters.json), charge management (StateManager), portrait UI (CompanionPanel)
- enemies.json combat stat structure: 12 enemies with tier/rewards/threatLevel + CombatUI threat level badges
- Item multi-effect support + 3 new items (Engram Crystal, Purification Incense, Abyssal Spring Water)
- Ending-specific meta rewards: 4 permanent perks + TitleScreen reached/not-reached display + hasReachedEnding condition
- CHANGELOG recovery: Restored v0.4.0~v0.8.0 5 version entries
- Map UI improvement: Subway route map style (CSS circle markers, hover glow, purified/locked badges)
- Combat UI effects enhancement: Dice deceleration chain, success/failure glow, damage popup, HP flash
- Companion skill combat integration: DC modifier toggle, charge consumption, skill bar UI

---

## [0.8.0] - 2026-02-10

### Boss Battles + 4 Endings + Ending Meta + Portraits
Main story line complete — Purify 4 districts -> Terminal -> Server Room -> 4 endings.

### Added
- **Terminal** (`terminal.json`) — 7 scenes
  - 4-card authentication gate -> Station Master dialogue/negotiation
  - Station Master boss battle: 3 rounds (Ghost Train/Time Stop/Final Train)
- **Server Room** (`core.json`) — 8 scenes
  - Central-bound train -> Server room entry -> Mayor dialogue 3 stages
  - Mayor final boss battle: 4 rounds (Data Stream/Gravity/Emotion Deletion/Format)
- **4 Endings** (`ending.json`) — 5 scenes
  - Return to Zero (bittersweet) / The Stranger (hopeful) / Sacrifice (tragic) / Remain (peaceful)
- **Ending meta tracking**: MetaProgression records ending completion, TitleScreen shows ending collection status
- **Character portrait system**: Portrait display on left side of DialogueBox (gradient overlay)
- 2 characters added (Station Master, Mayor), 2 enemy types added (Station Master, Mayor)
- Title: "The Abyss"

### Changed
- Hub: Added terminal entry choice when 4 cards collected
- `gameConfig.json`: Version 0.8.0
- `Game.js`: Scene transition debounce fixed to 200ms (resolved permanent lock bug)

## [0.7.0] - 2026-02-10

### 4 District Content Complete

### Added
- **District A: The Silent Mansions** (`district_a.json`) — ~25 scenes
  - Soyeon recruitment, Censorship Drone combat, Librarian boss battle
- **District B: The Iron Offices** (`district_b.json`) — ~25 scenes
  - Minjun recruitment, Ticket Inspector combat, Foreman boss battle
- **District C: The Frozen Apartments** (`district_c.json`) — ~18 scenes
  - Building 203 family, Crying Girl, Curator boss battle
- **District D: The Red District** (`district_d.json`) — ~20 scenes
  - Fight Club, Furnace Club, Chef boss battle
- 16 characters, 10 enemy types, 17 items
- District unlock: A/B clear -> C unlock, C clear -> D unlock

### Changed
- Hub expanded to 9 scenes (vending machine shop, NPCs)
- B1 -> Hub story connection

### Fixed
- ChoiceButtons keyboard handler leak fix
- Scene transition lock bug fix

## [0.6.0] - 2026-02-10

### Game Systems Complete — Map/Upgrade/Companion/Hub
Engine complete — just add story JSON to play.

### Added
- **MapUI**: Subway route map (4 administrative districts, locked/unlocked/purified states)
- **UpgradeUI**: Stat enhancement with engrams (cost = current value x 10)
- **CompanionPanel**: Companion list, trust bar, skills, permadeath display
- Hub scenes: Platform 0 tent city (move/upgrade/rest/explore)
- Special scene IDs: `__map__`, `__upgrade__`, `__rest__`, `__hub__`
- SceneManager: companionAlive, companionTrustGreaterThan conditions
- SceneManager: fullHeal, modifyCompanionTrust, killCompanion effects
- StateManager: Companion trust/death methods
- `gameConfig.json`: 4 district data + hubScene setting
- `systems.css` new (map/upgrade/companion/hub/toast styles)

## [0.5.0] - 2026-02-09

### Combat UI Enhancement + Test Mode

### Added
- Dice roll animation (number spin -> settle -> result reveal)
- Difficulty labels on choices (Easy/Normal/Hard/Extreme) + success probability (%) display
- In-combat HP mini bar + round display (1/3)
- Screen shake on damage, enemy hit flash on success
- Difficulty color coding (green/yellow/red/purple)
- Added 'Combat Test' button to title (3 rounds, 4 stats, light/dark choices)
- `docs/the_abyss_gdd_v2.md` design document

## [0.4.0] - 2026-02-09

### Combat System Complete Overhaul — GDD v2
Turn-based ATK/DEF combat replaced entirely with d6+stat>=DC check system.

### Changed
- **Combat**: Turn-based ATK/DEF -> d6+stat>=DC check + choice-based
- **Stats**: HP/MP/ATK/DEF/SPD -> HP 20 + Body/Sense/Reason/Bond (1~5)
- Karma gauge (-100~+100), Engrams (growth resource)
- 10 real-world memories (lost on death, 0 = bricked game over)
- Death -> revive on the spot
- Combat rounds added (Shadow 1R, Collector 3R)

### Added
- `docs/DESIGN.md` (GDD v2 original)

## [0.3.0] - 2026-02-09

### Setting Overhaul: "The Abyss"
Replaced all existing demo story (office worker Kim/Manager Park).
A philosophical text RPG inspired by Planescape: Torment.

**Core question**: "What does it take for a person to change?"

### Added
- **Prologue** (`prologue.json`) — 8 scenes
  - Abandoned station awakening -> memo discovery -> guide encounter -> abyss entry
  - Run-based branching: Run 1 vs Run 2+ memo content/guide dialogue changes
  - Run 2+ guide recognition route (permanent speed bonus)

- **B1 Floor of Pain** (`b1_pain.json`) — 28 scenes
  - 3-way route selection:
    - **Corridor of Memories**: Face/avert past memories, Shadow Self combat
    - **Room of Tears**: Lost One NPC (help/accompany/ignore), companion acquisition possible
    - **Path of Silence**: Emptiness of a painless world, Voice in the Mirror (B3 foreshadowing)
  - Run 2+ Path of Silence hidden branch
  - **Boss: The Pain Collector** — 3 resolution methods:
    - Combat: Difficult battle (HP 150, ATK 18)
    - Dialogue: Requires specific flag combination (empathy route)
    - Submit: Permanent stat loss (maxHp, attack)

- **6 character types**: Guide, Memo, Lost One, Collector, Voice in the Mirror, Protagonist
- **2 enemy types**: Shadow Self (normal), Pain Collector (boss)
- **5 item types**: Old Memo, Faded Photo, Painkiller, Bitter Water, Memory Fragment
- **7 background CSS types**: Abyss void, abandoned station, corridor of memories, room of tears, path of silence, central hall, boss battle

### Changed
- `gameConfig.json`: Title "The Abyss", stats lowered (HP 80, ATK 7)
- `Game.js`: demo.json -> prologue.json + b1_pain.json loading

### Removed
- `demo.json` (old office worker story)
- Old character/item/enemy data (Kim, Manager Park, etc.)
- Old background CSS (street, subway, office, etc.)

## [0.2.0] - 2026-02-08

### Added
- **Roguelike Meta Progression**
  - `MetaProgression`: Permanent progress management (run count, death count, unlocks, perks, permanent stat bonuses)
  - Automatic permanent rewards on death (HP +5, 3 deaths: attack +2, 5 deaths: defense +2)
  - `DeathScreen`: Death screen UI (achievement display + permanent rewards + restart)
  - Combat defeat -> DeathScreen -> new run automatic flow

- **Meta Conditions/Effects (SceneManager)**
  - Conditions: `runGreaterThan`, `hasUnlock`, `hasPerk`, `deathCountGreaterThan`
  - Effects: `unlock`, `addPerk`, `addPermanentBonus`

- **Title Screen Expansion**
  - Run info display (Run #N, death count, victory count)
  - Perk list view button + permanent bonus summary

- **Demo Scene Expansion**
  - "Deja Vu route" opens from Run 2+ (hidden choices)
  - "Negotiation route" opens from Run 3+ (resolve without combat)
  - Special choice at 5 deaths (attack boost)
  - `__death__` special scene support

### Changed
- `StateManager.reset()` -> `reset(metaBonuses)` expansion (applies permanent bonuses)
- `SceneManager` constructor now includes metaProgression reference
- `SaveLoadSystem` save data now includes run number
- Combat defeat now routes through DeathScreen instead of defeatScene

## [0.1.0] - 2026-02-08

### Added
- **Engine Core**
  - `StateManager`: Player stats/inventory/flag management + event subscription system
  - `SceneManager`: JSON scene loading, condition evaluation (hasFlag/hasItem/statGreaterThan), effect application
  - `DialogueRenderer`: Character-by-character typing effect + skip functionality
  - `CombatSystem`: Turn-based combat (attack/power attack/item/flee), damage calculation, enemy AI, reward system
  - `SaveLoadSystem`: localStorage 3-slot save/load + autosave

- **UI Modules**
  - `TitleScreen`: New Game / Continue / Save slot selection
  - `DialogueBox`: Speaker name + typing text + click/keyboard progression
  - `ChoiceButtons`: Choices (disabled when conditions unmet, keyboard shortcuts 1~9)
  - `StatsPanel`: HP/MP/EXP bars + level/gold real-time display
  - `CombatUI`: Enemy sprite + HP bar + action buttons + combat log
  - `InventoryPanel`: Item list/use (consumable items only)
  - `MenuBar`: Inventory/save/title buttons

- **Demo Content** (for engine verification)
  - 12 scenes: Intro -> app selection branch -> office -> combat -> 3 endings
  - 5 characters, 5 item types, 1 enemy type

- **CSS Pixel Art Style**
  - Retro color palette, DotGothic16 font
  - 8 backgrounds (street/subway/office/combat/ending, etc.)
  - Animations: typing, fade, shake, pop, level-up flash

- **Project Setup**
  - Vite + Vanilla JS configuration
  - CLAUDE.md, CHANGELOG.md
