"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useCursor } from "@react-three/drei";
import * as THREE from "three";

import CommandBar from "../CommandBar";
import { useModal } from "@/app/context/ModalContext";

import { projectSearchData } from "@/app/content/projectSearchData";

// Project data types and data
export type ProjectId = number | "center";
export type ProjectMeta = {
  id: ProjectId;
  title: string;
  tags: string[];
  description?: string;
};

const Tooltip = ({
  visible,
  position,
  content,
  color,
}: {
  visible: boolean;
  position: { x: number; y: number };
  content: string;
  color: string;
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none text-white px-3 py-2 rounded-lg shadow-lg  text-sm font-medium"
      style={{
        left: position.x + 15,
        top: position.y - 40,
        zIndex: 9999,
        backgroundColor: color,
      }}
    >
      {content}
    </div>
  );
};

const Dot = ({
  position,
  id,
  onClick,
  onHover,
}: {
  position: [number, number, number];
  id: ProjectId;
  onClick: () => void;
  onHover: (hovered: boolean, mousePos?: { x: number; y: number }) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (event: any) => {
    setHovered(true);
    // Get mouse position relative to viewport
    onHover(true, { x: event.clientX, y: event.clientY });
    // Change cursor manually
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
    // Reset cursor
    document.body.style.cursor = "default";
  };

  const handlePointerMove = (event: any) => {
    if (hovered) {
      onHover(true, { x: event.clientX, y: event.clientY });
    }
  };

  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="hotpink"
        emissive="hotpink"
        emissiveIntensity={hovered ? 0.8 : 0.5}
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
      const jitter = (Math.random() - 0.5) * 0.4;
      const radius = baseRadius + jitter;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      newPos = [x, y, z];

      valid = positions.every((pos) => getDistance(pos, newPos) >= minDistance);
      attempt++;
    }

    positions.push(newPos);
  }

  return positions;
};

const RotatingSphere = ({
  onDotClick,
  onDotHover,
}: {
  onDotClick: (id: ProjectId) => void;
  onDotHover: (
    id: ProjectId | null,
    hovered: boolean,
    mousePos?: { x: number; y: number }
  ) => void;
}) => {
  const sphereRef = useRef<THREE.Group>(null);
  const rotationSpeed = 0.0003;

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
          <Dot
            key={i}
            position={pos}
            id={i + 1}
            onClick={() => onDotClick(i + 1)}
            onHover={(hovered, mousePos) =>
              onDotHover(i + 1, hovered, mousePos)
            }
          />
        ))}
      </group>
      <Dot
        position={[0, 0, 0]}
        id="center"
        onClick={() => onDotClick("center")}
        onHover={(hovered, mousePos) => onDotHover("center", hovered, mousePos)}
      />
    </>
  );
};

export default function InteractiveSphere() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    color: string;
    position: { x: number; y: number };
  }>({
    visible: false,
    content: "",
    color: "#000000",
    position: { x: 0, y: 0 },
  });

  const { openModal } = useModal();

  const handleDotHover = (
    id: ProjectId | null,
    hovered: boolean,
    mousePos?: { x: number; y: number }
  ) => {
    if (hovered && id !== null && mousePos) {
      const project = projectSearchData.find((p) => p.id === id);
      const content = project ? `${project.tags}` : `Unknown Project (${id})`;

      // ? `${project.tags.join(", ")} - ${project.title}` if want to use both tags and title

      const color = project?.color || "#000";

      setTooltip({
        visible: true,
        content,
        position: mousePos,
        color,
      });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

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
        <RotatingSphere onDotClick={openModal} onDotHover={handleDotHover} />
      </Canvas>

      {/* Tooltip - moved outside canvas with highest z-index */}
      <Tooltip
        visible={tooltip.visible}
        position={tooltip.position}
        content={tooltip.content}
        color={tooltip.color}
      />

      {/* 🔍 Floating Search Button */}
      <button
        className="fixed bottom-6 right-6 bg-white text-black rounded-full px-4 py-2 shadow-lg z-40"
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
