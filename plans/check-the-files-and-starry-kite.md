# Type Runner — Implementation Plan

## Context

Build a desktop-first browser typing game called "Type Runner" based on two provided spec files. The game combines a clean Monkeytype-style typing test with a chase mechanic: a pixel-art runner (CSS/SVG, drawn in code) is chased by a human chaser. Correct words push them apart; typos and slow typing close the gap. Game ends when time runs out or runner is caught.

No backend needed — all local state. Project uses React + Tailwind CSS v4 + Shadcn/Radix UI components.

---

## Screens & State Machine

`gameStatus`: `"setup"` → `"running"` → `"finished"` | `"caught"`

---

## File Structure

```
src/app/
  App.tsx                        ← main state + routing between screens
  components/
    Navbar.tsx                   ← logo, leaderboard, settings, sound, profile icons
    SetupScreen.tsx              ← difficulty + time selector + start button
    GameScreen.tsx               ← stats bar + word display + chase strip
    WordDisplay.tsx              ← word rendering with letter-level highlighting
    ChaseStrip.tsx               ← horizontal runner/chaser scene
    RunnerSprite.tsx             ← CSS pixel-art runner character
    ChaserSprite.tsx             ← CSS pixel-art chaser character
    LeadMeter.tsx                ← progress bar showing lead distance
    ResultModal.tsx              ← result overlay (Escaped / Almost Caught / Caught)
    LeaderboardModal.tsx         ← dummy leaderboard table
    SettingsModal.tsx            ← theme accent, sound toggle, font size
    StatsBar.tsx                 ← WPM, Accuracy, Time, Correct Words, Lead
```

---

## Core Game State (in App.tsx)

```ts
{
  status: "setup" | "running" | "finished" | "caught",
  difficulty: "beginner" | "mid" | "pro" | "expert",
  timeMode: 30 | 60,
  timeRemaining: number,
  words: string[],
  currentWordIndex: number,
  currentInput: string,
  correctCharacters: number,
  totalTypedCharacters: number,
  correctWords: number,
  mistakes: number,
  combo: number,
  bestCombo: number,
  lead: number,        // 0–100, start at 45
  wpm: number,
  accuracy: number,
  lastKeystrokeTime: number,  // for idle detection
}
```

---

## Word Pools

Four static arrays by difficulty level (from spec):
- **Beginner**: short 3–4 letter common words
- **Mid**: medium 5–7 letter words
- **Pro**: longer 8–10 letter words
- **Expert**: long 10–15 letter hard words

Words shuffled randomly on game start. Generate ~80 words to avoid running out.

---

## Key Mechanics

### Lead System
- Start: `lead = 45`
- Correct word: `lead += 4 + wordLength * difficultyMultiplier`
- Wrong word (space with error): `lead -= typoPenalty` (diff-based)
- Idle >1s: `lead -= passiveRate` per second tick
- Every 5 combo: `lead += 5` bonus
- Clamp: `lead = Math.max(0, Math.min(100, lead))`

### Difficulty multipliers
| Level    | correctBonus | typoPenalty | passiveRate |
|----------|-------------|-------------|-------------|
| Beginner | 0.5x        | 3           | 0.3/s       |
| Mid      | 0.8x        | 5           | 0.6/s       |
| Pro      | 1.0x        | 7           | 1.0/s       |
| Expert   | 1.2x        | 10          | 1.5/s       |

### Timer
- `setInterval` at 100ms ticks
- Decrements `timeRemaining`
- Applies passive chase on idle
- Recalculates WPM/accuracy
- Checks caught/finished conditions

### Word Submission (Space key)
- Compare `currentInput.trim()` to `words[currentWordIndex]`
- Correct → increment correctWords, correctCharacters, combo, increase lead
- Wrong → increment mistakes, reset combo, reduce lead
- Advance `currentWordIndex`, clear `currentInput`

### Result Status
- `lead <= 0` → `"caught"` (game ends immediately)
- `timeRemaining === 0 && lead >= 40` → `"escaped"`
- `timeRemaining === 0 && lead > 0 && lead < 40` → `"almost_caught"`

