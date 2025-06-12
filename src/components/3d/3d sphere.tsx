"use client";

import React, { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import { useCursor } from "@react-three/drei";

import * as THREE from "three";

// type DotProps = {
//   position: [number, number, number];
//   label: string;
//   onClick: () => void;
// };

const Dot = ({
  position,
  label,
  route,
}: {
  position: [number, number, number];
  label: string;
  route: string;
}) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const router = useRouter();

  return (
    <mesh
      position={position}
      onClick={() => router.push(route)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="hotpink"
        emissive="hotpink"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const getDotPositions = (count: number, radius: number) => {
  const positions: [number, number, number][] = [];

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions.push([x, y, z]);
  }

  return positions;
};

const RotatingSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = 0.001;
  const dotPositions = useMemo(() => getDotPositions(5, 1.2), []);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <>
      <group ref={sphereRef}>
        {dotPositions.map((pos, i) => (
          <Dot
            key={i}
            position={pos}
            label={`Outer Dot ${i + 1}`}
            route={`/content/project-${i + 1}`}
          />
        ))}
      </group>

      <Dot position={[0, 0, 0]} label="Center Dot" route="/content/center" />
    </>
  );
};

export default function InteractiveSphere() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [2, 2, 2], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={13}
        />
        <Stars
          radius={50}
          depth={60}
          count={3000}
          factor={2}
          fade
          speed={0.5}
        />
        <RotatingSphere />
      </Canvas>
    </div>
  );
}
