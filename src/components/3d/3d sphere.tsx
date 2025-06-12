"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import { useCursor } from "@react-three/drei";

import * as THREE from "three";

type DotProps = {
  position: [number, number, number];
  label: string;
  onClick: () => void;
};

const Dot = ({ position, label, onClick }: DotProps) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered); // changes cursor to pointer

  return (
    <mesh
      position={position}
      onClick={onClick}
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

const generateRandomDotPositions = (radius: number, count: number) => {
  const positions: [number, number, number][] = [];

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1); // vertical angle (latitude)
    const theta = 2 * Math.PI * Math.random(); // horizontal angle (longitude)

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions.push([x, y, z]);
  }

  return positions;
};

const RotatingSphere = ({
  onDotClick,
}: {
  onDotClick: (label: string) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
      groupRef.current.rotation.x += 0.0002;
    }
  });

  const dotPositions = useMemo(() => generateRandomDotPositions(1, 5), []);

  return (
    <group ref={groupRef}>
      {/* Invisible transparent sphere */}
      <mesh>
        {/* <sphereGeometry args={[1, 64, 64]} /> */}
        <sphereGeometry args={[0, 0, 0]} />

        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Dots on sphere surface */}

      {dotPositions.map((pos, i) => (
        <Dot
          key={i}
          position={pos}
          label={`Outer Dot ${i + 1}`}
          onClick={() => onDotClick(`You clicked on outer dot ${i + 1}`)}
        />
      ))}

      {/* Center dot */}
      <Dot
        position={[0, 0, 0]}
        label="Center Dot"
        onClick={() => onDotClick("You clicked on the center dot")}
      />
    </group>
  );
};

export default function InteractiveSphere() {
  const [popupText, setPopupText] = useState<string | null>(null);

  const handleDotClick = (label: string) => {
    setPopupText(label);
  };

  return (
    <div className="fixed inset-0 z-0">
      {/* Pop-up */}
      {popupText && (
        <div className="absolute left-1/2 top-5 transform -translate-x-1/2 z-10 bg-white text-black px-4 py-2 rounded shadow-md">
          <button
            className="absolute right-2 top-1 text-sm"
            onClick={() => setPopupText(null)}
          >
            ✕
          </button>
          {popupText}
        </div>
      )}

      <Canvas camera={{ position: [2, 2, 2], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={false}
          minDistance={2}
          maxDistance={13}
        />
        {/* background stars styling */}
        <Stars
          radius={50}
          depth={60}
          count={3000} // reduced from 5000
          factor={2}
          fade
          speed={0.5}
        />
        <RotatingSphere onDotClick={handleDotClick} />
      </Canvas>
    </div>
  );
}
