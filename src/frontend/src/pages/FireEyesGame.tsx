import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Flame, Heart, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Types ──────────────────────────────────────────────────────────────────
interface GameState {
  phase: "playing" | "gameover" | "paused";
  lives: number;
  score: number;
  level: number;
  speed: number;
  health: number;
  distance: number;
  levelFlash: boolean;
  hitFlash: boolean;
}

interface HUDState {
  lives: number;
  score: number;
  level: number;
  speed: number;
  health: number;
  levelFlash: boolean;
  hitFlash: boolean;
  minimap: { playerLane: number; robotLane: number; carLanes: number[] };
}

const LANE_POSITIONS = [-3, 0, 3];
const ROAD_SEGMENT_LENGTH = 30;
const ROAD_SEGMENT_COUNT = 12;
const MAX_CARS = 20;
const LEVEL_DISTANCE_BASE = 400; // meters per level, decreases with level
const BASE_SPEED = 15;
const MAX_SPEED = 150;
const PLAYER_COLORS = { body: 0xff6b00, wheel: 0x222222, visor: 0x27d7f0 };
const ROBOT_COLORS = { body: 0x8899aa, wheel: 0x111111, eye: 0xff2222 };

// ── Utility ──────────────────────────────────────────────────────────────
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Road component ────────────────────────────────────────────────────────
function Road({
  segmentRefs,
}: { segmentRefs: React.MutableRefObject<THREE.Mesh[]> }) {
  const segments = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    segmentRefs.current = segments.current;
  });

  const roadMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
  const stripeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const edgeMat = new THREE.MeshLambertMaterial({ color: 0x334455 });

  return (
    <group>
      {Array.from({ length: ROAD_SEGMENT_COUNT }).map((_, i) => (
        <group
          key={`seg-${i * ROAD_SEGMENT_LENGTH}`}
          position={[0, 0, -i * ROAD_SEGMENT_LENGTH]}
        >
          {/* Road surface */}
          <mesh
            ref={(m) => {
              if (m) segments.current[i] = m;
            }}
            position={[0, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[12, ROAD_SEGMENT_LENGTH]} />
            <primitive object={roadMat} />
          </mesh>
          {/* Lane dividers */}
          {[-1.5, 1.5].map((x) => (
            <mesh
              key={x}
              position={[x, 0.01, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.08, ROAD_SEGMENT_LENGTH]} />
              <primitive object={stripeMat} />
            </mesh>
          ))}
          {/* Center dashes */}
          {Array.from({ length: 8 }).map((_, d) => (
            <mesh
              key={`dash-${-ROAD_SEGMENT_LENGTH / 2 + d * 4 + 2}`}
              position={[0, 0.01, -ROAD_SEGMENT_LENGTH / 2 + d * 4 + 2]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.06, 1.5]} />
              <primitive object={stripeMat} />
            </mesh>
          ))}
          {/* Road edges */}
          <mesh position={[-6.5, 0.2, 0]}>
            <boxGeometry args={[1, 0.4, ROAD_SEGMENT_LENGTH]} />
            <primitive object={edgeMat} />
          </mesh>
          <mesh position={[6.5, 0.2, 0]}>
            <boxGeometry args={[1, 0.4, ROAD_SEGMENT_LENGTH]} />
            <primitive object={edgeMat} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Player Bike ────────────────────────────────────────────────────────────
function PlayerBike({
  bikeRef,
}: { bikeRef: React.MutableRefObject<THREE.Group | null> }) {
  return (
    <group ref={bikeRef}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.5, 2]} />
        <meshStandardMaterial
          color={PLAYER_COLORS.body}
          emissive={PLAYER_COLORS.body}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Fairing top */}
      <mesh position={[0, 0.9, -0.5]}>
        <boxGeometry args={[0.6, 0.3, 1]} />
        <meshStandardMaterial
          color={0xff4400}
          emissive={0xff4400}
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Visor / windshield */}
      <mesh position={[0, 1.0, -0.9]}>
        <boxGeometry args={[0.5, 0.25, 0.1]} />
        <meshStandardMaterial
          color={PLAYER_COLORS.visor}
          emissive={PLAYER_COLORS.visor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Front wheel */}
      <mesh position={[0, 0.3, -1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color={PLAYER_COLORS.wheel} />
      </mesh>
      {/* Rear wheel */}
      <mesh position={[0, 0.3, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.22, 16]} />
        <meshStandardMaterial color={PLAYER_COLORS.wheel} />
      </mesh>
      {/* Exhaust glow */}
      <pointLight
        position={[0, 0.3, 1.2]}
        color={0xff4400}
        intensity={1.5}
        distance={3}
      />
    </group>
  );
}

// ── Robot Bike ─────────────────────────────────────────────────────────────
function RobotBike({
  robotRef,
}: { robotRef: React.MutableRefObject<THREE.Group | null> }) {
  return (
    <group ref={robotRef}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.75, 0.45, 1.9]} />
        <meshStandardMaterial
          color={ROBOT_COLORS.body}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.05, -0.5]}>
        <boxGeometry args={[0.45, 0.4, 0.4]} />
        <meshStandardMaterial
          color={0x667788}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 1.08, -0.72]}>
        <boxGeometry args={[0.1, 0.08, 0.05]} />
        <meshStandardMaterial
          color={ROBOT_COLORS.eye}
          emissive={ROBOT_COLORS.eye}
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.12, 1.08, -0.72]}>
        <boxGeometry args={[0.1, 0.08, 0.05]} />
        <meshStandardMaterial
          color={ROBOT_COLORS.eye}
          emissive={ROBOT_COLORS.eye}
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[-0.12, 1.08, -0.85]}
        color={0xff0000}
        intensity={2}
        distance={3}
      />
      <pointLight
        position={[0.12, 1.08, -0.85]}
        color={0xff0000}
        intensity={2}
        distance={3}
      />
      {/* Front wheel */}
      <mesh position={[0, 0.3, -1.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
        <meshStandardMaterial color={ROBOT_COLORS.wheel} metalness={0.9} />
      </mesh>
      {/* Rear wheel */}
      <mesh position={[0, 0.3, 0.95]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.33, 0.33, 0.2, 16]} />
        <meshStandardMaterial color={ROBOT_COLORS.wheel} metalness={0.9} />
      </mesh>
    </group>
  );
}

