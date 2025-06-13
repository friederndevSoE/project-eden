"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useCursor } from "@react-three/drei";
import * as THREE from "three";

import CommandBar from "../CommandBar";
import { useModal } from "@/app/context/ModalContext";

const Dot = ({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

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

const getDotPositions = (
  count: number,
  baseRadius: number,
  minDistance: number = 0.2,
  maxAttemptsPerDot: number = 50
): [number, number, number][] => {
  const positions: [number, number, number][] = [];

  const getDistance = (
    a: [number, number, number],
    b: [number, number, number]
  ) => {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  for (let i = 0; i < count; i++) {
    let attempt = 0;
    let valid = false;
    let newPos: [number, number, number] = [0, 0, 0];

    while (!valid && attempt < maxAttemptsPerDot) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const jitter = (Math.random() - 0.5) * 0.4; // +/- 0.2 variation, which make the distance between dots and the center one more random
      const radius = baseRadius + jitter;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      newPos = [x, y, z];

      // Check distance against all existing positions
      valid = positions.every((pos) => getDistance(pos, newPos) >= minDistance);
      attempt++;
    }

    // After max attempts, add it anyway to avoid infinite loop
    positions.push(newPos);
  }

  return positions;
};

const RotatingSphere = ({
  onDotClick,
}: {
  onDotClick: (id: number | "center") => void;
}) => {
  const sphereRef = useRef<THREE.Group>(null);
  const rotationSpeed = 0.0003; //adjust rotation speed as needed

  //change the first number to allow the maximum amount of dots
  const dotPositions = useMemo(() => getDotPositions(6, 1.2, 0.3), []);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <>
      <group ref={sphereRef}>
        {dotPositions.map((pos, i) => (
          <Dot key={i} position={pos} onClick={() => onDotClick(i + 1)} />
        ))}
      </group>
      <Dot position={[0, 0, 0]} onClick={() => onDotClick("center")} />
    </>
  );
};

export default function InteractiveSphere() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { openModal } = useModal();

  return (
    <div className="fixed inset-0 z-0 text-red-800">
      {/* 3D Canvas */}
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
          radius={40}
          depth={60}
          count={3000}
          factor={2}
          fade
          speed={0.5}
        />
        <RotatingSphere onDotClick={openModal} />
      </Canvas>

      {/* 🔍 Floating Search Button */}
      <button
        className="fixed bottom-6 right-6 bg-white text-black rounded-full px-4 py-2 shadow-lg z-50"
        onClick={() => setIsSearchOpen(true)}
      >
        Search
      </button>

      {/* 🔎 Command Bar Search */}
      <CommandBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
