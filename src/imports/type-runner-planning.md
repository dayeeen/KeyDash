# Type Runner — Planning Document

## 1. Project Overview

**Type Runner** adalah web-based typing game yang menggabungkan pengalaman typing test minimalis seperti Monkeytype dengan elemen chase ala endless runner. Pemain mengetik random English words dalam batas waktu tertentu. Setiap kata yang diketik dengan benar akan membuat karakter runner semakin menjauh dari pengejar. Jika pemain typo atau terlalu lambat mengetik, pengejar akan semakin dekat.

Game ini dirancang sebagai desktop-first web app, bukan mobile game. Fokus utama tetap pada pengalaman mengetik yang clean, cepat, dan readable, sementara elemen runner chase menjadi visual feedback yang membuat latihan typing terasa lebih fun dan kompetitif.

---

## 2. Core Concept

### Game Name

**Type Runner**

### Tagline

**Type fast. Stay ahead.**

### One-Liner

A minimalist web typing game where every correct word helps your runner escape from a human chaser.

### Main Inspiration

- Typing test layout seperti Monkeytype
- Chase tension seperti Subway Surfers
- Pixel-art runner sebagai visual feedback

---

## 3. Target Platform

### Primary Platform

Desktop web browser.

### Layout Direction

- Desktop-first
- Responsive untuk laptop/tablet
- Tidak diprioritaskan sebagai mobile game
- Best viewed in 16:9 browser layout

---

## 4. Target Users

### Primary Users

- Pelajar
- Mahasiswa
- Programmer pemula
- Orang yang ingin meningkatkan typing speed
- User yang suka typing test tapi ingin pengalaman yang lebih fun

### User Motivation

- Melatih WPM
- Melatih accuracy
- Meningkatkan fokus
- Compete dengan diri sendiri
- Mendapat pengalaman typing test yang lebih playful

---

## 5. Game Flow

### Step 1 — Open Web App

User masuk ke halaman utama Type Runner.

### Step 2 — Choose Level

User memilih difficulty level:

- Beginner
- Mid
- Pro
- Expert

### Step 3 — Choose Time

User memilih durasi permainan:

- 30 seconds
- 60 seconds

### Step 4 — Start Run

User menekan tombol **Start Run**.

### Step 5 — Typing Session

Random English words muncul di tengah layar. User mengetik secepat dan seakurat mungkin.

### Step 6 — Chase Feedback

Di bawah typing area, karakter runner dikejar oleh manusia seperti security guard atau police inspector.

- Correct word: runner menjauh
- Typo: chaser mendekat
- Slow typing: chaser perlahan mendekat
- High combo: runner mendapat boost

### Step 7 — End Session

Setelah waktu habis atau runner tertangkap, result modal muncul.

---

## 6. Difficulty Levels

Difficulty memengaruhi panjang kata, kompleksitas kata, dan tekanan chase.

### Beginner

Untuk pemain baru.

- Kata pendek
- Banyak kata umum
- Chase pressure rendah
- Typo penalty kecil

Example words:

```txt
cat run book hand sun blue tree play jump home
```

### Mid

Untuk pemain yang sudah familiar typing.

- Kata medium
- Campuran kata pendek dan panjang
- Chase pressure normal
- Typo penalty sedang

Example words:

```txt
focus runner typing window simple target bright escape
```

### Pro

Untuk pemain cepat.

- Kata lebih panjang
- Lebih banyak variasi
- Chase pressure tinggi
- Typo penalty lebih terasa

Example words:

```txt
keyboard accuracy movement challenge reaction distance
```

### Expert

Untuk pemain yang ingin challenge serius.

- Kata panjang
- Kombinasi kata sulit
- Chase pressure sangat tinggi
- Typo penalty besar
- Butuh speed dan accuracy stabil

Example words:

```txt
performance concentration acceleration unpredictable responsibility
```

---

## 7. Time Modes

### 30 Seconds

Mode cepat untuk quick session.

Cocok untuk:

- Warm-up
- Casual play
- Quick challenge
- User yang ingin replay berkali-kali

### 60 Seconds

Mode standar untuk typing performance.

Cocok untuk:

- Mengukur WPM lebih stabil
- Challenge yang lebih serius
- Leaderboard

---

## 8. Core Gameplay Mechanics

## 8.1 Typing Words

User mengetik word list yang muncul di layar.

Word state:

- Untyped: muted gray
- Current word: brighter text
- Correct letter: accent color
- Incorrect letter: red/glitch mark
- Completed word: faded or success state

## 8.2 Correct Word Mechanic

Setiap kata yang diketik benar memberi efek:

- Runner bergerak maju
- Distance/lead bertambah
- Score naik
- Combo bertambah

Formula sederhana:

```txt
lead += wordLength * difficultyMultiplier
```

## 8.3 Typo Mechanic

Setiap typo memberi efek:

- Accuracy turun
- Combo reset
- Chaser mendekat
- Current letter ditandai merah

Formula sederhana:

```txt
lead -= typoPenalty
```

## 8.4 Slow Typing Mechanic

