export type Difficulty = "beginner" | "mid" | "pro" | "expert" | "dash_master";
export type TimeMode = 30 | 60;
export type GameStatus = "setup" | "running" | "finished" | "caught";
export type ResultStatus = "escaped" | "almost_caught" | "caught" | "session_stopped";

export const WORD_POOLS: Record<Difficulty, string[]> = {
  beginner: [
    "cat", "dog", "run", "sun", "book", "hand", "tree", "play", "home", "blue",
    "fast", "jump", "kind", "road", "bird", "fish", "ball", "door", "food", "good",
    "help", "land", "love", "make", "name", "open", "park", "rain", "said", "take",
    "then", "time", "used", "very", "walk", "well", "with", "year", "your", "back",
    "call", "came", "come", "days", "down", "each", "find", "from", "gave", "give",
    "goes", "gold", "grow", "have", "here", "high", "hold", "just", "keep", "know",
    "last", "left", "life", "like", "line", "list", "long", "look", "made", "more",
    "move", "much", "must", "next", "only", "over", "part", "past", "plan", "read",
  ],
  mid: [
    "focus", "typing", "runner", "window", "simple", "target", "escape", "motion",
    "bright", "signal", "center", "change", "circle", "create", "driven", "effect",
    "energy", "finger", "follow", "format", "future", "global", "ground", "growth",
    "health", "impact", "income", "inside", "island", "joined", "launch", "leader",
    "letter", "listen", "little", "living", "loaded", "manage", "market", "master",
    "medium", "method", "middle", "mobile", "modern", "moment", "monkey", "moving",
    "needed", "normal", "notice", "object", "online", "option", "output", "passed",
    "people", "player", "pocket", "points", "policy", "portal", "posted", "prefer",
    "pretty", "prince", "proven", "public", "pushed", "random", "reason", "record",
    "remain", "render", "repair", "repeat", "result", "return", "review", "rising",
    "rocket", "router", "rubber", "sample", "saving", "search", "second", "secret",
    "sector", "select", "series", "server", "should", "single", "skills", "smooth",
  ],
  pro: [
    "keyboard", "accuracy", "distance", "challenge", "reaction", "pressure",
    "movement", "progress", "practice", "sequence", "position", "platform",
    "document", "equation", "feedback", "generate", "gradient", "hardware",
    "incoming", "instance", "interval", "keyboard", "language", "learning",
    "lifetime", "listener", "location", "markdown", "material", "measured",
    "momentum", "navigate", "negative", "observer", "optimize", "organize",
    "original", "overcome", "parallel", "passport", "patience", "positive",
    "powerful", "previous", "priority", "probable", "products", "property",
    "protocol", "provider", "relative", "reliable", "renderer", "response",
    "retrieve", "revision", "scenario", "schedule", "security", "selected",
    "separate", "showcase", "simplify", "skeleton", "snapshot", "software",
    "solution", "specific", "spectrum", "standard", "strategy", "strength",
    "struggle", "template", "terminal", "thousand", "timeline", "together",
    "tracking", "transfer", "triggers", "tutorial", "ultimate", "upcoming",
    "validate", "variable", "velocity", "vertical", "whatever", "workflow",
  ],
  dash_master: [
    "synchronization", "differentiation", "reconfiguration", "decentralization",
    "characterization", "instrumentation", "compartmentalize", "rationalization",
    "interoperability", "indistinguishable", "uncharacteristically", "antidisestablish",
    "incomprehensibility", "counterproductive", "phenomenologically", "constitutionally",
    "electromagnetically", "psychophysiological", "transcontinental", "intergenerational",
  ],
  expert: [
    "performance", "concentration", "acceleration", "responsibility", "unpredictable",
    "coordination", "communication", "collaboration", "accessibility", "continuously",
    "customization", "documentation", "establishment", "functionality", "implementation",
    "initialization", "internationalization", "investigation", "manufacturing", "optimization",
    "orchestration", "participation", "prioritization", "sophisticated", "straightforward",
    "transformation", "understanding", "visualization", "acknowledgement", "automatically",
    "circumstances", "consideration", "demonstration", "determination", "differentiate",
    "encouragement", "environmental", "extraordinary", "identification", "independence",
    "infrastructure", "interpretation", "introduction", "justification", "measurements",
    "multiplication", "notifications", "organizations", "philosophical", "predominantly",
    "professionally", "qualification", "reconstruction", "representation", "simultaneously",
    "specifications", "straightforward", "subscriptions", "supplementary", "telecommunications",
  ],
};

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  leadPerWord: number;
  typoPenalty: number;
  passiveRate: number;
  label: string;
  description: string;
}> = {
  beginner:    { leadPerWord: 2, typoPenalty: 3,  passiveRate: 0.25, label: "Beginner",    description: "Slow chaser, forgiving pressure" },
  mid:         { leadPerWord: 2, typoPenalty: 4,  passiveRate: 0.6,  label: "Mid",         description: "Normal chaser pressure" },
  pro:         { leadPerWord: 2, typoPenalty: 6,  passiveRate: 1.2,  label: "Pro",         description: "Faster chaser, less margin" },
  expert:      { leadPerWord: 2, typoPenalty: 8,  passiveRate: 2.0,  label: "Expert",      description: "Very fast chaser, sharp penalty" },
  dash_master: { leadPerWord: 2, typoPenalty: 12, passiveRate: 3.0,  label: "Dash Master", description: "Fastest chaser, harsh penalty, smaller start lead" },
};

