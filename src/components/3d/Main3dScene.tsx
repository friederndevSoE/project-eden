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
  color,
  onClick,
  onHover,
  variant = "default",
  glow = true,
  isSelected = false,
}: {
  position: [number, number, number];
  id: ProjectId;
  color: string;
  onClick: () => void;
  onHover: (hovered: boolean, mousePos?: { x: number; y: number }) => void;
  variant?: "default" | "center";
  glow?: boolean;
  isSelected?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);

  const handlePointerOver = (event: any) => {
    setHovered(true);
    onHover(true, { x: event.clientX, y: event.clientY });
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
    document.body.style.cursor = "default";
  };

  const handlePointerMove = (event: any) => {
    if (hovered) {
      onHover(true, { x: event.clientX, y: event.clientY });
    }
  };

  // adjust scale for main and rotating dots
  const mainScale = variant === "center" ? 0.04 : 0.05;
  const glowScales = glow
    ? [mainScale + 0.02, mainScale + 0.04, mainScale + 0.06]
    : [];

  // Rotation speed of the outer ring
  useFrame(() => {
    if (ringRef.current) {
      // ringRef.current.rotation.z += 0.8;
      // ringRef.current.rotation.y += 1;
      ringRef.current.rotation.x += 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Glow layers */}
      {glowScales.map((glowSize, i) => (
        <mesh key={i}>
          <sphereGeometry args={[glowSize, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08 / (i + 1)}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Main Dot */}
      <mesh
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
      >
        <sphereGeometry args={[mainScale, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 2}
        />
      </mesh>

      {/* Style rotating Selection Ring */}
      {isSelected && (
        <mesh ref={ringRef}>
          <ringGeometry args={[mainScale * 1.6, mainScale * 1.8, 64]} />
          <meshBasicMaterial
            color={"#ffffff"}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
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
  selectedDots,
}: {
  onDotClick: (id: ProjectId) => void;
  onDotHover: (
    id: ProjectId | null,
    hovered: boolean,
    mousePos?: { x: number; y: number }
  ) => void;
  selectedDots: Set<ProjectId>;
}) => {
  const sphereRef = useRef<THREE.Group>(null);
  const rotationSpeed = 0.0003;

  const projects = projectSearchData.filter((p) => p.id !== "center");

  const dotPositions = useMemo(
    () => getDotPositions(projects.length, 1.2, 0.3),
    [projects.length]
  );

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += rotationSpeed;
    }
  });

  const centerProject = projectSearchData.find((p) => p.id === "center");
  const centerColor = centerProject?.color || "#ff00ff";

  return (
    <>
      <group ref={sphereRef}>
        {projects.map((project, i) => (
          <Dot
            key={project.id}
            position={dotPositions[i]}
            id={project.id}
            color={project.color}
            onClick={() => onDotClick(project.id)}
            onHover={(hovered, mousePos) =>
              onDotHover(project.id, hovered, mousePos)
            }
            isSelected={selectedDots.has(project.id)}
          />
        ))}
      </group>

      <Dot
        position={[0, 0, 0]}
        id="center"
        color={centerColor}
        variant="center"
        glow={true}
        onClick={() => onDotClick("center")}
        onHover={(hovered, mousePos) => onDotHover("center", hovered, mousePos)}
        isSelected={selectedDots.has("center")}
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

  const [selectedDots, setSelectedDots] = useState<Set<ProjectId>>(new Set());

  const handleDotClick = (id: ProjectId) => {
    setSelectedDots((prev) => {
      const newSet = new Set(prev);
      newSet.add(id); // ✅ always keep it once clicked
      return newSet;
    });

    // ✅ always open modal, even if already selected
    setTimeout(() => openModal(id), 0);
  };

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
    <div className="fixed inset-0 z-0 ">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [2, 2, 2], fov: 60 }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[5, 5, 5]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={13}
        />
        <Stars
          radius={30}
          depth={60}
          count={3000}
          factor={2.5}
          fade
          speed={1.5}
        />
        <RotatingSphere
          onDotClick={handleDotClick}
          onDotHover={handleDotHover}
          selectedDots={selectedDots}
        />
      </Canvas>

      {/* Tooltip*/}
      <Tooltip
        visible={tooltip.visible}
        position={tooltip.position}
        content={tooltip.content}
        color={tooltip.color}
      />

      {/* Floating Search Button */}
      <button
        className="fixed bottom-6 right-6 bg-white text-black rounded-full px-4 py-2 shadow-lg z-40"
        onClick={() => setIsSearchOpen(true)}
      >
        Search
      </button>

      {/* Command Bar Search */}
      <CommandBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