Jika user berhenti mengetik terlalu lama, chaser perlahan mendekat.

Formula sederhana:

```txt
lead -= passiveChaseRatePerSecond
```

## 8.5 Caught Condition

Jika lead mencapai 0, runner tertangkap.

```txt
if lead <= 0:
  gameState = "caught"
```

## 8.6 Escape Condition

Jika waktu habis dan lead masih di atas 0, user berhasil survive.

```txt
if timeRemaining == 0 and lead > 0:
  gameState = "escaped"
```

---

## 9. Score & Stats

### Main Stats

- WPM
- Accuracy
- Correct Words
- Mistakes
- Combo
- Best Combo
- Time Remaining
- Final Lead / Distance
- Result Status

### WPM Calculation

Standard WPM dapat dihitung dari total karakter benar dibagi 5, lalu disesuaikan dengan waktu.

```txt
WPM = (correctCharacters / 5) / minutesElapsed
```

### Accuracy Calculation

```txt
Accuracy = correctCharacters / totalTypedCharacters * 100
```

### Combo Calculation

Combo naik setiap kata benar berturut-turut.

```txt
if wordCorrect:
  combo += 1
else:
  combo = 0
```

---

## 10. Chase System

### Chase Concept

Chase system adalah representasi visual dari performa typing user.

- Runner = user
- Chaser = pressure
- Lead distance = performa user saat ini

### Lead Value

Lead adalah angka internal yang menentukan jarak runner dan chaser.

Example:

```txt
minLead = 0
maxLead = 100
startingLead = 45
```

### Lead Changes

Correct word:

```txt
lead + 4 to 10
```

Typo:

```txt
lead - 4 to 8
```

Idle / slow typing:

```txt
lead - 1 per second
```

Combo boost:

```txt
Every 5 combo: lead + 5 bonus
```

### Visual Mapping

Lead value diterjemahkan ke jarak visual antara runner dan chaser.

```txt
low lead = chaser close
medium lead = safe distance
high lead = runner far ahead
```

---

## 11. Main Screens

## 11.1 Home / Setup Screen

Purpose:

User memilih level dan waktu sebelum mulai.

Elements:

- Logo: Type Runner
- Tagline: Type fast. Stay ahead.
- Difficulty selector:
  - Beginner
  - Mid
  - Pro
  - Expert
- Time selector:
  - 30 sec
  - 60 sec
- Start Run button
- Small preview chase strip
- Best score summary

## 11.2 Gameplay Screen

Purpose:

Tempat user mengetik dan melihat chase feedback.

Elements:

- Top navigation
- Live stats
  - WPM
  - Accuracy
  - Time
  - Correct Words
  - Lead
- Main word area
- Typing caret
- Chase strip below words
- Runner character
- Human chaser
- Progress/lead meter

## 11.3 Result Modal

Purpose:

Menampilkan hasil setelah game selesai.

Elements:

- Result title:
  - Escaped!
  - Almost Caught!
  - Caught!
- Final WPM
- Accuracy
- Correct Words
- Mistakes
- Best Combo
- Difficulty
- Time Mode
- Final Distance
- Retry button
- Back to Setup button
- Share Result button

## 11.4 Leaderboard Screen

Purpose:

Menampilkan score terbaik.

Elements:

- Rank
- Username
- WPM
- Accuracy
- Difficulty
- Time Mode
- Result

For MVP, leaderboard bisa menggunakan dummy data terlebih dahulu.

## 11.5 Settings Modal

Purpose:

User mengatur preferensi tampilan.

Elements:

- Theme accent color
- Sound on/off
- Show/hide chase strip
- Font size
- Reduced motion mode

---

## 12. UI Style Guide

### Overall Style

- Dark minimalist
- Clean typing-test interface
- Pixel-art accent
- Focused and readable
- Game layer tidak boleh terlalu ramai

### Color Direction

Suggested colors:

```txt
Background: dark charcoal / near black
Main text: soft gray / off-white
Muted text: gray
Accent: yellow, cyan, or lime
Error: red
Success: green or accent color
```

### Typography

- Monospace font for typing words
- Clean sans-serif for UI labels
- Large word text
- Strong spacing between words

### Visual Priority

1. Typing words
2. Current typing state
3. Timer and WPM
4. Chase strip
5. Other navigation items

---

## 13. Character Direction

## 13.1 Runner Character

### Concept

A youthful streetwear runner.

### Visual Details

- Hoodie
- Sneakers
- Small backpack
- Energetic running pose
- Pixel-art style
- Simple silhouette

### Personality

- Fast
- Focused
- Slightly nervous
- Playful

## 13.2 Chaser Character

### Concept

A human chaser inspired by endless runner games.

### Options

- Security guard
- Police inspector
- School hall monitor
- Train station guard

### Visual Details

- Human, not monster
- Uniform or authority outfit
- Playful expression
- Slightly exaggerated running pose
- Not scary or violent

---

## 14. Word Generation

### Word Pool by Difficulty

Each level uses a different word pool.

### Beginner Pool

