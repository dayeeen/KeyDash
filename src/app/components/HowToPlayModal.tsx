import { X } from "lucide-react";

interface HowToPlayModalProps {
  accentColor: string;
  onClose: () => void;
}

export function HowToPlayModal({ accentColor, onClose }: HowToPlayModalProps) {
  const steps = [
    { n: "01", title: "Choose your run", body: "Pick difficulty, time, a character, and a map from the setup screen." },
    { n: "02", title: "Type to stay ahead", body: "Every correct word increases your lead. Mistypes and idling let the chaser close in." },
    { n: "03", title: "Watch the gap", body: "The lead meter shows distance in meters. Status flips between SAFE, HOLDING, CLOSING IN, and DANGER." },
    { n: "04", title: "Finish the run", body: "Escape if your lead is high when time ends. Get caught if it ever hits zero." },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg mx-4 rounded-2xl p-7 flex flex-col gap-5" style={{ background: "#101010", border: "1px solid #1e1e1e" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-mono font-bold" style={{ color: accentColor, fontSize: 22, letterSpacing: "0.04em" }}>
            HOW TO PLAY
          </h2>
          <button onClick={onClose} className="p-1 rounded transition-colors" style={{ color: "#666" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e0e0e0")}
            onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {steps.map(s => (
            <div key={s.n} className="flex gap-3 rounded-lg p-3" style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}>
              <span className="font-mono font-bold" style={{ color: accentColor, fontSize: 14 }}>{s.n}</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono font-bold" style={{ color: "#e0e0e0", fontSize: 13 }}>{s.title}</span>
                <span className="font-mono" style={{ color: "#666", fontSize: 12, lineHeight: 1.55 }}>{s.body}</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="w-full py-3 rounded-lg font-mono font-bold uppercase tracking-widest transition-opacity"
          style={{ background: accentColor, color: "#0a0a0a" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          Got it
        </button>
      </div>
    </div>
  );
}