// ── Traffic Car ────────────────────────────────────────────────────────────
const CAR_COLORS = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c];

interface TrafficCarMesh {
  group: THREE.Group;
  lane: number;
  zPos: number;
  speed: number;
  color: number;
  active: boolean;
}

// ── Scene / Game Loop ──────────────────────────────────────────────────────
interface SceneProps {
  keysRef: React.MutableRefObject<Set<string>>;
  onHUDUpdate: (hud: HUDState) => void;
  onGameOver: (score: number, level: number) => void;
}

function GameScene({ keysRef, onHUDUpdate, onGameOver }: SceneProps) {
  const { scene, camera } = useThree();

  // Refs for game objects
  const bikeRef = useRef<THREE.Group | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const segmentRefs = useRef<THREE.Mesh[]>([]);
  const carsRef = useRef<TrafficCarMesh[]>([]);

  // Mutable game state (avoid re-renders)
  const gs = useRef<GameState>({
    phase: "playing",
    lives: 3,
    score: 0,
    level: 1,
    speed: BASE_SPEED,
    health: 100,
    distance: 0,
    levelFlash: false,
    hitFlash: false,
  });

  const playerLane = useRef(1); // 0, 1, 2
  const playerTargetX = useRef(0);
  const playerX = useRef(0);
  const robotLane = useRef(0);
  const robotX = useRef(LANE_POSITIONS[0]);
  const robotZ = useRef(-15); // starts ahead of player
  const invincible = useRef(0); // frames of invincibility
  const levelFlashTimer = useRef(0);
  const hudTimer = useRef(0);
  const distanceToNextLevel = useRef(LEVEL_DISTANCE_BASE);

  // Init cars
  useEffect(() => {
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    const cars: TrafficCarMesh[] = [];
    for (let i = 0; i < MAX_CARS; i++) {
      const g = new THREE.Group();
      const lane = Math.floor(Math.random() * 3);
      const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];

      // Car body
      const bodyMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.7, 2.8),
        new THREE.MeshLambertMaterial({ color }),
      );
      bodyMesh.position.set(0, 0.55, 0);
      g.add(bodyMesh);

      // Car roof
      const roofMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.5, 1.5),
        new THREE.MeshLambertMaterial({ color }),
      );
      roofMesh.position.set(0, 1.1, -0.1);
      g.add(roofMesh);

      // Windshield
      const windMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.35, 0.08),
        new THREE.MeshLambertMaterial({
          color: 0x88ccee,
          transparent: true,
          opacity: 0.6,
        }),
      );
      windMesh.position.set(0, 1.0, -0.9);
      g.add(windMesh);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 12);
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
      for (const [wx, wz] of [
        [-0.75, -1.0],
        [0.75, -1.0],
        [-0.75, 1.0],
        [0.75, 1.0],
      ]) {
        const wm = new THREE.Mesh(wheelGeo, wheelMat);
        wm.position.set(wx, 0.28, wz);
        wm.rotation.set(0, 0, Math.PI / 2);
        g.add(wm);
      }

      const zPos = -(Math.random() * 200 + 30);
      g.position.set(LANE_POSITIONS[lane], 0, zPos);
      carGroup.add(g);

      cars.push({
        group: g,
        lane,
        zPos,
        speed: 6 + Math.random() * 3,
        color,
        active: true,
      });
    }
    carsRef.current = cars;

    return () => {
      scene.remove(carGroup);
    };
  }, [scene]);

  // Set up fog
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x0b1117, 0.015);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const state = gs.current;
    if (state.phase !== "playing") return;

    const dt = Math.min(delta, 0.05);

    // ── Input ──
    const keys = keysRef.current;

    // Lane change
    const prevLane = playerLane.current;
    if ((keys.has("ArrowLeft") || keys.has("KeyA")) && playerLane.current > 0) {
      playerLane.current--;
      keys.delete("ArrowLeft");
      keys.delete("KeyA");
    }
    if (
      (keys.has("ArrowRight") || keys.has("KeyD")) &&
      playerLane.current < 2
    ) {
      playerLane.current++;
      keys.delete("ArrowRight");
      keys.delete("KeyD");
    }
    if (prevLane !== playerLane.current) {
      playerTargetX.current = LANE_POSITIONS[playerLane.current];
    }

    // Speed control
    let targetSpeed = BASE_SPEED + (state.level - 1) * 0.3;
    if (keys.has("ArrowUp") || keys.has("KeyW")) {
      targetSpeed = Math.min(targetSpeed * 1.5, MAX_SPEED);
    }
    if (keys.has("ArrowDown") || keys.has("KeyS")) {
      targetSpeed *= 0.6;
    }
    targetSpeed = clamp(targetSpeed, 5, MAX_SPEED);
    state.speed = lerp(state.speed, targetSpeed, dt * 3);

    // ── Player position ──
    playerX.current = lerp(playerX.current, playerTargetX.current, dt * 8);
    if (bikeRef.current) {
      bikeRef.current.position.x = playerX.current;
      // Tilt on lane change
      bikeRef.current.rotation.z = lerp(
        bikeRef.current.rotation.z,
        (playerTargetX.current - playerX.current) * -0.15,
        dt * 10,
      );
    }

    // ── Distance & level ──
    const distThisFrame = state.speed * dt;
    state.distance += distThisFrame;
    state.score += Math.floor(distThisFrame * state.level);
    distanceToNextLevel.current -= distThisFrame;

    if (distanceToNextLevel.current <= 0) {
      state.level = Math.min(state.level + 1, 500);
      distanceToNextLevel.current = Math.max(
        200,
        LEVEL_DISTANCE_BASE - state.level * 0.5,
      );
      state.levelFlash = true;
      levelFlashTimer.current = 90; // frames
    }

    if (levelFlashTimer.current > 0) {
      levelFlashTimer.current--;
      if (levelFlashTimer.current === 0) state.levelFlash = false;
    }

    // ── Road scrolling ──
    for (let i = 0; i < segmentRefs.current.length; i++) {
      const seg = segmentRefs.current[i];
      if (!seg?.parent) continue;
      seg.parent.position.z += state.speed * dt;
      if (seg.parent.position.z > 25) {
        seg.parent.position.z -= ROAD_SEGMENT_LENGTH * ROAD_SEGMENT_COUNT;
      }
    }

    // ── Camera follows player ──
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = lerp(cam.position.x, playerX.current * 0.4, dt * 5);
    cam.position.y = 4;
    cam.position.z = 8;
    cam.lookAt(playerX.current * 0.3, 1, -15);

    // ── Traffic cars ──
    const carSpeed = state.speed;
    const levelFactor = 1 + (state.level - 1) * 0.02;
    for (const car of carsRef.current) {
      car.group.position.z += (carSpeed - car.speed * levelFactor) * dt;
      // Recycle behind
      if (car.group.position.z > 15) {
        car.lane = Math.floor(Math.random() * 3);
        car.group.position.x = LANE_POSITIONS[car.lane];
        car.group.position.z = -(100 + Math.random() * 150);
        car.speed = 5 + Math.random() * 4 + state.level * 0.05;
      }
      // Simple AABB collision with player
      if (invincible.current <= 0) {
        const dx = Math.abs(car.group.position.x - playerX.current);
        const dz = Math.abs(car.group.position.z - 0);
        if (dx < 1.1 && dz < 2.0) {
          state.health -= 20;
          invincible.current = 90;
          state.hitFlash = true;
          setTimeout(() => {
            state.hitFlash = false;
          }, 400);
          if (state.health <= 0) {
            state.health = 0;
            state.lives--;
            if (state.lives <= 0) {
              state.phase = "gameover";
              onGameOver(state.score, state.level);
            } else {
              state.health = 100;
            }
          }
        }
      } else {
        invincible.current--;
      }
    }

    // ── Robot AI ──
    if (robotRef.current) {
      // Robot tries to match player lane but not perfectly
      const robotReactSpeed = 0.3 + state.level * 0.002;
      const rand = Math.random();
      if (rand < robotReactSpeed * dt) {
        // Occasionally dodge away from player
        if (Math.random() < 0.3) {
          robotLane.current = Math.floor(Math.random() * 3);
        } else {
          robotLane.current = playerLane.current;
        }
      }
      robotX.current = lerp(
        robotX.current,
        LANE_POSITIONS[robotLane.current],
        dt * 3,
      );

      // Robot speed relative to player
      const robotSpeedFactor = 0.9 + state.level * 0.003;
      robotZ.current += state.speed * (robotSpeedFactor - 1) * dt;
      robotZ.current = clamp(robotZ.current, -40, 30);

      robotRef.current.position.x = robotX.current;
      robotRef.current.position.z = robotZ.current;
    }

    // ── HUD update at ~15fps ──
    hudTimer.current += dt;
    if (hudTimer.current > 0.067) {
      hudTimer.current = 0;
      const carLanes = carsRef.current
        .filter((c) => c.group.position.z > -50 && c.group.position.z < 5)
        .slice(0, 5)
        .map((c) => c.lane);
      onHUDUpdate({
        lives: state.lives,
        score: state.score,
        level: state.level,
        speed: Math.round(state.speed * 3.6),
        health: state.health,
        levelFlash: state.levelFlash,
        hitFlash: state.hitFlash,
        minimap: {
          playerLane: playerLane.current,
          robotLane: robotLane.current,
          carLanes,
        },
      });
    }
  });

  const roadMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color={0x223344} />
      <directionalLight
        position={[0, 20, -10]}
        intensity={0.8}
        color={0xaabbcc}
      />
      <pointLight
        position={[0, 10, 0]}
        color={0x27d7f0}
        intensity={0.5}
        distance={50}
      />

      {/* Road */}
      <Road segmentRefs={segmentRefs} />

      {/* Ground plane (distant) */}
      <mesh position={[0, -0.2, -100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 300]} />
        <primitive object={roadMat} />
      </mesh>

      {/* Player */}
      <PlayerBike bikeRef={bikeRef} />

      {/* Robot */}
      <RobotBike robotRef={robotRef} />

      {/* City silhouette (background buildings) */}
      {[-40, -20, -30, -10, -50, 20, 30, 40, 50].map((x, i) => (
        <mesh key={`city-${x}`} position={[x, 5 + (i % 3) * 4, -80]}>
          <boxGeometry args={[3, 10 + (i % 4) * 5, 3]} />
          <meshLambertMaterial color={0x0d1520} />
        </mesh>
      ))}
    </>
  );
}

