"use client";

import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import {
  Float,
  Instance,
  Instances,
  Line,
  MeshDistortMaterial,
  OrbitControls,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CatmullRomCurve3,
  Euler,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
} from "three";
import type { SystemLayer } from "./observatory-controls";

type LayerVisual = {
  color: string;
  radius: number;
  flatten: number;
  euler: [number, number, number];
  node: [number, number, number];
  phase: number;
};

const layerOrder: SystemLayer[] = ["architecture", "product", "platform"];

const layerVisuals: Record<SystemLayer, LayerVisual> = {
  architecture: {
    color: "#c8ff3d",
    radius: 2.58,
    flatten: 0.72,
    euler: [0.5, 0.08, 0.22],
    node: [2.3, 0.72, 0.28],
    phase: 0.1,
  },
  product: {
    color: "#f3f6ed",
    radius: 2.95,
    flatten: 0.58,
    euler: [-0.22, 0.72, -0.56],
    node: [-1.66, 1.76, -0.54],
    phase: 0.42,
  },
  platform: {
    color: "#889381",
    radius: 3.34,
    flatten: 0.52,
    euler: [0.86, -0.38, 0.36],
    node: [0.28, -2.48, 0.72],
    phase: 0.74,
  },
};

function DataPacket({
  active,
  color,
  curve,
  phase,
}: {
  active: boolean;
  color: string;
  curve: CatmullRomCurve3;
  phase: number;
}) {
  const packet = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!packet.current) return;
    const progress = (clock.elapsedTime * (active ? 0.085 : 0.035) + phase) % 1;
    curve.getPointAt(progress, packet.current.position);
    const targetScale = active ? 1.25 : 0.64;
    const scale = MathUtils.damp(packet.current.scale.x, targetScale, 5, delta);
    packet.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={packet}>
      <sphereGeometry args={[0.055, 14, 14]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function SystemNode({
  active,
  color,
  position,
}: {
  active: boolean;
  color: string;
  position: [number, number, number];
}) {
  const node = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    if (!node.current) return;
    const targetScale = active ? 1.22 : 0.76;
    const scale = MathUtils.damp(node.current.scale.x, targetScale, 5, delta);
    node.current.scale.setScalar(scale);
    node.current.rotation.y = clock.elapsedTime * (active ? 0.7 : 0.24);
    node.current.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.18;
  });

  return (
    <Float speed={active ? 2 : 0.8} rotationIntensity={0.18} floatIntensity={0.32}>
      <group ref={node} position={position}>
        <mesh>
          <octahedronGeometry args={[0.23, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 1.1 : 0.18}
            metalness={0.72}
            roughness={0.18}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.39, 0.012, 8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={active ? 0.92 : 0.24}
            toneMapped={false}
          />
        </mesh>
        {active && <pointLight color={color} intensity={1.8} distance={2.2} />}
      </group>
    </Float>
  );
}

function LayerOrbit({ active, layer }: { active: boolean; layer: SystemLayer }) {
  const visual = layerVisuals[layer];
  const curve = useMemo(() => {
    const rotation = new Euler(...visual.euler);
    const points = Array.from({ length: 96 }, (_, index) => {
      const angle = (index / 96) * Math.PI * 2;
      return new Vector3(
        Math.cos(angle) * visual.radius,
        Math.sin(angle) * visual.radius * visual.flatten,
        Math.sin(angle * 2 + visual.phase) * 0.18,
      ).applyEuler(rotation);
    });
    return new CatmullRomCurve3(points, true, "catmullrom", 0.45);
  }, [visual]);

  return (
    <group>
      <Line
        points={curve.getPoints(160)}
        color={visual.color}
        lineWidth={active ? 1.35 : 0.48}
        transparent
        opacity={active ? 0.82 : 0.17}
      />
      {[0, 0.31, 0.67].map((phase) => (
        <DataPacket
          key={phase}
          active={active}
          color={visual.color}
          curve={curve}
          phase={phase + visual.phase}
        />
      ))}
      <SystemNode active={active} color={visual.color} position={visual.node} />
    </group>
  );
}

function RadialTicks() {
  return (
    <Instances limit={72}>
      <boxGeometry args={[0.012, 0.085, 0.014]} />
      <meshBasicMaterial color="#87917f" transparent opacity={0.32} />
      {Array.from({ length: 72 }, (_, index) => {
        const angle = (index / 72) * Math.PI * 2;
        const radius = index % 6 === 0 ? 1.62 : 1.57;
        return (
          <Instance
            key={index}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle - Math.PI / 2]}
            scale={index % 6 === 0 ? [1.5, 1.9, 1] : 1}
          />
        );
      })}
    </Instances>
  );
}

