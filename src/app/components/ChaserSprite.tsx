import { useEffect, useState } from "react";

// Police inspector / security guard chaser — pixel art SVG
const FRAME_0: [number, number, string][] = [
  // head
  [2,0,"#e8b88a"],[3,0,"#e8b88a"],[4,0,"#e8b88a"],
  // cap
  [1,0,"#1a2a6c"],[2,0,"#1a2a6c"],[3,0,"#1a2a6c"],[4,0,"#1a2a6c"],[5,0,"#1a2a6c"],
  // face
  [2,1,"#e8b88a"],[3,1,"#e8b88a"],[4,1,"#e8b88a"],
  // body (uniform)
  [1,2,"#1a2a6c"],[2,2,"#1a2a6c"],[3,2,"#1a2a6c"],[4,2,"#1a2a6c"],[5,2,"#1a2a6c"],
  [1,3,"#1a2a6c"],[2,3,"#1a2a6c"],[3,3,"#1a2a6c"],[4,3,"#1a2a6c"],
  // badge
  [3,2,"#ffd700"],
  // left arm (forward)
  [0,2,"#1a2a6c"],[0,3,"#e8b88a"],
  // right arm (back)
  [5,3,"#1a2a6c"],[6,3,"#e8b88a"],
  // pants
  [1,4,"#0d1a3a"],[2,4,"#0d1a3a"],[3,4,"#0d1a3a"],[4,4,"#0d1a3a"],
  // left leg forward
  [1,5,"#0d1a3a"],[2,5,"#0d1a3a"],
  [1,6,"#222"],[2,6,"#1a2a6c"],
  // right leg back
  [3,5,"#0d1a3a"],[4,5,"#0d1a3a"],
  [3,6,"#0d1a3a"],[4,6,"#1a2a6c"],
];

const FRAME_1: [number, number, string][] = [
  // cap
  [1,0,"#1a2a6c"],[2,0,"#1a2a6c"],[3,0,"#1a2a6c"],[4,0,"#1a2a6c"],[5,0,"#1a2a6c"],
  // face
  [2,1,"#e8b88a"],[3,1,"#e8b88a"],[4,1,"#e8b88a"],
  // body
  [1,2,"#1a2a6c"],[2,2,"#1a2a6c"],[3,2,"#1a2a6c"],[4,2,"#1a2a6c"],[5,2,"#1a2a6c"],
  [1,3,"#1a2a6c"],[2,3,"#1a2a6c"],[3,3,"#1a2a6c"],[4,3,"#1a2a6c"],
  // badge
  [3,2,"#ffd700"],
  // left arm (back)
  [0,3,"#1a2a6c"],[-1,3,"#e8b88a"],
  // right arm (forward)
  [5,2,"#1a2a6c"],[6,2,"#e8b88a"],
  // pants
  [1,4,"#0d1a3a"],[2,4,"#0d1a3a"],[3,4,"#0d1a3a"],[4,4,"#0d1a3a"],
  // left leg back
  [1,5,"#0d1a3a"],[2,5,"#0d1a3a"],
  [2,6,"#1a2a6c"],[1,6,"#0d1a3a"],
  // right leg forward
  [3,5,"#0d1a3a"],[4,5,"#0d1a3a"],
  [3,6,"#1a2a6c"],[4,6,"#222"],
];

const FRAMES = [FRAME_0, FRAME_1];

export function ChaserSprite({ running = true }: { running?: boolean }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setFrame(f => (f + 1) % 2), 180);
    return () => clearInterval(id);
  }, [running]);

  const pixels = FRAMES[frame];
  const width = 8 * 7;
  const height = 8 * 7;

  return (
    <svg width={width} height={height} viewBox={`-1 -1 9 9`} style={{ imageRendering: "pixelated" }}>
      {pixels.map(([x, y, color], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}