// ── HUD Overlay ────────────────────────────────────────────────────────────
function HUDOverlay({
  hud,
  phase,
  finalScore,
  finalLevel,
  onRestart,
  onExit,
}: {
  hud: HUDState;
  phase: "playing" | "gameover";
  finalScore: number;
  finalLevel: number;
  onRestart: () => void;
  onExit: () => void;
}) {
  const orbFont = { fontFamily: "Orbitron, monospace" } as const;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      {/* Hit flash overlay */}
      {hud.hitFlash && (
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255,0,0,0.25)",
            pointerEvents: "none",
            zIndex: 20,
          }}
        />
      )}

      {/* TOP LEFT – Lives */}
      <div
        data-ocid="hud.lives.panel"
        className="absolute top-4 left-4 hud-panel rounded px-3 py-2 flex items-center gap-2"
      >
        {[0, 1, 2].map((i) => (
          <Heart
            key={i}
            className="w-5 h-5"
            style={{
              color: i < hud.lives ? "#FF8A2A" : "rgba(255,138,42,0.2)",
              fill: i < hud.lives ? "#FF8A2A" : "transparent",
              filter:
                i < hud.lives
                  ? "drop-shadow(0 0 6px rgba(255,138,42,0.8))"
                  : "none",
            }}
          />
        ))}
      </div>

      {/* TOP CENTER – Level */}
      <div
        data-ocid="hud.level.panel"
        className="absolute top-4 left-1/2 -translate-x-1/2 hud-panel rounded px-4 py-2 text-center"
        style={{ minWidth: 160 }}
      >
        <div
          style={{
            ...orbFont,
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            color: "rgba(39,215,240,0.6)",
          }}
        >
          LEVEL
        </div>
        <div
          style={{
            ...orbFont,
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#27D7F0",
          }}
        >
          {hud.level}{" "}
          <span style={{ color: "rgba(39,215,240,0.4)", fontSize: "0.8rem" }}>
            / 500
          </span>
        </div>
        <div
          style={{
            height: 4,
            backgroundColor: "rgba(39,215,240,0.1)",
            borderRadius: 2,
            marginTop: 4,
            overflow: "hidden",
          }}
        >
          <div
            className="hud-progress-fill"
            style={{ width: `${(hud.level / 500) * 100}%` }}
          />
        </div>
      </div>

      {/* TOP RIGHT – Score */}
      <div
        data-ocid="hud.score.panel"
        className="absolute top-4 right-4 hud-panel rounded px-3 py-2 text-right"
      >
        <div
          style={{
            ...orbFont,
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: "rgba(39,215,240,0.5)",
          }}
        >
          SCORE
        </div>
        <div
          style={{
            ...orbFont,
            fontSize: "1rem",
            fontWeight: 700,
            color: "#F2F5F7",
          }}
        >
          {hud.score.toLocaleString()}
        </div>
      </div>

      {/* BOTTOM LEFT – Speedometer */}
      <div
        data-ocid="hud.speed.panel"
        className="absolute bottom-6 left-4 hud-panel rounded-full flex flex-col items-center justify-center"
        style={{ width: 80, height: 80 }}
      >
        <div
          style={{
            ...orbFont,
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#FF8A2A",
          }}
        >
          {hud.speed}
        </div>
        <div
          style={{
            ...orbFont,
            fontSize: "0.45rem",
            letterSpacing: "0.15em",
            color: "rgba(255,138,42,0.6)",
          }}
        >
          KM/H
        </div>
      </div>

      {/* BOTTOM CENTER – Health bar */}
      <div
        data-ocid="hud.health.panel"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hud-panel rounded px-4 py-2"
        style={{ minWidth: 160 }}
      >
        <div
          style={{
            ...orbFont,
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: "rgba(39,215,240,0.5)",
            marginBottom: 4,
          }}
        >
          HEALTH
        </div>
        <div
          style={{
            height: 8,
            backgroundColor: "rgba(39,215,240,0.1)",
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid rgba(39,215,240,0.2)",
          }}
        >
          <div
            style={{
              width: `${hud.health}%`,
              height: "100%",
              background:
                hud.health > 60
                  ? "linear-gradient(90deg, #27D7F0, #1ab8d6)"
                  : hud.health > 30
                    ? "linear-gradient(90deg, #FF8A2A, #ffaa00)"
                    : "linear-gradient(90deg, #ff2222, #ff6644)",
              transition: "width 0.3s ease, background 0.3s ease",
              boxShadow: "0 0 8px rgba(39,215,240,0.5)",
            }}
          />
        </div>
      </div>

      {/* BOTTOM RIGHT – Mini-map */}
      <div
        data-ocid="hud.minimap.panel"
        className="absolute bottom-6 right-4 hud-panel rounded p-2"
        style={{ width: 80, height: 80 }}
      >
        <div
          style={{
            ...orbFont,
            fontSize: "0.4rem",
            letterSpacing: "0.2em",
            color: "rgba(39,215,240,0.5)",
            marginBottom: 3,
          }}
        >
          MAP
        </div>
        {/* Mini-map lanes */}
        <div className="flex gap-1 h-14" style={{ paddingTop: 4 }}>
          {[0, 1, 2].map((lane) => (
            <div
              key={lane}
              style={{
                flex: 1,
                position: "relative",
                backgroundColor: "rgba(39,215,240,0.05)",
                border: "1px solid rgba(39,215,240,0.15)",
                borderRadius: 2,
              }}
            >
              {/* Player dot */}
              {hud.minimap.playerLane === lane && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#FF8A2A",
                    boxShadow: "0 0 6px #FF8A2A",
                  }}
                />
              )}
              {/* Robot dot */}
              {hud.minimap.robotLane === lane && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: "#ff2222",
                    boxShadow: "0 0 5px #ff2222",
                  }}
                />
              )}
              {/* Car dots */}
              {hud.minimap.carLanes.includes(lane) && (
                <div
                  style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: 1,
                    backgroundColor: "rgba(39,215,240,0.6)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Level flash */}
      {hud.levelFlash && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 15 }}
        >
          <div className="level-flash text-center">
            <div
              style={{
                ...orbFont,
                fontSize: "4rem",
                fontWeight: 900,
                color: "#27D7F0",
                textShadow:
                  "0 0 40px rgba(39,215,240,0.8), 0 0 80px rgba(39,215,240,0.4)",
                letterSpacing: "0.1em",
              }}
            >
              LEVEL {hud.level}
            </div>
            <div
              style={{
                ...orbFont,
                fontSize: "0.8rem",
                letterSpacing: "0.3em",
                color: "#FF8A2A",
              }}
            >
              GET READY
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {phase === "gameover" && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          style={{ backgroundColor: "rgba(11,17,23,0.9)", zIndex: 30 }}
          data-ocid="gameover.modal"
        >
          <div
            className="hud-panel rounded-lg text-center"
            style={{ padding: "3rem", maxWidth: 400, width: "90%" }}
          >
            <div
              style={{
                ...orbFont,
                fontSize: "2rem",
                fontWeight: 900,
                color: "#FF8A2A",
                letterSpacing: "0.15em",
                marginBottom: "0.5rem",
                textShadow: "0 0 20px rgba(255,138,42,0.6)",
              }}
            >
              GAME OVER
            </div>
            <div
              style={{
                color: "rgba(242,245,247,0.5)",
                marginBottom: "2rem",
                fontSize: "0.9rem",
              }}
            >
              The road ends here, racer.
            </div>
            <div className="flex gap-8 justify-center mb-8">
              <div>
                <div
                  style={{
                    ...orbFont,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#27D7F0",
                  }}
                >
                  {finalScore.toLocaleString()}
                </div>
                <div
                  style={{
                    ...orbFont,
                    fontSize: "0.5rem",
                    letterSpacing: "0.2em",
                    color: "rgba(39,215,240,0.5)",
                  }}
                >
                  SCORE
                </div>
              </div>
              <div>
                <div
                  style={{
                    ...orbFont,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#FF8A2A",
                  }}
                >
                  {finalLevel}
                </div>
                <div
                  style={{
                    ...orbFont,
                    fontSize: "0.5rem",
                    letterSpacing: "0.2em",
                    color: "rgba(255,138,42,0.5)",
                  }}
                >
                  LEVEL
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                data-ocid="gameover.restart.primary_button"
                onClick={onRestart}
                className="btn-play px-6 py-3 rounded text-sm"
              >
                RACE AGAIN
              </button>
              <button
                type="button"
                data-ocid="gameover.exit.secondary_button"
                onClick={onExit}
                style={{
                  ...orbFont,
                  padding: "12px 24px",
                  border: "1px solid #1B2A35",
                  borderRadius: 4,
                  backgroundColor: "transparent",
                  color: "rgba(242,245,247,0.6)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                }}
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT button */}
      {phase === "playing" && (
        <button
          type="button"
          data-ocid="game.exit.button"
          onClick={onExit}
          className="absolute top-4 pointer-events-auto"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: 64,
            top: 72,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(242,245,247,0.3)",
            fontSize: "0.65rem",
            fontFamily: "Orbitron, monospace",
            letterSpacing: "0.15em",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <X className="w-3 h-3" /> ESC TO EXIT
        </button>
      )}
    </div>
  );
}

// ── Main Game Component ────────────────────────────────────────────────────
interface Props {
  onExit: () => void;
}

const DEFAULT_HUD: HUDState = {
  lives: 3,
  score: 0,
  level: 1,
  speed: 0,
  health: 100,
  levelFlash: false,
  hitFlash: false,
  minimap: { playerLane: 1, robotLane: 0, carLanes: [] },
};

export default function FireEyesGame({ onExit }: Props) {
  const [hud, setHud] = useState<HUDState>(DEFAULT_HUD);
  const [phase, setPhase] = useState<"playing" | "gameover">("playing");
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [gameKey, setGameKey] = useState(0); // remount to restart
  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      // Prevent page scroll
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
      ) {
        e.preventDefault();
      }
      if (e.code === "Escape") onExit();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onExit]);

  const handleGameOver = useCallback((score: number, level: number) => {
    setFinalScore(score);
    setFinalLevel(level);
    setPhase("gameover");
    // Save to leaderboard
    try {
      const raw = localStorage.getItem("fireeyes_scores");
      const board = raw ? JSON.parse(raw) : [];
      board.push({
        score,
        level,
        date: new Date().toLocaleDateString(),
      });
      board.sort(
        (a: { score: number }, b: { score: number }) => b.score - a.score,
      );
      localStorage.setItem(
        "fireeyes_scores",
        JSON.stringify(board.slice(0, 20)),
      );
    } catch {}
  }, []);

  const handleRestart = useCallback(() => {
    setPhase("playing");
    setHud(DEFAULT_HUD);
    setGameKey((k) => k + 1);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0B1117",
        overflow: "hidden",
      }}
      data-ocid="game.canvas_target"
    >
      <Canvas
        key={gameKey}
        shadows
        camera={{ position: [0, 4, 8], fov: 75, near: 0.1, far: 400 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true }}
      >
        <GameScene
          keysRef={keysRef}
          onHUDUpdate={setHud}
          onGameOver={handleGameOver}
        />
      </Canvas>

      {/* HUD overlay */}
      <HUDOverlay
        hud={hud}
        phase={phase}
        finalScore={finalScore}
        finalLevel={finalLevel}
        onRestart={handleRestart}
        onExit={onExit}
      />

      {/* Mobile controls */}
      <MobileControls keysRef={keysRef} />
    </div>
  );
}

