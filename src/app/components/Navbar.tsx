import { History, Settings, Volume2, VolumeX, User } from "lucide-react";

interface NavbarProps {
  accentColor: string;
  soundOn: boolean;
  onHistory: () => void;
  onSettings: () => void;
  onToggleSound: () => void;
  onHome?: () => void;
}

export function Navbar({ accentColor, soundOn, onHistory, onSettings, onToggleSound, onHome }: NavbarProps) {
  return (
    <nav
      className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-b"
      style={{ borderColor: "#1e1e1e", background: "#0a0a0a" }}
    >
      <button
        onClick={onHome}
        className="text-lg sm:text-xl font-mono font-bold tracking-tight transition-opacity"
        style={{ color: accentColor }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        KEYDASH
      </button>
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onHistory}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded text-sm font-mono transition-colors"
          style={{ color: "#888" }}
          onMouseEnter={e => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.color = "#888")}
        >
          <History size={14} />
          <span className="hidden sm:inline">History</span>
        </button>
        <button
          onClick={onSettings}
          className="p-2 rounded transition-colors"
          style={{ color: "#888" }}
          onMouseEnter={e => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.color = "#888")}
        >
          <Settings size={16} />
        </button>
        <button
          onClick={onToggleSound}
          className="p-2 rounded transition-colors"
          style={{ color: soundOn ? accentColor : "#555" }}
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          className="p-2 rounded transition-colors"
          style={{ color: "#888" }}
          onMouseEnter={e => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.color = "#888")}
        >
          <User size={16} />
        </button>
      </div>
    </nav>
  );
}