function CoreReactor() {
  const core = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    if (!core.current) return;
    core.current.rotation.y += delta * 0.17;
    core.current.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.11;
  });

  return (
    <group ref={core}>
      <mesh scale={1.16}>
        <sphereGeometry args={[0.86, 64, 64]} />
        <MeshDistortMaterial
          color="#202a0e"
          emissive="#c8ff3d"
          emissiveIntensity={0.7}
          distort={0.25}
          speed={1.35}
          roughness={0.22}
          transparent
          opacity={0.36}
        />
      </mesh>

      <mesh scale={0.88} rotation={[0.18, 0.34, 0]}>
        <icosahedronGeometry args={[0.82, 2]} />
        <meshPhysicalMaterial
          color="#dfff88"
          emissive="#89bd1e"
          emissiveIntensity={0.68}
          metalness={0.42}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      <mesh scale={1.04} rotation={[-0.2, 0.5, 0.32]}>
        <icosahedronGeometry args={[1.04, 2]} />
        <meshBasicMaterial
          color="#d8ff75"
          wireframe
          transparent
          opacity={0.48}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.8, 0.1, 0.24]}>
        <torusGeometry args={[1.24, 0.015, 8, 128]} />
        <meshBasicMaterial color="#f3f6ed" transparent opacity={0.52} />
      </mesh>
      <mesh rotation={[-Math.PI / 2.4, 0.45, -0.2]}>
        <torusGeometry args={[1.38, 0.01, 8, 128]} />
        <meshBasicMaterial color="#c8ff3d" transparent opacity={0.33} />
      </mesh>

      <RadialTicks />
      <pointLight color="#c8ff3d" intensity={3.4} distance={5.2} />
    </group>
  );
}

function NetworkLattice({ active }: { active: SystemLayer }) {
  return (
    <group>
      {layerOrder.map((layer) => {
        const visual = layerVisuals[layer];
        const selected = active === layer;
        return (
          <Line
            key={layer}
            points={[[0, 0, 0], visual.node]}
            color={visual.color}
            lineWidth={selected ? 0.85 : 0.32}
            transparent
            opacity={selected ? 0.34 : 0.08}
            dashed
            dashSize={0.08}
            gapSize={0.07}
          />
        );
      })}
    </group>
  );
}

function SystemAtlas({ active }: { active: SystemLayer }) {
  const atlas = useRef<Group>(null);
  const activeIndex = layerOrder.indexOf(active);

  useFrame(({ clock, pointer }, delta) => {
    if (!atlas.current) return;
    const targetY = -0.18 + activeIndex * 0.2 + pointer.x * 0.09;
    const targetX = 0.08 - activeIndex * 0.07 - pointer.y * 0.06;
    atlas.current.rotation.y = MathUtils.damp(
      atlas.current.rotation.y,
      targetY + Math.sin(clock.elapsedTime * 0.12) * 0.04,
      2.3,
      delta,
    );
    atlas.current.rotation.x = MathUtils.damp(atlas.current.rotation.x, targetX, 2.3, delta);
  });

  return (
    <group ref={atlas} rotation={[0.08, -0.18, 0]}>
      <CoreReactor />
      <NetworkLattice active={active} />
      {layerOrder.map((layer) => (
        <LayerOrbit key={layer} layer={layer} active={active === layer} />
      ))}
      <Sparkles
        count={96}
        scale={[7.4, 5.8, 3.8]}
        size={1.25}
        speed={0.16}
        opacity={0.28}
        color="#d7e7c4"
      />
    </group>
  );
}

export function ObservatoryCanvas({ active }: { active: SystemLayer }) {
  return (
    <Canvas
      camera={{ fov: 39, position: [0, 0.08, 8.2] }}
      dpr={[1, 1.65]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      performance={{ min: 0.55 }}
    >
      <fog attach="fog" args={["#090b09", 8, 18]} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[4, 5, 6]} intensity={2.4} color="#f5ffe5" />
      <pointLight position={[-4, -3, 3]} intensity={1.6} color="#93bf31" />
      <Stars radius={46} depth={18} count={620} factor={1.6} fade speed={0.2} />
      <SystemAtlas active={active} />
      <OrbitControls
        enableDamping
        dampingFactor={0.055}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.6}
        maxPolarAngle={Math.PI / 1.58}
        rotateSpeed={0.38}
      />
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={0.82}
          luminanceThreshold={0.54}
          luminanceSmoothing={0.28}
          radius={0.66}
        />
        <Noise opacity={0.012} />
      </EffectComposer>
    </Canvas>
  );
}
