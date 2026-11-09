import { Play, BookOpen, History, Settings } from "lucide-react";
import { RunnerSprite } from "./RunnerSprite";
import { ChaserSprite } from "./ChaserSprite";
import { CHARACTERS } from "../gameData";

interface HomeScreenProps {
  accentColor: string;
  bestScore: number | null;
  onStart: () => void;
  onHowTo: () => void;
  onHistory: () => void;
  onSettings: () => void;
}

export function HomeScreen({ accentColor, bestScore, onStart, onHowTo, onHistory, onSettings }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-8 py-6 sm:py-12 gap-6 sm:gap-10 overflow-y-auto">
      {/* Title */}
      <div className="text-center">
        <h1
          className="font-mono font-bold mb-2 sm:mb-3 text-5xl sm:text-6xl"
          style={{ color: accentColor, letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          KEYDASH
        </h1>
        <p className="text-base sm:text-lg font-mono mb-2" style={{ color: "#888" }}>
          Type fast. Stay ahead.
        </p>
        <p className="font-mono max-w-md mx-auto px-2" style={{ color: "#555", fontSize: 13, lineHeight: 1.6 }}>
          A typing game where every correct word helps you stay ahead of the chaser.
          Mistype and the gap closes — keep your rhythm to escape.
        </p>
      </div>

      {/* Hero strip */}
      <div
        className="relative w-full max-w-xl rounded-lg overflow-hidden"
        style={{
          height: 96,
          background: "linear-gradient(to bottom, #0b0b0b, #0a0a0a)",
          border: `1px solid ${accentColor}22`,
        }}
      >
        {/* Road */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: 24, background: "repeating-linear-gradient(0deg, #161616 0 4px, #1c1c1c 4px 8px)" }} />
        <div className="absolute inset-x-0 left-0 right-0" style={{ bottom: 24, height: 2, background: `${accentColor}44` }} />
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: 10,
            height: 4,
            background: `repeating-linear-gradient(90deg, ${accentColor}33 0 16px, transparent 16px 36px)`,
            animation: "homeRoadScroll 0.5s linear infinite",
            opacity: 0.6,
          }}
        />

        {/* Chaser */}
        <div className="absolute" style={{ left: "12%", bottom: 22 }}>
          <ChaserSprite running />
        </div>
        {/* Runner */}
        <div className="absolute" style={{ right: "12%", bottom: 22, filter: `drop-shadow(0 0 4px ${accentColor}77)` }}>
          <RunnerSprite running character={CHARACTERS.hoodie_kid} />
        </div>

        <style>{`@keyframes homeRoadScroll { from { background-position: 0 0; } to { background-position: -36px 0; } }`}</style>
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-lg font-mono font-bold text-lg tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          style={{ background: accentColor, color: "#0a0a0a", boxShadow: `0 0 24px ${accentColor}44` }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <Play size={18} fill="#0a0a0a" />
          Start Game
        </button>

        <div className="flex w-full gap-2">
          <SecondaryButton icon={<BookOpen size={14} />} label="How to Play" onClick={onHowTo} />
          <SecondaryButton icon={<History size={14} />} label="Run History" onClick={onHistory} />
          <SecondaryButton icon={<Settings size={14} />} label="Settings" onClick={onSettings} />
        </div>

        {bestScore !== null && (
          <p className="text-xs font-mono mt-2" style={{ color: "#444" }}>
            Best WPM: <span style={{ color: accentColor }}>{bestScore}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function SecondaryButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded font-mono transition-colors"
      style={{ fontSize: 11, color: "#888", background: "#0d0d0d", border: "1px solid #1e1e1e" }}
      onMouseEnter={e => { e.currentTarget.style.color = "#e0e0e0"; e.currentTarget.style.borderColor = "#333"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
    >
      {icon}
      {label}
    </button>
  );
}
