# Required Image List

## Image Folder Locations
```
public/images/bg/          <- Background images
public/images/characters/   <- Character images
```

> Once you add the images, I can handle linking them via CSS or JS in the code.
> Recommended sizes: Backgrounds 800x600, Characters 200x400 (transparent PNG)

---

## Background Images (7 images)

| Filename | Scene | Mood Description |
|----------|-------|------------------|
| `bg-void.png` | Abyss Void | Complete darkness. A black space with faint light particles floating. A cosmic emptiness. |
| `bg-station.png` | Abandoned Subway Station | An abandoned subway platform. Rusty rails, dusty benches, broken fluorescent lights flickering. Scratched marks on concrete walls. |
| `bg-corridor.png` | Corridor of Memories | A long corridor filled with purple mist. Blurry mirrors line both walls. Glass fragments on the floor. Dreamlike and unsettling atmosphere. |
| `bg-crying.png` | Room of Tears | A dark blue space. Water (tears) streams down the walls. Shallow puddles on the floor. Cold and sorrowful atmosphere. |
| `bg-silence.png` | Path of Silence | A blindingly white space. No distinction between walls, floor, and ceiling — all white. No shadows. Clean but unsettlingly empty. |
| `bg-hall.png` | B1 Central Hall | A massive underground space. A dim red light pulses from the high ceiling. Three arched entrances. An ancient temple feel. |
| `bg-boss.png` | Boss Battle | A dark space pulsing with red light. Thousands of glass shards (pain fragments) gleam on the floor. Overwhelmingly oppressive. |

---

## Character Images (5 images)

| Filename | Character | Appearance Description |
|----------|-----------|----------------------|
| `guide.png` | The Guide | A homeless-looking being wrapped in rags. Hood pulled deep over the face, only tired eyes visible. An expression neither kind nor malicious. |
| `lost_one.png` | The Lost One | A faceless being. The eye/nose/mouth areas are smoothly blank. Curled up posture. A faint blue light (tears) drips from its body. |
| `collector.png` | The Pain Collector | A neat black coat. Elegant demeanor. Eyes composed of thousands of tiny pupil fragments (kaleidoscope-like eyes). A smile. |
| `shadow_self.png` | Shadow Self | The protagonist's silhouette but completely black shadow. Only the eye area glows with hollow white light. As if it emerged from a mirror. |
| `mirror.png` | Voice in the Mirror | (Optional) A cracked mirror. A blurry figure is reflected inside. Identity unknown — only a silhouette. Foreshadowing for B3. |

---

## Priority

**Priority 1 (these alone dramatically change the atmosphere):**
- `bg-station.png` — Prologue main background
- `bg-corridor.png` — Corridor of Memories
- `bg-boss.png` — Boss battle
- `collector.png` — Main boss
- `guide.png` — The Guide (first NPC)

**Priority 2:**
- `bg-crying.png`, `bg-silence.png`, `bg-hall.png`
- `lost_one.png`, `shadow_self.png`

**Priority 3:**
- `bg-void.png` (CSS gradients are sufficient)
- `mirror.png` (fully appears in B3)
