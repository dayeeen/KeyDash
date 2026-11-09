import { X } from "lucide-react";

interface SettingsModalProps {
  accentColor: string;
  soundOn: boolean;
  fontSize: number;
  onAccentColor: (c: string) => void;
  onToggleSound: () => void;
  onFontSize: (s: number) => void;
  onClose: () => void;
}

const ACCENT_COLORS = [
  { label: "Yellow", value: "#facc15" },
  { label: "Cyan", value: "#22d3ee" },
  { label: "Lime", value: "#a3e635" },
  { label: "Orange", value: "#fb923c" },
  { label: "Purple", value: "#a78bfa" },
];

export function SettingsModal({
  accentColor, soundOn, fontSize,
  onAccentColor, onToggleSound, onFontSize, onClose,
}: SettingsModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl p-8 flex flex-col gap-6"
        style={{ background: "#111", border: "1px solid #1e1e1e" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-mono font-bold" style={{ color: accentColor }}>Settings</h2>
          <button onClick={onClose} className="p-1" style={{ color: "#555" }}>
            <X size={18} />
          </button>
        </div>

        {/* Accent color */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "#555" }}>Accent Color</p>
          <div className="flex gap-2">
            {ACCENT_COLORS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => onAccentColor(value)}
                className="flex-1 py-2 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: `${value}22`,
                  border: `2px solid ${accentColor === value ? value : "transparent"}`,
                  color: value,
                }}
                title={label}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#555" }}>Sound</p>
          <button
            onClick={onToggleSound}
            className="relative w-12 h-6 rounded-full transition-all"
            style={{ background: soundOn ? accentColor : "#1e1e1e" }}
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full transition-all"
              style={{
                background: "#0a0a0a",
                left: soundOn ? "calc(100% - 20px)" : 4,
              }}
            />
          </button>
        </div>

        {/* Font size */}
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#555" }}>Word Size</p>
            <p className="text-xs font-mono" style={{ color: accentColor }}>{fontSize}px</p>
          </div>
          <input
            type="range"
            min={20}
            max={40}
            value={fontSize}
            onChange={e => onFontSize(Number(e.target.value))}
            className="w-full"
            style={{ accentColor }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono" style={{ color: "#333" }}>Small</span>
            <span className="text-xs font-mono" style={{ color: "#333" }}>Large</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg font-mono text-sm transition-all"
          style={{ background: "#1a1a1a", color: "#888", border: "1px solid #222" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e0e0e0")}
          onMouseLeave={e => (e.currentTarget.style.color = "#888")}
        >
          Done
        </button>
      </div>
    </div>
  );
}
