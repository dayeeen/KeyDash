import { useEffect, useState } from "react";
import { RunnerSprite } from "./RunnerSprite";
import { ChaserSprite } from "./ChaserSprite";
import { CharacterDef, MapDef, CHARACTERS, MAPS } from "../gameData";

interface ChaseStripProps {
  lead: number;
  running?: boolean;
  character?: CharacterDef;
  map?: MapDef;
}

const SAFE_LINES = ["Too slow!", "Catch me if you can!", "You'll need more than that!", "Easy run."];
const DANGER_LINES = ["Oh no...", "He's getting close!", "I need to type faster!", "Don't mess this up!"];

export function ChaseStrip({ lead, running = true, character, map }: ChaseStripProps) {
  const c = character ?? CHARACTERS.hoodie_kid;
  const m = map ?? MAPS.city_street;

  const chaserLeft = 6;
  const runnerLeft = chaserLeft + 10 + (lead / 100) * 68;

  const status =
    lead >= 70 ? "SAFE" :
    lead >= 50 ? "HOLDING" :
    lead >= 25 ? "CLOSING IN" :
    lead > 0   ? "DANGER" : "CAUGHT";
  const statusColor =
    lead >= 70 ? "#22c55e" :
    lead >= 50 ? "#84cc16" :
    lead >= 25 ? "#facc15" :
    lead > 0   ? "#ef4444" : "#7f1d1d";
  const danger = lead < 25;
  const safe = lead >= 50;

  // Speech bubble: rotate every ~4s, pool depends on lead
  const [phraseIdx, setPhraseIdx] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setPhraseIdx(i => i + 1), 4000);
    return () => clearInterval(id);
  }, [running]);
  const pool = lead < 35 ? DANGER_LINES : SAFE_LINES;
  const phrase = pool[phraseIdx % pool.length];

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden chase-strip"
      style={{
        height: "var(--chase-h, 160px)",
        background: `linear-gradient(to bottom, ${m.sky} 0%, ${m.ground} 100%)`,
        border: `2px solid ${statusColor}aa`,
        boxShadow: `inset 0 0 18px ${statusColor}22, 0 0 14px ${statusColor}33${danger ? `, inset 0 0 32px ${statusColor}55` : ""}`,
        transition: "border-color 300ms, box-shadow 300ms, background 400ms",
      }}
    >
      {/* Map atmosphere: subtle environment elements */}
      <MapBackground map={m} running={running} />

      {/* Status label (top-left) */}
      <div
        className="absolute top-2 left-3 px-2 py-0.5 rounded font-mono font-bold z-20"
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          color: statusColor,
          background: `${statusColor}1a`,
          border: `1px solid ${statusColor}55`,
        }}
      >
        {status}
      </div>

      {/* Gap label (top-right) */}
      <div
        className="absolute top-2 right-3 font-mono z-20"
        style={{ fontSize: 11, color: "#cfcfcf", letterSpacing: "0.12em", fontWeight: 600 }}
      >
        GAP <span style={{ color: statusColor, fontWeight: 800, fontSize: 13 }}>{Math.round(lead)}m</span>
      </div>

      {/* Map name */}
      <div
        className="absolute bottom-1 right-3 font-mono z-20"
        style={{ fontSize: 9, color: `${m.accent}77`, letterSpacing: "0.15em" }}
      >
        {m.name.toUpperCase()}
      </div>

      {/* Distance dotted line between chaser and runner */}
      <svg
        className="absolute pointer-events-none z-10"
        style={{ left: 0, right: 0, top: 0, width: "100%", height: "100%" }}
      >
        <line
          x1={`${chaserLeft + 4}%`}
          y1="68%"
          x2={`${runnerLeft + 2}%`}
          y2="68%"
          stroke={statusColor}
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.85"
        />
      </svg>

      {/* Pixel road */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: 28 }}>
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: 28,
            background: `repeating-linear-gradient(0deg, ${m.road} 0px, ${m.road} 4px, ${m.roadAlt} 4px, ${m.roadAlt} 8px)`,
          }}
        />
        <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: m.accent + "55" }} />
        <div
          className="absolute left-0 right-0"
          style={{
            top: 12,
            height: 4,
            background: `repeating-linear-gradient(90deg, ${m.laneColor} 0px, ${m.laneColor} 16px, transparent 16px, transparent 36px)`,
            animation: running ? "roadScroll 0.5s linear infinite" : "none",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Chaser */}
      <div
        className="absolute z-20"
        style={{ left: `${chaserLeft}%`, bottom: 22, transition: "left 250ms ease-out" }}
      >
        {/* CHASER label */}
        <div
          className="absolute font-mono"
          style={{
            top: -14, left: "50%", transform: "translateX(-50%)",
            fontSize: 9, letterSpacing: "0.18em",
            color: "#ef4444", fontWeight: 700,
          }}
        >
          CHASER
        </div>
        {running && <SpeedLines color={danger ? "#ef4444" : "#888"} />}
        <ChaserSprite running={running} />
        {running && <Dust />}
      </div>

      {/* Runner */}
      <div
        className="absolute z-20"
        style={{
          left: `${runnerLeft}%`,
          bottom: 22,
          transition: "left 250ms ease-out",
          filter: safe ? `drop-shadow(0 0 4px ${c.body}77)` : undefined,
        }}
      >
        {/* YOU label */}
        <div
          className="absolute font-mono"
          style={{
            top: -14, left: "50%", transform: "translateX(-50%)",
            fontSize: 9, letterSpacing: "0.18em",
            color: "#facc15", fontWeight: 700,
          }}
        >
          YOU
        </div>

        {/* Speech bubble */}
        <SpeechBubble text={phrase} color={lead < 35 ? "#ef4444" : "#facc15"} />

        {running && <SpeedLines color="#aaa" />}
        <RunnerSprite running={running} character={c} />
        {running && <Dust />}
      </div>

      <style>{`
        .chase-strip { --chase-h: 160px; }
        @media (max-width: 640px) { .chase-strip { --chase-h: 110px; } }
        @keyframes roadScroll { from { background-position: 0 0; } to { background-position: -36px 0; } }
        @keyframes speedLine { 0% { transform: translateX(0); opacity: 0.8; } 100% { transform: translateX(-12px); opacity: 0; } }
        @keyframes dust { 0% { transform: translate(0,0) scale(1); opacity: 0.7; } 100% { transform: translate(-10px,-4px) scale(0.4); opacity: 0; } }
        @keyframes bubblePop { 0% { transform: translate(-50%, -4px) scale(0.85); opacity: 0; } 100% { transform: translate(-50%, -10px) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

function SpeechBubble({ text, color }: { text: string; color: string }) {
  return (
    <div
      key={text}
      className="absolute font-mono whitespace-nowrap px-2 py-1 rounded"
      style={{
        bottom: "100%",
        left: "50%",
        transform: "translate(-50%, -10px)",
        marginBottom: 8,
        fontSize: 10,
        color: "#0a0a0a",
        background: color,
        border: `1px solid ${color}`,
        boxShadow: `0 2px 0 ${color}55`,
        animation: "bubblePop 200ms ease-out",
      }}
    >
      {text}
      <span
        className="absolute"
        style={{
          left: "50%",
          bottom: -4,
          transform: "translateX(-50%) rotate(45deg)",
          width: 6,
          height: 6,
          background: color,
        }}
      />
    </div>
  );
}

function SpeedLines({ color }: { color: string }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: -24, top: 18, width: 22, height: 24 }}>
      <div className="absolute" style={{ top: 4, left: 0, width: 18, height: 2, background: color, opacity: 0.7, animation: "speedLine 0.35s linear infinite" }} />
      <div className="absolute" style={{ top: 14, left: 6, width: 12, height: 2, background: color, opacity: 0.5, animation: "speedLine 0.45s linear infinite", animationDelay: "0.1s" }} />
    </div>
  );
}

function Dust() {
  return (
    <div className="absolute" style={{ left: -4, bottom: -2, width: 16, height: 6 }}>
      <div className="absolute rounded-full" style={{ width: 6, height: 3, left: 0, bottom: 0, background: "#3a3a3a", animation: "dust 0.55s ease-out infinite" }} />
      <div className="absolute rounded-full" style={{ width: 4, height: 2, left: 6, bottom: 0, background: "#2e2e2e", animation: "dust 0.65s ease-out infinite", animationDelay: "0.2s" }} />
    </div>
  );
}

function MapBackground({ map, running }: { map: MapDef; running: boolean }) {
  const id = map.id;
  if (id === "city_street") {
    // Distant building silhouettes
    return (
      <div className="absolute inset-x-0 z-0 pointer-events-none" style={{ bottom: 28, height: 60 }}>
        {[8, 22, 38, 55, 72, 88].map((l, i) => (
          <div key={i} className="absolute" style={{
            left: `${l}%`, bottom: 0, width: i % 2 ? 24 : 18, height: 28 + (i % 3) * 8,
            background: "#15151a", borderTop: `2px solid ${map.accent}33`,
          }} />
        ))}
      </div>
    );
  }
  if (id === "subway_tunnel") {
    // Tunnel arch + flickering bulbs
    return (
      <div className="absolute inset-x-0 z-0 pointer-events-none" style={{ top: 0, bottom: 28 }}>
        <div className="absolute inset-x-0 top-0" style={{ height: "100%",
          background: `radial-gradient(ellipse at 50% 100%, ${map.accent}15, transparent 60%)` }} />
        {[15, 40, 65, 88].map((l, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left: `${l}%`, top: 14, width: 6, height: 6,
            background: map.accent, boxShadow: `0 0 8px ${map.accent}`,
            animation: running ? `bulbFlicker ${1.2 + i * 0.3}s infinite` : "none",
          }} />
        ))}
        <style>{`@keyframes bulbFlicker { 0%,100%{opacity:1} 70%{opacity:0.6} 75%{opacity:0.2} 80%{opacity:1} }`}</style>
      </div>
    );
  }
  if (id === "school_corridor") {
    // Lockers
    return (
      <div className="absolute inset-x-0 z-0 pointer-events-none" style={{ bottom: 28, height: 50 }}>
        <div className="absolute inset-x-0 bottom-0" style={{
          height: 50,
          background: `repeating-linear-gradient(90deg, #14160e 0px, #14160e 22px, ${map.accent}22 22px, ${map.accent}22 23px, #1a1d12 23px, #1a1d12 45px, #0e1108 45px, #0e1108 46px)`,
        }} />
      </div>
    );
  }
  // neon_downtown
  return (
    <div className="absolute inset-x-0 z-0 pointer-events-none" style={{ top: 0, bottom: 28 }}>
      <div className="absolute inset-x-0 bottom-0" style={{
        height: "100%",
        background: `radial-gradient(ellipse at 50% 100%, ${map.accent}22, transparent 55%)`,
      }} />
      {[10, 30, 50, 70, 90].map((l, i) => (
        <div key={i} className="absolute" style={{
          left: `${l}%`, bottom: 4, width: 2, height: 36 + (i % 3) * 10,
          background: i % 2 ? map.accent : "#22d3ee",
          opacity: 0.55,
          boxShadow: `0 0 6px ${i % 2 ? map.accent : "#22d3ee"}`,
        }} />
      ))}
    </div>
  );
}