---

## UI Details

### Navbar
- Left: "Type Runner" logo text (monospace, accent color)
- Right: Leaderboard button, Settings gear icon, Sound toggle (Lucide icons), Profile icon
- Use Shadcn `Button` variant="ghost" for icon buttons

### SetupScreen
- Centered card layout
- Title + tagline
- Difficulty: 4 pill/card buttons (Beginner / Mid / Pro / Expert), selected state highlighted
- Time: 2 toggle buttons (30s / 60s)
- "Start Run" button (large, accent colored)
- Small preview chase strip (animated idle loop)

### WordDisplay
- Display ~3 rows of words (current + lookahead)
- Each word: space-separated spans
- Each letter: colored based on state
  - Untyped: `text-gray-500`
  - Current word letters: colored as user types
  - Correct letter: accent color (yellow/cyan)
  - Wrong letter: `text-red-400` + underline
  - Current caret: blinking `|` after last typed char
- Font: monospace, large (`text-2xl` or larger)
- Scroll words upward as lines are completed

### ChaseStrip
- Full-width horizontal strip, ~80–100px tall
- Dark background with subtle ground line
- `RunnerSprite` positioned by `lead` value (right side when lead is high)
- `ChaserSprite` always on left, distance determined by `lead`
- CSS pixel-art: use `box-shadow` grid technique or SVG `<rect>` elements for blocky pixel characters
- Running animation via CSS keyframes (leg alternation)

### LeadMeter
- Horizontal progress bar below chase strip
- Shows lead 0–100
- Color: green when high, yellow when medium, red when low (<20)

### ResultModal
- Shadcn `Dialog` overlay
- Large result title with color (green=Escaped, yellow=Almost, red=Caught)
- Stats grid: WPM, Accuracy, Correct Words, Mistakes, Best Combo, Difficulty, Time Mode, Final Lead
- Buttons: Retry (same settings), Back to Home, Share Result (copies text to clipboard)

### LeaderboardModal
- Shadcn `Dialog`
- Table with dummy data: Rank, Username, WPM, Accuracy, Difficulty, Time, Result

### SettingsModal
- Shadcn `Dialog`
- Accent color picker (yellow / cyan / lime options)
- Sound toggle (placeholder, no actual audio for MVP)
- Font size slider

---

## Pixel-Art Characters (CSS/SVG approach)

Use SVG with `<rect>` elements on a pixel grid (each rect = 1 pixel unit, e.g. 4×4px). Define a 12×16 pixel canvas per character. Two frames for running animation, toggled via CSS animation.

**RunnerSprite**: hoodie figure, side-view, 2-frame run cycle
**ChaserSprite**: guard/inspector figure, side-view, 2-frame run cycle, slightly different color palette

---

## Design Tokens (via Tailwind classes / CSS vars)

```
Background: #0f0f0f (near black)
Surface: #1a1a1a
Text primary: #e0e0e0
Text muted: #555
Accent: #facc15 (yellow, changeable via settings)
Error: #ef4444
Success: #22c55e
Font (words): font-mono
Font (UI): font-sans
```

---

## Reusable Shadcn Components to Use

- `Button` — all buttons
- `Dialog` / `DialogContent` — result, leaderboard, settings modals
- `Progress` — lead meter bar
- `Separator` — dividers
- `Badge` — difficulty/time labels in result modal
- `Slider` — font size in settings

---

## Verification

1. Setup screen renders with selectors and start button
2. Clicking "Start Run" transitions to game screen
3. Typing words highlights letters correctly (green/red)
4. Space submits word; lead meter updates
5. Chase strip shows runner moving right/left based on lead
6. Timer counts down; passive chase pressure reduces lead when idle
7. Lead reaching 0 triggers "Caught" result
8. Timer reaching 0 triggers "Escaped" or "Almost Caught"
9. Result modal shows correct stats and buttons work
10. Retry restarts with same settings; Back to Home returns to setup