export type CharacterId = "street_runner" | "hoodie_kid" | "pixel_courier" | "cyber_student";
export interface CharacterDef {
  id: CharacterId;
  name: string;
  description: string;
  skin: string;
  body: string;
  pants: string;
  shoe: string;
}
export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  street_runner:  { id: "street_runner",  name: "Street Runner",  description: "Quick and casual.",          skin: "#f4c27f", body: "#e05a2b", pants: "#1f1f1f", shoe: "#fff" },
  hoodie_kid:     { id: "hoodie_kid",     name: "Hoodie Kid",     description: "Calm under pressure.",       skin: "#f4c27f", body: "#5b8dd9", pants: "#2a2a4a", shoe: "#e05a2b" },
  pixel_courier:  { id: "pixel_courier",  name: "Pixel Courier",  description: "Always on a delivery.",      skin: "#e8b88a", body: "#2bbf6a", pants: "#222a33", shoe: "#ffd700" },
  cyber_student:  { id: "cyber_student",  name: "Cyber Student",  description: "Late to class, always.",     skin: "#f1c891", body: "#a855f7", pants: "#1a1230", shoe: "#22d3ee" },
};

export type MapId = "city_street" | "subway_tunnel" | "school_corridor" | "neon_downtown";
export interface MapDef {
  id: MapId;
  name: string;
  description: string;
  sky: string;       // top background
  ground: string;    // bottom background
  road: string;      // dirt strip color base
  roadAlt: string;   // dirt strip alt
  laneColor: string; // scrolling stripe
  accent: string;    // small environment accent
}
export const MAPS: Record<MapId, MapDef> = {
  city_street:     { id: "city_street",     name: "City Street",     description: "Cracked asphalt, neon signs.",  sky: "#0b0b0b", ground: "#0a0a0a", road: "#161616", roadAlt: "#1c1c1c", laneColor: "#facc1533", accent: "#facc15" },
  subway_tunnel:   { id: "subway_tunnel",   name: "Subway Tunnel",   description: "Tiles, rails, flickering bulbs.",sky: "#0a0e14", ground: "#06080c", road: "#11161c", roadAlt: "#161c22", laneColor: "#22d3ee33", accent: "#22d3ee" },
  school_corridor: { id: "school_corridor", name: "School Corridor", description: "Lockers and tiled floors.",      sky: "#0e0f0a", ground: "#0a0b07", road: "#1a1c14", roadAlt: "#202218", laneColor: "#a3e63533", accent: "#a3e635" },
  neon_downtown:   { id: "neon_downtown",   name: "Neon Downtown",   description: "Wet pavement, pink glow.",       sky: "#120a18", ground: "#0a0610", road: "#1a1024", roadAlt: "#22142e", laneColor: "#f472b633", accent: "#f472b6" },
};

export const STARTING_LEAD = 45;
export const MAX_LEAD = 100;

export function startingLeadFor(d: Difficulty): number {
  return d === "dash_master" ? 30 : STARTING_LEAD;
}

// Unified vocabulary: mostly short, some medium, occasional longer.
// All difficulties use the same pool — challenge comes from chase pressure, not word length.
const SHORT_WORDS = WORD_POOLS.beginner;
const MEDIUM_WORDS = WORD_POOLS.mid;
const LONG_WORDS = [...WORD_POOLS.pro, ...WORD_POOLS.expert, ...WORD_POOLS.dash_master];

function pickFrom(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateWordList(_difficulty: Difficulty, count = 80): string[] {
  // ~55% short, ~35% medium, ~10% long for every difficulty
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    if (r < 0.55) out.push(pickFrom(SHORT_WORDS));
    else if (r < 0.9) out.push(pickFrom(MEDIUM_WORDS));
    else out.push(pickFrom(LONG_WORDS));
  }
  return out;
}

export function calcWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0;
  return Math.round((correctChars / 5) / (elapsedSeconds / 60));
}

export function calcAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

export interface RunEntry {
  id: string;
  result: ResultStatus;
  wpm: number;
  accuracy: number;
  correctWords: number;
  bestCombo: number;
  lead: number;
  difficulty: Difficulty;
  timeMode: TimeMode;
  timestamp: number;
}

export function formatRelativeTime(ms: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ms);
  const sec = Math.floor(diff / 1000);
  if (sec < 30) return "Just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day} days ago`;
  const d = new Date(ms);
  return d.toLocaleDateString();
}

export const SEED_HISTORY: RunEntry[] = [];

export function getResultStatus(lead: number, timeRemaining: number, endedManually = false): ResultStatus {
  if (lead <= 0) return "caught";
  if (endedManually) return "session_stopped";
  if (timeRemaining === 0 && lead >= 40) return "escaped";
  return "almost_caught";
}
