export type Genre =
  | "Pop"
  | "Jazz"
  | "Hip-Hop"
  | "Classical"
  | "Rock"
  | "Afrobeats"
  | "Lo-Fi"
  | "Electronic";

export interface Station {
  id: string;
  name: string;
  frequency: string;
  genre: Genre;
  description: string;
  emoji: string;
  streamUrl: string;
  color: string;
  colorDark: string;
  featured?: boolean;
}

export const STATIONS: Station[] = [
  {
    id: "popwave",
    name: "PopWave FM",
    frequency: "98.5 FM",
    genre: "Pop",
    description: "Top charting hits 24/7",
    emoji: "🎵",
    streamUrl: "https://stream.zeno.fm/fn3udvuqd78uv",
    color: "#FF4FD8",
    colorDark: "rgba(255,79,216,0.15)",
    featured: true,
  },
  {
    id: "jazzlounge",
    name: "Jazz Lounge",
    frequency: "101.3 FM",
    genre: "Jazz",
    description: "Smooth jazz for the soul",
    emoji: "🎷",
    streamUrl: "https://stream.zeno.fm/wrr0ufrbutzuv",
    color: "#F5A524",
    colorDark: "rgba(245,165,36,0.15)",
    featured: true,
  },
  {
    id: "urbanbeats",
    name: "Urban Beats",
    frequency: "94.7 FM",
    genre: "Hip-Hop",
    description: "Street heat all day",
    emoji: "🎤",
    streamUrl: "https://stream.zeno.fm/0r0xa792kwzuv",
    color: "#7B4DFF",
    colorDark: "rgba(123,77,255,0.15)",
    featured: true,
  },
  {
    id: "classicvienna",
    name: "Classic Vienna",
    frequency: "88.9 FM",
    genre: "Classical",
    description: "Timeless orchestral pieces",
    emoji: "🎻",
    streamUrl: "https://stream.zeno.fm/yr4scbpnk08uv",
    color: "#3B82F6",
    colorDark: "rgba(59,130,246,0.15)",
    featured: true,
  },
  {
    id: "rockstar",
    name: "RockStar Radio",
    frequency: "103.1 FM",
    genre: "Rock",
    description: "Hard rock & metal anthems",
    emoji: "🎸",
    streamUrl: "https://stream.zeno.fm/jnc2jrrqtwzuv",
    color: "#FF4B4B",
    colorDark: "rgba(255,75,75,0.15)",
  },
  {
    id: "afronation",
    name: "Afro Nation",
    frequency: "96.3 FM",
    genre: "Afrobeats",
    description: "African vibes & rhythms",
    emoji: "🥁",
    streamUrl: "https://stream.zeno.fm/r9f92qnkf78uv",
    color: "#43D66B",
    colorDark: "rgba(67,214,107,0.15)",
  },
  {
    id: "chillzone",
    name: "ChillZone",
    frequency: "90.1 FM",
    genre: "Lo-Fi",
    description: "Study & relax beats",
    emoji: "☕",
    streamUrl: "https://stream.zeno.fm/fyn3ev3r4i8uv",
    color: "#34E6FF",
    colorDark: "rgba(52,230,255,0.15)",
  },
  {
    id: "neonpulse",
    name: "Neon Pulse",
    frequency: "107.5 FM",
    genre: "Electronic",
    description: "Cyberpunk & EDM energy",
    emoji: "⚡",
    streamUrl: "https://stream.zeno.fm/q7ctabperh0uv",
    color: "#FF4FD8",
    colorDark: "rgba(255,79,216,0.15)",
  },
  {
    id: "soulgroove",
    name: "Soul Groove",
    frequency: "92.7 FM",
    genre: "Jazz",
    description: "R&B soul classics & neo-soul",
    emoji: "🎺",
    streamUrl: "https://stream.zeno.fm/fn3udvuqd78uv",
    color: "#F5A524",
    colorDark: "rgba(245,165,36,0.15)",
  },
  {
    id: "deephouse",
    name: "Deep House Miami",
    frequency: "105.9 FM",
    genre: "Electronic",
    description: "Deep & progressive house",
    emoji: "🌊",
    streamUrl: "https://stream.zeno.fm/q7ctabperh0uv",
    color: "#3B82F6",
    colorDark: "rgba(59,130,246,0.15)",
  },
  {
    id: "countryhits",
    name: "Country Roads",
    frequency: "99.3 FM",
    genre: "Pop",
    description: "Country pop & folk hits",
    emoji: "🤠",
    streamUrl: "https://stream.zeno.fm/fn3udvuqd78uv",
    color: "#43D66B",
    colorDark: "rgba(67,214,107,0.15)",
  },
  {
    id: "hiphoplegends",
    name: "Hip-Hop Legends",
    frequency: "95.5 FM",
    genre: "Hip-Hop",
    description: "Golden era to modern rap",
    emoji: "🔥",
    streamUrl: "https://stream.zeno.fm/0r0xa792kwzuv",
    color: "#7B4DFF",
    colorDark: "rgba(123,77,255,0.15)",
  },
];

export const GENRE_CARDS = [
  {
    genre: "Pop" as Genre,
    emoji: "🎵",
    color: "#FF4FD8",
    gradient:
      "linear-gradient(135deg, rgba(255,79,216,0.25) 0%, rgba(123,77,255,0.15) 100%)",
    description: "Chart-topping hits",
  },
  {
    genre: "Jazz" as Genre,
    emoji: "🎷",
    color: "#F5A524",
    gradient:
      "linear-gradient(135deg, rgba(245,165,36,0.25) 0%, rgba(255,75,75,0.1) 100%)",
    description: "Smooth & soulful",
  },
  {
    genre: "Hip-Hop" as Genre,
    emoji: "🎤",
    color: "#7B4DFF",
    gradient:
      "linear-gradient(135deg, rgba(123,77,255,0.25) 0%, rgba(52,230,255,0.1) 100%)",
    description: "Urban street energy",
  },
  {
    genre: "Rock" as Genre,
    emoji: "🎸",
    color: "#FF4B4B",
    gradient:
      "linear-gradient(135deg, rgba(255,75,75,0.25) 0%, rgba(245,165,36,0.1) 100%)",
    description: "Riffs & anthems",
  },
  {
    genre: "Lo-Fi" as Genre,
    emoji: "☕",
    color: "#34E6FF",
    gradient:
      "linear-gradient(135deg, rgba(52,230,255,0.25) 0%, rgba(123,77,255,0.1) 100%)",
    description: "Chill study vibes",
  },
  {
    genre: "Electronic" as Genre,
    emoji: "⚡",
    color: "#FF4FD8",
    gradient:
      "linear-gradient(135deg, rgba(255,79,216,0.2) 0%, rgba(59,130,246,0.2) 100%)",
    description: "EDM & synthwave",
  },
  {
    genre: "Classical" as Genre,
    emoji: "🎻",
    color: "#3B82F6",
    gradient:
      "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(123,77,255,0.1) 100%)",
    description: "Orchestral mastery",
  },
  {
    genre: "Afrobeats" as Genre,
    emoji: "🥁",
    color: "#43D66B",
    gradient:
      "linear-gradient(135deg, rgba(67,214,107,0.25) 0%, rgba(245,165,36,0.1) 100%)",
    description: "African rhythms",
  },
];
