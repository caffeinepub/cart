import {
  Bot,
  ChevronRight,
  Flame,
  Github,
  Layers,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onPlay: () => void;
}

interface LeaderEntry {
  score: number;
  level: number;
  date: string;
}

function getLeaderboard(): LeaderEntry[] {
  try {
    const raw = localStorage.getItem("fireeyes_scores");
    if (!raw) return [];
    return JSON.parse(raw) as LeaderEntry[];
  } catch {
    return [];
  }
}

export default function FireEyesLanding({ onPlay }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [activeSection, setActiveSection] = useState("home");
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const scrollTo = (
    ref: React.RefObject<HTMLDivElement | null>,
    id: string,
  ) => {
    setActiveSection(id);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" style={{ color: "#27D7F0" }} />,
      title: "HIGH-SPEED CHASES",
      desc: "Race at 300+ MPH on neon-lit highways. Weave through traffic. Push the limits of speed and control.",
    },
    {
      icon: <Bot className="w-8 h-8" style={{ color: "#FF8A2A" }} />,
      title: "ROBOT OPPONENT",
      desc: "Face IRONEX, a relentless AI opponent with glowing red eyes that adapts and gets smarter every level.",
    },
    {
      icon: <Layers className="w-8 h-8" style={{ color: "#27D7F0" }} />,
      title: "500 LEVELS",
      desc: "Progress through 500 increasingly intense levels. Each level cranks up speed, traffic, and challenge.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#0B1117",
        color: "#F2F5F7",
        minHeight: "100vh",
      }}
      className="overflow-x-hidden"
    >
      {/* NAV */}
      <nav
        data-ocid="nav.panel"
        style={{
          backgroundColor: "rgba(11,17,23,0.95)",
          borderBottom: "1px solid #1B2A35",
          backdropFilter: "blur(12px)",
        }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Flame style={{ color: "#FF8A2A" }} className="w-6 h-6" />
            <span
              className="font-orbitron font-black text-xl tracking-widest neon-cyan-text"
              style={{ fontFamily: "Orbitron, monospace" }}
            >
              FIREEYES
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["home", "features", "leaderboard"].map((s) => (
              <button
                type="button"
                key={s}
                data-ocid={`nav.${s}.link`}
                onClick={() =>
                  s === "home"
                    ? scrollTo(heroRef, s)
                    : s === "features"
                      ? scrollTo(featuresRef, s)
                      : scrollTo(leaderboardRef, s)
                }
                style={{
                  fontFamily: "Orbitron, monospace",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color:
                    activeSection === s ? "#27D7F0" : "rgba(242,245,247,0.6)",
                  transition: "color 0.2s",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Play Now button */}
          <button
            type="button"
            data-ocid="nav.play_now.button"
            onClick={onPlay}
            className="btn-play px-5 py-2 rounded text-sm"
          >
            PLAY NOW
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100vh", minHeight: 600 }}
      >
        {/* Background image */}
        <img
          src="/assets/generated/fireeyes-hero.dim_1920x1080.jpg"
          alt="FIREEYES Racing"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center" }}
        />
        {/* Overlay */}
        <div className="hero-overlay absolute inset-0" />
        <div className="scanlines absolute inset-0" />

        {/* HUD-style border decorations */}
        <div
          className="absolute top-6 left-6 w-16 h-16 pointer-events-none"
          style={{
            borderTop: "2px solid #27D7F0",
            borderLeft: "2px solid #27D7F0",
            boxShadow: "inset 0 0 10px rgba(39,215,240,0.2)",
          }}
        />
        <div
          className="absolute top-6 right-6 w-16 h-16 pointer-events-none"
          style={{
            borderTop: "2px solid #27D7F0",
            borderRight: "2px solid #27D7F0",
            boxShadow: "inset 0 0 10px rgba(39,215,240,0.2)",
          }}
        />
        <div
          className="absolute bottom-6 left-6 w-16 h-16 pointer-events-none"
          style={{
            borderBottom: "2px solid #FF8A2A",
            borderLeft: "2px solid #FF8A2A",
            boxShadow: "inset 0 0 10px rgba(255,138,42,0.2)",
          }}
        />
        <div
          className="absolute bottom-6 right-6 w-16 h-16 pointer-events-none"
          style={{
            borderBottom: "2px solid #FF8A2A",
            borderRight: "2px solid #FF8A2A",
            boxShadow: "inset 0 0 10px rgba(255,138,42,0.2)",
          }}
        />

        {/* Hero content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "clamp(3rem, 10vw, 8rem)",
                fontWeight: 900,
                letterSpacing: "0.12em",
                lineHeight: 1,
                color: "#F2F5F7",
                textShadow:
                  "0 0 30px rgba(39,215,240,0.6), 0 0 60px rgba(39,215,240,0.3), 0 0 100px rgba(39,215,240,0.15)",
              }}
            >
              FIRE
              <span
                style={{
                  color: "#FF8A2A",
                  textShadow: "0 0 30px rgba(255,138,42,0.8)",
                }}
              >
                EYES
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "clamp(0.6rem, 1.5vw, 1rem)",
              letterSpacing: "0.3em",
              color: "rgba(39,215,240,0.8)",
              marginTop: "1rem",
            }}
          >
            THE ULTIMATE BIKE RACING EXPERIENCE
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-8 mt-10 flex-wrap justify-center"
          >
            {[
              { val: "500", label: "LEVELS" },
              { val: "1", label: "ROBOT RIVAL" },
              { val: "120", label: "FPS TARGET" },
              { val: "∞", label: "REPLAYABILITY" },
            ].map((s) => (
              <div
                key={s.label}
                className="hud-panel px-5 py-3 rounded text-center stat-appear"
              >
                <div
                  style={{
                    fontFamily: "Orbitron, monospace",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#FF8A2A",
                    textShadow: "0 0 15px rgba(255,138,42,0.5)",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: "Orbitron, monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    color: "rgba(39,215,240,0.6)",
                    marginTop: "2px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            data-ocid="hero.play_now.primary_button"
            onClick={onPlay}
            className="btn-play mt-10 px-12 py-4 rounded text-lg flex items-center gap-3"
          >
            <Flame className="w-5 h-5" />
            IGNITE THE RACE
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Level bar at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, #27D7F0, #FF8A2A, #27D7F0)",
            boxShadow: "0 0 15px rgba(39,215,240,0.6)",
          }}
        />
      </div>

      {/* FEATURES */}
      <section
        ref={featuresRef}
        id="features"
        className="py-24 px-6"
        style={{ backgroundColor: "#0B1117" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.4em",
                color: "#27D7F0",
                marginBottom: "0.75rem",
              }}
            >
              GAME FEATURES
            </div>
            <h2
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "#F2F5F7",
              }}
            >
              BUILT FOR SPEED
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                data-ocid={`features.item.${i + 1}`}
                className="fe-card rounded-lg p-8"
              >
                <div className="mb-4">{f.icon}</div>
                <h3
                  style={{
                    fontFamily: "Orbitron, monospace",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#F2F5F7",
                    marginBottom: "0.75rem",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "rgba(242,245,247,0.6)",
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Controls guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 fe-card rounded-lg p-8"
          >
            <h3
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#27D7F0",
                marginBottom: "1.5rem",
              }}
            >
              CONTROLS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "← →", action: "Change Lane" },
                { key: "↑", action: "Boost Speed" },
                { key: "↓", action: "Brake" },
                { key: "A / D", action: "Lane Switch" },
              ].map((c) => (
                <div key={c.key} className="text-center">
                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      border: "1px solid #1B2A35",
                      borderRadius: "6px",
                      backgroundColor: "#16222C",
                      fontFamily: "Orbitron, monospace",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#FF8A2A",
                      marginBottom: "6px",
                    }}
                  >
                    {c.key}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(242,245,247,0.5)",
                    }}
                  >
                    {c.action}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section
        ref={leaderboardRef}
        id="leaderboard"
        className="py-24 px-6"
        style={{ backgroundColor: "#121C24" }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Trophy
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "#FF8A2A" }}
            />
            <h2
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "#F2F5F7",
              }}
            >
              LEADERBOARD
            </h2>
          </motion.div>

          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid #1B2A35" }}
            data-ocid="leaderboard.table"
          >
            {/* Header */}
            <div
              className="grid grid-cols-4 px-6 py-3"
              style={{
                backgroundColor: "#16222C",
                borderBottom: "1px solid #1B2A35",
                fontFamily: "Orbitron, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "rgba(39,215,240,0.7)",
              }}
            >
              <div>RANK</div>
              <div>SCORE</div>
              <div>LEVEL</div>
              <div>DATE</div>
            </div>

            {leaderboard.length === 0 ? (
              <div
                data-ocid="leaderboard.empty_state"
                className="py-16 text-center"
                style={{ backgroundColor: "#0B1117" }}
              >
                <div
                  style={{
                    color: "rgba(242,245,247,0.3)",
                    fontFamily: "Orbitron, monospace",
                    fontSize: "0.8rem",
                  }}
                >
                  NO RACES YET — BE THE FIRST
                </div>
                <button
                  type="button"
                  data-ocid="leaderboard.play_now.primary_button"
                  onClick={onPlay}
                  className="btn-play mt-6 px-8 py-3 rounded text-sm"
                >
                  START RACING
                </button>
              </div>
            ) : (
              leaderboard.slice(0, 10).map((entry, i) => (
                <motion.div
                  key={`${entry.score}-${entry.date}-${entry.level}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  data-ocid={`leaderboard.item.${i + 1}`}
                  className="grid grid-cols-4 px-6 py-4"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#0B1117" : "#121C24",
                    borderBottom: "1px solid #1B2A35",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Orbitron, monospace",
                      fontWeight: 700,
                      color:
                        i === 0
                          ? "#FF8A2A"
                          : i < 3
                            ? "#27D7F0"
                            : "rgba(242,245,247,0.5)",
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div
                    style={{
                      fontFamily: "Orbitron, monospace",
                      fontWeight: 600,
                      color: "#F2F5F7",
                    }}
                  >
                    {entry.score.toLocaleString()}
                  </div>
                  <div style={{ color: "rgba(39,215,240,0.8)" }}>
                    LVL {entry.level}
                  </div>
                  <div
                    style={{
                      color: "rgba(242,245,247,0.4)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {entry.date}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-12 px-6"
        style={{
          backgroundColor: "#0B1117",
          borderTop: "1px solid #1B2A35",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Flame style={{ color: "#FF8A2A" }} className="w-5 h-5" />
              <span
                style={{
                  fontFamily: "Orbitron, monospace",
                  fontWeight: 900,
                  letterSpacing: "0.2em",
                  color: "#27D7F0",
                }}
              >
                FIREEYES
              </span>
            </div>
            <div
              style={{ color: "rgba(242,245,247,0.3)", fontSize: "0.85rem" }}
            >
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(39,215,240,0.5)",
                  textDecoration: "none",
                }}
              >
                Built with ❤️ using caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
