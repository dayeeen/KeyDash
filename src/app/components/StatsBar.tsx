import { Difficulty, TimeMode, DIFFICULTY_CONFIG } from "../gameData";

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  timeRemaining: number;
  correctWords: number;
  lead: number;
  accentColor: string;
  difficulty: Difficulty;
  timeMode: TimeMode;
}

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "#555" }}>{label}</span>
      <span className="text-2xl font-mono font-bold" style={{ color: color || "#e0e0e0" }}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded px-1 py-1" style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}>
      <span className="font-mono uppercase" style={{ fontSize: 9, color: "#555", letterSpacing: "0.1em" }}>{label}</span>
      <span className="font-mono font-bold tabular-nums" style={{ color: color || "#e0e0e0", fontSize: 16, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

function Chip({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded font-mono uppercase whitespace-nowrap"
      style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        color: accent,
        background: `${accent}14`,
        border: `1px solid ${accent}33`,
      }}
    >
      {children}
    </span>
  );
}

export function StatsBar({ wpm, accuracy, timeRemaining, correctWords, lead, accentColor, difficulty, timeMode }: StatsBarProps) {
  const leadColor =
    lead >= 70 ? "#22c55e" :
    lead >= 50 ? "#84cc16" :
    lead >= 25 ? "#facc15" :
    lead > 0   ? "#ef4444" : "#7f1d1d";
  const timeColor = timeRemaining <= 10 ? "#ef4444" : "#e0e0e0";

  return (
    <div className="relative border-b" style={{ borderColor: "#1e1e1e" }}>
      {/* Selected settings chips — desktop only */}
      <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 gap-2">
        <Chip accent={accentColor}>Lv · {DIFFICULTY_CONFIG[difficulty].label}</Chip>
        <Chip accent={accentColor}>{timeMode}s</Chip>
      </div>

      {/* Desktop / tablet: spread stats row */}
      <div className="hidden sm:flex justify-center gap-8 md:gap-12 py-3 md:py-4">
        <Stat label="WPM" value={wpm} color={accentColor} />
        <Stat label="ACC" value={`${accuracy}%`} />
        <Stat label="TIME" value={timeRemaining} color={timeColor} />
        <Stat label="WORDS" value={correctWords} />
        <Stat label="LEAD" value={`${lead}m`} color={leadColor} />
      </div>

      {/* Mobile: compact 4-stat grid + secondary chips */}
      <div className="sm:hidden flex flex-col gap-1.5 px-3 pt-2 pb-2">
        <div className="grid grid-cols-4 gap-2 pr-20">
          <MiniStat label="WPM" value={wpm} color={accentColor} />
          <MiniStat label="ACC" value={`${accuracy}%`} />
          <MiniStat label="TIME" value={timeRemaining} color={timeColor} />
          <MiniStat label="LEAD" value={`${lead}m`} color={leadColor} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <Chip accent={accentColor}>{DIFFICULTY_CONFIG[difficulty].label}</Chip>
          <Chip accent={accentColor}>{timeMode}s</Chip>
          <Chip accent="#888">{correctWords}w</Chip>
        </div>
      </div>
    </div>
  );
}
