Build a desktop-first responsive web app prototype for a typing game called “Type Runner”.

Type Runner is a minimalist web typing game mixed with a playful chase mechanic. The main experience should feel like a clean typing test website, but with a small runner chase scene underneath the words.

This is a WEB game, not a mobile app. Prioritize a 16:9 desktop browser layout.

Core concept:
The player selects a difficulty level and a time duration before starting. During the game, random English words appear in the center. The player types them as fast and accurately as possible. Every correctly typed word increases the distance between the runner and the chaser. Typos, slow typing, or inactivity allow the chaser to get closer.

Game name:
Type Runner

Tagline:
Type fast. Stay ahead.

Visual style:
Use a dark minimalist UI inspired by modern typing test websites. The interface should be clean, focused, and readable. Add a subtle arcade/pixel runner layer below the typing area. The game should feel modern, polished, playful, and slightly tense.

Main screens / states:

1. Home / Setup Screen
   Create a centered setup panel with:

* Game title: Type Runner
* Tagline: Type fast. Stay ahead.
* Difficulty selector:

  * Beginner
  * Mid
  * Pro
  * Expert
* Time selector:

  * 30 seconds
  * 60 seconds
* Start button: Start Run

Add a simple top navigation:

* Type Runner logo/text
* Leaderboard
* Settings
* Sound icon
* Profile icon

Difficulty behavior:

* Beginner: short and simple English words
* Mid: medium common English words
* Pro: longer words and faster pressure
* Expert: longer and harder words with less room for mistakes

2. Gameplay Screen
   Create a clean typing test layout.

Top stats bar:

* WPM
* Accuracy
* Time remaining
* Correct words
* Lead distance

Main typing area:

* Display random English words in multiple lines at the center
* Make the current word and current letter visually highlighted
* Correct letters should change to a success color
* Wrong letters should become red or glitch-styled
* Show a blinking caret
* The text must be large, readable, and the main focus of the page

Typing interaction:

* User types into the game directly
* Pressing space completes a word
* If the word is typed correctly, increment correct words and increase runner lead
* If the word is incorrect, reduce accuracy and let the chaser get closer
* Timer starts when the player begins typing
* Game ends when timer reaches zero or when the chaser catches the runner

Chase scene area:
Place this below the typing words as a horizontal visual strip.

* Show a small pixel-art runner character in casual streetwear
* Show a human chaser behind the runner, like a security guard or police inspector
* Do NOT use a monster
* The vibe should be playful and similar to an endless runner chase
* The runner gets farther away when the user types correctly
* The chaser gets closer when the user makes mistakes or types too slowly
* Use a simple distance/progress visualization
* Keep this area fun but secondary to the typing words

Runner character:

* Casual hoodie
* Sneakers
* Youthful and energetic
* Pixel-art style
* Small readable side-view running pose

Chaser character:

* Human chaser, not scary
* Security guard / police inspector style
* Playful arcade expression
* Pixel-art style
* Side-view running pose

3. Result Screen / Modal
   Show a centered result card after the session ends.

Include:

* Result status:

  * Escaped
  * Almost Caught
  * Caught
* Final WPM
* Accuracy
* Correct words
* Selected difficulty
* Selected time mode
* Final lead distance
* Best streak

Buttons:

* Retry
* Back to Home
* Share Result

Game logic details:
Use simulated local data only. No backend is needed.

WPM formula:
Calculate WPM based on typed characters or correct completed words over elapsed time.

Accuracy formula:
Correct characters or correct words divided by total typed attempts.

Lead / chase mechanic:

* Start with a medium safe distance
* Correct word: runner gains distance
* Incorrect word: chaser gets closer
* Idle or slow typing: chaser gradually gets closer
* Higher difficulties should make the chaser pressure stronger
* If lead distance reaches zero, the player is caught and the game ends

Suggested difficulty pressure:

* Beginner: forgiving chase speed, simple words
* Mid: normal chase speed
* Pro: faster chase pressure, longer words
* Expert: highest pressure, longer words, mistakes are more punishing

UI components needed:

* Difficulty selector cards or pills
* Time selector toggle
* Start button
* Typing word display
* Typing caret
* Stats bar
* Chase distance strip
* Pixel runner
* Pixel human chaser
* Result modal
* Retry button

Design requirements:

* Desktop-first web layout
* Dark charcoal background
* Muted gray text for inactive words
* Bright accent color for active typing
* Red accent for mistakes
* Clean spacing
* Strong readability
* Smooth transitions
* Minimal clutter
* The typing words must always be the main focus

Mood:
Focused, competitive, playful, tense, satisfying.

Overall goal:
Create a polished working prototype of a browser typing game where the user practices typing random English words while visually trying to stay ahead of a human chaser.
