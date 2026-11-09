import { Difficulty, TimeMode, DIFFICULTY_CONFIG, CharacterId, MapId, CHARACTERS, MAPS } from "../gameData";
import { ChaseStrip } from "./ChaseStrip";
import { RunnerSprite } from "./RunnerSprite";

interface SetupScreenProps {
  difficulty: Difficulty;
  timeMode: TimeMode;
  accentColor: string;
  characterId: CharacterId;
  mapId: MapId;
  onDifficulty: (d: Difficulty) => void;
  onTimeMode: (t: TimeMode) => void;
  onCharacter: (c: CharacterId) => void;
  onMap: (m: MapId) => void;
  onStart: () => void;
  onBack?: () => void;
  bestScore: number | null;
}

const DIFFICULTIES: Difficulty[] = ["beginner", "mid", "pro", "expert", "dash_master"];
const TIME_MODES: TimeMode[] = [30, 60];
const CHARACTER_IDS: CharacterId[] = ["street_runner", "hoodie_kid", "pixel_courier", "cyber_student"];
const MAP_IDS: MapId[] = ["city_street", "subway_tunnel", "school_corridor", "neon_downtown"];

export function SetupScreen({
  difficulty, timeMode, accentColor, characterId, mapId,
  onDifficulty, onTimeMode, onCharacter, onMap, onStart, onBack, bestScore,
}: SetupScreenProps) {
  return (
    <div className="flex flex-col items-center flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 gap-6 sm:gap-8 overflow-y-auto">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-mono font-bold mb-2" style={{ color: accentColor, letterSpacing: "-0.02em" }}>
          KEYDASH
        </h1>
        <p className="text-base font-mono" style={{ color: "#666" }}>Type fast. Stay ahead.</p>
        {bestScore !== null && (
          <p className="text-sm font-mono mt-1" style={{ color: "#444" }}>
            Best WPM: <span style={{ color: accentColor }}>{bestScore}</span>
          </p>
        )}
      </div>

      {/* Setup card */}
      <div className="w-full max-w-2xl rounded-xl p-4 sm:p-6 md:p-7 flex flex-col gap-5 sm:gap-7" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
        {/* Difficulty */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#555" }}>Difficulty</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {DIFFICULTIES.map(d => {
              const cfg = DIFFICULTY_CONFIG[d];
              const selected = d === difficulty;
              const isMaster = d === "dash_master";
              const masterColor = "#ef4444";
              return (
                <button key={d} onClick={() => onDifficulty(d)}
                  className="flex flex-col items-center py-3 px-2 rounded-lg transition-all min-h-[60px]"
                  style={{
                    background: selected ? `${(isMaster ? masterColor : accentColor)}18` : "#0a0a0a",
                    border: `1px solid ${selected ? (isMaster ? masterColor : accentColor) : (isMaster ? "#3a1a1a" : "#222")}`,
                    color: selected ? (isMaster ? masterColor : accentColor) : (isMaster ? "#a86a6a" : "#666"),
                  }}>
                  <span className="font-mono font-bold" style={{ fontSize: 13 }}>{cfg.label}</span>
                  <span className="text-xs font-mono mt-0.5" style={{ color: selected ? `${(isMaster ? masterColor : accentColor)}99` : "#444" }}>
                    {isMaster ? "MAX" : `×${(cfg.passiveRate).toFixed(1)}`}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-mono mt-2" style={{ color: "#444" }}>{DIFFICULTY_CONFIG[difficulty].description}</p>
        </div>

        {/* Time */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#555" }}>Time</p>
          <div className="flex gap-3">
            {TIME_MODES.map(t => {
              const selected = t === timeMode;
              return (
                <button key={t} onClick={() => onTimeMode(t)}
                  className="flex-1 py-3 rounded-lg font-mono font-bold transition-all"
                  style={{
                    background: selected ? `${accentColor}18` : "#0a0a0a",
                    border: `1px solid ${selected ? accentColor : "#222"}`,
                    color: selected ? accentColor : "#666",
                  }}>{t}s</button>
              );
            })}
          </div>
        </div>

        {/* Character */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#555" }}>Character</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHARACTER_IDS.map(id => {
              const c = CHARACTERS[id];
              const selected = id === characterId;
              return (
                <button key={id} onClick={() => onCharacter(id)}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all"
                  style={{
                    background: selected ? `${accentColor}18` : "#0a0a0a",
                    border: `1px solid ${selected ? accentColor : "#222"}`,
                  }}>
                  <div style={{ transform: "scale(0.7)", transformOrigin: "center", height: 44 }}>
                    <RunnerSprite running={selected} character={c} />
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: selected ? accentColor : "#888" }}>{c.name}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-mono mt-2" style={{ color: "#444" }}>{CHARACTERS[characterId].description}</p>
        </div>

        {/* Map */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#555" }}>Map</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MAP_IDS.map(id => {
              const m = MAPS[id];
              const selected = id === mapId;
              return (
                <button key={id} onClick={() => onMap(id)}
                  className="flex flex-col items-stretch gap-2 py-2 px-2 rounded-lg transition-all"
                  style={{
                    background: selected ? `${accentColor}18` : "#0a0a0a",
                    border: `1px solid ${selected ? accentColor : "#222"}`,
                  }}>
                  <div className="rounded" style={{
                    height: 28,
                    background: `linear-gradient(to bottom, ${m.sky}, ${m.ground})`,
                    borderBottom: `2px solid ${m.accent}88`,
                  }} />
                  <span className="text-xs font-mono font-bold text-center" style={{ color: selected ? accentColor : "#888" }}>{m.name}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-mono mt-2" style={{ color: "#444" }}>{MAPS[mapId].description}</p>
        </div>

        {/* Chase preview (above Start) */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "#555" }}>Chase Preview</p>
          <ChaseStrip lead={55} running character={CHARACTERS[characterId]} map={MAPS[mapId]} />
        </div>

        {/* Start button */}
        <button onClick={onStart}
          className="w-full py-4 rounded-lg font-mono font-bold text-lg tracking-widest uppercase transition-all"
          style={{ background: accentColor, color: "#0a0a0a", boxShadow: `0 0 20px ${accentColor}44` }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          Start Run
        </button>

        {onBack && (
          <button onClick={onBack}
            className="text-xs font-mono uppercase tracking-widest transition-colors"
            style={{ color: "#555" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#aaa")}
            onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
            ← Back to Home
          </button>
        )}
      </div>
    </div>
  );
}