// ── Mobile Controls ────────────────────────────────────────────────────────
function MobileControls({
  keysRef,
}: { keysRef: React.MutableRefObject<Set<string>> }) {
  const press = (code: string) => () => keysRef.current.add(code);
  const release = (code: string) => () => keysRef.current.delete(code);

  const btnStyle = {
    backgroundColor: "rgba(39,215,240,0.1)",
    border: "1px solid rgba(39,215,240,0.3)",
    borderRadius: 8,
    color: "#27D7F0",
    fontFamily: "Orbitron, monospace",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
    touchAction: "none" as const,
  };

  return (
    <div
      className="absolute bottom-24 pointer-events-auto md:hidden"
      style={{ left: 0, right: 0, zIndex: 25 }}
    >
      <div className="flex justify-between items-end px-4">
        {/* Left controls */}
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="mobile.left.button"
            style={{ ...btnStyle, width: 56, height: 56 }}
            onPointerDown={press("ArrowLeft")}
            onPointerUp={release("ArrowLeft")}
            onPointerLeave={release("ArrowLeft")}
          >
            ←
          </button>
          <button
            type="button"
            data-ocid="mobile.right.button"
            style={{ ...btnStyle, width: 56, height: 56 }}
            onPointerDown={press("ArrowRight")}
            onPointerUp={release("ArrowRight")}
            onPointerLeave={release("ArrowRight")}
          >
            →
          </button>
        </div>
        {/* Right controls */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            data-ocid="mobile.boost.button"
            style={{
              ...btnStyle,
              width: 56,
              height: 56,
              backgroundColor: "rgba(255,138,42,0.15)",
              borderColor: "rgba(255,138,42,0.4)",
              color: "#FF8A2A",
            }}
            onPointerDown={press("ArrowUp")}
            onPointerUp={release("ArrowUp")}
            onPointerLeave={release("ArrowUp")}
          >
            ↑
          </button>
          <button
            type="button"
            data-ocid="mobile.brake.button"
            style={{ ...btnStyle, width: 56, height: 56 }}
            onPointerDown={press("ArrowDown")}
            onPointerUp={release("ArrowDown")}
            onPointerLeave={release("ArrowDown")}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
