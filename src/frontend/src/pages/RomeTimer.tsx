import { useEffect, useRef, useState } from "react";

const ROMAN_NUMERALS = [
  { num: "XII", hour: 12 },
  { num: "I", hour: 1 },
  { num: "II", hour: 2 },
  { num: "III", hour: 3 },
  { num: "IV", hour: 4 },
  { num: "V", hour: 5 },
  { num: "VI", hour: 6 },
  { num: "VII", hour: 7 },
  { num: "VIII", hour: 8 },
  { num: "IX", hour: 9 },
  { num: "X", hour: 10 },
  { num: "XI", hour: 11 },
];

// Pre-computed static positions — keyed by stable position id, not array index
const MINUTE_TICKS = Array.from({ length: 60 }, (_, i) => i)
  .filter((i) => i % 5 !== 0)
  .map((i) => ({ id: `mt-${i}`, minuteIndex: i }));

const HOUR_TICKS = Array.from({ length: 12 }, (_, i) => ({
  id: `ht-${i}`,
  hourIndex: i,
}));

interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
}

function getTime(): ClockTime {
  const now = new Date();
  return {
    hours: now.getHours() % 12,
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    ms: now.getMilliseconds(),
  };
}

function getDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDigitalTime(t: ClockTime): string {
  const h24 = new Date().getHours().toString().padStart(2, "0");
  const m = t.minutes.toString().padStart(2, "0");
  const s = t.seconds.toString().padStart(2, "0");
  return `${h24}:${m}:${s}`;
}