```txt
cat dog run sun book hand tree play home blue fast jump kind road
```

### Mid Pool

```txt
focus typing runner window simple target escape motion bright signal
```

### Pro Pool

```txt
keyboard accuracy distance challenge reaction pressure movement progress
```

### Expert Pool

```txt
performance concentration acceleration responsibility unpredictable coordination
```

### Word Rules

- Words are lowercase
- No punctuation for MVP
- No numbers for MVP
- English only for first version
- Words appear in random order

---

## 15. MVP Scope

### Must Have

- Difficulty selection
- Time selection: 30 / 60 seconds
- Random English words
- Typing input handling
- Correct/incorrect letter feedback
- WPM calculation
- Accuracy calculation
- Timer
- Correct words count
- Chase strip visual
- Human chaser
- Result modal
- Retry flow

### Nice to Have

- Combo system
- Leaderboard
- Character skin selection
- Sound effects
- Animations
- Share result
- Settings modal

### Not for MVP

- Multiplayer
- Mobile-first controls
- Complex obstacle system
- Power-ups
- Story mode
- Login system
- Real-time online leaderboard

---

## 16. Suggested Component Structure

```txt
App
├── Navbar
├── SetupPanel
│   ├── DifficultySelector
│   ├── TimeSelector
│   └── StartButton
├── GameScreen
│   ├── StatsBar
│   ├── WordDisplay
│   ├── TypingInput
│   ├── ChaseStrip
│   │   ├── RunnerSprite
│   │   └── ChaserSprite
│   └── LeadMeter
├── ResultModal
├── LeaderboardModal
└── SettingsModal
```

---

## 17. Game State Structure

Example state:

```js
const gameState = {
  status: "setup", // setup | running | finished | caught
  difficulty: "beginner",
  timeMode: 30,
  timeRemaining: 30,
  words: [],
  currentWordIndex: 0,
  currentInput: "",
  correctCharacters: 0,
  totalTypedCharacters: 0,
  correctWords: 0,
  mistakes: 0,
  combo: 0,
  bestCombo: 0,
  lead: 45,
  wpm: 0,
  accuracy: 100
};
```

---

## 18. Basic Game Logic

### Start Game

```txt
1. User selects difficulty
2. User selects time mode
3. Generate random words
4. Reset stats
5. Set lead to starting value
6. Start timer
7. Change game status to running
```

### During Typing

```txt
1. Listen to keyboard input
2. Compare input with current word
3. Highlight correct and wrong letters
4. When user presses space:
   - Check if word is correct
   - If correct, add correct word count and increase lead
   - If wrong, add mistake and reduce lead
   - Move to next word
```

### Timer Tick

```txt
1. Reduce time remaining
2. Apply passive chase pressure
3. Update WPM
4. Update accuracy
5. Check caught condition
6. Check time finished condition
```

### End Game

```txt
1. Stop timer
2. Calculate final stats
3. Show result modal
```

---

## 19. Result Status Rules

### Escaped

Condition:

```txt
timeRemaining == 0 and lead >= 40
```

### Almost Caught

Condition:

```txt
timeRemaining == 0 and lead > 0 and lead < 40
```

### Caught

Condition:

```txt
lead <= 0
```

---

## 20. Interaction Details

### Start Button

- Starts game after level and time are selected
- Disabled only if setup is incomplete

### Retry Button

- Restarts game using previous difficulty and time mode

### Back to Setup

- Returns user to setup screen

### Space Key

- Submits current word
- Moves to next word

### Tab + Enter

Optional shortcut to restart test.

---

## 21. Animation Ideas

### Runner Animation

- Idle bounce on setup
- Running loop during game
- Speed boost when correct word submitted
- Stumble when typo happens

### Chaser Animation

- Running loop
- Gets visually closer when lead decreases
- Small frustration animation when runner gains distance

### Word Animation

- Correct letter: subtle color transition
- Wrong letter: quick shake/glitch
- Current caret: blinking

---

## 22. Sound Ideas

For MVP, sound can be optional.

Possible sounds:

- Key press tick
- Correct word blip
- Typo buzz
- Combo boost
- Caught sound
- Result success sound

Need sound toggle in navbar/settings.

---

## 23. Accessibility Notes

- Keep contrast high
- Avoid relying only on color for error state
- Include reduced motion mode
- Keep font size adjustable
- Make keyboard interaction smooth
- Do not make chase strip too distracting

---

## 24. Success Criteria

The prototype is successful if users can:

- Understand the game concept within 5 seconds
- Select difficulty and time easily
- Start typing without confusion
- See immediate feedback for correct/wrong typing
- Understand that correct words increase distance
- Feel tension from the chaser
- View final typing performance clearly

---

## 25. Pitch Summary

**Type Runner** turns a normal typing test into a playful chase game. Instead of only seeing WPM and accuracy, users see their performance represented by a runner escaping from a human chaser. Every correct word creates distance, while mistakes and slow typing bring the chaser closer. The result is a focused, browser-based typing experience that feels competitive, satisfying, and more engaging than a standard typing test.
