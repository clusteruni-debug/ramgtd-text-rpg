# The Abyss (심연) — Complete Art Bible & Image Prompt Guide

> **Single source of truth** for all visual asset production.
> Every prompt is copy-pasteable into Midjourney v6 / DALL-E 3 / Stable Diffusion.
> Last updated: 2026-03-16

---

## Table of Contents

1. [Style Guide & Art Direction](#1-style-guide--art-direction)
2. [Enemy Sprites (14)](#2-enemy-sprites)
3. [UI Frame Assets](#3-ui-frame-assets)
4. [UI Icons (24)](#4-ui-icons)
5. [Texture Overlays (7)](#5-texture-overlays)
6. [Background Art (36)](#6-background-art)
7. [Effect Sprites](#7-effect-sprites)
8. [Character Portraits (26)](#8-character-portraits)
9. [Batch Generation Workflow](#9-batch-generation-workflow)

---

## 1. Style Guide & Art Direction

### 1-1. Core Aesthetic

**One-line pitch:** "Disco Elysium meets Korean subway horror through the lens of bureaucratic dystopia."

The Abyss is an underground industrial city that processes dead souls' emotions. It is not fantasy — it is modern Korea pushed through a nightmare filter. Every visual must feel simultaneously **familiar** (apartments, offices, subways) and **deeply wrong** (sewn mouths, frozen corpses, buildings that move like pistons).

**Art pillars:**
- **Liminal horror** — Backrooms, empty stations at 3 AM, fluorescent lights that hum wrong
- **Bureaucratic dystopia** — Paperwork for the damned, employee ID badges on corpses, vending machines in hell
- **Korean urban vernacular** — Corridor-style apartments (복도식 아파트), pojangmacha tents, gosiwon rooms, subway platform screen doors
- **Industrial machinery** — Pipes, presses, furnaces, cooling systems — the city IS the machine

**Things to AVOID across all assets:**
- Bright, saturated cartoon colors
- Cute / chibi / anime-moe aesthetic
- High-fantasy elements (dragons, elves, magic circles)
- Clean, polished sci-fi (this is grimy, worn, stained)
- Photorealistic human faces (portraits should be painterly / semi-abstract)

### 1-2. Color Palettes by District

Each district has a strict color identity. All assets set in a district must use that palette.

| District | Primary | Secondary | Accent | Mood |
|----------|---------|-----------|--------|------|
| **Hub (Platform 0)** | `#1a1a1a` charcoal | `#2d1f0f` warm brown | `#e8a84c` amber | Only warmth in the game |
| **A — Silent Mansions** | `#1a0e2e` midnight purple | `#3d2b65` dusty lavender | `#6b5b95` muted violet | Oppressive quiet, old library |
| **B — Iron Offices** | `#151f23` steel grey | `#2a3a1f` industrial green | `#8a9a5b` sickly olive | Exhaustion, fluorescent buzz |
| **C — Frozen Apartments** | `#0a1a2a` deep ice blue | `#1a3a4a` frozen teal | `#4e9af5` frost blue | Stillness, loneliness, cold |
| **D — Red District** | `#2d0a0f` dark crimson | `#4a1015` dried blood | `#e94560` neon red | Rage, fire, chaos |
| **Terminal** | `#c0c8d0` clinical white | `#808890` steel | `#ffd700` gold | Uncanny cleanliness |
| **Core** | `#0a0515` void purple | `#1a1a3a` deep indigo | `#9b59b6` data purple | Digital, godlike, alien |

### 1-3. Technical Specifications

| Asset Type | Resolution | Format | Background |
|------------|-----------|--------|------------|
| Enemy sprites (minion/elite) | 128x128 | PNG | Transparent |
| Enemy sprites (boss) | 256x256 | PNG | Transparent |
| UI frames | Varies (see each) | PNG | Transparent |
| UI icons | 32x32 | PNG | Transparent |
| Texture overlays | 256x256 (tileable) | PNG | Transparent |
| Background art | 1920x1080 | JPG | Opaque |
| Character portraits | 512x512 (crop to fit) | JPG/PNG | Dark vignette |
| Effect spritesheets | Varies | PNG | Transparent |

### 1-4. Naming Convention

```
public/images/
├── enemies/       enemy_{enemy_id}.png
├── bg/            bg-{scene-name}.jpg
├── characters/    {character_id}.jpg or .png
├── ui/
│   ├── frames/    frame-{element}-{variant}.png
│   ├── icons/     icon-{name}.png
│   ├── textures/  tex-{name}.png
│   └── effects/   fx-{name}.png
```

### 1-5. Global Style Suffixes

Append these to ALL prompts as appropriate:

**Positive (apply to all):**
```
dark atmospheric art, muted desaturated palette, Korean urban horror aesthetic, liminal space, industrial decay, worn textures, subtle grain, dramatic chiaroscuro lighting
```

**Negative (apply to all):**
```
cute, chibi, bright colors, anime, cartoon, 3D render, happy, colorful, clean, polished, photorealistic face, fantasy magic, dragons, elves, watermark, text, logo, blurry, low quality
```

---

## 2. Enemy Sprites

14 total: 4 minions, 3 elites, 6 bosses, 1 final boss.
All sprites are portrait-oriented with transparent background.
CSS fallback sprites already exist in `enemy-sprites.css`; these PNG files override them.

### 2-1. Minions (128x128, transparent PNG)

#### shadow_self — The Shadow Self (그림자 자아)
```
Dark pixel art portrait of a shadow doppelganger office worker, wearing a grey suit identical to the player character, face is completely blank — smooth featureless surface like polished stone, holding a battered briefcase that leaks faint white light from the seams, slightly transparent ghostly appearance with visible static distortion lines, the outline shimmers and glitches like a broken monitor, 128x128 pixel art sprite, limited palette of grey purple and black, dim backlight casting long shadow, transparent background
```
**Negative:** `cute, detailed face, colorful, bright, realistic, 3D, happy expression`

**File:** `public/images/enemies/enemy_shadow_self.png`

---

#### necktie_zombie — Necktie Zombie (넥타이 좀비)
```
Dark pixel art of a dead Korean office worker zombie, hunched posture leaning forward as if still commuting, wearing crumpled grey suit with loosened red necktie that drags on the ground like a leash, carrying a battered leather briefcase as weapon raised overhead, barcode printed where eyes should be, skin is grey-blue with visible veins, dark circles under empty eye sockets, exhausted undead salaryman who died at his desk, 128x128 pixel art sprite, muted corporate colors of grey blue and dull red, overhead fluorescent lighting, transparent background
```
**Negative:** `cute, colorful suit, happy, clean clothes, bright colors, anime`

**File:** `public/images/enemies/enemy_necktie_zombie.png`

---

#### censor_drone — Censorship Drone (검열 드론)
```
Dark pixel art of a floating censorship patrol drone, octagonal mechanical body with brushed chrome finish and visible rivets, central camera eye glows deep red like a surveillance light, small tattered banner hanging below reading "정숙" (SILENCE) in Korean, speaker arrays on both sides emitting faint purple sound waves, antenna arrays on top with blinking warning light, narrow searchlight beam projecting downward, 128x128 pixel art sprite, color palette of grey purple and warning red, cold industrial lighting from above, transparent background
```
**Negative:** `cute robot, friendly, bright colors, cartoon, rounded edges, happy`

**File:** `public/images/enemies/enemy_censor_drone.png`

---

#### frost_drone — Cryo Drone (냉각 드론)
```
Dark pixel art of a cryogenic freezing drone, spherical body encased in thick frost and ice crystals, blue-white cooling nozzles extending from three sides emitting white vapor clouds, heat-sensor eye in center glowing angry red contrasting with blue body, icicles hanging from the bottom dripping frozen condensation, frost trail behind it, small hazard warning symbol on hull, 128x128 pixel art sprite, ice blue and white palette with dark background showing through, cold blue ambient lighting, transparent background
```
**Negative:** `warm colors, fire, cute, friendly, bright, cartoon, sunny`

**File:** `public/images/enemies/enemy_frost_drone.png`

---

#### rage_fighter — Rage Fighter (분노의 투사)
```
Dark pixel art of a rage-consumed fighter spirit, humanoid figure with flames erupting from cracks across the entire body like lava through rock, bandaged fists raised in aggressive boxing stance, eyes are pure red-orange light with no pupils, fire creates a wild aggressive silhouette that shifts and flickers, deep scars and burn marks visible on exposed skin, bare-chested arena fighter wearing torn pants, veins glow orange like molten metal, 128x128 pixel art sprite, orange red and black palette, dramatic fire underlighting casting upward shadows, transparent background
```
**Negative:** `calm, peaceful, blue, cold, cute, happy, clean skin, armor`

**File:** `public/images/enemies/enemy_rage_fighter.png`

---

### 2-2. Elites (128x128, transparent PNG)

#### ticket_inspector_enemy — Ticket Inspector (검표원)
```
Dark pixel art portrait of a subway ticket inspector monster, head replaced by a large CCTV surveillance camera with a single glowing red lens that tracks the viewer, wearing a worn dark blue railway uniform with tarnished brass buttons, one hand holds a cracked digital tablet displaying red "VIOLATION" error text in Korean, other hand holds a metal barrier rod as a weapon, mechanical joints visible at neck where camera meets body, faint red scanning beam projecting from camera lens, 128x128 pixel art sprite, limited palette of red black and steel grey, dramatic top-down fluorescent lighting, transparent background
```
**Negative:** `friendly, human face, cute, bright uniform, clean, modern, happy`

**File:** `public/images/enemies/enemy_ticket_inspector_enemy.png`

---

#### classification_examiner — Classification Examiner (분류 심사관)
```
Dark pixel art of a holographic classification examiner entity, faceless figure wearing a pristine black suit, entire body is made of translucent red-pink holographic data with visible horizontal scan lines, "CLASSIFY" badge glowing on chest, both hands emit red energy scanning beams, floating above ground with no legs — lower body dissolves into data particles, glitching hologram effect with RGB color separation at edges, data corruption artifacts around the outline, 128x128 pixel art sprite, red and dark blue palette with white data line accents, holographic glow lighting from within, transparent background
```
**Negative:** `solid body, human face, cute, bright, friendly, cartoon, opaque`

**File:** `public/images/enemies/enemy_classification_examiner.png`

---

#### pain_collector — Pain Collector (고통의 수집가)
```
Dark pixel art of a pain collector entity, amorphous dark red organic mass shaped like a hunched figure, surface covered in dozens of human eyes of different sizes — each eye showing a different expression of pain and anguish, three tentacle-like arms reaching outward with grasping hands, glowing sickly yellow core pulsing in the center like a beating heart of collected suffering, dripping dark viscous fluid, Lovecraftian body horror aesthetic, 128x128 pixel art sprite, deep red crimson and black palette with yellow core accent, internal glow lighting emanating from the core, transparent background
```
**Negative:** `cute, one eye, cartoon, bright, friendly, clean, geometric, happy`

**File:** `public/images/enemies/enemy_pain_collector.png`

---

### 2-3. Bosses (256x256, transparent PNG)

#### librarian — The Librarian (사서) — District A Boss
```
Dark pixel art boss portrait of the Librarian, floating ethereal figure visible from waist up, mouth sewn shut with thick black wire in visible X-pattern stitches, wearing torn archivist robes in deep purple and black, lower body dissolves into hundreds of floating loose book pages that orbit around the figure, trails of black ink streaming from both eyes like tears, hands raised with fingers extended — each finger trails ink that forms Korean text in the air, surrounded by orbiting blank white books with their spines cracked open, regal and tragic presence, 256x256 pixel art sprite, purple black and white palette, ethereal purple glow emanating from within the robes, transparent background
```
**Negative:** `happy, mouth open, cute, bright, modern clothes, anime, solid lower body`

**File:** `public/images/enemies/enemy_librarian.png`

---

#### foreman — The Foreman (현장 소장) — District B Boss
```
Dark pixel art boss portrait of the Foreman, upper body is an exhausted Korean man in a stained factory supervisor vest, a blood-red necktie dug deep into his neck cutting into the flesh, lower body has merged with a massive industrial hydraulic press machine — pistons and gears replacing his legs, mechanical press arms extend from his sides dripping a mixture of oil and blood, barcode tattoo across both eyes replacing normal vision, exposed pipes and gears visible in the torso transition zone, factory steam rising from joints, 256x256 pixel art sprite, industrial green brown and steel grey palette, harsh overhead industrial strip lighting, transparent background
```
**Negative:** `clean, healthy, happy, cute, fantasy armor, bright, modern office`

**File:** `public/images/enemies/enemy_foreman.png`

---

#### curator — The Curator (동면 관리자) — District C Boss
```
Dark pixel art boss portrait of the Cryogenic Curator, upper body of a thin man wearing torn hospital pajamas covered in spreading white frost, lower body permanently connected to a massive tangle of blue cooling pipes and cryogenic tubes, bright blue glowing eyes that emit visible cold vapor, skin surface covered in intricate white frost crystal patterns like frozen tears, ice forming at the corners of eyes and dripping downward frozen mid-fall, sitting on a throne constructed of intertwined frozen pipes, cryo-pod silhouettes visible in the dark background behind, the saddest and most pitiful of all bosses, 256x256 pixel art sprite, ice blue and white palette against deep dark blue background, cold blue ambient glow with frost particle effects, transparent background
```
**Negative:** `warm, fire, happy, healthy skin, cute, bright, red, comfortable`

**File:** `public/images/enemies/enemy_curator.png`

---

#### chef — The Chef (주방장) — District D Boss
```
Dark pixel art boss portrait of the Chef boss, wearing a traditional tall white chef hat (toque) that is entirely engulfed in roaring orange flames — the flames form a crown shape, severe burn scars covering both hands and forearms up to the elbows, wielding an oversized blackened cast-iron frying pan in one hand dripping with bubbling hot oil, chef coat once white now stained with soot grease and char marks, fire surrounding the entire figure in a halo of rage, manic wide grin visible through the heat distortion — teeth clenched, destroyed commercial kitchen turned furnace visible as faint shapes in the background glow, 256x256 pixel art sprite, fire orange vermillion red and charcoal black palette, dramatic fire underlighting casting harsh upward shadows, transparent background
```
**Negative:** `clean kitchen, happy cooking, cute, blue, cold, modern, friendly smile`

**File:** `public/images/enemies/enemy_chef.png`

---

#### station_master — The Station Master (역장) — Mid-Boss
```
Dark pixel art boss portrait of the Station Master, face replaced by a functioning analog clock — hour and minute hands serve as eyes that rotate mechanically, wearing an ornate black vintage railway conductor uniform with double rows of polished gold buttons and gold braided trim on shoulders, one hand holds a brass whistle emitting wisps of cold ghostly vapor, ghost trains visible as transparent blue afterimages rushing past behind the figure, multiple pocket watch chains hanging from vest pockets catching the light, unnervingly precise and rigid military posture, subway tracks radiating outward from beneath the figure's feet into darkness, 256x256 pixel art sprite, gold black and grey palette with warm timepiece glow, golden light emanating from the clock face, transparent background
```
**Negative:** `modern uniform, digital clock, cute, casual, friendly, bright station, cartoon`

**File:** `public/images/enemies/enemy_station_master.png`

---

#### mayor — The Mayor (시장) — Final Boss
```
Dark pixel art final boss portrait of the Mayor of the Abyss, seated on a massive humming server rack throne covered in blinking LED lights, face replaced by a cracked LCD monitor screen displaying cascading data streams and red error codes and fragmented images of trapped souls, thousands of black cables connecting from the body upward into darkness above like puppet strings in reverse, wearing a formal dark suit but the body is visibly merging with the machine — skin transitions to circuit board patterns at the edges, the faintest ghost of a human face barely visible beneath the cracked screen surface, smaller floating monitoring screens orbit the figure showing surveillance feeds of each district, the most powerful and alien presence in the game, 256x256 pixel art sprite, deep purple digital blue and white data accent palette, ominous purple server room glow with intermittent screen flicker, transparent background
```
**Negative:** `human face, friendly, cute, small, weak, bright room, simple, cartoon`

**File:** `public/images/enemies/enemy_mayor.png`

---

## 3. UI Frame Assets

Decorative transparent PNG overlays for CSS elements. These add physical texture to the game's interface.

### 3-1. Dialogue Box Frame (960x220, transparent PNG)

**Base variant:**
```
Ornamental UI frame border for a dialogue box, 960x220 pixels, rectangular with slightly rounded corners, made of worn dark metal with visible rivets and bolts, concrete-like texture along the edges, subtle rust stains and scratches, thin inner border line of dull amber, the interior is completely transparent/empty, industrial dystopian aesthetic matching a Korean underground city, dark steel grey with hints of warm amber at corners, no text, no characters, game UI element, transparent background, flat design with subtle depth
```
**File:** `public/images/ui/frames/frame-dialogue-base.png`

**District A variant (ink-stained):**
```
Ornamental UI frame border for a dialogue box, 960x220, worn dark metal frame with dried black ink stains dripping down from the top edge, faded purple tint to the metal, small "정숙" (silence) stamp faintly visible in one corner, dried paper scraps caught in the rivets, library-prison aesthetic, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-dialogue-a.png`

**District B variant (industrial rivets):**
```
Ornamental UI frame border for a dialogue box, 960x220, heavy industrial steel frame with prominent hex bolts and reinforced corner brackets, oil stains and grease marks along edges, faint green-grey industrial tint, small barcode label in corner, factory press aesthetic, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-dialogue-b.png`

**District C variant (frost crystals):**
```
Ornamental UI frame border for a dialogue box, 960x220, dark metal frame encrusted with frost and ice crystals growing inward from the edges, frozen condensation droplets on the surface, blue-white ice tint, icicles hanging from bottom edge, cold vapor wisps at corners, frozen apartment aesthetic, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-dialogue-c.png`

**District D variant (burn marks):**
```
Ornamental UI frame border for a dialogue box, 960x220, dark metal frame with scorch marks and heat discoloration, edges warped slightly from extreme heat, embers and tiny flame licks at corners, deep red-orange tint to the burns, molten metal drips frozen mid-fall, furnace club aesthetic, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-dialogue-d.png`

**Terminal variant (clock gears):**
```
Ornamental UI frame border for a dialogue box, 960x220, polished brass and dark steel frame with visible clockwork gear mechanisms at each corner, small clock faces embedded in the frame showing different times, precise engraved tick marks along edges like a ruler, gold accent lines, railway station aesthetic, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-dialogue-terminal.png`

**Core variant (circuit board):**
```
Ornamental UI frame border for a dialogue box, 960x220, dark frame with visible circuit board trace patterns running along edges, small LED-like dots at connection points glowing purple, data stream lines flowing through channels, cracked LCD panel texture in corners, server room aesthetic, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-dialogue-core.png`

---

### 3-2. Combat Frame (800x600, transparent PNG)

**Standard:**
```
Ornamental UI frame border for a combat screen, 800x600 pixels, rectangular dark metal frame with industrial reinforced corners, warning stripe tape (yellow-black) along top edge, scratched and dented steel surface, dim red warning lights at corners, the entire interior is transparent/empty, dark industrial aesthetic, hints of blood-rust stains, game UI overlay element, transparent background
```
**File:** `public/images/ui/frames/frame-combat-standard.png`

**Boss variant:**
```
Ornamental UI frame border for a boss combat screen, 800x600, heavy ornate dark metal frame with dramatic spiked corner ornaments, pulsing red glow channels running through the frame like veins, larger and more imposing than the standard frame, chain links hanging from top corners, cracked glass texture overlay on frame surface, ominous and oppressive presence, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-combat-boss.png`

---

### 3-3. Enemy Portrait Frame (160x160, transparent PNG)

**Minion tier (simple):**
```
Small square UI frame, 160x160, thin dark metal border with minimal ornamentation, two small bolts at top corners, scratched industrial surface, subtle dark glow, simple and functional, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-enemy-minion.png`

**Elite tier (ornate):**
```
Small square UI frame, 160x160, medium-weight dark metal border with angular Art Deco corner ornaments, etched warning symbols, slightly thicker than minion frame, amber accent line on inner edge, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-enemy-elite.png`

**Boss tier (dramatic with glow channels):**
```
Small square UI frame, 160x160, heavy ornate dark frame with dramatic pointed corner spikes, glowing red channels running through the metal like molten veins, visible energy pulsing along the edges, chain details, more imposing and intimidating than other tiers, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-enemy-boss.png`

---

### 3-4. Character Portrait Frame (180x240, transparent PNG)

```
Vertical rectangular UI frame for character portraits, 180x240, designed to look like a worn photograph frame found in a subway lost-and-found, dark wood-grain texture with chipped edges revealing metal underneath, small name plate area at bottom (empty), corner brackets tarnished brass, slight yellowing along inner edge like aged photo matting, melancholic and personal feeling, transparent interior, transparent background
```
**File:** `public/images/ui/frames/frame-portrait.png`

---

### 3-5. Choice Button Background (500x48, transparent PNG)

**Normal:**
```
Horizontal rectangular button background, 500x48, dark textured metal panel with subtle brushed steel finish, thin amber border line on left edge (3px), slightly darker at edges creating depth, industrial dystopian UI element, no text, transparent background with slight dark gradient fill in the panel area
```
**File:** `public/images/ui/frames/frame-choice-normal.png`

**Light alignment variant (warm):**
```
Horizontal rectangular button background, 500x48, same dark metal panel but with warm golden-amber inner glow along left edge, faint sun/star motif embossed in corner, warmth bleeding into the cold metal, transparent background
```
**File:** `public/images/ui/frames/frame-choice-light.png`

**Dark alignment variant (cold):**
```
Horizontal rectangular button background, 500x48, same dark metal panel but with cold purple-blue inner glow along left edge, faint void/moon motif embossed in corner, deeper shadows, transparent background
```
**File:** `public/images/ui/frames/frame-choice-dark.png`

---

### 3-6. HP Bar Frame (300x30, transparent PNG)

```
Horizontal ornamental frame for an HP bar, 300x30, dark industrial pipe aesthetic — the frame looks like a cross-section of a worn metal pipe with visible threading at both ends, small pressure gauge icon at right end, scratched and dented surface, rust spots, the interior channel where the HP fill would display is transparent, game UI element, transparent background
```
**File:** `public/images/ui/frames/frame-hp-bar.png`

---

### 3-7. Stat Bar Frame (200x24, transparent PNG)

```
Small horizontal ornamental frame for stat display, 200x24, thinner and more refined than HP bar, dark brushed metal with minimal ornamentation, small engraved tick marks along bottom edge for measurement, industrial aesthetic, transparent interior channel, transparent background
```
**File:** `public/images/ui/frames/frame-stat-bar.png`

---

### 3-8. Map Node Icons (48x48, transparent PNG, 8 variants)

**Hub — Platform 0:**
```
Small icon, 48x48 pixel art, hexagonal subway station marker symbol, dark metal with warm amber glow at center, tent/shelter silhouette inside the hexagon, safe haven aesthetic, pixel art style, transparent background
```
**File:** `public/images/ui/icons/map-hub.png`

**District A — Silent Mansions:**
```
Small icon, 48x48 pixel art, silenced mouth symbol — lips sewn shut with visible X-stitch thread, muted purple tint, library/prison aesthetic, dark pixel art, transparent background
```
**File:** `public/images/ui/icons/map-district-a.png`

**District B — Iron Offices:**
```
Small icon, 48x48 pixel art, industrial gear and hydraulic press symbol, interlocking cogs with a small briefcase silhouette crushed between them, industrial green-grey tint, factory aesthetic, dark pixel art, transparent background
```
**File:** `public/images/ui/icons/map-district-b.png`

**District C — Frozen Apartments:**
```
Small icon, 48x48 pixel art, snowflake ice crystal symbol with an apartment building silhouette frozen inside, blue-white frost tint, ice particles around edges, frozen aesthetic, dark pixel art, transparent background
```
**File:** `public/images/ui/icons/map-district-c.png`

**District D — Red District:**
```
Small icon, 48x48 pixel art, flame icon — aggressive fire symbol with a fist silhouette burning inside, red-orange tint, neon glow effect, rage aesthetic, dark pixel art, transparent background
```
**File:** `public/images/ui/icons/map-district-d.png`

**Terminal:**
```
Small icon, 48x48 pixel art, clock symbol — analog clock face showing all hands pointing to 12 (midnight), gold tint, railway aesthetic, precise lines, dark pixel art, transparent background
```
**File:** `public/images/ui/icons/map-terminal.png`

**Core:**
```
Small icon, 48x48 pixel art, server/monolith symbol — tall narrow black rectangle (monolith) with data lines radiating outward, purple glow at center, digital aesthetic, dark pixel art, transparent background
```
**File:** `public/images/ui/icons/map-core.png`

**Locked overlay:**
```
Small icon overlay, 48x48 pixel art, heavy padlock with chains crossing in an X pattern, dark metal with red "ACCESS DENIED" glow, meant to overlay other map icons, semi-transparent dark tint behind the lock, transparent background
```
**File:** `public/images/ui/icons/map-locked.png`

---

### 3-9. Title Screen Logo (800x200, transparent PNG)

```
Game title logo, 800x200 pixels, the Korean characters "심연" written in dramatic dark calligraphy brush strokes — bold and aggressive with ink splatters and drips falling downward, below it the English subtitle "THE ABYSS" in thin sans-serif capital letters with a slight digital glitch distortion, the ink of "심연" appears to be dripping into a void below, dark black ink on transparent background with faint purple digital artifacts around the edges, suitable as a game title screen logo, transparent background
```
**File:** `public/images/ui/frames/title-logo.png`

---

### 3-10. Death Screen Overlay (800x600, transparent PNG)

```
Full-screen overlay texture, 800x600, cracked CRT monitor screen effect with radiating fracture lines from center, heavy static noise and scan line distortion, the text "PROCESSING ERROR" in red monospace font glitching in the center, RGB color separation artifacts, vertical hold distortion bars, the overall effect suggests a system crash/BSOD in the underground city's machinery, meant to overlay the game screen on death, semi-transparent so gameplay is visible but disrupted behind it, dark with red and purple glitch colors, transparent background where the static is less dense
```
**File:** `public/images/ui/frames/overlay-death.png`

---

## 4. UI Icons

All icons: 32x32 transparent PNG, dark pixel art style with subtle glow accents.
These replace emoji characters currently used in the codebase.

Global icon style suffix:
```
32x32 pixel art icon, dark background compatible, clean readable silhouette, subtle glow accent, game UI icon, transparent background
```

### 4-1. Menu Icons

#### icon-inventory (Inventory / Backpack)
```
32x32 pixel art icon of a worn dark leather backpack/satchel, buckle clasp visible, slightly beaten up, amber accent on the buckle, dark silhouette style, transparent background
```
**File:** `public/images/ui/icons/icon-inventory.png`

#### icon-companions (Companions / Two Silhouettes)
```
32x32 pixel art icon of two human silhouettes standing side by side, one slightly in front of the other suggesting companionship, subtle warm amber glow between them suggesting connection, dark figures, transparent background
```
**File:** `public/images/ui/icons/icon-companions.png`

#### icon-dialogue-log (Dialogue Log / Scroll)
```
32x32 pixel art icon of a partially unrolled scroll or notepad with faint text lines visible, dark paper with amber text lines, worn edges, transparent background
```
**File:** `public/images/ui/icons/icon-dialogue-log.png`

#### icon-save (Save / Data Crystal)
```
32x32 pixel art icon of a small hexagonal data crystal glowing faintly purple, geometric facets visible, digital save point aesthetic rather than floppy disk, transparent background
```
**File:** `public/images/ui/icons/icon-save.png`

#### icon-settings (Settings / Gear)
```
32x32 pixel art icon of a single industrial gear/cog, dark metal with visible teeth, subtle metallic sheen, one small bolt in the center, transparent background
```
**File:** `public/images/ui/icons/icon-settings.png`

#### icon-home (Home / Exit Sign)
```
32x32 pixel art icon of a subway exit sign arrow pointing upward, Korean text "출구" (exit) faintly visible, green-amber glow, station wayfinding aesthetic, transparent background
```
**File:** `public/images/ui/icons/icon-home.png`

### 4-2. Resource Icons

#### icon-memory (Memory / Brain)
```
32x32 pixel art icon of a human brain viewed from the side, dark pink-red with subtle glow, one section appears to be fading/dissolving into particles suggesting memory loss, replaces brain emoji, transparent background
```
**File:** `public/images/ui/icons/icon-memory.png`

#### icon-engram (Engram / Crystal)
```
32x32 pixel art icon of a pentagonal crystal (engram), translucent purple with internal light, geometric facets, faint data lines visible inside like trapped information, replaces diamond emoji, transparent background
```
**File:** `public/images/ui/icons/icon-engram.png`

#### icon-hp (HP / Heart)
```
32x32 pixel art icon of a stylized heart, dark red with visible pulse line running through it like an EKG reading, medical-industrial aesthetic rather than romantic, replaces heart emoji, transparent background
```
**File:** `public/images/ui/icons/icon-hp.png`

### 4-3. Status Icons

#### icon-lock (Lock)
```
32x32 pixel art icon of a heavy industrial padlock, dark metal, closed and secured, red indicator light on the body, replaces lock emoji, transparent background
```
**File:** `public/images/ui/icons/icon-lock.png`

#### icon-check (Checkmark / Success)
```
32x32 pixel art icon of a checkmark inside a circle, green glow, clean confirmation indicator, system approval aesthetic, replaces checkmark character, transparent background
```
**File:** `public/images/ui/icons/icon-check.png`

#### icon-skull (Skull / Death)
```
32x32 pixel art icon of a human skull viewed from front, dark with red eye socket glow, cracked surface, system error aesthetic, replaces skull emoji, transparent background
```
**File:** `public/images/ui/icons/icon-skull.png`

#### icon-dice (Dice / Stat Check)
```
32x32 pixel art icon of a six-sided die showing 5 pips, dark body with red pip dots matching the game's accent color, slight tilt for dynamism, replaces dice emoji, transparent background
```
**File:** `public/images/ui/icons/icon-dice.png`

#### icon-victory (Victory / Crossed Swords)
```
32x32 pixel art icon of two crossed swords forming an X, dark metal blades with golden crossguards, victory laurel suggested by simple angular lines at sides, replaces swords emoji, transparent background
```
**File:** `public/images/ui/icons/icon-victory.png`

#### icon-warning (Warning / Triangle)
```
32x32 pixel art icon of an exclamation mark inside a triangle, yellow-amber warning color, industrial hazard sign aesthetic, replaces warning emoji, transparent background
```
**File:** `public/images/ui/icons/icon-warning.png`

### 4-4. Stat Icons

#### icon-stat-body (Body / Fist)
```
32x32 pixel art icon of a clenched fist viewed from front, dark silhouette with red accent glow on knuckles, strength and physicality, transparent background
```
**File:** `public/images/ui/icons/icon-stat-body.png`

#### icon-stat-sense (Sense / Eye)
```
32x32 pixel art icon of a single open eye with dilated pupil, dark with blue accent glow in the iris, awareness and perception, transparent background
```
**File:** `public/images/ui/icons/icon-stat-sense.png`

#### icon-stat-reason (Reason / Brain Lightbulb)
```
32x32 pixel art icon of a lightbulb with a brain pattern inside the glass, dark with gold accent glow, intellect and analysis, transparent background
```
**File:** `public/images/ui/icons/icon-stat-reason.png`

#### icon-stat-bond (Bond / Heart Handshake)
```
32x32 pixel art icon of two hands clasping/shaking with a small heart above, dark silhouettes with green accent glow, connection and empathy, transparent background
```
**File:** `public/images/ui/icons/icon-stat-bond.png`

### 4-5. Karma & Misc Icons

#### icon-karma-light (Karma Light / Star)
```
32x32 pixel art icon of a radiant star or sun symbol, warm golden glow with extending rays, hope and confrontation, replaces sun/star indicator, transparent background
```
**File:** `public/images/ui/icons/icon-karma-light.png`

#### icon-karma-dark (Karma Dark / Void Moon)
```
32x32 pixel art icon of a crescent moon with a void/dark circle where the full moon would be, cold purple glow, concealment and self-preservation, transparent background
```
**File:** `public/images/ui/icons/icon-karma-dark.png`

#### icon-next (Next / Arrow)
```
32x32 pixel art icon of a right-pointing arrow or chevron, subtle pulse animation suggested by double-line construction, amber accent, "continue" / "next page" indicator, transparent background
```
**File:** `public/images/ui/icons/icon-next.png`

#### icon-rest (Rest / Tent)
```
32x32 pixel art icon of a small makeshift tent or shelter, dark silhouette with warm amber campfire glow at the entrance, Platform 0 rest aesthetic, transparent background
```
**File:** `public/images/ui/icons/icon-rest.png`

#### icon-upgrade (Upgrade / Growth Arrow)
```
32x32 pixel art icon of an upward arrow breaking through a horizontal line, purple engram glow, growth and stat enhancement, level up indicator, transparent background
```
**File:** `public/images/ui/icons/icon-upgrade.png`

---

## 5. Texture Overlays

All textures are 256x256, tileable (seamless edges), transparent PNG with varying opacity.
Used as CSS `background-image` overlays on panels and containers.

### 5-1. Panel Texture (Dark Fabric/Metal)
```
Seamless tileable texture, 256x256, dark woven industrial fabric or brushed dark metal surface, very subtle grid pattern like carbon fiber or cheap office chair mesh, nearly black with slight variation in darkness, meant as a background panel texture for game UI, low contrast, muted, no obvious repeating pattern when tiled, transparent PNG with semi-opaque dark fill
```
**File:** `public/images/ui/textures/tex-panel.png`

### 5-2. Paper/Parchment Texture
```
Seamless tileable texture, 256x256, aged yellowed paper or parchment surface, subtle fiber grain visible, faint coffee stains and foxing marks, very low contrast warm cream to brown tones, meant as dialogue box background texture, transparent PNG with semi-opaque warm fill
```
**File:** `public/images/ui/textures/tex-paper.png`

### 5-3. Static/Noise Texture (Glitch)
```
Seamless tileable texture, 256x256, CRT television static noise pattern, random grey and white pixels creating visual noise, horizontal scan lines visible at 2-pixel intervals, meant as glitch effect overlay, digital error aesthetic, transparent PNG with semi-transparent noise fill (about 15% opacity)
```
**File:** `public/images/ui/textures/tex-static.png`

### 5-4. Frost Overlay (District C)
```
Seamless tileable texture, 256x256, frost crystal pattern growing from edges, ice crystal formations in white and pale blue, frozen condensation droplets, meant as a District C themed overlay for UI panels, transparent PNG with white-blue frost elements on transparent background (edges have more frost, center is more transparent)
```
**File:** `public/images/ui/textures/tex-frost.png`

### 5-5. Burn/Scorch Overlay (District D)
```
Seamless tileable texture, 256x256, scorch marks and burn patterns, darkened charred areas with orange-red heat glow at edges of burns, ember spots, meant as District D themed overlay for UI panels, transparent PNG with dark burn marks on transparent background
```
**File:** `public/images/ui/textures/tex-scorch.png`

### 5-6. Ink Splash Overlay (District A)
```
Seamless tileable texture, 256x256, dried black ink splashes and drips, calligraphy brush stroke marks, censorship redaction bar marks, meant as District A themed overlay, transparent PNG with black ink elements on transparent background, library/censorship aesthetic
```
**File:** `public/images/ui/textures/tex-ink.png`

### 5-7. Oil/Grease Overlay (District B)
```
Seamless tileable texture, 256x256, industrial oil stains and grease smears on metal surface, dark brown and black petroleum marks, fingerprint-like smudges, meant as District B themed overlay, transparent PNG with dark oil elements on transparent background, factory maintenance aesthetic
```
**File:** `public/images/ui/textures/tex-oil.png`

---

## 6. Background Art

36 backgrounds total. All 1920x1080 JPG.
CSS already references these in `backgrounds.css` — many already exist as files.

Global background style suffix:
```
dark atmospheric environment concept art, muted desaturated colors, Korean urban dystopia, liminal space, eerie lighting, 1920x1080, cinematic composition, no characters, no text
```

### 6-1. Common Areas (7 backgrounds)

#### bg-subway-modern (Prologue — Real-World Subway)
**Status:** EXISTS
```
Realistic modern Seoul subway station interior, clean white tiles, bright fluorescent lighting that feels slightly too white, platform screen doors with digital arrival display, a few blurred commuter silhouettes, mundane and ordinary but with a subtle sense of wrongness — one fluorescent tube flickers, the platform seems to stretch slightly too long, normal Korean subway but shot at an unsettling angle, 1920x1080
```
**File:** `public/images/bg/bg-subway-modern.jpg`

#### bg-subway (Transition — Entering the Abyss)
**Status:** EXISTS (gradient-only, upgrade recommended)
```
Dark atmospheric concept art of an abandoned subway station mid-transformation, the clean modern tiles from the real world are cracking and peeling to reveal dark concrete and rusted metal beneath, fluorescent lights are dying — half are out and the remaining ones flicker with a sickly yellow hue, the platform screen doors are dented and jammed half-open, the tunnel beyond is pure darkness, transition between the real world and the Abyss, liminal horror, 1920x1080
```
**File:** `public/images/bg/bg-subway.jpg`

#### bg-void (The Void — Falling/Death)
**Status:** EXISTS
```
Pure abstract void space, infinite darkness with a faint warm point of light impossibly far away, subtle concentric ripples of deep purple expanding outward from center, the sensation of falling through an infinite space between dimensions, particles of light (memories?) drifting upward against the fall direction, no floor no ceiling no walls, existential emptiness, 1920x1080
```
**File:** `public/images/bg/bg-void.jpg`

#### bg-station (Platform 0 — Abandoned Station)
**Status:** EXISTS
```
Dark concept art of a decommissioned underground subway station, cracked concrete platform with weeds growing through gaps, rusted metal pillars supporting a low ceiling, a single dim orange lamp illuminates a small area, old defaced subway maps on the wall with routes to districts marked in different colors, water stains and mold on ceiling, the tracks below the platform are dark and still — no trains come here anymore, 1920x1080
```
**File:** `public/images/bg/bg-station.jpg`

#### bg-tent-city (Platform 0 — Tent City)
**Status:** EXISTS
```
Dark atmospheric concept art of an underground tent city in an abandoned subway station, dozens of makeshift shelters made from old tarps subway ad banners and cardboard, dim string lights and oil lamps providing scattered warm pools of light in the darkness, souls (translucent faintly glowing figures) huddled in groups or alone, a vending machine glowing in the corner with its light casting long shadows, the ceiling is the underside of the subway platform above with pipes and cables, the only warm place in the Abyss, 1920x1080
```
**File:** `public/images/bg/bg-tent-city.jpg`

#### bg-campfire (Platform 0 — Campfire)
**Status:** EXISTS
```
Dark atmospheric concept art of a small campfire scene in an underground station, a makeshift fire burning in a metal trash can at the center, warm orange light illuminating a small circle of overturned crates used as seats, the warm light fights against the surrounding darkness creating a sharp boundary between safety and void, pipes and concrete walls just visible at the edges, the only genuinely warm and intimate scene in the entire game, a place for conversation not combat, 1920x1080
```
**File:** `public/images/bg/bg-campfire.jpg`

#### bg-corridor (Memory Corridor)
**Status:** EXISTS
```
Dark atmospheric concept art of a long underground corridor stretching to a vanishing point, walls of dark purple-grey concrete with exposed pipes running along the ceiling, intermittent fluorescent lights some working some dead creating pools of light and shadow, a thin purple-pink fog hovering at ankle height, the corridor feels like it shifts when you are not looking at it directly, doors on both sides (memory rooms) — all closed, liminal space par excellence, 1920x1080
```
**File:** `public/images/bg/bg-corridor.jpg`

---

### 6-2. District A — The Silent Mansions (5 backgrounds)

#### bg-mansion (District A — Main Street)
**Status:** EXISTS
```
Dark atmospheric concept art of a grand but decaying Victorian-Korean fusion mansion district, elegant buildings with traditional Korean roof tiles combined with Western Gothic architecture, the streets are eerily silent — "정숙" (SILENCE) signs posted everywhere in faded red, residents visible in windows with their mouths sewn shut, censorship drone silhouettes patrolling above, purple-grey color palette with deep shadows, the beauty of the architecture is oppressive rather than inviting, 1920x1080
```
**File:** `public/images/bg/bg-mansion.jpg`

#### bg-archive (The Central Archive)
**Status:** EXISTS
```
Dark concept art of a vast underground library archive stretching impossibly far in all directions, towering bookshelves reaching into darkness above, many books are blank — their words have been censored and erased, loose pages drift through the air like leaves, a single reading desk with a dim lamp in the foreground, ladders lean against shelves at odd angles, the silence here is not just quiet but actively suppressive — sound itself seems to die, purple and midnight blue palette, 1920x1080
```
**File:** `public/images/bg/bg-archive.jpg`

#### bg-exam (The Infinite Exam Hall)
**Status:** EXISTS
```
Dark concept art of a Kafkaesque examination hall, hundreds of identical wooden desks arranged in perfect rows stretching to infinity, ghost students (translucent) sit hunched over answer sheets filling them mechanically, the room has no walls — just desks fading into darkness, a single clock on an unsupported wall shows all hands spinning, fluorescent lights create a sickly institutional glow, every desk has the same exam paper stamped "ATTEMPT ___" in red, Korean civil service exam (공무원 시험) aesthetic turned into purgatory, 1920x1080
```
**File:** `public/images/bg/bg-exam.jpg`

#### bg-whisper-market (The Whisper Market)
**Status:** EXISTS
```
Dark concept art of a hidden underground market in narrow alleyways, all trade conducted in silence — vendors communicate through hand signs and written notes, dim candlelight and small oil lamps create intimate pools of warm light, goods displayed on blankets and overturned crates, scrolls and documents are the primary currency, the walls are covered in layers of overlapping handwritten notes, a sense of paranoia — everyone watches for censorship drones, purple shadows with warm candlelight accents, 1920x1080
```
**File:** `public/images/bg/bg-whisper-market.jpg`

#### bg-silence (The Path of Silence)
**Status:** EXISTS
```
Dark concept art of a long straight road in District A that starts bright and gradually darkens, the beginning of the road is almost white — bleached clean silence, as the road progresses the white gives way to grey then to deep purple-black, "SILENCE" signs line both sides growing larger and more aggressive further down, the road itself seems to absorb sound — visual representation of sound dying, no shadows because there is no light source to cast them, gradient from white-grey to deep purple-black, 1920x1080
```
**File:** `public/images/bg/bg-silence.jpg`

---

### 6-3. District B — The Iron Offices (3 backgrounds)

#### bg-office (District B — Main Street)
**Status:** EXISTS
```
Dark concept art of an infinite Korean office district where the buildings are alive, skyscrapers move up and down like hydraulic pistons — some crushing down while others rise, the ground shakes with each compression cycle, necktie zombie office workers trudge in perfect lines through the streets carrying briefcases, every building's windows glow with cold fluorescent light — no one ever turns them off, corporate logos are illegible smears, steel grey and sickly green palette, industrial office park (테크노파크) turned into a meat grinder, 1920x1080
```
**File:** `public/images/bg/bg-office.jpg`

#### bg-overtime-tower (The Overtime Tower)
**Status:** EXISTS
```
Dark concept art looking up at a single impossibly tall office tower, the tower stretches beyond the visible ceiling into pure darkness, every single floor is lit — the lights never go out, through the windows endless rows of desk workers can be seen hunched over their desks, the building sways slightly as if exhausted, a digital clock on the facade shows "99:99" — overtime that never ends, the base of the building is reinforced with industrial supports like a factory chimney, cold blue-grey fluorescent glow, 1920x1080
```
**File:** `public/images/bg/bg-overtime-tower.jpg`

#### bg-press (The Press Zone)
**Status:** EXISTS
```
Dark concept art of an industrial press factory floor, massive hydraulic press machines line both sides of a narrow walkway, the presses slam down at irregular intervals spraying oil and sparks, the machines are processing not metal but briefcases documents and ties — the detritus of office life, conveyor belts carry the compressed material (dark cubes) deeper into the facility, hot steam jets from pipe joints, industrial brown green and iron grey palette, factory horror, 1920x1080
```
**File:** `public/images/bg/bg-press.jpg`

---

### 6-4. District C — The Frozen Apartments (3 backgrounds)

#### bg-frozen (District C — Main Street)
**Status:** EXISTS
```
Dark concept art of a Korean corridor-style apartment complex (복도식 아파트) completely frozen in ice, every window is a frosted-over rectangle of pale blue, the streets between buildings are covered in thick ice with frozen street lamps casting blue-white light, an abandoned playground is visible in the courtyard — the swings frozen mid-swing, no movement anywhere — absolute stillness, each apartment unit door has a number and a thin layer of frost, you can see through some windows that the residents inside are frozen solid in their daily poses — eating alone watching TV lying in bed, ice blue and grey-white palette, 1920x1080
```
**File:** `public/images/bg/bg-frozen.jpg`

#### bg-frozen-corridor (Frozen Corridor — Building 707)
**Status:** EXISTS
```
Dark concept art of an apartment building interior corridor, the hallway of a Korean apartment building (복도식 아파트 복도) with numbered doors on both sides, everything is covered in thick frost and ice, the fluorescent ceiling lights are frozen — they still glow dimly blue through the ice encasing them, shoe racks outside each door are frozen with the shoes still in place, each door has a frosted-over peephole, the corridor stretches long and straight into blue darkness, the floor is slippery ice, cold breath would be visible here, deep blue and frost-white palette, 1920x1080
```
**File:** `public/images/bg/bg-frozen-corridor.jpg`

#### bg-apt-interior (Yuri's Apartment)
**Status:** EXISTS
```
Dark concept art of the interior of a single Korean apartment unit (원룸), a small one-room space with a desk covered in translation documents and an open laptop, delivery food containers stacked by the door (never opened the door for the deliveries — left outside), the bed is unmade, curtains permanently drawn, a single monitor provides the only light in a blue-white glow, everything is neat but clearly inhabited by only one person for a very long time, subtle frost creeping in from the window frames, loneliness made tangible in a room, muted blue-grey palette with monitor glow, 1920x1080
```
**File:** `public/images/bg/bg-apt-interior.jpg`

#### bg-playground (Frozen Playground)
**Status:** EXISTS
```
Dark concept art of a Korean apartment complex playground frozen in time, children's play equipment (slide, swings, see-saw, climbing frame) all encased in clear ice, the swings are frozen at different angles mid-swing suggesting children were playing when the freeze happened, a sandbox is now a block of ice, apartment buildings loom in the background with their frozen windows, a single frozen street lamp provides a dim blue light, small frozen footprints preserved in the ice on the ground, deeply melancholic, ice blue and grey palette, 1920x1080
```
**File:** `public/images/bg/bg-playground.jpg`

---

### 6-5. District D — The Red District (3 backgrounds)

#### bg-rage (District D — Main Street)
**Status:** EXISTS
```
Dark concept art of a Korean red-light district infused with industrial steel mill aesthetics, narrow streets flashing with aggressive red neon signs in Korean, the ground is wet not with rain but with thin layers of oil and molten metal that reflects the red light, fights and small explosions visible in the distance, food stalls and bars line the street but they serve rage and fire not food, the loudest most vibrant yet most dangerous area, everything is slightly on fire — embers drift through the air, deep crimson red and black palette with neon accents, 1920x1080
```
**File:** `public/images/bg/bg-rage.jpg`

#### bg-furnace-club (The Furnace Club)
**Status:** EXISTS
```
Dark concept art of an underground nightclub that doubles as a furnace, the dance floor is a massive industrial furnace grate with fire visible below, souls dance on the grate as their feet burn — they cannot stop, a DJ booth made of welded scrap metal and furnace controls, the speakers are industrial sirens, the strobe lights are actually bursts from the furnace below, the walls are lined with pipes carrying the heat energy generated from burned rage, the most horrifying venue in the city — a party where you are the fuel, red orange and black palette with fire glow, 1920x1080
```
**File:** `public/images/bg/bg-furnace-club.jpg`

#### bg-backstage (The Backstage)
**Status:** EXISTS
```
Dark concept art of a backstage area behind the Furnace Club, narrow cramped space with exposed pipes and wiring, broken mirrors on the walls reflecting distorted images, discarded performance costumes (burned and torn) hanging on racks, a single dim red bulb provides the only light, graffiti on the walls — some in Korean expressing rage and grief, quieter than the club but the walls still vibrate with bass, a door leads to a darker space beyond, deep red and black palette, 1920x1080
```
**File:** `public/images/bg/bg-backstage.jpg`

#### bg-stall (Taehyun's Pojangmacha)
**Status:** EXISTS
```
Dark concept art of a Korean pojangmacha (포장마차) street food tent in a back alley of D-district, a small makeshift tent with clear plastic walls and a single hanging bulb, inside an old man (suggested not detailed) stirs a large pot of sundaeguk (순대국) on a portable gas stove, the steam from the pot is the warmest thing in D-district, mismatched plastic stools outside, a handwritten menu board in Korean, the tent is surrounded by the red glow of the district but inside it is warm amber-orange, the second warmest place in the game after Platform 0's campfire, contrast of warm amber interior against red-black exterior, 1920x1080
```
**File:** `public/images/bg/bg-stall.jpg`

---

### 6-6. Boss Arenas (6 backgrounds)

#### bg-boss (Generic Boss Arena — Fallback)
**Status:** EXISTS
```
Dark atmospheric concept art of a vast underground arena, concentric rings of dark stone descending toward a central point like an inverted colosseum, red emergency lighting pulsing from below, the ceiling is lost in darkness, chains hang from above, the ground is cracked and stained, an oppressive sense of being watched from all sides, pure combat space, dark red and black palette with pulsing crimson glow, 1920x1080
```
**File:** `public/images/bg/bg-boss.jpg`

#### bg-boss-librarian (Librarian's Sanctum)
**Status:** EXISTS
```
Dark concept art of the Librarian's inner sanctum, a circular chamber at the center of the Central Archive, the walls are made entirely of books — floor to infinite ceiling — but every book is blank, its contents erased, the Librarian's chair/throne is made of stacked volumes, loose pages orbit the room in a slow vortex, black ink pools on the floor like blood, the silence here is visible — represented as a faint purple distortion in the air that dampens everything, a single unfinished manuscript lies open on a stand (Soyeon's article?), deep purple and midnight palette with white page accents, 1920x1080
```
**File:** `public/images/bg/bg-boss-librarian.jpg`

#### bg-boss-foreman (Foreman's Press Floor)
**Status:** EXISTS
```
Dark concept art of the Foreman's domain — the heart of the Iron Offices' press system, a massive industrial floor with the largest hydraulic press in the city at the center, the press is large enough to crush an entire office building, conveyor belts feed compressed soul-material from all directions, the ceiling is a tangle of pipes and machinery, oil drips from every surface, the floor vibrates with each press cycle creating ripples in the pooled oil, scattered briefcases and crushed ties litter the ground, industrial green-brown and iron palette with harsh overhead lighting, 1920x1080
```
**File:** `public/images/bg/bg-boss-foreman.jpg`

#### bg-boss-curator (Curator's Cryogenic Chamber)
**Status:** EXISTS
```
Dark concept art of the Curator's cryo-chamber deep in Building 101 basement, the coldest place in the entire Abyss, rows of cryogenic pods line the walls each containing a frozen soul preserved in their moment of deepest loneliness, the center of the room has a throne of intertwined cooling pipes where the Curator sits permanently connected to the system, frost covers every surface in thick crystalline patterns, the temperature is so low that the air itself seems to freeze — visible ice crystals suspended in space, a deep blue light emanates from the cooling system, ice blue white and deep navy palette, 1920x1080
```
**File:** `public/images/bg/bg-boss-curator.jpg`

#### bg-boss-chef (Chef's Infernal Kitchen)
**Status:** EXISTS
```
Dark concept art of the Chef's arena — a massive commercial kitchen turned into an inferno, industrial cooking stations line the perimeter each with fires burning out of control, the main prep area in the center has become a fighting ring surrounded by flames, pots and pans hang from overhead racks creating a metallic ceiling, the walls are blackened with soot and grease, a massive wok at the center burns with blue-white intensity — this is where rage is refined into pure fuel, broken plates and scattered utensils on the floor, fire orange deep red and charcoal black palette, 1920x1080
```
**File:** `public/images/bg/bg-boss-chef.jpg`

#### bg-boss-stationmaster (Station Master's Terminal)
**Status:** EXISTS
```
Dark concept art of the central transit terminal where all railway lines converge, infinite subway tracks converging to a single point creating a forced perspective vanishing point, ghost trains rush from every direction as transparent blue afterimages with motion blur, massive clock faces embedded in the walls and ceiling each showing a different time, the platform itself is a circular island at the convergence point, a conductor's podium stands at the center, golden and dark palette with time distortion effects — some areas of the image appear slightly warped as if time moves differently, clock gears visible in the architecture, 1920x1080
```
**File:** `public/images/bg/bg-boss-stationmaster.jpg`

---

### 6-7. Special Locations (6 backgrounds)

#### bg-hall (B1 Central Hall)
**Status:** EXISTS
```
Dark concept art of a vast underground central hall, the main gathering space of the Abyss, enormous dark chamber with a distant ceiling from which a single beam of pale purple light descends, the floor is smooth dark stone with faded directional markings pointing to different districts, pillars of dark metal support the ceiling at regular intervals, echoes suggest the space is even larger than what is visible, a sense of grand scale that dwarfs the individual, deep purple-black palette with single pale light source, 1920x1080
```
**File:** `public/images/bg/bg-hall.jpg`

#### bg-terminal (Central Transfer Terminal)
**Status:** EXISTS
```
Dark concept art of a deep underground corridor that feels unsettlingly clean compared to the rest of the Abyss, pristine white tiles on walls and floor with not a single crack, fluorescent lights that actually work properly casting even clinical lighting, but one shadow on the wall does not match any physical object, the corridor is too straight and too long and too clean — it feels like a hospital or a laboratory not a subway, the cleanliness itself is the horror, clinical white and steel palette with golden trim accents, 1920x1080
```
**File:** `public/images/bg/bg-terminal.jpg`

#### bg-core (The Core — City Hall / Black Monolith)
**Status:** EXISTS
```
Dark concept art of the Core — the Abyss's central control room, a massive cylindrical chamber with a monolithic black server tower at the center rising from floor to ceiling, thousands of cables extend from the tower in all directions like a nervous system, small screens and monitors float at various heights displaying data streams and surveillance feeds from all districts, the air is filled with faint purple-white data particles, the room hums with an alien intelligence, the most powerful and dangerous place in the Abyss, deep purple digital blue and white data accent palette with ominous server glow, 1920x1080
```
**File:** `public/images/bg/bg-core.jpg`

#### bg-crying (The Crying Room)
**Status:** EXISTS
```
Dark atmospheric concept art of a small underground room where the walls weep, liquid streams down the dark blue walls like tears, the ceiling drips constantly creating ripples in shallow pools on the floor, the room is intimate and claustrophobic, a single bench sits in the center under a dim light, this is where souls come when they cannot hold grief any longer, the water on the walls is not rain — it is concentrated grief that has condensed, deep dark blue palette with liquid reflections, 1920x1080
```
**File:** `public/images/bg/bg-crying.jpg`

#### bg-memory-fade (Memory Erasure)
**Status:** EXISTS
```
Dark concept art depicting the moment a memory is being destroyed, a warm scene (kitchen? living room? schoolroom?) dissolving from the center outward, the warm golden center contains the fading ghost of a memory — a blurred figure a voice a place — becoming transparent, the edges are pure void black consuming the warmth inward, particles of golden light drift away from the dissolving image like embers, the most emotionally devastating background in the game, warm amber center dissolving into absolute black void, 1920x1080
```
**File:** `public/images/bg/bg-memory-fade.jpg`

#### bg-glitch (System Glitch — Death Transition)
**Status:** CSS only (gradient animation), no JPG needed
```
N/A — This background is CSS-only (animated glitch gradient in backgrounds.css).
Keep as CSS for performance — the animation cannot be replicated by a static image.
```

---

### 6-8. Ending Scenes (3 backgrounds)

#### bg-ending-gate (The Turnstile — Lethe's Choice)
**Status:** EXISTS
```
Dark concept art of a single subway turnstile standing alone in an infinite void, the turnstile is the same model as the one from the prologue but aged and worn, beyond the turnstile there is a faint light — the real world, behind the turnstile (where the viewer stands) is the Abyss, the turnstile asks for a fare — not money but memories, the void around the turnstile is not empty but contains faint ghostly images of all the districts visited, the most important threshold in the game, dark void with turnstile illuminated by light from beyond, 1920x1080
```
**File:** `public/images/bg/bg-ending-gate.jpg`

#### bg-ending-seoul (Ending A/B — Return to Seoul)
**Status:** EXISTS
```
Concept art of a Seoul cityscape seen from a subway station exit, the real world — but seen with new eyes, the sky is grey and overcast (typical Seoul sky), apartment buildings and office towers in the distance, commuters walking past with their heads down looking at phones, the mundane reality that the protagonist escaped from and is now returning to, but there is one detail: a single break in the clouds letting through a shaft of golden sunlight, the beauty and the sadness of ordinary life, muted grey with one warm light accent, 1920x1080
```
**File:** `public/images/bg/bg-ending-seoul.jpg`

#### bg-ending-hospital (Ending C — Hospital / Sacrifice)
**Status:** EXISTS
```
Concept art of a hospital room, sterile white walls and fluorescent lighting, a single hospital bed by a window with drawn curtains, medical monitors display a flat line or barely-there readings, flowers on the bedside table — wilting but someone keeps replacing them, the room is both peaceful and unbearably sad, the body is alive but the person inside gave everything away, outside the window: a blurred view of a city, muted clinical white and pale blue palette with warm flower accents, 1920x1080
```
**File:** `public/images/bg/bg-ending-hospital.jpg`

---

### 6-9. Missing Backgrounds (NEEDED)

These backgrounds are referenced or needed but do not yet have dedicated prompts or may need dedicated variants:

#### bg-boss-mayor (Mayor's Core Chamber — Final Boss Arena)
**Status:** NEEDED (currently falls back to `bg-boss` or `bg-core`)
```
Dark concept art of the Mayor's throne room at the absolute center of the Core, a circular chamber where all cables converge into a single massive server throne, the Mayor's cracked screen face dominates the room casting flickering light, floating holographic screens surround the throne showing every soul in the city, the floor is a glass plane through which the infinite depth of the Abyss is visible below — you can see the city from above through the floor, the most alien and powerful space in the game, deep purple with white data streams and flickering screen-light, 1920x1080
```
**File:** `public/images/bg/bg-boss-mayor.jpg`

#### bg-ending-remain (Ending D — Remaining in the Abyss)
**Status:** NEEDED
```
Dark concept art of Platform 0 reimagined as a permanent home, the tent city has been made more permanent — real structures replacing tarps, the campfire burns brighter and steadier, the protagonist (back to viewer, suggested not detailed) sits at the campfire with companion silhouettes around them, the subway tunnel beyond is dark but no longer threatening, a sense of acceptance and quiet peace, warmer than any other Abyss scene but still underground — natural light will never reach here, warm amber and dark brown palette, the loneliest kind of peace, 1920x1080
```
**File:** `public/images/bg/bg-ending-remain.jpg`

#### bg-gosiwon (Junseo's Gosiwon Room — Flashback)
**Status:** NEEDED
```
Dark concept art of a tiny Korean gosiwon (고시원) room, 1.5 pyeong (about 5 sq meters), barely enough space for a desk a bed and a lamp, no window, walls covered in exam preparation notes and schedules, a desk lamp is the only light source, textbooks stacked to the ceiling, an answer sheet on the desk stamped "ATTEMPT 47" in red, a phone face-down on the bed, claustrophobic and suffocating, the room of someone who has reduced their entire existence to a single purpose, warm yellow desk lamp against dark cramped walls, 1920x1080
```
**File:** `public/images/bg/bg-gosiwon.jpg`

---

## 7. Effect Sprites

Animated effects as spritesheets or individual frames. All transparent PNG.

### 7-1. Dice Roll Animation (6 frames, 96x96 each → 576x96 spritesheet)
```
Spritesheet of 6 frames showing a d6 die rolling, frame 1: die airborne tilted left showing 2, frame 2: die spinning showing 4, frame 3: die tumbling showing 1, frame 4: die bouncing showing 6, frame 5: die settling showing 3, frame 6: die landed flat showing 5, dark red die body with white pips matching the game's color scheme, each frame 96x96 pixels arranged horizontally, pixel art style, transparent background
```
**File:** `public/images/ui/effects/fx-dice-roll.png`

### 7-2. Damage Numbers (10 digits, 32x32 each → 320x32 spritesheet)
```
Spritesheet of digits 0-9 for damage number display, each digit 32x32 pixels arranged horizontally, bold angular font style, red color (#e94560) with dark outline for readability, slight crack/shatter effect on each digit, meant to pop up during combat, pixel art style, transparent background
```
**File:** `public/images/ui/effects/fx-damage-numbers.png`

### 7-3. Level Up Burst (single frame, 128x128)
```
Level up burst effect, 128x128, radial explosion of purple engram energy from center, crystalline shards and light particles expanding outward, golden-purple color gradient, celebratory but restrained — this is growth in a dark world not a party, pixel art style, transparent background
```
**File:** `public/images/ui/effects/fx-level-up.png`

### 7-4. Healing Sparkle (4 frames, 64x64 each → 256x64 spritesheet)
```
Spritesheet of 4 frames showing a healing sparkle effect, frame 1: small green point of light, frame 2: green cross/plus shape expanding, frame 3: green particles radiating outward with warm glow, frame 4: particles fading with trailing sparkles, medical/clinical healing aesthetic not magical, each frame 64x64 arranged horizontally, transparent background
```
**File:** `public/images/ui/effects/fx-heal.png`

### 7-5. Karma Shift — Light Burst (single frame, 96x96)
```
Karma light shift indicator effect, 96x96, burst of warm golden light radiating from center, sun-ray pattern, motes of golden light drifting upward, hope and warmth, meant to flash briefly when karma shifts toward light, transparent background
```
**File:** `public/images/ui/effects/fx-karma-light.png`

### 7-6. Karma Shift — Dark Ripple (single frame, 96x96)
```
Karma dark shift indicator effect, 96x96, concentric ripples of dark purple void energy collapsing inward toward center, cold particles being drawn inward, a sense of something closing or concealing, meant to flash briefly when karma shifts toward dark, transparent background
```
**File:** `public/images/ui/effects/fx-karma-dark.png`

### 7-7. Memory Loss Effect (single frame, 256x256)
```
Memory dissolution effect, 256x256, a warm golden photograph-like rectangle dissolving from edges inward into black void particles, the center still holds a warm glow but the edges are being consumed by darkness, individual pixels/particles breaking away and drifting into the void, the visual representation of losing a memory, emotionally devastating effect, warm gold dissolving into black void, transparent background
```
**File:** `public/images/ui/effects/fx-memory-loss.png`

---

## 8. Character Portraits

26 characters total. All should be painted in a consistent semi-realistic/painterly style (NOT anime, NOT photorealistic). Think: Disco Elysium character art meets Korean manhwa illustration.

**Global portrait style:**
```
Semi-realistic painted portrait, dark fantasy Korean urban horror aesthetic, dramatic chiaroscuro lighting, painterly brush strokes visible, muted desaturated palette with one accent color per character, emotional depth in expression, dark vignette background, upper body visible
```

**Global portrait negative:**
```
anime, cartoon, chibi, 3D render, photorealistic, bright colors, happy, clean, perfect skin, fantasy armor, medieval, American comic book style
```

### 8-1. Protagonist & Core NPCs

#### player — The Protagonist (???)
**Status:** EXISTS
```
Portrait of a Korean person in their 30s, gender ambiguous, wearing a rumpled grey office suit with loosened tie, face is deliberately indistinct — features are there but slightly blurred as if the viewer cannot quite focus on them, dark circles under hollow eyes that look through rather than at things, short unremarkable hair, the most average-looking person imaginable but with an unsettling emptiness behind the eyes, holding a battered briefcase, dramatic side-lighting in amber and grey
```
**File:** `public/images/characters/player.jpg`

#### guide — The Guide (안내자)
**Status:** EXISTS
```
Portrait of an ageless figure sitting on a subway bench, could be 40 or 400, wearing layers of mismatched clothing — a faded station worker's jacket over a sweater over a shirt, tired intelligent eyes that have seen too much, messy grey-streaked hair, stubble, sitting with perfect stillness, a subway map is tattooed or drawn on the back of one visible hand, not kind but not cruel — simply exhausted, knows everything about the Abyss but wishes they did not, warm amber lighting from a single source below
```
**File:** `public/images/characters/guide.jpg`

#### narrator — Narrator
**Status:** No portrait needed (text-only)

#### self_memo — Memo
**Status:** No portrait needed (text element)

#### lost_one — The Lost One (상실자)
**Status:** EXISTS
```
Portrait of a huddled figure crouching in a corner of Platform 0, wrapped in a dirty blanket, the face is completely smooth and featureless — no eyes no nose no mouth, just pale blank skin where features should be, this is what happens when all memories are consumed, the hands clutching the blanket are the only human-looking part, deeply unsettling, a warning of what the protagonist could become, dim cold lighting
```
**File:** `public/images/characters/lost_one.png`

#### weary_soul — Weary Soul (지친 영혼)
**Status:** NEEDED
```
Portrait of a translucent ghostly figure with a faint warm glow, appears to be a Korean man in his 50s, slightly transparent — you can faintly see the background through them, wearing a worn jacket and slacks, face shows exhaustion but a hint of dry humor in the corner of the mouth, almost no memories left but personality somehow persists, sits on a crate in the tent city, the lightest and most gentle character, faintly luminous with warm tones
```
**File:** `public/images/characters/weary_soul.png`

#### vending_human — Vending Machine Human (자판기 인간)
**Status:** EXISTS
```
Portrait of a person who has become part-vending machine, their torso is a functioning vending machine with a glass panel showing items inside (engram crystals, bandages, notes), but they still have a human head with confused gentle eyes, their arms extend from the sides of the machine body, mouth moves as if trying to remember how to speak — words come out in stutters, a tragic friendly figure, the result of losing all memories but the body persisting, clinical lighting with warm machine glow
```
**File:** `public/images/characters/vending_human.png`

### 8-2. Companions (10)

#### soyeon — Soyeon (소연, 28) — District A
**Status:** EXISTS
```
Portrait of a Korean woman age 28 with short practical journalist's haircut, sharp intelligent eyes that are always observing and cataloguing, a visible line of black wire stitching across her sealed lips — she cannot speak and communicates through writing, wearing a worn press vest with empty ID badge clip, holding a small notebook and pen at all times, a camera strap around her neck but the camera is broken, strong determined jaw, the wire at her mouth does not diminish her — she found another way, purple-grey District A lighting with one side of face illuminated by candlelight
```
**File:** `public/images/characters/soyeon.jpg`

#### junseo — Junseo (준서, 23) — District A
**Status:** EXISTS
```
Portrait of a young Korean man age 23 with an exhausted boyish face, large dark eyes with dark circles underneath from years of studying, wearing a faded hoodie and carrying a mechanical pencil behind his ear, slightly hunched posture suggesting someone who has been bent over a desk for years, hair is messy from running hands through it while thinking, expression is apologetic by default — he looks like he is about to say sorry for existing, but there is a hidden spark of intelligence behind the weariness, warm desk-lamp yellow lighting against dark background
```
**File:** `public/images/characters/junseo.jpg`

#### minjun — Minjun (민준, 31) — District B
**Status:** EXISTS
```
Portrait of a Korean man age 31 with the look of a tech startup developer who never left the office, wearing a wrinkled company hoodie with hood down, dark rings under bloodshot eyes, carrying a damaged laptop under one arm that he never puts down, wireless earbuds still in — listening to nothing, fingers have a slight twitch from typing, stubble from days of not shaving, his last commit message "TODO: go home" is faintly visible as ghost text near him, blue-white monitor glow lighting from below contrasting with dark background
```
**File:** `public/images/characters/minjun.jpg`

#### jeongsu — Jeongsu (정수, 43) — District B
**Status:** EXISTS
```
Portrait of a weathered Korean man age 43 with the build of someone who has done physical labor their entire life, wearing a faded safety vest and a cracked yellow construction hard hat, the crack in the hard hat is prominent and significant — it is what killed him, face is stoic with deep lines from sun and worry, callused hands visible, a small photograph of a child is tucked into the inside of his hard hat visible through the crack, he fixes broken things silently because that is all he knows how to do, harsh overhead work-site lighting casting strong shadows
```
**File:** `public/images/characters/jeongsu.jpg`

#### yuri — Yuri (유리, 33) — District C
**Status:** EXISTS
```
Portrait of a Korean woman age 33 with long hair that falls forward hiding most of her face, pale skin from never going outside, wearing a comfortable oversized cardigan wrapped tight like armor, eyes visible through the hair are intelligent but wary — she has not had a face-to-face conversation in 8 months, hands holding a cup of cold tea, headphones around neck, a faint blue frost forming on the edges of her cardigan in the Abyss, her last translation was "She finally opened the door" — and she never did, cold blue side-lighting with warm monitor glow from below
```
**File:** `public/images/characters/yuri.jpg`

#### hayoung — Hayoung (하영, 27) — District C
**Status:** EXISTS
```
Portrait of a young Korean woman age 27 in a worn nurse's uniform, her scrubs were once white but are now grey-blue in the Abyss, a stethoscope around her neck that she unconsciously uses to check pulses of dead souls, bags under her eyes from 3-shift rotations and workplace bullying (태움), hair pulled back in a functional ponytail, hands are gentle but shaking slightly from exhaustion, her last text to her mother was "엄마 나 좀 힘들—" never finished, a caretaker who forgot to take care of herself, cool clinical blue-white lighting
```
**File:** `public/images/characters/hayoung.png`

#### narae — Narae (나래, 24) — District D
**Status:** EXISTS
```
Portrait of a young Korean woman age 24 with an aggressive punk aesthetic that is clearly armor, shaved sides with longer top dyed dark red, multiple ear piercings, wearing a leather jacket covered in patches from indie music venues, eyes burn with anger but if you look closely there is a terrified child behind the rage, a microphone is clutched in one hand, knuckles scarred from fights, she raps to burn her rage — but the rage comes from a house she could not escape, red neon District D lighting creating harsh contrasts, fire reflected in her eyes
```
**File:** `public/images/characters/narae.png`

#### taehyun — Taehyun (태현, 45) — District D
**Status:** EXISTS
```
Portrait of a stocky Korean man age 45 with the weathered face of someone who ran a small restaurant for 15 years, wearing a stained but clean apron over a simple shirt, carrying a blackened but well-maintained iron soup pot — the only thing that survived the fire, warm eyes with deep crow's feet from years of smiling at customers now dimmed with loss, thick arms from stirring heavy pots, a small burn scar on one forearm, he cooks because it is the only way he remembers how to take care of people, warm amber pojangmacha tent light from below, the warmest-lit portrait
```
**File:** `public/images/characters/taehyun.jpg`

#### miseon — Miseon (미선, 38) — Hub (Platform 0)
**Status:** EXISTS
```
Portrait of a Korean woman age 38 with the exhausted but unbreakable look of someone who takes care of everyone except herself, wearing a faded green apron over practical clothing, hair pulled back messily with a clip, carrying a towel over one shoulder and a medical pouch at her hip, laugh lines around her eyes but the eyes themselves are tired, hands are raw from constant washing and working, her mouth naturally forms the words "괜찮아?" (are you okay?) even in silence, the mother everyone needs but who needed a mother herself, warm amber campfire light, the most approachable portrait
```
**File:** `public/images/characters/miseon.jpg`

#### youngjae — Youngjae (영재, 22) — Terminal
**Status:** EXISTS
```
Portrait of the youngest character — a Korean man of 22 with an earnest face that still has traces of teenage hope, wearing a neat but cheap railway intern uniform with a crooked "INTERN" name badge, short clean haircut, a genuinely warm smile that feels almost impossibly bright for the Abyss — but look closer and see the slight bags under his eyes and the exhaustion behind the warmth, his collar is slightly crooked, he died saving someone — and the system rewarded him by making him work forever, clean warm lighting contrasting sharply with the dark Abyss background behind him
```
**File:** `public/images/characters/youngjae.jpg`

### 8-3. Administrators / Bosses (6)

#### ticket_inspector — Ticket Inspector (검표원)
**Status:** EXISTS
```
Portrait of a ticket inspector entity, head is a mounted CCTV surveillance camera with a single red lens, wearing a dark blue railway enforcement uniform with brass buttons, body language is rigid and mechanical, the camera-head slowly pans left to right as if scanning, one hand holds a cracked tablet displaying "VIOLATION" in red Korean text, no humanity — pure enforcement, cold institutional fluorescent lighting
```
**File:** `public/images/characters/ticket_inspector.png`

#### librarian — The Librarian (사서) — District A Boss
**Status:** EXISTS
```
Portrait of the Librarian, a floating ethereal figure, mouth sewn shut with thick black wire (X-pattern stitches), wearing deep purple torn archivist robes, black ink tears streaming perpetually from both eyes, surrounded by orbiting blank book pages, hands have ink-stained fingers that trail text when they move, a regal and tragic presence — she enforced silence until she became silence, deep purple lighting with white page-glow accents
```
**File:** `public/images/characters/librarian.jpg`

#### foreman — The Foreman (현장 소장) — District B Boss
**Status:** EXISTS
```
Portrait of the Foreman, upper body is a haggard Korean man in a supervisor's vest with a necktie that has grown into his neck cutting deep into the flesh, transition zone at the waist where human flesh merges with hydraulic press machinery, mechanical arms with piston joints, oil and something darker dripping from the machine joints, barcode eyes, he genuinely believes work saves people — and will crush you to prove it, harsh overhead industrial strip lighting
```
**File:** `public/images/characters/foreman.jpg`

#### curator — The Curator (동면 관리자) — District C Boss
**Status:** EXISTS
```
Portrait of the Curator, a thin figure in torn hospital pajamas covered in white frost, connected to massive cooling pipes from the waist down, bright blue glowing eyes emitting visible cold vapor, frost crystal patterns spreading across skin like tears frozen mid-fall, sitting immobile on a throne of frozen pipes, the saddest boss — he freezes people so they cannot feel pain anymore, he thinks he is helping, ice blue lighting with frost particle effects
```
**File:** `public/images/characters/curator.png`

#### chef — The Chef (주방장) — District D Boss
**Status:** EXISTS
```
Portrait of the Chef, wearing a traditional white chef toque that is completely engulfed in orange flames forming a crown, severe burn scars on hands and forearms, wielding a blackened oversized iron pan, chef coat stained with soot and grease, a manic grin — the fire has consumed his sanity but not his passion, he once loved food but now only loves fire, he burns rage into power and considers it honest work, dramatic fire underlighting casting harsh upward shadows
```
**File:** `public/images/characters/chef.png`

#### station_master — The Station Master (역장) — Mid-Boss
**Status:** EXISTS
```
Portrait of the Station Master, face is a functioning analog clock with hour and minute hands as eyes, wearing an ornate black vintage railway conductor uniform with gold buttons and trim, a brass whistle in one hand emitting cold vapor, pocket watch chains hanging from vest, rigid military posture, clock hands move in real-time, he manages the trains — and the trains manage the souls, golden clock-light on face against dark station background
```
**File:** `public/images/characters/station_master.png`

#### mayor — The Mayor (시장) — Final Boss
**Status:** EXISTS
```
Portrait of the Mayor of the Abyss, face is a cracked LCD screen displaying data streams and error codes, wearing a formal dark suit that transitions into circuit board patterns at the edges, thousands of cables connecting upward from the body into darkness, a ghost of a human face barely visible beneath the cracked screen, floating monitoring screens orbit around showing surveillance feeds, the designer of the city the judge of souls the final obstacle, deep purple server glow with white data accents, the most inhuman and alien portrait
```
**File:** `public/images/characters/mayor.png`

### 8-4. Missing Character Portraits (NEEDED)

#### shadow_self — Shadow Self (그림자 자아) — Used in combat encounter
**Status:** EXISTS (as character portrait, not just enemy sprite)
```
Portrait of the protagonist's shadow self, identical grey suit to the player but the face is a smooth blank surface — no features at all, a mirror that reflects the shape but none of the content, slightly transparent and shifting, unsettling because it is both the protagonist and utterly empty
```
**File:** `public/images/characters/shadow_self.png`

---

## 9. Batch Generation Workflow

### 9-1. Generation Tool Settings

**Midjourney v6+:**
- Sprites: `--ar 1:1 --style raw --s 50`
- Backgrounds: `--ar 16:9 --style raw --s 100`
- Portraits: `--ar 1:1 --style raw --s 150`
- UI elements: `--ar [match spec] --style raw --s 50 --no background`
- Add `--chaos 10` for organic enemies, `--chaos 0` for UI elements

**DALL-E 3:**
- Use prompts as-is; specify size in the API call
- For transparent backgrounds, generate on solid color and remove in post

**Stable Diffusion (SDXL/Flux):**
- Positive prefix: `(masterpiece:1.2), best quality, `
- Negative prefix: `(worst quality:1.4), (low quality:1.4), 3d, photo, realistic, blurry, watermark, `
- Sprites: Use ControlNet with pixel art checkpoint
- Backgrounds: Use `dark_sushi_mix` or `dreamshaper` checkpoint
- CFG scale: 7-9 for backgrounds, 5-7 for characters
- Steps: 30-50

### 9-2. Production Priority Order

Generate in this order for maximum visual impact with minimum effort:

| Priority | Asset Group | Count | Reason |
|----------|------------|-------|--------|
| 1 | Enemy sprites | 14 | Combat is the most repetitive screen — variety matters most |
| 2 | Character portraits (missing) | 1 | weary_soul is the only missing portrait |
| 3 | Background art (missing 3) | 3 | bg-boss-mayor, bg-ending-remain, bg-gosiwon |
| 4 | UI icons | 24 | Replace emojis system-wide for polished feel |
| 5 | Title logo | 1 | First impression |
| 6 | Death screen overlay | 1 | High-impact moment |
| 7 | UI frames | 15 | Polish layer — the game works without these |
| 8 | Texture overlays | 7 | Subtle enhancement |
| 9 | Effect sprites | 7 | Nice-to-have animation enhancement |
| 10 | Map node icons | 8 | Small but noticeable upgrade |

### 9-3. File Integration Map

Where each asset category is referenced in the codebase:

| Asset | Referenced In | How It's Loaded |
|-------|--------------|-----------------|
| Enemy sprites | `src/ui/CombatUI.js` → `combatRenderers.js` | `<img>` with fallback to CSS (`enemy-sprites.css`) |
| Backgrounds | `src/styles/backgrounds.css` | CSS `background-image: url('/images/bg/...')` |
| Character portraits | `src/data/characters.json` → `DialogueBox.js` | `<img>` loaded from `portrait` field in JSON |
| UI icons | `src/ui/icons.js` | Currently SVG inline; PNG would need new loader |
| UI frames | Not yet referenced | Need CSS integration (border-image or overlay div) |
| Textures | Not yet referenced | CSS `background-image` on panels |
| Effects | Not yet referenced | Need JS spritesheet player |
| Map icons | `src/ui/MapUI.js` | Currently CSS-only; PNG needs img tags |

### 9-4. Directory Structure

```
public/images/
├── enemies/
│   ├── enemy_shadow_self.png
│   ├── enemy_necktie_zombie.png
│   ├── enemy_censor_drone.png
│   ├── enemy_frost_drone.png
│   ├── enemy_rage_fighter.png
│   ├── enemy_ticket_inspector_enemy.png
│   ├── enemy_classification_examiner.png
│   ├── enemy_pain_collector.png
│   ├── enemy_librarian.png
│   ├── enemy_foreman.png
│   ├── enemy_curator.png
│   ├── enemy_chef.png
│   ├── enemy_station_master.png
│   └── enemy_mayor.png
├── bg/
│   ├── bg-subway-modern.jpg      (EXISTS)
│   ├── bg-subway.jpg             (UPGRADE RECOMMENDED)
│   ├── bg-void.jpg               (EXISTS)
│   ├── bg-station.jpg            (EXISTS)
│   ├── bg-tent-city.jpg          (EXISTS)
│   ├── bg-campfire.jpg           (EXISTS)
│   ├── bg-corridor.jpg           (EXISTS)
│   ├── bg-mansion.jpg            (EXISTS)
│   ├── bg-archive.jpg            (EXISTS)
│   ├── bg-exam.jpg               (EXISTS)
│   ├── bg-whisper-market.jpg     (EXISTS)
│   ├── bg-silence.jpg            (EXISTS)
│   ├── bg-office.jpg             (EXISTS)
│   ├── bg-overtime-tower.jpg     (EXISTS)
│   ├── bg-press.jpg              (EXISTS)
│   ├── bg-frozen.jpg             (EXISTS)
│   ├── bg-frozen-corridor.jpg    (EXISTS)
│   ├── bg-apt-interior.jpg       (EXISTS)
│   ├── bg-playground.jpg         (EXISTS)
│   ├── bg-rage.jpg               (EXISTS)
│   ├── bg-furnace-club.jpg       (EXISTS)
│   ├── bg-backstage.jpg          (EXISTS)
│   ├── bg-stall.jpg              (EXISTS)
│   ├── bg-boss.jpg               (EXISTS)
│   ├── bg-boss-librarian.jpg     (EXISTS)
│   ├── bg-boss-foreman.jpg       (EXISTS)
│   ├── bg-boss-curator.jpg       (EXISTS)
│   ├── bg-boss-chef.jpg          (EXISTS)
│   ├── bg-boss-stationmaster.jpg (EXISTS)
│   ├── bg-boss-mayor.jpg         (NEEDED)
│   ├── bg-hall.jpg               (EXISTS)
│   ├── bg-terminal.jpg           (EXISTS)
│   ├── bg-core.jpg               (EXISTS)
│   ├── bg-crying.jpg             (EXISTS)
│   ├── bg-memory-fade.jpg        (EXISTS)
│   ├── bg-ending-gate.jpg        (EXISTS)
│   ├── bg-ending-seoul.jpg       (EXISTS)
│   ├── bg-ending-hospital.jpg    (EXISTS)
│   ├── bg-ending-remain.jpg      (NEEDED)
│   └── bg-gosiwon.jpg            (NEEDED)
├── characters/
│   ├── player.jpg                (EXISTS)
│   ├── guide.jpg                 (EXISTS)
│   ├── lost_one.png              (EXISTS)
│   ├── weary_soul.png            (NEEDED)
│   ├── vending_human.png         (EXISTS)
│   ├── soyeon.jpg                (EXISTS)
│   ├── junseo.jpg                (EXISTS)
│   ├── minjun.jpg                (EXISTS)
│   ├── jeongsu.jpg               (EXISTS)
│   ├── yuri.jpg                  (EXISTS)
│   ├── hayoung.png               (EXISTS)
│   ├── narae.png                 (EXISTS)
│   ├── taehyun.jpg               (EXISTS)
│   ├── miseon.jpg                (EXISTS)
│   ├── youngjae.jpg              (EXISTS)
│   ├── ticket_inspector.png      (EXISTS)
│   ├── librarian.jpg             (EXISTS)
│   ├── foreman.jpg               (EXISTS)
│   ├── curator.png               (EXISTS)
│   ├── chef.png                  (EXISTS)
│   ├── station_master.png        (EXISTS)
│   ├── mayor.png                 (EXISTS)
│   └── shadow_self.png           (EXISTS)
└── ui/
    ├── frames/
    │   ├── title-logo.png
    │   ├── overlay-death.png
    │   ├── frame-dialogue-base.png
    │   ├── frame-dialogue-a.png
    │   ├── frame-dialogue-b.png
    │   ├── frame-dialogue-c.png
    │   ├── frame-dialogue-d.png
    │   ├── frame-dialogue-terminal.png
    │   ├── frame-dialogue-core.png
    │   ├── frame-combat-standard.png
    │   ├── frame-combat-boss.png
    │   ├── frame-enemy-minion.png
    │   ├── frame-enemy-elite.png
    │   ├── frame-enemy-boss.png
    │   ├── frame-portrait.png
    │   ├── frame-choice-normal.png
    │   ├── frame-choice-light.png
    │   ├── frame-choice-dark.png
    │   ├── frame-hp-bar.png
    │   └── frame-stat-bar.png
    ├── icons/
    │   ├── icon-inventory.png
    │   ├── icon-companions.png
    │   ├── icon-dialogue-log.png
    │   ├── icon-save.png
    │   ├── icon-settings.png
    │   ├── icon-home.png
    │   ├── icon-memory.png
    │   ├── icon-engram.png
    │   ├── icon-hp.png
    │   ├── icon-lock.png
    │   ├── icon-check.png
    │   ├── icon-skull.png
    │   ├── icon-dice.png
    │   ├── icon-victory.png
    │   ├── icon-warning.png
    │   ├── icon-stat-body.png
    │   ├── icon-stat-sense.png
    │   ├── icon-stat-reason.png
    │   ├── icon-stat-bond.png
    │   ├── icon-karma-light.png
    │   ├── icon-karma-dark.png
    │   ├── icon-next.png
    │   ├── icon-rest.png
    │   ├── icon-upgrade.png
    │   ├── map-hub.png
    │   ├── map-district-a.png
    │   ├── map-district-b.png
    │   ├── map-district-c.png
    │   ├── map-district-d.png
    │   ├── map-terminal.png
    │   ├── map-core.png
    │   └── map-locked.png
    ├── textures/
    │   ├── tex-panel.png
    │   ├── tex-paper.png
    │   ├── tex-static.png
    │   ├── tex-frost.png
    │   ├── tex-scorch.png
    │   ├── tex-ink.png
    │   └── tex-oil.png
    └── effects/
        ├── fx-dice-roll.png
        ├── fx-damage-numbers.png
        ├── fx-level-up.png
        ├── fx-heal.png
        ├── fx-karma-light.png
        ├── fx-karma-dark.png
        └── fx-memory-loss.png
```

### 9-5. Asset Count Summary

| Category | Total Assets | Already Exist | Need Generation |
|----------|-------------|---------------|-----------------|
| Enemy sprites | 14 | 0 | **14** |
| Backgrounds | 39 | 35 | **3** (+1 upgrade) |
| Character portraits | 23 | 22 | **1** |
| UI frames | 20 | 0 | **20** |
| UI icons | 32 | 0 | **32** |
| Texture overlays | 7 | 0 | **7** |
| Effect sprites | 7 | 0 | **7** |
| **TOTAL** | **142** | **57** | **84** |

---

*Document Version: 2.0*
*Last Updated: 2026-03-16*
*Status: Complete art bible — ready for asset production*
