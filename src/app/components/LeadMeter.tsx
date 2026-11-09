import { useEffect, useRef, useState } from "react";

interface LeadMeterProps {
  lead: number; // 0–100
}

export function LeadMeter({ lead }: LeadMeterProps) {
  // SAFE >= 70 | HOLDING 50-69 | CLOSING IN 25-49 | DANGER 1-24 | CAUGHT 0
  const color =
    lead >= 70 ? "#22c55e" :
    lead >= 50 ? "#84cc16" :
    lead >= 25 ? "#facc15" :
    lead > 0   ? "#ef4444" : "#7f1d1d";
  const label =
    lead >= 70 ? "SAFE" :
    lead >= 50 ? "HOLDING" :
    lead >= 25 ? "CLOSING IN" :
    lead > 0   ? "DANGER" : "CAUGHT";
  const danger = lead < 25;
  const critical = lead < 12;

  const prevRef = useRef(lead);
  const [delta, setDelta] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    const diff = lead - prevRef.current;
    if (Math.abs(diff) > 0.5) {
      setDelta(diff > 0 ? "up" : "down");
      const t = setTimeout(() => setDelta(null), 250);
      prevRef.current = lead;
      return () => clearTimeout(t);
    }
    prevRef.current = lead;
  }, [lead]);

  const barHeight = critical ? 18 : danger ? 14 : 10;
  const pulseDuration = critical ? "0.4s" : danger ? "0.8s" : "0s";

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-mono" style={{ color: "#555" }}>LEAD</span>
        <div className="flex items-center gap-2">
          {delta && (
            <span
              className="text-xs font-mono font-bold"
              style={{ color: delta === "up" ? "#22c55e" : "#ef4444" }}
            >
              {delta === "up" ? "▲" : "▼"}
            </span>
          )}
          <span
            className="font-mono font-bold tabular-nums"
            style={{ color, fontSize: critical ? 22 : 16, transition: "font-size 200ms" }}
          >
            {Math.round(lead)}m
          </span>
          <span className="text-xs font-mono font-bold" style={{ color }}>{label}</span>
        </div>
      </div>
      <div
        className="w-full rounded-full overflow-hidden relative"
        style={{
          background: "#1e1e1e",
          height: barHeight,
          transition: "height 200ms",
          boxShadow: danger ? `inset 0 0 0 1px ${color}55` : "none",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(2, lead)}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            transition: "width 200ms ease-out, background 300ms",
            boxShadow: `0 0 ${critical ? 18 : danger ? 12 : 6}px ${color}`,
            animation: danger ? `lead-pulse ${pulseDuration} ease-in-out infinite` : "none",
          }}
        />
      </div>
      <style>{`
        @keyframes lead-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
