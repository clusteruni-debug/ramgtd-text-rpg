# Text RPG — CC/CX File Ownership

| Area | File/Directory | Owner | Rationale |
|------|---------------|:-----:|-----------|
| Game Core | src/Game.js | CC | Orchestrator |
| Engine Systems | src/engine/* | CC | Core logic (combat, scenes, state) |
| UI Components | src/ui/* | CX | Display layer |
| Content Data | src/data/** (JSON) | CX | Story/item/enemy data |
| Styles | src/styles/* | CX | CSS |
