import { useState } from "react";
import { Check, Copy, RotateCcw, Home, Share2, Sparkles } from "lucide-react";
import { GameState } from "./GameScreen";
import { getResultStatus, DIFFICULTY_CONFIG } from "../gameData";

interface ResultModalProps {
  gameState: GameState;
  accentColor: string;
  isNewBest?: boolean;
  onRetry: () => void;
  onHome: () => void;
}

const HALFTONE =
  "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1.5px) 0 0 / 6px 6px";

export function ResultModal({ gameState, accentColor, isNewBest, onRetry, onHome }: ResultModalProps) {
  const result = getResultStatus(gameState.lead, gameState.timeRemaining, gameState.endedManually);

  const resultConfig = {
    escaped:        { label: "ESCAPED",         color: "#22c55e", subtitle: "You outpaced the chaser." },
    almost_caught:  { label: "ALMOST CAUGHT",   color: "#facc15", subtitle: "Close call — type faster next time." },
    caught:         { label: "CAUGHT",          color: "#ef4444", subtitle: "The chaser got you. Try again!" },
    session_stopped:{ label: "SESSION STOPPED", color: "#a3a3a3", subtitle: "You ended the run early." },
  }[result];

  const performanceMessage = (() => {
    const wpm = gameState.wpm;
    if (wpm >= 100) return "Lightning fingers. You outpaced the chaser.";
    if (wpm >= 70)  return "Quick on the keys. Solid rhythm.";
    if (wpm >= 45)  return "Steady pace. Keep building speed.";
    if (wpm > 0)    return "A warm-up run. Try again to push harder.";
    return "Every run counts — give it another go.";
  })();

  const summary =
    `KeyDash — ${resultConfig.label}\n` +
    `WPM: ${gameState.wpm}  •  Accuracy: ${gameState.accuracy}%\n` +
    `Correct Words: ${gameState.correctWords}  •  Best Combo: ${gameState.bestCombo}x\n` +
    `Final Lead: ${Math.round(gameState.lead)}m\n` +
    `Difficulty: ${DIFFICULTY_CONFIG[gameState.difficulty].label}  •  Time: ${gameState.timeMode}s`;

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setShareOpen(true);
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-3 sm:px-4 py-3"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col gap-3 max-h-[94vh] overflow-y-auto relative"
        style={{
          background: "#0d0d0d",
          border: `3px solid ${resultConfig.color}88`,
          boxShadow: `0 10px 0 #050505, 0 0 60px ${resultConfig.color}33`,
        }}
      >
        {/* Result header */}
        <div className="text-center relative">
          <StickerBadge color={resultConfig.color} rotate={-3}>RESULT</StickerBadge>
          <h2
            className="font-mono font-bold mt-2"
            style={{
              color: resultConfig.color,
              fontSize: "clamp(24px, 6vw, 34px)",
              letterSpacing: "0.06em",
              lineHeight: 1,
              textShadow: `2px 2px 0 #000, 0 0 20px ${resultConfig.color}55`,
              WebkitTextStroke: `1px ${resultConfig.color}aa`,
            }}
          >
            {resultConfig.label}
          </h2>
          <p className="font-mono mt-1" style={{ color: "#888", fontSize: 11 }}>
            {resultConfig.subtitle}
          </p>
        </div>

        {/* WPM hero panel */}
        <div
          className="relative rounded-2xl py-4 px-4 flex flex-col items-center overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${accentColor}1a, #0a0a0a 80%)`,
            border: `3px solid ${accentColor}`,
            boxShadow: `0 6px 0 ${accentColor}33, inset 0 0 28px ${accentColor}15`,
          }}
        >
          {/* Halftone overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: HALFTONE, opacity: 0.45 }}
          />
          {/* Corner pixel accents */}
          <Corner pos="tl" color={accentColor} />
          <Corner pos="tr" color={accentColor} />
          <Corner pos="bl" color={accentColor} />
          <Corner pos="br" color={accentColor} />

          {isNewBest && (
            <div
              className="absolute font-mono font-bold flex items-center gap-1 px-3 py-1 rounded-full z-20"
              style={{
                top: -10, right: 14,
                transform: "rotate(6deg)",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "#0a0a0a",
                background: accentColor,
                border: "2px solid #0a0a0a",
                boxShadow: `0 3px 0 #050505, 0 0 18px ${accentColor}99`,
                whiteSpace: "nowrap",
              }}
            >
              <Sparkles size={12} fill="#0a0a0a" />
              NEW BEST
            </div>
          )}

          <span
            className="font-mono uppercase relative z-10"
            style={{ fontSize: 11, color: "#888", letterSpacing: "0.22em" }}
          >
            Final WPM
          </span>
          <span
            className="font-mono font-bold tabular-nums relative z-10"
            style={{
              color: accentColor,
              fontSize: "clamp(56px, 14vw, 76px)",
              lineHeight: 1,
              marginTop: 2,
              textShadow: `3px 3px 0 #000, 0 0 24px ${accentColor}77`,
              WebkitTextStroke: `1px ${accentColor}`,
            }}
          >
            {gameState.wpm}
          </span>
          <span className="font-mono mt-2 text-center relative z-10" style={{ color: "#777", fontSize: 11, fontStyle: "italic" }}>
            {performanceMessage}
          </span>
        </div>

        {/* Primary row: 3 stats — stays 3 cols even on mobile (compact) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <PrimaryStat label="Accuracy" value={`${gameState.accuracy}%`} accent="#22d3ee" />
          <PrimaryStat label="Correct Words" value={gameState.correctWords} accent="#22c55e" />
          <PrimaryStat label="Mistakes" value={gameState.mistakes} accent="#ef4444" />
        </div>

        {/* Secondary 2x2 */}
        <div className="grid grid-cols-2 gap-2">
          <SecondaryStat label="Best Combo" value={`${gameState.bestCombo}x`} />
          <SecondaryStat label="Final Lead" value={`${Math.round(gameState.lead)}m`} color={resultConfig.color} />
          <SecondaryStat label="Difficulty" value={DIFFICULTY_CONFIG[gameState.difficulty].label} />
          <SecondaryStat label="Time Mode" value={`${gameState.timeMode}s`} />
        </div>

        {/* CTA buttons — stack on mobile */}
        <div className="flex flex-col gap-2 mt-1">
          <ArcadeButton primary color={accentColor} onClick={onRetry}>
            <RotateCcw size={16} />
            <span>RETRY</span>
          </ArcadeButton>
          <div className="flex flex-col sm:flex-row gap-2">
            <ArcadeButton onClick={onHome}>
              <Home size={14} />
              <span>BACK TO HOME</span>
            </ArcadeButton>
            <ArcadeButton onClick={handleShare}>
              <Share2 size={14} />
              <span>SHARE RESULT</span>
            </ArcadeButton>
          </div>
        </div>
      </div>

      {shareOpen && (
        <ShareModal
          summary={summary}
          copied={copied}
          accentColor={accentColor}
          onCopy={async () => {
            try {
              await navigator.clipboard.writeText(summary);
              setCopied(true);
              setTimeout(() => setCopied(false), 2200);
            } catch {}
          }}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}

function StickerBadge({ children, color, rotate = 0 }: { children: React.ReactNode; color: string; rotate?: number }) {
  return (
    <div
      className="inline-block px-3 py-1 rounded-full font-mono font-bold"
      style={{
        fontSize: 10,
        letterSpacing: "0.24em",
        color: "#0a0a0a",
        background: color,
        border: "2px solid #0a0a0a",
        boxShadow: `0 3px 0 #050505, 0 0 14px ${color}77`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}

function Corner({ pos, color }: { pos: "tl" | "tr" | "bl" | "br"; color: string }) {
  const s: React.CSSProperties = { position: "absolute", width: 8, height: 8, background: color, opacity: 0.7 };
  if (pos === "tl") { s.top = 6; s.left = 6; }
  if (pos === "tr") { s.top = 6; s.right = 6; }
  if (pos === "bl") { s.bottom = 6; s.left = 6; }
  if (pos === "br") { s.bottom = 6; s.right = 6; }
  return <span style={s} />;
}

function PrimaryStat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div
      className="rounded-2xl px-3 py-2 flex flex-col gap-0.5 relative"
      style={{
        background: "#0a0a0a",
        border: "2px solid #222",
        boxShadow: "0 4px 0 #050505",
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 10, letterSpacing: "0.18em", color: "#666" }}
      >
        {label}
      </span>
      <span
        className="font-mono font-bold tabular-nums"
        style={{
          color: accent,
          fontSize: "clamp(18px, 5vw, 22px)",
          lineHeight: 1.1,
          textShadow: "2px 2px 0 #000",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SecondaryStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div
      className="rounded-xl px-3 py-2 flex items-center justify-between gap-3"
      style={{ background: "#080808", border: "2px solid #1a1a1a", boxShadow: "0 2px 0 #050505" }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: 10, letterSpacing: "0.14em", color: "#555" }}
      >
        {label}
      </span>
      <span
        className="font-mono font-bold tabular-nums"
        style={{ color: color || "#cfcfcf", fontSize: 13 }}
      >
        {value}
      </span>
    </div>
  );
}

function ArcadeButton({
  children, onClick, primary, color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  color?: string;
}) {
  const accent = color || "#facc15";
  const baseStyle: React.CSSProperties = primary
    ? {
        background: accent,
        color: "#0a0a0a",
        border: "2px solid #0a0a0a",
        boxShadow: `0 5px 0 ${accent}55, 0 6px 0 #000`,
        fontSize: 14,
        letterSpacing: "0.2em",
      }
    : {
        background: "#0d0d0d",
        color: "#cfcfcf",
        border: "2px solid #262626",
        boxShadow: "0 4px 0 #050505",
        fontSize: 11,
        letterSpacing: "0.18em",
      };
  return (
    <button
      onClick={onClick}
      className={`${primary ? "py-3" : "py-2.5 flex-1"} rounded-xl font-mono font-bold uppercase transition-transform flex items-center justify-center gap-2`}
      style={baseStyle}
      onMouseDown={e => { e.currentTarget.style.transform = "translateY(2px)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "translateY(0)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
}

function ShareModal({
  summary, copied, accentColor, onCopy, onClose,
}: {
  summary: string;
  copied: boolean;
  accentColor: string;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60] px-3 sm:px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl sm:rounded-3xl px-5 sm:px-7 py-6 sm:py-7 flex flex-col gap-5"
        style={{
          background: "#0d0d0d",
          border: `3px solid ${accentColor}88`,
          boxShadow: `0 8px 0 #050505, 0 0 40px ${accentColor}33`,
        }}
      >
        <div>
          <StickerBadge color={accentColor} rotate={-2}>SHARE</StickerBadge>
          <h3
            className="font-mono font-bold mt-3"
            style={{
              color: accentColor,
              fontSize: 22,
              letterSpacing: "0.06em",
              textShadow: "2px 2px 0 #000",
            }}
          >
            SHARE RESULT
          </h3>
          <p className="font-mono mt-1" style={{ color: "#777", fontSize: 12 }}>
            Copy this summary and paste it anywhere.
          </p>
        </div>

        <textarea
          readOnly
          value={summary}
          className="w-full font-mono rounded-xl p-3 resize-none"
          style={{
            background: "#0a0a0a",
            border: "2px solid #1e1e1e",
            color: "#d0d0d0",
            fontSize: 12,
            lineHeight: 1.55,
            minHeight: 130,
          }}
        />

        <div className="flex flex-col gap-2 mt-1">
          <ArcadeButton primary color={accentColor} onClick={onCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "COPIED TO CLIPBOARD" : "COPY SUMMARY"}</span>
          </ArcadeButton>
          <ArcadeButton onClick={onClose}>
            <span>CLOSE</span>
          </ArcadeButton>
        </div>
      </div>
    </div>
  );
}