function ClockFace({ time }: { time: ClockTime }) {
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  const secAngle = ((time.seconds + time.ms / 1000) / 60) * 360 - 90;
  const minAngle =
    ((time.minutes + (time.seconds + time.ms / 1000) / 60) / 60) * 360 - 90;
  const hrAngle =
    ((time.hours + (time.minutes + time.seconds / 60) / 60) / 12) * 360 - 90;

  const polar = (angleDeg: number, radius: number) => ({
    x: cx + radius * Math.cos((angleDeg * Math.PI) / 180),
    y: cy + radius * Math.sin((angleDeg * Math.PI) / 180),
  });

  return (
    <svg
      role="img"
      aria-label="RomeTimer analog clock"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="clock-face w-full h-full"
    >
      <title>RomeTimer Analog Clock</title>
      <defs>
        <radialGradient id="faceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="oklch(0.18 0.012 285)" />
          <stop offset="100%" stopColor="oklch(0.10 0.006 285)" />
        </radialGradient>
        <radialGradient id="rimGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="oklch(0.72 0.13 85)" />
          <stop offset="50%" stopColor="oklch(0.58 0.11 78)" />
          <stop offset="100%" stopColor="oklch(0.42 0.09 75)" />
        </radialGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="handGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="secGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer decorative ring */}
      <circle cx={cx} cy={cy} r={r + 6} fill="url(#rimGrad)" />
      <circle
        cx={cx}
        cy={cy}
        r={r + 3}
        fill="oklch(0.10 0.006 285)"
        stroke="oklch(0.62 0.12 82)"
        strokeWidth="1"
      />

      {/* Clock face */}
      <circle cx={cx} cy={cy} r={r} fill="url(#faceGrad)" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="oklch(0.60 0.11 82)"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r - 22}
        fill="none"
        stroke="oklch(0.52 0.09 80)"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* Minute ticks */}
      {MINUTE_TICKS.map(({ id, minuteIndex }) => {
        const angle = (minuteIndex / 60) * 360 - 90;
        const outer = polar(angle, r - 4);
        const inner = polar(angle, r - 10);
        return (
          <line
            key={id}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="oklch(0.55 0.08 82)"
            strokeWidth="0.8"
            opacity="0.6"
          />
        );
      })}

      {/* Hour ticks */}
      {HOUR_TICKS.map(({ id, hourIndex }) => {
        const angle = (hourIndex / 12) * 360 - 90;
        const outer = polar(angle, r - 4);
        const inner = polar(angle, r - 18);
        return (
          <line
            key={id}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="oklch(0.78 0.13 85)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}

      {/* Roman numerals */}
      {ROMAN_NUMERALS.map(({ num, hour }) => {
        const angle = (hour / 12) * 360 - 90;
        const pos = polar(angle, r - 38);
        return (
          <text
            key={hour}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={num.length > 3 ? "11" : "13"}
            fontFamily="'Cinzel', Georgia, serif"
            fontWeight="600"
            fill="oklch(0.82 0.12 85)"
            filter="url(#glow)"
            letterSpacing="0.5"
          >
            {num}
          </text>
        );
      })}

      {/* Hour hand */}
      <line
        x1={polar(hrAngle + 180, 18).x}
        y1={polar(hrAngle + 180, 18).y}
        x2={polar(hrAngle, r * 0.52).x}
        y2={polar(hrAngle, r * 0.52).y}
        stroke="oklch(0.82 0.13 85)"
        strokeWidth="7"
        strokeLinecap="round"
        filter="url(#handGlow)"
      />

      {/* Minute hand */}
      <line
        x1={polar(minAngle + 180, 22).x}
        y1={polar(minAngle + 180, 22).y}
        x2={polar(minAngle, r * 0.74).x}
        y2={polar(minAngle, r * 0.74).y}
        stroke="oklch(0.85 0.12 85)"
        strokeWidth="4.5"
        strokeLinecap="round"
        filter="url(#handGlow)"
      />

      {/* Second hand */}
      <line
        x1={polar(secAngle + 180, 26).x}
        y1={polar(secAngle + 180, 26).y}
        x2={polar(secAngle, r * 0.82).x}
        y2={polar(secAngle, r * 0.82).y}
        stroke="oklch(0.62 0.20 27)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#secGlow)"
      />

      {/* Center jewel */}
      <circle cx={cx} cy={cy} r={8} fill="oklch(0.65 0.13 82)" />
      <circle cx={cx} cy={cy} r={5} fill="oklch(0.78 0.15 85)" />
      <circle cx={cx} cy={cy} r={2.5} fill="oklch(0.90 0.10 85)" />
    </svg>
  );
}

export default function RomeTimer() {
  const [time, setTime] = useState<ClockTime>(getTime);
  const [dateStr, setDateStr] = useState<string>(getDateString);
  const [colonVisible, setColonVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime(getTime());
      setDateStr(getDateString());
      setColonVisible((v) => !v);
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const digitalTime = getDigitalTime(time);
  const [hh, mm, ss] = digitalTime.split(":");

  return (
    <div
      className="marble-bg min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      data-ocid="rome-timer.page"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, oklch(0.78 0.14 85 / 0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Title */}
      <header className="relative z-10 text-center mb-10 animate-fade-in">
        <div
          className="text-xs tracking-[0.4em] font-cinzel uppercase mb-3"
          style={{ color: "oklch(0.62 0.10 82)" }}
        >
          ✦ Tempus Fugit ✦
        </div>
        <h1
          className="font-cinzel font-bold tracking-widest uppercase gold-text-glow"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            color: "oklch(0.82 0.13 85)",
            letterSpacing: "0.15em",
          }}
          data-ocid="rome-timer.panel"
        >
          RomeTimer
        </h1>
        <div
          className="mt-2 h-px w-48 mx-auto"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.78 0.14 85 / 0.6), transparent)",
          }}
        />
      </header>

      {/* Clock body */}
      <main
        className="relative z-10 flex flex-col items-center gap-8"
        aria-label="RomeTimer clock"
      >
        <div
          className="relative"
          style={{ width: "clamp(280px, 70vw, 420px)", aspectRatio: "1" }}
          data-ocid="rome-timer.card"
        >
          <ClockFace time={time} />
        </div>

        {/* Digital time */}
        <div
          className="flex items-center gap-1 font-cinzel"
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            letterSpacing: "0.08em",
          }}
          data-ocid="rome-timer.section"
          aria-label={`Current time: ${hh} hours ${mm} minutes ${ss} seconds`}
        >
          <span
            style={{ color: "oklch(0.86 0.12 85)" }}
            className="gold-text-glow tabular-nums"
          >
            {hh}
          </span>
          <span
            style={{
              color: "oklch(0.72 0.13 82)",
              opacity: colonVisible ? 1 : 0.3,
              transition: "opacity 0.1s",
            }}
          >
            :
          </span>
          <span
            style={{ color: "oklch(0.86 0.12 85)" }}
            className="gold-text-glow tabular-nums"
          >
            {mm}
          </span>
          <span
            style={{
              color: "oklch(0.72 0.13 82)",
              opacity: colonVisible ? 1 : 0.3,
              transition: "opacity 0.1s",
            }}
          >
            :
          </span>
          <span
            style={{ color: "oklch(0.62 0.10 82)" }}
            className="tabular-nums"
          >
            {ss}
          </span>
        </div>

        {/* Date */}
        <div className="text-center">
          <div
            className="font-display italic"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
              color: "oklch(0.70 0.08 82)",
              letterSpacing: "0.03em",
            }}
          >
            {dateStr}
          </div>
          <div
            className="mt-3 h-px w-32 mx-auto"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.60 0.10 82 / 0.5), transparent)",
            }}
          />
        </div>

        {/* Inscription */}
        <div className="text-center mt-2">
          <p
            className="font-cinzel text-xs tracking-[0.3em] uppercase"
            style={{ color: "oklch(0.42 0.06 78)" }}
          >
            SPQR · Anno Domini · Hora Est
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 text-center">
        <p
          className="font-body text-xs tracking-wider"
          style={{ color: "oklch(0.38 0.04 78)" }}
        >
          © {new Date().getFullYear()}. Built with{" "}
          <span style={{ color: "oklch(0.62 0.12 25)" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-opacity hover:opacity-80"
            style={{ color: "oklch(0.62 0.10 82)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
