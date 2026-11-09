import { X, History, Play, Trash2 } from "lucide-react";
import { RunEntry, DIFFICULTY_CONFIG, formatRelativeTime } from "../gameData";

interface RunHistoryModalProps {
  accentColor: string;
  history: RunEntry[];
  onClose: () => void;
  onStart?: () => void;
  onClear?: () => void;
}

const RESULT_META: Record<RunEntry["result"], { label: string; color: string }> = {
  escaped:        { label: "ESCAPED",         color: "#22c55e" },
  almost_caught:  { label: "ALMOST",          color: "#facc15" },
  caught:         { label: "CAUGHT",          color: "#ef4444" },
  session_stopped:{ label: "STOPPED",         color: "#a3a3a3" },
};

export function RunHistoryModal({ accentColor, history, onClose, onStart, onClear }: RunHistoryModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-3 sm:px-4 py-3"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 max-h-[92vh]"
        style={{
          background: "#0d0d0d",
          border: "2px solid #2a2a2a",
          boxShadow: "0 10px 0 #060606, 0 0 40px rgba(250,204,21,0.08)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 32, height: 32, background: `${accentColor}1a`, border: `2px solid ${accentColor}66` }}
            >
              <History size={16} style={{ color: accentColor }} />
            </div>
            <div>
              <h2 className="font-mono font-bold" style={{ color: "#f0f0f0", fontSize: 18, letterSpacing: "0.04em" }}>
                RUN HISTORY
              </h2>
              <p className="font-mono" style={{ color: "#666", fontSize: 11 }}>
                Your recent {history.length} run{history.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && onClear && (
              <button
                onClick={() => {
                  if (confirm("Clear all run history? This cannot be undone.")) onClear();
                }}
                className="rounded-lg px-2.5 py-1.5 font-mono uppercase flex items-center gap-1.5 transition-colors"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "#ef4444",
                  background: "#1a0a0a",
                  border: "1px solid #ef444466",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#260c0c"; e.currentTarget.style.borderColor = "#ef4444aa"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1a0a0a"; e.currentTarget.style.borderColor = "#ef444466"; }}
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 transition-colors"
              style={{ color: "#666", background: "#0a0a0a", border: "1px solid #222" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e0e0e0")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <EmptyState accentColor={accentColor} onStart={onStart && (() => { onClose(); onStart(); })} />
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
            {history.map((row) => (
              <HistoryRow key={row.id} row={row} accentColor={accentColor} />
            ))}
          </div>
        )}

        <p className="font-mono text-center" style={{ color: "#333", fontSize: 10, letterSpacing: "0.15em" }}>
          LOCAL HISTORY · STORED THIS SESSION
        </p>
      </div>
    </div>
  );
}

function HistoryRow({ row, accentColor }: { row: RunEntry; accentColor: string }) {
  const meta = RESULT_META[row.result];
  return (
    <div
      className="rounded-2xl px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
      style={{
        background: "#0a0a0a",
        border: "2px solid #1a1a1a",
        boxShadow: "0 3px 0 #050505",
      }}
    >
      {/* Result sticker */}
      <div
        className="rounded-lg px-2 py-1 font-mono font-bold flex-shrink-0 text-center"
        style={{
          minWidth: 78,
          color: meta.color,
          background: `${meta.color}14`,
          border: `2px solid ${meta.color}66`,
          fontSize: 10,
          letterSpacing: "0.12em",
          boxShadow: `0 2px 0 ${meta.color}33`,
        }}
      >
        {meta.label}
      </div>

      {/* WPM hero */}
      <div className="flex flex-col flex-shrink-0" style={{ minWidth: 60 }}>
        <span className="font-mono uppercase" style={{ fontSize: 9, color: "#555", letterSpacing: "0.14em" }}>
          WPM
        </span>
        <span className="font-mono font-bold tabular-nums" style={{ color: accentColor, fontSize: 22, lineHeight: 1 }}>
          {row.wpm}
        </span>
      </div>

      {/* Mini stats */}
      <div className="flex flex-1 items-center gap-4 flex-wrap">
        <MiniStat label="ACC" value={`${row.accuracy}%`} />
        <MiniStat label="LEAD" value={`${Math.round(row.lead)}m`} color={meta.color} />
        <MiniStat label="LV" value={DIFFICULTY_CONFIG[row.difficulty].label} />
        <MiniStat label="TIME" value={`${row.timeMode}s`} />
      </div>

      {/* Time */}
      <div
        className="font-mono flex-shrink-0 text-left sm:text-right"
        style={{ color: "#666", fontSize: 10, letterSpacing: "0.1em" }}
      >
        {formatRelativeTime(row.timestamp)}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono uppercase" style={{ fontSize: 9, color: "#444", letterSpacing: "0.12em" }}>
        {label}
      </span>
      <span className="font-mono font-bold tabular-nums" style={{ color: color || "#cfcfcf", fontSize: 12 }}>
        {value}
      </span>
    </div>
  );
}

function EmptyState({ accentColor, onStart }: { accentColor: string; onStart?: () => void }) {
  return (
    <div
      className="rounded-2xl py-10 px-6 flex flex-col items-center gap-3"
      style={{ background: "#0a0a0a", border: "2px dashed #222" }}
    >
      <span className="font-mono font-bold" style={{ color: accentColor, fontSize: 14, letterSpacing: "0.12em" }}>NO RUNS YET</span>
      <span className="font-mono text-center" style={{ color: "#666", fontSize: 12, lineHeight: 1.55 }}>
        Play your first run to see your history here.
      </span>
      {onStart && (
        <button
          onClick={onStart}
          className="mt-2 px-5 py-2.5 rounded-xl font-mono font-bold uppercase flex items-center gap-2 transition-opacity"
          style={{
            background: accentColor,
            color: "#0a0a0a",
            fontSize: 12,
            letterSpacing: "0.18em",
            border: "2px solid #0a0a0a",
            boxShadow: `0 4px 0 ${accentColor}55, 0 5px 0 #000`,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <Play size={12} fill="#0a0a0a" />
          Start First Run
        </button>
      )}
    </div>
  );
}
