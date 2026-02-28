# Prologue: Turnstile Error

## Design Principles
- **Tone:** Detached third-person observer. Minimize emotional adjectives. Convey only facts.
- **Length:** 5~10 minutes (12~18 scenes, including combat)
- **First choice:** Immediately after turnstile error (scenes 3~4)
- **Goal:** Show through experience, not exposition. Explanations come at Platform 0.

---

## Scene Flow

### -- ACT 1: Turnstile (Scenes 1~4) --

**[P-001] The Commute Home**
> 6:47 PM. A subway station somewhere in Seoul.
> He stood before the turnstile. A transit card in hand. A convenience store receipt in his pocket.
> Another unremarkable day.

-> Auto-advance

**[P-002] The Tap**
> He tapped the card.
> 'Beeeep---'
> The turnstile didn't open.
> Text appeared on the terminal screen.
>
> `[Insufficient Emotional Mass — Subject Reclassified for Transport]`
> `[Processing Code: NULL]`
>
> Before he could read those words, the floor beneath him vanished.

-> Auto-advance

**[P-003] The Fall** (first choice)
> He was falling.
> Into darkness. Soundlessly. Without wind.
> Only the sound of something like machine noise rising from below.
>
> What crossed his mind was—

-> **Choices (karma initial set + character personality hint):**
1. `'I'm going to be late for work.'` -> Karma stays 0, Reason+1 temp buff [numb/practical]
2. `'...Nothing came to mind.'` -> Karma stays 0, Sense+1 temp buff [empty/honest]
3. `'Someone help me.'` -> Karma +5 (Light), Bond+1 temp buff [humane/vulnerable]

> *(Regardless of choice, result text:)*
> Before the thought finished, his back hit the ground.
> Cold, smooth tile floor. Fluorescent light.

-> Auto-advance -> P-004

---

### -- ACT 2: Arriving at Platform 0 (Scenes 4~7) --

**[P-004] The Floor**
> He could see the ceiling. Concrete. Fluorescent lights. Pipes.
> A subway station. Similar to the one before, but different.
>
> The platform sign read:
>
> **"Platform 0 — Central Transfer Center"**
> **"Temporary Storage for Unclassified Data"**
>
> Nothing passed over the tracks.
> Instead, throughout the platform, people — or things that once were people — sat about.

-> Auto-advance

**[P-005] Tent City**
> Tents and shanties lined the platform.
> Figures huddled under old blankets. A hand retrieving something from a vending machine.
> Someone leaned against the wall, staring into nothing.
>
> Their eyes shared one thing in common.
> No one found this place strange.

-> **Choices (exploration vs progression):**
1. `Talk to the nearest person.` -> P-006A
2. `Read the sign more carefully.` -> P-006B
3. `Start moving to find an exit.` -> P-006C

**[P-006A] Conversation Attempt**
> "Where is this?"
> The blanketed figure raised its head.
> It had no eyes. The eyelids were smoothly sealed shut.
>
> "...New arrival? Turnstile?"
>
> It lowered its head again.
> "Tough luck."

-> P-007

**[P-006B] Sign**
> Small text was densely packed beneath the sign.
>
> `[Data awaiting processing is prohibited from moving outside designated zones]`
> `[Retention period for unclassified data: None]`
> `[Complaint office: Not applicable]`
>
> At the bottom, someone had scratched with a pen:
> **"This isn't a waiting room, it's a dumpster"**

-> P-007

**[P-006C] Exit Search**
> You walked to both ends of the platform.
> One end had a lowered shutter.
> The other end had tracks leading into darkness.
>
> Something blinked in the darkness. A red dot. Like a CCTV camera.
>
> The blinking stopped, then began moving toward you.

-> P-007

---

### -- ACT 3: Ticket Inspector Encounter — First Combat (Scenes 7~12) --

**[P-007] Warning Sound**
> An announcement played over the platform.
>
> `"Unregistered data detected. Verifying coordinates."`
> `"Ticket Inspector dispatched. Code NULL processing standby."`
>
> The fluorescent lights flickered once.
> Something emerged from the darkness near the tracks.

-> Auto-advance

**[P-008] Ticket Inspector Appears**
> It was at least 2 meters tall.
> It wore a station worker's uniform, but the head was not human.
> A CCTV camera was embedded where the head should be. The lens slowly focused.
>
> In one hand, a tablet. In the other — something resembling a turnstile barrier arm.
>
> "Code: NULL. Classification: Impossible. Processing: Discard."
>
> The barrier arm rose.

-> **Choices (combat entry method — determines first turn bonus):**
1. `Dodge.` -> Sense check, DC 5 [Easy] — Success: first strike on turn 1
2. `Block.` -> Body check, DC 6 [Normal] — Success: damage reduction
3. `Speak to it.` -> Bond check, DC 7 [Hard] — Success: enemy stunned for 1 turn

