import { X } from "lucide-react";

interface LeaderboardModalProps {
  accentColor: string;
  onClose: () => void;
}

const DUMMY_DATA = [
  { rank: 1, username: "speedtyper99", wpm: 142, accuracy: 98, difficulty: "Expert", time: "60s", result: "Escaped" },
  { rank: 2, username: "keymaster",    wpm: 128, accuracy: 96, difficulty: "Pro",    time: "60s", result: "Escaped" },
  { rank: 3, username: "flashfingers", wpm: 117, accuracy: 94, difficulty: "Expert", time: "30s", result: "Escaped" },
  { rank: 4, username: "typeracer_x",  wpm: 103, accuracy: 91, difficulty: "Pro",    time: "60s", result: "Escaped" },
  { rank: 5, username: "quickkeys",    wpm: 98,  accuracy: 95, difficulty: "Mid",    time: "60s", result: "Escaped" },
  { rank: 6, username: "runnerdev",    wpm: 87,  accuracy: 89, difficulty: "Pro",    time: "30s", result: "Almost" },
  { rank: 7, username: "clacksmith",   wpm: 79,  accuracy: 93, difficulty: "Mid",    time: "60s", result: "Escaped" },
  { rank: 8, username: "novicetyper",  wpm: 64,  accuracy: 82, difficulty: "Beginner", time: "60s", result: "Escaped" },
];

export function LeaderboardModal({ accentColor, onClose }: LeaderboardModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl p-8 flex flex-col gap-6"
        style={{ background: "#111", border: "1px solid #1e1e1e" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-mono font-bold" style={{ color: accentColor }}>Leaderboard</h2>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#555" }}>
            <X size={18} />
          </button>
        </div>

        <div className="overflow-hidden rounded-lg" style={{ border: "1px solid #1e1e1e" }}>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr style={{ background: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
                {["#", "Player", "WPM", "ACC", "Level", "Time", "Result"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest" style={{ color: "#444" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DUMMY_DATA.map((row, i) => (
                <tr
                  key={row.rank}
                  style={{
                    borderBottom: i < DUMMY_DATA.length - 1 ? "1px solid #141414" : "none",
                    background: i % 2 === 0 ? "transparent" : "#0a0a0a",
                  }}
                >
                  <td className="px-4 py-3" style={{ color: row.rank <= 3 ? accentColor : "#555" }}>
                    {row.rank <= 3 ? ["🥇","🥈","🥉"][row.rank - 1] : row.rank}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#e0e0e0" }}>{row.username}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: accentColor }}>{row.wpm}</td>
                  <td className="px-4 py-3" style={{ color: "#888" }}>{row.accuracy}%</td>
                  <td className="px-4 py-3" style={{ color: "#888" }}>{row.difficulty}</td>
                  <td className="px-4 py-3" style={{ color: "#888" }}>{row.time}</td>
                  <td className="px-4 py-3" style={{ color: row.result === "Escaped" ? "#22c55e" : "#facc15" }}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs font-mono text-center" style={{ color: "#333" }}>Sample data — real leaderboard coming soon</p>
      </div>
    </div>
  );
}
