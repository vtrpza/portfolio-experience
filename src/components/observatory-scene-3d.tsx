"use client";

import { Edges, Float, Grid } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SystemLayer } from "./observatory-controls";

const INK = new THREE.Color("#f1f4ed");
const SIGNAL = new THREE.Color("#c8ff3d");
const SLAB_COLOR = new THREE.Color("#151a12");
const SLAB_ACTIVE_COLOR = new THREE.Color("#19220d");

const SLAB_WIDTH = 3.1;
const SLAB_DEPTH = 2.0;
const SLAB_THICKNESS = 0.055;
const SLAB_LIFT = 0.3;

const LAYER_ORDER: Record<SystemLayer, number> = {
  security: 0,
  platform: 1,
  product: 2,
};

const LAYER_PULSE: Record<SystemLayer, number> = {
  product: 1.6,
  platform: 0.9,
  security: 2.6,
};

const INNER_BLOCKS: ReadonlyArray<readonly [number, number]> = [
  [-0.95, 0.45],
  [-0.15, 0.1],
  [0.95, -0.45],
];

const ARTIFACT_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uDistort;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;
    float wave = sin(pos.x * 4.0 + uTime) * sin(pos.y * 5.0 + uTime * 1.3) * sin(pos.z * 6.0 + uTime * 0.7);
    pos += normal * wave * uDistort;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ARTIFACT_FRAGMENT = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uRim;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.6);
    float pulse = 0.72 + 0.28 * sin(uTime * 2.0);
    vec3 color = mix(uBase, uRim, fresnel * pulse);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function Slab({ layer, active }: { layer: SystemLayer; active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const dotMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const baseY = LAYER_ORDER[layer] * 0.42;

  useFrame((_, delta) => {
    const damp = 1 - Math.exp(-6 * delta);
    if (groupRef.current) {
      const targetY = baseY + (active ? SLAB_LIFT : 0);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, damp);
    }
    if (materialRef.current) {
      materialRef.current.color.lerp(active ? SLAB_ACTIVE_COLOR : SLAB_COLOR, damp);
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, active ? 0.62 : 0.3, damp);
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        active ? 0.22 : 0,
        damp,
      );
    }
    if (edgeMaterialRef.current) {
      edgeMaterialRef.current.color.lerp(active ? SIGNAL : INK, damp);
      edgeMaterialRef.current.opacity = THREE.MathUtils.lerp(edgeMaterialRef.current.opacity, active ? 0.95 : 0.28, damp);
    }
    if (dotMaterialRef.current) {
      dotMaterialRef.current.color.lerp(active ? SIGNAL : new THREE.Color("#8f978b"), damp);
    }
  });

  return (
    <group ref={groupRef} position={[0, baseY, 0]}>
      <mesh>
        <boxGeometry args={[SLAB_WIDTH, SLAB_THICKNESS, SLAB_DEPTH]} />
        <meshStandardMaterial
          ref={materialRef}
          color={SLAB_COLOR}
          emissive={SIGNAL}
          emissiveIntensity={0}
          metalness={0.15}
          opacity={0.3}
          roughness={0.42}
          transparent
        />
        <Edges scale={1.001} threshold={15}>
          <lineBasicMaterial ref={edgeMaterialRef} color={INK} opacity={0.28} transparent />
        </Edges>
      </mesh>
      {INNER_BLOCKS.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, SLAB_THICKNESS / 2 + 0.004, z]}>
          <boxGeometry args={[0.62, 0.008, 0.5]} />
          <meshBasicMaterial color={INK} opacity={0.05} transparent />
          <Edges scale={1.001} threshold={15}>
            <lineBasicMaterial color={INK} opacity={0.2} transparent />
          </Edges>
        </mesh>
      ))}
      <mesh position={[1.18, SLAB_THICKNESS / 2 + 0.03, -0.72]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial ref={dotMaterialRef} color="#8f978b" />
      </mesh>
    </group>
  );
}

function Artifact({ active }: { active: SystemLayer }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color("#0a0d08") },
      uDistort: { value: 0.06 },
      uRim: { value: SIGNAL.clone() },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const material = materialRef.current;
    if (material) {
      material.uniforms.uTime.value = t * LAYER_PULSE[active];
      material.uniforms.uDistort.value = THREE.MathUtils.damp(
        material.uniforms.uDistort.value,
        active === "security" ? 0.12 : 0.06,
        4,
        delta,
      );
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.16;
    }
  });

  return (
    <Float floatIntensity={0.55} rotationIntensity={0.25} speed={1.4}>
      <group ref={groupRef} position={[0, 2.05, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.72, 3]} />
          <shaderMaterial
            ref={materialRef}
            fragmentShader={ARTIFACT_FRAGMENT}
            uniforms={uniforms}
            vertexShader={ARTIFACT_VERTEX}
          />
        </mesh>
        <mesh scale={1.003}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshBasicMaterial color={SIGNAL} opacity={0.14} transparent wireframe />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const seeded = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (seeded(i * 3 + 1) - 0.5) * 11;
      positions[i * 3 + 1] = seeded(i * 3 + 2) * 5.5 - 0.6;
      positions[i * 3 + 2] = (seeded(i * 3 + 3) - 0.5) * 11;
    }
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return bufferGeometry;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.018;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color={INK} opacity={0.3} size={0.022} sizeAttenuation transparent />
    </points>
  );
}

function CameraDrift({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  useFrame(({ camera }, delta) => {
    const damp = 1 - Math.exp(-2.4 * delta);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 4.6 + pointer.current.x * 0.7, damp);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.8 + pointer.current.y * 0.45, damp);
    camera.lookAt(0, 0.75, 0);
  });
  return null;
}

type ObservatoryScene3DProps = {
  active: SystemLayer;
  visible: boolean;
  onCreated?: () => void;
};

export default function ObservatoryScene3D({ active, visible, onCreated }: ObservatoryScene3DProps) {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 30, position: [4.6, 3.8, 5.2] }}
      dpr={[1, 2]}
      frameloop={visible ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={onCreated}
    >
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1.1} position={[4, 7, 3]} />
      <group position={[0, 0, 0]}>
        <Slab active={active === "security"} layer="security" />
        <Slab active={active === "platform"} layer="platform" />
        <Slab active={active === "product"} layer="product" />
      </group>
      <Artifact active={active} />
      <Particles />
      <Grid
        args={[14, 14]}
        cellColor="#1a1f18"
        cellSize={0.5}
        fadeDistance={13}
        fadeStrength={2.4}
        infiniteGrid
        position={[0, -0.5, 0]}
        sectionColor="#2c3620"
        sectionSize={2}
      />
      <CameraDrift pointer={pointerRef} />
    </Canvas>
  );
}
