import { useState, useCallback, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { HomeScreen } from "./components/HomeScreen";
import { SetupScreen } from "./components/SetupScreen";
import { GameScreen, GameState, createInitialGameState } from "./components/GameScreen";
import { ResultModal } from "./components/ResultModal";
import { RunHistoryModal } from "./components/RunHistoryModal";
import { SettingsModal } from "./components/SettingsModal";
import { HowToPlayModal } from "./components/HowToPlayModal";
import { Difficulty, TimeMode, CharacterId, MapId, CHARACTERS, MAPS, getResultStatus, RunEntry, SEED_HISTORY } from "./gameData";
import bgmUrl from "../imports/walen-gameboy-cut.mp3";
import successUrl from "../imports/success-state.mp3";
import failedUrl from "../imports/failed-state.mp3";

type AppModal = "none" | "history" | "settings" | "howto";
type Screen = "home" | "setup" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [modal, setModal] = useState<AppModal>("none");
  const [showResult, setShowResult] = useState(false);

  // Setup options
  const [difficulty, setDifficulty] = useState<Difficulty>("mid");
  const [timeMode, setTimeMode] = useState<TimeMode>(60);
  const [characterId, setCharacterId] = useState<CharacterId>("hoodie_kid");
  const [mapId, setMapId] = useState<MapId>("city_street");

  // Settings
  const [accentColor, setAccentColor] = useState("#facc15");
  const [soundOn, setSoundOn] = useState(true);
  const [fontSize, setFontSize] = useState(28);

  // Game state
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [history, setHistory] = useState<RunEntry[]>(SEED_HISTORY);

  // Audio
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const successRef = useRef<HTMLAudioElement | null>(null);
  const failedRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgmRef.current = new Audio(bgmUrl);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.45;
    successRef.current = new Audio(successUrl);
    successRef.current.volume = 0.8;
    failedRef.current = new Audio(failedUrl);
    failedRef.current.volume = 0.8;
    return () => {
      bgmRef.current?.pause();
      successRef.current?.pause();
      failedRef.current?.pause();
    };
  }, []);

  // Mute / unmute all
  useEffect(() => {
    [bgmRef.current, successRef.current, failedRef.current].forEach(a => {
      if (a) a.muted = !soundOn;
    });
  }, [soundOn]);

  // BGM lifecycle: play during gameplay (while running), stop otherwise
  useEffect(() => {
    const bgm = bgmRef.current;
    if (!bgm) return;
    const playing = screen === "game" && gameState?.status === "running" && gameState?.hasStarted === true && !showResult;
    if (playing) {
      bgm.currentTime = 0;
      bgm.play().catch(() => {});
    } else {
      bgm.pause();
    }
  }, [screen, gameState?.status, gameState?.hasStarted, showResult]);

  const handleStart = useCallback(() => {
    const state = createInitialGameState(difficulty, timeMode);
    setGameState(state);
    setShowResult(false);
    setScreen("game");
  }, [difficulty, timeMode]);

  const handleGameEnd = useCallback((finalState: GameState) => {
    setGameState(finalState);
    setShowResult(true);
    setBestScore(prev => {
      const newBest = prev === null || finalState.wpm > prev;
      setIsNewBest(newBest && finalState.wpm > 0);
      return newBest ? finalState.wpm : prev;
    });

    // Append to local run history
    const entry: RunEntry = {
      id: `r${Date.now()}`,
      result: getResultStatus(finalState.lead, finalState.timeRemaining, finalState.endedManually),
      wpm: finalState.wpm,
      accuracy: finalState.accuracy,
      correctWords: finalState.correctWords,
      bestCombo: finalState.bestCombo,
      lead: finalState.lead,
      difficulty: finalState.difficulty,
      timeMode: finalState.timeMode,
      timestamp: Date.now(),
    };
    setHistory(prev => [entry, ...prev].slice(0, 30));

    // Stop BGM, play result cue
    bgmRef.current?.pause();
    const result = getResultStatus(finalState.lead, finalState.timeRemaining, finalState.endedManually);
    const cue = result === "escaped" ? successRef.current : result === "caught" ? failedRef.current : null;
    if (cue) {
      try { cue.currentTime = 0; cue.play().catch(() => {}); } catch {}
    }
  }, []);

  const handleStateChange = useCallback((updater: (prev: GameState) => GameState) => {
    setGameState(prev => {
      if (!prev) return prev;
      return updater(prev);
    });
  }, []);

  const handleRetry = useCallback(() => {
    const state = createInitialGameState(
      gameState?.difficulty ?? difficulty,
      gameState?.timeMode ?? timeMode,
    );
    setGameState(state);
    setShowResult(false);
    setScreen("game");
  }, [gameState, difficulty, timeMode]);

  const handleHome = useCallback(() => {
    setShowResult(false);
    setScreen("home");
    setGameState(null);
  }, []);

  return (
    <div
      className="flex flex-col w-screen overflow-hidden select-none"
      style={{ background: "#0f0f0f", color: "#e0e0e0", height: "100dvh" }}
    >
      <Navbar
        accentColor={accentColor}
        soundOn={soundOn}
        onHistory={() => setModal(modal === "history" ? "none" : "history")}
        onSettings={() => setModal(modal === "settings" ? "none" : "settings")}
        onToggleSound={() => setSoundOn(s => !s)}
        onHome={() => { setShowResult(false); setScreen("home"); }}
      />

      {screen === "home" && (
        <HomeScreen
          accentColor={accentColor}
          bestScore={bestScore}
          onStart={() => setScreen("setup")}
          onHowTo={() => setModal("howto")}
          onHistory={() => setModal("history")}
          onSettings={() => setModal("settings")}
        />
      )}

      {screen === "setup" && (
        <SetupScreen
          difficulty={difficulty}
          timeMode={timeMode}
          accentColor={accentColor}
          characterId={characterId}
          mapId={mapId}
          onDifficulty={setDifficulty}
          onTimeMode={setTimeMode}
          onCharacter={setCharacterId}
          onMap={setMapId}
          onStart={handleStart}
          onBack={() => setScreen("home")}
          bestScore={bestScore}
        />
      )}

      {screen === "game" && gameState && (
        <GameScreen
          key={gameState.gameStartTime}
          gameState={gameState}
          accentColor={accentColor}
          fontSize={fontSize}
          character={CHARACTERS[characterId]}
          map={MAPS[mapId]}
          onStateChange={handleStateChange}
          onGameEnd={handleGameEnd}
        />
      )}

      {showResult && gameState && (
        <ResultModal
          gameState={gameState}
          accentColor={accentColor}
          isNewBest={isNewBest}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}

      {modal === "history" && (
        <RunHistoryModal
          accentColor={accentColor}
          history={history}
          onClose={() => setModal("none")}
          onStart={() => { setModal("none"); setScreen("setup"); }}
          onClear={() => setHistory([])}
        />
      )}

      {modal === "settings" && (
        <SettingsModal
          accentColor={accentColor}
          soundOn={soundOn}
          fontSize={fontSize}
          onAccentColor={setAccentColor}
          onToggleSound={() => setSoundOn(s => !s)}
          onFontSize={setFontSize}
          onClose={() => setModal("none")}
        />
      )}

      {modal === "howto" && (
        <HowToPlayModal accentColor={accentColor} onClose={() => setModal("none")} />
      )}
    </div>
  );
}
