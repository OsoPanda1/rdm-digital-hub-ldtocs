import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface TwinVisualizerData {
  id: string;
  x: number;
  z: number;
  meshHealth: number;
  adoptionIndex: number;
}

function healthColor(health: number): THREE.Color {
  if (health >= 0.8) return new THREE.Color(0x22c55e);
  if (health >= 0.6) return new THREE.Color(0xeab308);
  return new THREE.Color(0xef4444);
}

export function TwinNode({ data }: { data: TwinVisualizerData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const baseColor = useMemo(() => healthColor(data.meshHealth), [data.meshHealth]);
  const glowStrength = useMemo(
    () => THREE.MathUtils.lerp(0.1, 2.0, data.adoptionIndex),
    [data.adoptionIndex],
  );

  useFrame(() => {
    if (!materialRef.current) return;
    const pulse = 1.0 + Math.sin(Date.now() * 0.002 + data.id.charCodeAt(0)) * 0.08;
    materialRef.current.emissiveIntensity = glowStrength * pulse;
  });

  return (
    <mesh
      ref={meshRef}
      position={[data.x, 0.18, data.z]}
      castShadow
    >
      <sphereGeometry args={[0.16, 24, 24]} />
      <meshStandardMaterial
        ref={materialRef}
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={glowStrength}
        metalness={0.3}
        roughness={0.6}
      />
    </mesh>
  );
}

export function TwinNodeCloud({ nodes }: { nodes: TwinVisualizerData[] }) {
  return (
    <group>
      {nodes.map((node) => (
        <TwinNode key={node.id} data={node} />
      ))}
    </group>
  );
}
