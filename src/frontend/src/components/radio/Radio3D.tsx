import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

function RadioModel({ isPlaying }: { isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const emissiveIntensityRef = useRef(1.5);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    if (screenRef.current && isPlaying) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      emissiveIntensityRef.current =
        1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
      mat.emissiveIntensity = emissiveIntensityRef.current;
    }
  });

  const bodyMat = {
    color: "#0a1428",
    metalness: 0.7,
    roughness: 0.2,
    envMapIntensity: 1.5,
  };

  const accentMat = {
    color: "#1a2a4a",
    metalness: 0.8,
    roughness: 0.15,
  };

  const grilleYPositions = [-0.15, 0, 0.15];
  const feetXPositions = [-1.2, 1.2];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main body */}
      <RoundedBox
        args={[3.2, 1.8, 0.8]}
        radius={0.18}
        smoothness={6}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial {...bodyMat} />
      </RoundedBox>

      {/* Top handle */}
      <mesh position={[0, 1.25, 0]}>
        <torusGeometry args={[0.65, 0.1, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#0d1f3c" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[-0.55, 0.15, 0.42]}>
        <boxGeometry args={[1.4, 0.8, 0.06]} />
        <meshStandardMaterial
          color="#001020"
          emissive="#34E6FF"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Screen inner glow */}
      <mesh position={[-0.55, 0.15, 0.44]}>
        <boxGeometry args={[1.25, 0.66, 0.01]} />
        <meshStandardMaterial
          color="#001525"
          emissive="#34E6FF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Speaker grille lines */}
      {grilleYPositions.map((y) => (
        <mesh key={`grille-${y}`} position={[0.85, y - 0.1, 0.42]}>
          <boxGeometry args={[0.6, 0.05, 0.06]} />
          <meshStandardMaterial
            color="#0d1f3c"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Main tuning knob */}
      <mesh position={[1.25, 0.1, 0.42]}>
        <cylinderGeometry args={[0.22, 0.22, 0.2, 24]} />
        <meshStandardMaterial color="#1a3a6a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Knob indicator */}
      <mesh position={[1.25, 0.1, 0.54]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
        <meshStandardMaterial
          color="#34E6FF"
          emissive="#34E6FF"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Volume knob */}
      <mesh position={[1.25, -0.38, 0.42]}>
        <cylinderGeometry args={[0.15, 0.15, 0.18, 20]} />
        <meshStandardMaterial
          color="#FF4FD8"
          metalness={0.85}
          roughness={0.15}
          emissive="#FF4FD8"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Bottom feet */}
      {feetXPositions.map((x) => (
        <mesh key={`foot-${x}`} position={[x, -1.0, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.15, 12]} />
          <meshStandardMaterial {...accentMat} />
        </mesh>
      ))}

      {/* Antenna */}
      <mesh position={[1.4, 0.9, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.025, 0.035, 1.4, 8]} />
        <meshStandardMaterial
          color="#aaccff"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Neon edge strip top */}
      <mesh position={[0, 0.93, 0]}>
        <boxGeometry args={[3.2, 0.04, 0.85]} />
        <meshStandardMaterial
          color="#34E6FF"
          emissive="#34E6FF"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Neon edge strip bottom */}
      <mesh position={[0, -0.93, 0]}>
        <boxGeometry args={[3.2, 0.04, 0.85]} />
        <meshStandardMaterial
          color="#FF4FD8"
          emissive="#FF4FD8"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

export default function Radio3D({ isPlaying }: { isPlaying: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 3]} intensity={60} color="#34E6FF" />
      <pointLight position={[-3, -2, 2]} intensity={40} color="#FF4FD8" />
      <pointLight position={[3, 2, 1]} intensity={30} color="#7B4DFF" />
      <directionalLight position={[0, 4, 6]} intensity={1.5} color="#aaddff" />

      <RadioModel isPlaying={isPlaying} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
      />
    </Canvas>
  );
}
