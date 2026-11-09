import { useEffect, useState } from "react";
import { CharacterDef, CHARACTERS } from "../gameData";

const PIXEL = 7;

type Cell = [number, number, "skin" | "body" | "pants" | "shoe" | "dark"];

// Frame 0: left leg forward
const FRAME_0: Cell[] = [
  [2,0,"skin"],[3,0,"skin"],[4,0,"skin"],
  [1,1,"body"],[2,1,"body"],[3,1,"body"],[4,1,"body"],[5,1,"body"],
  [1,2,"body"],[2,2,"body"],[3,2,"body"],[4,2,"body"],[5,2,"body"],
  [1,3,"body"],[2,3,"body"],[3,3,"body"],[4,3,"body"],
  [0,2,"body"],[0,3,"skin"],
  [5,3,"body"],[6,3,"skin"],
  [1,4,"pants"],[2,4,"pants"],[3,4,"pants"],[4,4,"pants"],
  [1,5,"pants"],[2,5,"pants"],
  [1,6,"dark"],[2,6,"shoe"],
  [3,5,"pants"],[4,5,"pants"],
  [3,6,"pants"],[4,6,"shoe"],
];

// Frame 1: right leg forward
const FRAME_1: Cell[] = [
  [2,0,"skin"],[3,0,"skin"],[4,0,"skin"],
  [1,1,"body"],[2,1,"body"],[3,1,"body"],[4,1,"body"],[5,1,"body"],
  [1,2,"body"],[2,2,"body"],[3,2,"body"],[4,2,"body"],[5,2,"body"],
  [1,3,"body"],[2,3,"body"],[3,3,"body"],[4,3,"body"],
  [0,3,"body"],[-1,3,"skin"],
  [5,2,"body"],[6,2,"skin"],
  [1,4,"pants"],[2,4,"pants"],[3,4,"pants"],[4,4,"pants"],
  [1,5,"pants"],[2,5,"pants"],
  [2,6,"shoe"],[1,6,"pants"],
  [3,5,"pants"],[4,5,"pants"],
  [3,6,"shoe"],[4,6,"dark"],
];

const FRAMES = [FRAME_0, FRAME_1];

export function RunnerSprite({ running = true, character }: { running?: boolean; character?: CharacterDef }) {
  const [frame, setFrame] = useState(0);
  const c = character ?? CHARACTERS.hoodie_kid;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setFrame(f => (f + 1) % 2), 200);
    return () => clearInterval(id);
  }, [running]);

  const palette: Record<Cell[2], string> = {
    skin: c.skin, body: c.body, pants: c.pants, shoe: c.shoe, dark: "#1a1a1a",
  };
  const pixels = FRAMES[frame];
  const width = 8 * PIXEL;
  const height = 8 * PIXEL;

  return (
    <svg width={width} height={height} viewBox={`-1 -1 9 9`} style={{ imageRendering: "pixelated" }}>
      {pixels.map(([x, y, k], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={palette[k]} />
      ))}
    </svg>
  );
}
