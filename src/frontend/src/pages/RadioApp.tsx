import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Menu,
  Music,
  Pause,
  Play,
  Radio,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Star,
  User,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Radio3D from "../components/radio/Radio3D";
import {
  GENRE_CARDS,
  type Genre,
  STATIONS,
  type Station,
} from "../data/stations";

type Page = "explore" | "stations" | "genre" | "account";

const GENRE_COLORS: Record<string, string> = {
  Pop: "#FF4FD8",
  Jazz: "#F5A524",
  "Hip-Hop": "#7B4DFF",
  Classical: "#3B82F6",
  Rock: "#FF4B4B",
  Afrobeats: "#43D66B",
  "Lo-Fi": "#34E6FF",
  Electronic: "#FF4FD8",
};

const EQ_BARS = [
  { id: "bar-a", minH: 4, maxH: 24, duration: "0.6s" },
  { id: "bar-b", minH: 8, maxH: 20, duration: "0.8s" },
  { id: "bar-c", minH: 4, maxH: 28, duration: "0.5s" },
  { id: "bar-d", minH: 10, maxH: 18, duration: "0.9s" },
  { id: "bar-e", minH: 4, maxH: 22, duration: "0.7s" },
];

function EqBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="eq-bars">
      {EQ_BARS.map((b) => (
        <div
          key={b.id}
          className={`eq-bar ${isPlaying ? "playing" : ""}`}
          style={
            {
              height: isPlaying ? undefined : `${b.minH}px`,
              "--min-h": `${b.minH}px`,
              "--max-h": `${b.maxH}px`,
              "--duration": b.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function NowPlayingCard({
  station,
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  volume,
  onVolumeChange,
}: {
  station: Station | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (v: number) => void;
}) {
  const color = station ? GENRE_COLORS[station.genre] || "#34E6FF" : "#34E6FF";

  return (
    <div
      className="glass-panel-strong flex flex-col h-full p-5"
      style={{ minHeight: 440 }}
      data-ocid="now-playing.card"
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color }}
        >
          Now Playing
        </span>
        <div className="flex items-center gap-1">
          {isPlaying && (
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span
                className="ping-neon absolute inline-flex h-full w-full rounded-full"
                style={{ background: color, opacity: 0.6 }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ background: color }}
              />
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {isPlaying ? "LIVE" : "PAUSED"}
          </span>
        </div>
      </div>

      <div
        className="rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden"
        style={{
          height: 160,
          background: station
            ? `linear-gradient(135deg, ${station.colorDark} 0%, rgba(5,8,15,0.8) 100%)`
            : "rgba(10,18,40,0.5)",
          border: `1px solid ${color}30`,
          boxShadow: isPlaying ? `0 0 30px ${color}30` : "none",
        }}
      >
        <span style={{ fontSize: 64 }}>{station?.emoji || "📻"}</span>
        {isPlaying && (
          <div className="absolute inset-0 flex items-end justify-center pb-3">
            <EqBars isPlaying={isPlaying} />
          </div>
        )}
      </div>

      <div className="mb-3">
        <h3 className="font-bold text-lg text-foreground leading-tight">
          {station?.name || "Select a Station"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {station?.frequency || "---"} · {station?.genre || "---"}
        </p>
        <p className="text-xs mt-1" style={{ color }}>
          {station?.description || "Browse stations below"}
        </p>
      </div>

      <div className="mb-4">
        <div
          className="h-1 rounded-full mb-1 overflow-hidden"
          style={{ background: "rgba(120,220,255,0.15)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: isPlaying ? "45%" : "0%",
              background: `linear-gradient(90deg, ${color}, #FF4FD8)`,
              transition: "width 1s linear",
              boxShadow: `0 0 8px ${color}60`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>LIVE</span>
          <span>∞</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Shuffle"
          data-ocid="player.toggle"
        >
          <Shuffle size={16} />
        </button>
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onPrev}
          aria-label="Previous"
          data-ocid="player.pagination_prev"
        >
          <SkipBack size={18} />
        </button>
        <button
          type="button"
          className="btn-neon w-12 h-12 flex items-center justify-center rounded-full"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          data-ocid="player.primary_button"
        >
          {isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </button>
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onNext}
          aria-label="Next"
          data-ocid="player.pagination_next"
        >
          <SkipForward size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          <Volume2 size={14} className="text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(Number.parseFloat(e.target.value))}
            className="seek-bar w-16"
            style={{
              background: `linear-gradient(90deg, ${color} ${volume * 100}%, rgba(120,220,255,0.2) ${volume * 100}%)`,
            }}
            data-ocid="player.input"
          />
        </div>
      </div>
    </div>
  );
}

function StationGenreCard({
  genre,
  emoji,
  color,
  gradient,
  description,
  onSelect,
}: {
  genre: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <div
      className="glass-panel card-neon-hover p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{ background: gradient, borderColor: `${color}25` }}
      data-ocid="genre.card"
    >
      <div
        className="text-4xl w-14 h-14 flex items-center justify-center rounded-2xl"
        style={{
          background: `${color}20`,
          boxShadow: `0 4px 20px ${color}30`,
          transform: "perspective(100px) rotateX(5deg) rotateY(-5deg)",
        }}
      >
        {emoji}
      </div>
      <div>
        <h3 className="font-bold text-base text-foreground">{genre}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        className="btn-listen self-start"
        style={{ borderColor: color, color }}
        onClick={onSelect}
        data-ocid="genre.button"
      >
        LISTEN NOW
      </button>
    </div>
  );
}

function StationRow({
  station,
  isActive,
  isPlaying,
  onSelect,
  index,
}: {
  station: Station;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  index: number;
}) {
  const color = GENRE_COLORS[station.genre] || "#34E6FF";
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-panel card-neon-hover cursor-pointer p-4 flex items-center gap-4 w-full text-left"
      style={{
        borderColor: isActive ? `${color}60` : undefined,
        boxShadow: isActive ? `0 0 20px ${color}20` : undefined,
      }}
      onClick={onSelect}
      data-ocid={`stations.item.${index + 1}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{
          background: station.colorDark,
          boxShadow: `0 4px 16px ${color}30`,
        }}
      >
        {station.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-foreground">
            {station.name}
          </span>
          {isActive && isPlaying && <EqBars isPlaying={true} />}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {station.description}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <Badge
          style={{
            background: `${color}20`,
            color,
            borderColor: `${color}40`,
            fontSize: 10,
          }}
          className="mb-1 border"
        >
          {station.genre}
        </Badge>
        <p className="text-xs text-muted-foreground">{station.frequency}</p>
      </div>
    </motion.button>
  );
}

function TopPickCard({
  station,
  isActive,
  isPlaying,
  onSelect,
  index,
}: {
  station: Station;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  index: number;
}) {
  const color = GENRE_COLORS[station.genre] || "#34E6FF";
  return (
    <button
      type="button"
      className="glass-panel card-neon-hover cursor-pointer p-4 flex-shrink-0 relative overflow-hidden text-left"
      style={{ width: 200, borderColor: isActive ? `${color}60` : undefined }}
      onClick={onSelect}
      data-ocid={`toppicks.item.${index + 1}`}
    >
      <div
        className="rounded-xl h-24 flex items-center justify-center mb-3 text-4xl relative"
        style={{
          background: `linear-gradient(135deg, ${station.colorDark} 0%, rgba(5,8,15,0.8) 100%)`,
          boxShadow: `0 4px 20px ${color}25`,
        }}
      >
        {station.emoji}
        {isActive && isPlaying && (
          <div className="absolute top-2 right-2">
            <span className="relative flex h-3 w-3">
              <span
                className="ping-neon absolute inline-flex h-full w-full rounded-full"
                style={{ background: color, opacity: 0.7 }}
              />
              <span
                className="relative inline-flex rounded-full h-3 w-3"
                style={{ background: color }}
              />
            </span>
          </div>
        )}
      </div>
      <h4 className="font-bold text-sm text-foreground truncate">
        {station.name}
      </h4>
      <p className="text-xs mt-0.5" style={{ color }}>
        {station.frequency}
      </p>
    </button>
  );
}

export default function RadioApp() {
  const [page, setPage] = useState<Page>("explore");
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentIndex = currentStation
    ? STATIONS.findIndex((s) => s.id === currentStation.id)
    : -1;

  const playStation = useCallback(
    (station: Station) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      const audio = new Audio();
      audio.src = station.streamUrl;
      audio.volume = volume;
      audioRef.current = audio;

      audio
        .play()
        .then(() => {
          setCurrentStation(station);
          setIsPlaying(true);
        })
        .catch(() => {
          setCurrentStation(station);
          setIsPlaying(false);
          toast.error(
            `Could not load ${station.name}. Stream may be unavailable.`,
          );
        });

      audio.onerror = () => {
        setIsPlaying(false);
        toast.error(`Stream error for ${station.name}.`);
      };
    },
    [volume],
  );

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !currentStation) {
      if (STATIONS[0]) playStation(STATIONS[0]);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          toast.error("Playback error. Try another station.");
        });
    }
  }, [isPlaying, currentStation, playStation]);

  const handlePrev = useCallback(() => {
    const idx = currentIndex <= 0 ? STATIONS.length - 1 : currentIndex - 1;
    playStation(STATIONS[idx]);
  }, [currentIndex, playStation]);

  const handleNext = useCallback(() => {
    const idx = currentIndex >= STATIONS.length - 1 ? 0 : currentIndex + 1;
    playStation(STATIONS[idx]);
  }, [currentIndex, playStation]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const filteredStations = selectedGenre
    ? STATIONS.filter((s) => s.genre === selectedGenre)
    : STATIONS;

  const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
    { label: "Explore", page: "explore", icon: <Zap size={14} /> },
    { label: "Stations", page: "stations", icon: <Radio size={14} /> },
    { label: "Genre", page: "genre", icon: <Grid3X3 size={14} /> },
    { label: "Account", page: "account", icon: <User size={14} /> },
  ];

  return (
    <div className="radio-bg min-h-screen font-body">
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(5,8,20,0.85)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(120,220,255,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #34E6FF, #FF4FD8)",
                boxShadow: "0 0 16px rgba(52,230,255,0.4)",
              }}
            >
              <Radio size={16} color="#05080F" />
            </div>
            <span className="neon-brand font-display text-xl font-black tracking-wider hidden sm:block">
              RADIOVERSE
            </span>
          </div>

          <nav
            className="hidden md:flex items-center gap-1"
            data-ocid="nav.panel"
          >
            {navLinks.map((link) => (
              <button
                key={link.page}
                type="button"
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  page === link.page
                    ? "nav-active"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setPage(link.page)}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
              data-ocid="nav.search_input"
            >
              <Search size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 cursor-pointer group">
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  style={{
                    background: "linear-gradient(135deg, #34E6FF20, #FF4FD820)",
                    color: "#34E6FF",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  RV
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors hidden lg:block">
                Guest
              </span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </div>
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="nav.toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: "1px solid rgba(120,220,255,0.1)" }}
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    type="button"
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all text-left ${
                      page === link.page
                        ? "nav-active"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setPage(link.page);
                      setMobileMenuOpen(false);
                    }}
                    data-ocid={`mobile.nav.${link.label.toLowerCase()}.link`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {page === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <section
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
                data-ocid="explore.section"
              >
                <div>
                  <NowPlayingCard
                    station={currentStation}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                  />
                </div>

                <div
                  className="glass-panel flex flex-col items-center justify-center relative overflow-hidden"
                  style={{ minHeight: 420 }}
                >
                  <div className="absolute top-5 left-0 right-0 flex flex-col items-center z-10 pointer-events-none">
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                      EXPLORE STATIONS
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      style={{
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background:
                          "radial-gradient(ellipse, rgba(52,230,255,0.08) 0%, transparent 70%)",
                      }}
                    />
                  </div>
                  <div style={{ width: "100%", height: 380 }}>
                    <Radio3D isPlaying={isPlaying} />
                  </div>
                  {currentStation && (
                    <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                      <div className="glass-panel px-4 py-2 flex items-center gap-2">
                        <Radio size={12} style={{ color: "#34E6FF" }} />
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#34E6FF" }}
                        >
                          {currentStation.frequency}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {currentStation.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title" style={{ color: "#EAF0FF" }}>
                    STATION CHANNELS
                  </h2>
                  <button
                    type="button"
                    className="text-xs font-semibold flex items-center gap-1 transition-colors"
                    style={{ color: "#34E6FF" }}
                    onClick={() => setPage("genre")}
                    data-ocid="explore.genre.link"
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  data-ocid="genre.list"
                >
                  {GENRE_CARDS.slice(0, 6).map((g) => (
                    <StationGenreCard
                      key={g.genre}
                      {...g}
                      onSelect={() => {
                        const station = STATIONS.find(
                          (s) => s.genre === g.genre,
                        );
                        if (station) playStation(station);
                      }}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title" style={{ color: "#EAF0FF" }}>
                    TOP PICKS
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:border-primary/40 transition-colors"
                      data-ocid="toppicks.pagination_prev"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:border-primary/40 transition-colors"
                      data-ocid="toppicks.pagination_next"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div
                  className="flex gap-4 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: "none" }}
                  data-ocid="toppicks.list"
                >
                  {STATIONS.filter(
                    (s) =>
                      s.featured || [0, 1, 2, 3].includes(STATIONS.indexOf(s)),
                  )
                    .slice(0, 6)
                    .map((s, i) => (
                      <TopPickCard
                        key={s.id}
                        station={s}
                        isActive={currentStation?.id === s.id}
                        isPlaying={isPlaying}
                        onSelect={() => playStation(s)}
                        index={i}
                      />
                    ))}
                </div>
              </section>
            </motion.div>
          )}

          {page === "stations" && (
            <motion.div
              key="stations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1
                  className="section-title text-2xl mb-1"
                  style={{ color: "#EAF0FF" }}
                >
                  ALL STATIONS
                </h1>
                <p className="text-sm text-muted-foreground">
                  {STATIONS.length} stations streaming live
                </p>
              </div>
              <ScrollArea className="h-[70vh]">
                <div
                  className="flex flex-col gap-3 pr-4"
                  data-ocid="stations.list"
                >
                  {STATIONS.map((s, i) => (
                    <StationRow
                      key={s.id}
                      station={s}
                      isActive={currentStation?.id === s.id}
                      isPlaying={isPlaying}
                      onSelect={() => playStation(s)}
                      index={i}
                    />
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}

          {page === "genre" && (
            <motion.div
              key="genre"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 flex items-center gap-4">
                <div>
                  <h1
                    className="section-title text-2xl mb-1"
                    style={{ color: "#EAF0FF" }}
                  >
                    GENRES
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Filter by music genre
                  </p>
                </div>
                {selectedGenre && (
                  <button
                    type="button"
                    className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(52,230,255,0.1)",
                      color: "#34E6FF",
                      border: "1px solid rgba(52,230,255,0.3)",
                    }}
                    onClick={() => setSelectedGenre(null)}
                    data-ocid="genre.secondary_button"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                data-ocid="genre.list"
              >
                {GENRE_CARDS.map((g) => (
                  <button
                    key={g.genre}
                    type="button"
                    className="glass-panel card-neon-hover cursor-pointer p-4 text-center w-full"
                    style={{
                      background:
                        selectedGenre === g.genre ? g.gradient : undefined,
                      borderColor:
                        selectedGenre === g.genre ? `${g.color}60` : undefined,
                    }}
                    onClick={() =>
                      setSelectedGenre(
                        selectedGenre === g.genre ? null : g.genre,
                      )
                    }
                    data-ocid="genre.tab"
                  >
                    <div className="text-3xl mb-2">{g.emoji}</div>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: selectedGenre === g.genre ? g.color : undefined,
                      }}
                    >
                      {g.genre}
                    </p>
                  </button>
                ))}
              </div>

              <div>
                <h2
                  className="section-title text-base mb-4"
                  style={{ color: "#EAF0FF" }}
                >
                  {selectedGenre ? `${selectedGenre} STATIONS` : "ALL STATIONS"}
                </h2>
                <div
                  className="flex flex-col gap-3"
                  data-ocid="genre.stations.list"
                >
                  {filteredStations.map((s, i) => (
                    <StationRow
                      key={s.id}
                      station={s}
                      isActive={currentStation?.id === s.id}
                      isPlaying={isPlaying}
                      onSelect={() => playStation(s)}
                      index={i}
                    />
                  ))}
                  {filteredStations.length === 0 && (
                    <div
                      className="glass-panel p-8 text-center"
                      data-ocid="genre.stations.empty_state"
                    >
                      <Music
                        size={32}
                        className="mx-auto mb-3 text-muted-foreground"
                      />
                      <p className="text-muted-foreground">
                        No stations for this genre.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {page === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-lg mx-auto">
                <div
                  className="glass-panel-strong p-8 text-center mb-6"
                  data-ocid="account.card"
                >
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(52,230,255,0.2), rgba(255,79,216,0.2))",
                      border: "2px solid rgba(52,230,255,0.3)",
                    }}
                  >
                    🎧
                  </div>
                  <h2 className="font-bold text-2xl text-foreground mb-1">
                    Radio Listener
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Guest Account
                  </p>
                  <div className="flex gap-3 justify-center">
                    <div className="glass-panel px-4 py-3 text-center">
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#34E6FF" }}
                      >
                        {STATIONS.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Stations</p>
                    </div>
                    <div className="glass-panel px-4 py-3 text-center">
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#FF4FD8" }}
                      >
                        8
                      </p>
                      <p className="text-xs text-muted-foreground">Genres</p>
                    </div>
                    <div className="glass-panel px-4 py-3 text-center">
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#7B4DFF" }}
                      >
                        {currentStation ? "1" : "0"}
                      </p>
                      <p className="text-xs text-muted-foreground">Playing</p>
                    </div>
                  </div>
                </div>

                <div
                  className="glass-panel p-6 mb-4"
                  data-ocid="account.section"
                >
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                    Currently Playing
                  </h3>
                  {currentStation ? (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{currentStation.emoji}</span>
                      <div>
                        <p className="font-bold text-foreground">
                          {currentStation.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentStation.frequency} · {currentStation.genre}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {isPlaying ? (
                          <EqBars isPlaying={true} />
                        ) : (
                          <Music size={16} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <p
                      className="text-sm text-muted-foreground"
                      data-ocid="account.empty_state"
                    >
                      No station selected. Browse stations to start listening.
                    </p>
                  )}
                </div>

                <div className="glass-panel p-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                    Preferences
                  </h3>
                  <div className="flex flex-col gap-3">
                    {["Pop", "Electronic", "Lo-Fi"].map((g) => (
                      <div
                        key={g}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Star
                            size={14}
                            style={{ color: GENRE_COLORS[g] || "#34E6FF" }}
                          />
                          <span className="text-sm">{g}</span>
                        </div>
                        <Badge
                          style={{
                            background: `${GENRE_COLORS[g] || "#34E6FF"}20`,
                            color: GENRE_COLORS[g] || "#34E6FF",
                            border: `1px solid ${GENRE_COLORS[g] || "#34E6FF"}40`,
                            fontSize: 10,
                          }}
                        >
                          Favorite
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(120,220,255,0.08)",
          marginTop: 48,
          padding: "32px 32px",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #34E6FF, #FF4FD8)",
              }}
            >
              <Radio size={12} color="#05080F" />
            </div>
            <span className="neon-brand font-display text-base font-black tracking-wider">
              RADIOVERSE
            </span>
          </div>
          <div className="flex items-center gap-6">
            {["Explore", "Stations", "Genre"].map((l) => (
              <button
                key={l}
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setPage(l.toLowerCase() as Page)}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              style={{ color: "#34E6FF" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
