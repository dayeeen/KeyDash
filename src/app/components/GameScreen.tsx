import { useEffect, useRef, useCallback } from "react";
import { Flame } from "lucide-react";
import { StatsBar } from "./StatsBar";
import { WordDisplay } from "./WordDisplay";
import { ChaseStrip } from "./ChaseStrip";
import { LeadMeter } from "./LeadMeter";
import { Difficulty, TimeMode, DIFFICULTY_CONFIG, calcWPM, calcAccuracy, generateWordList, startingLeadFor, MAX_LEAD, CharacterDef, MapDef } from "../gameData";

export interface GameState {
  status: "setup" | "running" | "finished" | "caught";
  difficulty: Difficulty;
  timeMode: TimeMode;
  timeRemaining: number;
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  correctCharacters: number;
  totalTypedCharacters: number;
  correctWords: number;
  mistakes: number;
  combo: number;
  bestCombo: number;
  wordCorrect: (boolean | null)[];
  lead: number;
  wpm: number;
  accuracy: number;
  lastKeystrokeTime: number;
  gameStartTime: number;
  endedManually: boolean;
  hasStarted: boolean;
}

function ComboChip({ combo }: { combo: number }) {
  // Heat tiers: 2x warm yellow, 5x orange, 8x+ red-hot
  const tier =
    combo >= 8 ? { ring: "#ef4444", glow: "#f97316", text: "#fff7ed" } :
    combo >= 5 ? { ring: "#f97316", glow: "#fb923c", text: "#fff7ed" } :
                 { ring: "#facc15", glow: "#fde047", text: "#1a1100" };
  const flameSize = combo >= 8 ? 18 : combo >= 5 ? 16 : 14;
  return (
    <div
      key={combo}
      className="relative font-mono font-bold flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        background: tier.ring,
        color: tier.text,
        border: "2px solid #0a0a0a",
        fontSize: 13,
        letterSpacing: "0.12em",
        boxShadow: `0 3px 0 #050505, 0 0 18px ${tier.glow}aa, 0 0 36px ${tier.glow}55`,
        animation: "comboPulse 0.9s ease-in-out infinite",
      }}
    >
      <Flame
        size={flameSize}
        fill={tier.glow}
        style={{
          color: tier.ring,
          filter: `drop-shadow(0 0 6px ${tier.glow})`,
          animation: "flameFlicker 0.35s ease-in-out infinite alternate",
        }}
      />
      <span>{combo}x COMBO</span>
      <Flame
        size={flameSize - 2}
        fill={tier.glow}
        style={{
          color: tier.ring,
          filter: `drop-shadow(0 0 6px ${tier.glow})`,
          animation: "flameFlicker 0.42s ease-in-out infinite alternate-reverse",
        }}
      />
      <style>{`
        @keyframes comboPulse {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-1px) scale(1.03); }
        }
        @keyframes flameFlicker {
          0% { transform: translateY(0) scaleY(1) rotate(-2deg); opacity: 1; }
          100% { transform: translateY(-1px) scaleY(1.15) rotate(2deg); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

export function createInitialGameState(difficulty: Difficulty, timeMode: TimeMode): GameState {
  return {
    status: "running",
    difficulty,
    timeMode,
    timeRemaining: timeMode,
    words: generateWordList(difficulty),
    currentWordIndex: 0,
    currentInput: "",
    correctCharacters: 0,
    totalTypedCharacters: 0,
    correctWords: 0,
    mistakes: 0,
    combo: 0,
    bestCombo: 0,
    wordCorrect: [],
    lead: startingLeadFor(difficulty),
    wpm: 0,
    accuracy: 100,
    lastKeystrokeTime: Date.now(),
    gameStartTime: Date.now(),
    endedManually: false,
    hasStarted: false,
  };
}

interface GameScreenProps {
  gameState: GameState;
  accentColor: string;
  fontSize: number;
  character: CharacterDef;
  map: MapDef;
  onStateChange: (updater: (prev: GameState) => GameState) => void;
  onGameEnd: (state: GameState) => void;
}

export function GameScreen({ gameState, accentColor, fontSize, character, map, onStateChange, onGameEnd }: GameScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  const endGame = useCallback((state: GameState) => {
    if (timerRef.current) clearInterval(timerRef.current);
    onGameEnd(state);
  }, [onGameEnd]);

  const handleEndRun = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "running") return;
    endGame({ ...s, status: "finished", timeRemaining: 0, endedManually: true });
  }, [endGame]);

  // Keep input focused: refocus on any keypress or click anywhere
  useEffect(() => {
    const refocus = () => {
      if (stateRef.current.status === "running" && document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      // Ignore modifier-only keys
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      refocus();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", refocus);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", refocus);
    };
  }, []);

  // Timer tick
  useEffect(() => {
    inputRef.current?.focus();

    timerRef.current = setInterval(() => {
      onStateChange(prev => {
        if (prev.status !== "running") return prev;
        // Pause everything until first valid keypress
        if (!prev.hasStarted) return prev;

        const now = Date.now();
        const cfg = DIFFICULTY_CONFIG[prev.difficulty];
        const idleSeconds = (now - prev.lastKeystrokeTime) / 1000;
        const tickSeconds = 0.1;

        // Chaser always closes the gap. Idle time accelerates the drain.
        const idleMultiplier = 1 + Math.min(2, idleSeconds * 0.8);
        let newLead = prev.lead - cfg.passiveRate * tickSeconds * idleMultiplier;

        newLead = Math.max(0, Math.min(MAX_LEAD, newLead));

        const elapsed = (now - prev.gameStartTime) / 1000;
        const newWpm = calcWPM(prev.correctCharacters, elapsed);
        const newAccuracy = calcAccuracy(prev.correctCharacters, prev.totalTypedCharacters);
        const newTimeRemaining = Math.max(0, prev.timeRemaining - tickSeconds);

        const newState = {
          ...prev,
          lead: newLead,
          wpm: newWpm,
          accuracy: newAccuracy,
          timeRemaining: Math.round(newTimeRemaining * 10) / 10,
        };

        // Caught
        if (newLead <= 0) {
          setTimeout(() => endGame({ ...newState, status: "caught", lead: 0 }), 0);
          return { ...newState, status: "caught", lead: 0 };
        }

        // Time up
        if (newTimeRemaining <= 0) {
          const finalState = { ...newState, status: "finished" as const, timeRemaining: 0 };
          setTimeout(() => endGame(finalState), 0);
          return finalState;
        }

        return newState;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState.status !== "running") return;

    if (e.key === " ") {
      e.preventDefault();
      const input = stateRef.current.currentInput.trim();
      if (!input) return;

      onStateChange(prev => {
        const currentWord = prev.words[prev.currentWordIndex];
        const isCorrect = input === currentWord;
        const cfg = DIFFICULTY_CONFIG[prev.difficulty];

        let newLead = prev.lead;
        let newCorrectChars = prev.correctCharacters;
        let newMistakes = prev.mistakes;
        let newCombo = prev.combo;
        let newCorrectWords = prev.correctWords;

        const typed = input.length;
        let newTotalChars = prev.totalTypedCharacters + typed;

        if (isCorrect) {
          newLead += cfg.leadPerWord;
          // Standard typing-test WPM: include the trailing space as a correct char
          newCorrectChars += currentWord.length + 1;
          newTotalChars += 1; // count the space keystroke too
          newCombo += 1;
          newCorrectWords += 1;
          if (newCombo % 5 === 0) newLead += 5;
        } else {
          newLead -= cfg.typoPenalty;
          newMistakes += 1;
          newCombo = 0;
          // Count correct chars in the word
          let cc = 0;
          for (let i = 0; i < Math.min(input.length, currentWord.length); i++) {
            if (input[i] === currentWord[i]) cc++;
          }
          newCorrectChars += cc;
        }

        newLead = Math.max(0, Math.min(MAX_LEAD, newLead));
        const newBestCombo = Math.max(prev.bestCombo, newCombo);
        const newWordCorrect = prev.wordCorrect.slice();
        newWordCorrect[prev.currentWordIndex] = isCorrect;

        return {
          ...prev,
          currentInput: "",
          currentWordIndex: prev.currentWordIndex + 1,
          correctCharacters: newCorrectChars,
          totalTypedCharacters: newTotalChars,
          correctWords: newCorrectWords,
          mistakes: newMistakes,
          combo: newCombo,
          bestCombo: newBestCombo,
          wordCorrect: newWordCorrect,
          lead: newLead,
          lastKeystrokeTime: Date.now(),
        };
      });
    }
  }, [gameState.status, onStateChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState.status !== "running") return;
    const value = e.target.value;
    onStateChange(prev => {
      const isFirstKey = !prev.hasStarted && value.length > 0 && /[a-zA-Z]/.test(value);
      const now = Date.now();
      return {
        ...prev,
        currentInput: value,
        lastKeystrokeTime: now,
        ...(isFirstKey ? { hasStarted: true, gameStartTime: now } : {}),
      };
    });
  }, [gameState.status, onStateChange]);

  // Warning vignette intensity: ramps up as lead drops below 40
  const lead = gameState.lead;
  const warnT = Math.max(0, Math.min(1, (40 - lead) / 40)); // 0 at 40+, 1 at 0
  const critical = lead < 15 && gameState.status === "running";
  const warnColor = lead < 15 ? "239, 68, 68" /* red */ : "250, 204, 21" /* yellow */;
  const vignetteOpacity = gameState.status === "running" ? warnT * 0.85 : 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* Warning vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          boxShadow: `inset 0 0 ${80 + warnT * 180}px ${20 + warnT * 60}px rgba(${warnColor}, ${vignetteOpacity})`,
          transition: "box-shadow 200ms ease-out",
          animation: critical ? "screen-warn 0.5s ease-in-out infinite" : "none",
        }}
      />
      <style>{`
        @keyframes screen-warn {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.35); }
        }
      `}</style>
      {/* End Run button */}
      <button
        onClick={handleEndRun}
        className="absolute top-2 right-2 sm:top-3 sm:right-4 z-30 px-2.5 sm:px-3 py-1 rounded font-mono uppercase transition-colors"
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "#666",
          background: "#0d0d0d",
          border: "1px solid #222",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "#ef4444";
          e.currentTarget.style.borderColor = "#ef444466";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "#666";
          e.currentTarget.style.borderColor = "#222";
        }}
      >
        End Run
      </button>

      <StatsBar
        wpm={gameState.wpm}
        accuracy={gameState.accuracy}
        timeRemaining={Math.ceil(gameState.timeRemaining)}
        correctWords={gameState.correctWords}
        lead={Math.round(gameState.lead)}
        accentColor={accentColor}
        difficulty={gameState.difficulty}
        timeMode={gameState.timeMode}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto w-full">
        {/* Combo badge */}
        {gameState.combo >= 2 && (
          <ComboChip combo={gameState.combo} />
        )}

        {/* Word display */}
        <div className="w-full">
          <WordDisplay
            words={gameState.words}
            currentWordIndex={gameState.currentWordIndex}
            currentInput={gameState.currentInput}
            wordCorrect={gameState.wordCorrect}
            accentColor={accentColor}
            fontSize={fontSize}
          />
        </div>

        {/* Hidden input — must stay focusable on mobile (no pointer-events-none) */}
        <input
          ref={inputRef}
          value={gameState.currentInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="absolute"
          style={{ opacity: 0, width: 1, height: 1, left: -9999, top: -9999 }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        {/* Helper hint — pulses before first key */}
        <button
          onClick={() => inputRef.current?.focus()}
          className="font-mono uppercase tracking-widest transition-colors"
          style={{
            fontSize: 12,
            color: !gameState.hasStarted ? accentColor : "#333",
            animation: !gameState.hasStarted ? "helperPulse 1.4s ease-in-out infinite" : "none",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#aaa")}
          onMouseLeave={e => (e.currentTarget.style.color = !gameState.hasStarted ? accentColor : "#333")}
        >
          {!gameState.hasStarted ? "Start typing to run" : "keep going"}
        </button>
        <style>{`@keyframes helperPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>

        {/* Chase strip */}
        <div className="w-full">
          <ChaseStrip
            lead={Math.round(gameState.lead)}
            running={gameState.status === "running" && gameState.hasStarted}
            character={character}
            map={map}
          />
          <div className="mt-2">
            <LeadMeter lead={Math.round(gameState.lead)} />
          </div>
        </div>
      </div>
    </div>
  );
}