> *(This choice doubles as Round 1 of combat)*

---

### -- Combat: Ticket Inspector (COMBAT) --

**Combat Data:**
```
Name: Ticket Inspector
HP: 12
Attack: 4 (barrier arm strike)
Defense: None
Pattern: "Scan -> Strike" repeated each turn
Special: Uses "Call" every 2 turns — next turn DC +1
Weakness: Reason check "Tablet Hack" possible — 1 turn stun
```

**Round Structure (3 rounds):**

**Round 1** (P-008 choice result reflected here)
> The Ticket Inspector's barrier arm slices through the fluorescent light as it comes down.

Choices:
1. `Roll sideways to dodge` -> Sense DC 5, Success: dodge, Failure: -3 HP
2. `Block with your arm` -> Body DC 6, Success: -1 HP, Failure: -4 HP
3. `Kick its legs` -> Body DC 6, Success: enemy HP -4, Failure: -3 HP
4. `Read its pattern` -> Reason DC 6, Success: next turn DC -2, Failure: -3 HP

**Round 2**
> The Ticket Inspector raises its tablet. Red text scrolls across the screen.
> "Subject resisting. Additional Ticket Inspector call on standby."

Choices:
1. `Snatch the tablet` -> Sense DC 6, Success: enemy HP -5 + call canceled, Failure: -4 HP
2. `Grab and twist the barrier arm` -> Body DC 7, Success: enemy HP -6, Failure: -4 HP
3. `Back away to create distance` -> Sense DC 5, Success: dodge, Failure: -3 HP
4. `Say "I am a passenger"` -> Bond DC 7, Success: enemy stunned 1 turn (system confusion), Failure: no effect

**Round 3 (Finale)**
> The Ticket Inspector's movements have slowed. The lens is cracked.
> But it's still standing.

Choices:
1. `Shove with full force` -> Body DC 5, Success: enemy HP -5, Failure: -3 HP
2. `Smash the tablet screen` -> Sense DC 5, Success: enemy HP -6, Failure: -2 HP
3. `Lure it toward the tracks` -> Reason DC 6, Success: enemy HP -8 (fall), Failure: -4 HP
4. [Karma <= -5] `Jam your finger into the lens` -> Body DC 4, enemy HP -10, Karma -5 [cruel]

---

### -- ACT 4: Post-Combat — Prologue End (Scenes 13~15) --

**[P-009] Combat End (Victory)**
> The Ticket Inspector collapsed.
> Something like oil leaked from inside the uniform. Not blood.
> The tablet screen flickered and went dark.
>
> `[Processing failed. Session log saved. Awaiting redeployment.]`
>
> The fluorescent lights stabilized again.

-> Auto-advance

**[P-010] First Engram**
> Something rose from the Ticket Inspector's remains.
> A glowing crystal. About the size of a finger joint.
> When touched, it dissolved into your hand.
>
> **[Engram Acquired: Ticket Inspector Code Fragment]**
> *(Choose any stat +1 — first growth experience)*

-> Stat selection UI

**[P-011] The Guide's Voice**
> "Still alive, huh."
>
> A voice came from behind.
> Turning around, someone was approaching from the tent city.
>
> An old station worker vest. But different from the Ticket Inspector.
> It was a person. — Something that was once a person.
>
> "Not bad for a newcomer. What's your name?"
> "...Oh, right. Names are meaningless here."

-> Auto-advance

**[P-012] Prologue End**
> "Come to the tent for now. I have things to explain."
>
> He followed the Guide.
> The tiles underfoot were cold.
> Above, the announcement played again.
>
> `"Platform 0 — Current occupants: 47. Unclassified: 1."`
>
> ---
> **Prologue End**
> **Chapter 1: Platform 0 — Unlocked**
> ---

---

## Prologue Summary

| Item | Details |
|------|---------|
| Scene count | 12 (15 including choice branches) |
| Choice count | 3 (during fall + exploration + combat entry) + 3 combat rounds |
| Combats | 1 (Ticket Inspector, 3 rounds) |
| Playtime | Approximately 5~8 minutes |
| Rewards | 1 engram (stat +1) |
| Karma change | Min -5 to max +5 |
| Result | Entry to Platform 0 hub |

## Information Conveyed in Prologue (through experience, not exposition)
- The protagonist is a living person (different from other beings)
- This is a subway station-like place
- The system treats the protagonist as an 'error'
- Enemies are administrative/mechanical beings
- Choices lead to different outcomes
- Stat checks exist (dice rolls)
- Growth (engrams) exists
- A guide (NPC) exists
- Companion system (revealed in Chapter 1)
- Specific karma effects (revealed gradually)
- Real memory/death system (revealed at first death)
