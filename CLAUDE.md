# Text RPG Engine

## Stack
Vite + Vanilla JS (no external dependencies)

## Running
```bash
npm run dev      # Dev server
npm run build    # Build
```

## Structure
```
src/
├── Game.js              # Main game class (module orchestrator, ~675 lines)
├── engine/
│   ├── StateManager.js
│   ├── SceneManager.js
│   ├── CombatSystem.js
│   ├── DialogueRenderer.js
│   ├── SaveLoadSystem.js
│   ├── MetaProgression.js
│   ├── AudioManager.js
│   └── DeathHandler.js      # Death handling logic (extracted from Game.js)
├── ui/
│   ├── CombatUI.js          # Combat UI main
│   ├── combatConstants.js   # Combat UI constants (extracted from CombatUI)
│   ├── combatRenderers.js   # Combat UI rendering helpers (extracted from CombatUI)
│   ├── DialogueBox.js, ChoiceButtons.js, StatsPanel.js
│   ├── MapUI.js, UpgradeUI.js, CompanionPanel.js
│   ├── TitleScreen.js, DeathScreen.js, MenuBar.js
│   ├── InventoryPanel.js, SettingsPanel.js, DialogueLog.js
│   └── ...
├── data/
│   ├── scenes/              # Scene JSON files
│   ├── testCombat.js        # Combat test data (extracted from Game.js)
│   ├── characters.json, items.json, enemies.json, gameConfig.json
│   └── ...
├── utils/helpers.js
└── styles/
    ├── main.css             # :root variables, reset, common styles
    ├── backgrounds.css      # Background gradients/images (extracted from main.css)
    ├── stats-panel.css      # Stat bars + stat panel (extracted from main.css)
    ├── dialogue.css         # Dialogue box + choices
    ├── title.css            # Title screen (extracted from dialogue.css)
    ├── save.css             # Save slots/dialog (extracted from dialogue.css)
    ├── menu-bar.css         # Menu bar (extracted from dialogue.css)
    ├── perks.css            # Perks panel (extracted from dialogue.css)
    ├── combat.css           # Barrel: combat-layout + combat-animations + death
    ├── combat-layout.css    # Combat layout/choices/results (extracted from combat.css)
    ├── combat-animations.css # Dice/damage animations (extracted from combat.css)
    ├── death.css            # Death screen (extracted from combat.css)
    ├── animations.css       # Common animations + inventory + toast + scene transitions
    ├── systems.css          # Barrel: map + upgrade + companion + hub + rest + dialogue-log + settings
    ├── map.css              # Map UI (extracted from systems.css)
    ├── upgrade.css          # Upgrade UI (extracted from systems.css)
    ├── companion.css        # Companion panel (extracted from systems.css)
    ├── hub.css              # Hub menu (extracted from systems.css)
    ├── rest.css             # Rest screen (extracted from systems.css)
    ├── dialogue-log.css     # Dialogue log (extracted from systems.css)
    └── settings.css         # Settings panel (extracted from systems.css)
```

## Scene JSON Schema (core)
```json
{
  "id": "scene_id",
  "type": "dialogue | combat | ending",
  "speaker": "character_id",
  "text": "Dialogue line",
  "choices": [{
    "text": "Choice text",
    "conditions": [{ "type": "hasFlag", "flag": "key" }],
    "effects": [{ "type": "modifyStat", "stat": "hp", "value": -10 }],
    "nextScene": "next_id"
  }]
}
```

## Special Scene IDs
`__title__`, `__death__`, `__map__`, `__upgrade__`, `__rest__`, `__hub__`

## Project-Specific Rules
- Game design: docs/DESIGN.md is the authority (combat/stats/karma values)
- Maintain separation between engine code and data (JSON)
- New stories: Add JSON files to src/data/scenes/

## Current Status
- Latest: v0.9.0 polish pass (mobile/audio/settings/dialogue log/accessibility/scene transitions)
- Next: Expand to 10 companions, add image/audio files, balancing

## References
- CC/CX file ownership: agent_docs/domain-map.md
