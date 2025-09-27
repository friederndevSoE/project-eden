"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import { motion, AnimatePresence } from "framer-motion";

import CommandBar from "../CommandBar";
import { useModal } from "@/app/context/ModalContext";

import { projectSearchData } from "@/app/content/projectSearchData";

import { ThreeEvent } from "@react-three/fiber";

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

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    setHovered(true);
    onHover(true, { x: event.clientX, y: event.clientY });
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = (_event: ThreeEvent<PointerEvent>) => {
    setHovered(false);
    onHover(false);
    document.body.style.cursor = "default";
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
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
  const [isOpen, setIsOpen] = useState(false);

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

        {/* adjust the zoom */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={90}
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
        className="fixed bottom-6 right-6 bg-white text-black rounded-full px-4 py-2 shadow-lg z-40 flex items-center gap-2 cursor-pointer"
        onClick={() => setIsSearchOpen(true)}
      >
        <svg
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 1664 1664"
        >
          <path
            fill="#000000"
            d="M1152 704q0-185-131.5-316.5T704 256T387.5 387.5T256 704t131.5 316.5T704 1152t316.5-131.5T1152 704zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124q-143 0-273.5-55.5t-225-150t-150-225T0 704t55.5-273.5t150-225t225-150T704 0t273.5 55.5t225 150t150 225T1408 704q0 220-124 399l343 343q37 37 37 90z"
          ></path>
        </svg>
        <span className="hidden md:block mt-0.5 ">Search</span>
      </button>

      {/* Patch notes button */}
      <button
        className="fixed bottom-6 left-6 bg-black hover:bg-slate-900 transition-all duration-200 ease-linear border md:border-2 border-slate-700 rounded-full p-2 md:p-4 z-40 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="#ffffff"
        >
          <g fill="#ffffff">
            <path
              fillRule="evenodd"
              d="M10 7a2 2 0 0 1 2 2v7a2 2 0 1 1-4 0V9a2 2 0 0 1 2-2Z"
              clipRule="evenodd"
            ></path>
            <path d="M12 4a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"></path>
          </g>
        </svg>
      </button>

      {/* style the patch note */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-16 md:bottom-22 left-6 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)} // close when clicking outside
          >
            <motion.div
              key="popup"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="p-4 bg-black/20 border border-slate-800 rounded-md shadow-xl w-full min-w-[240px] md:min-w-[440px] "
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <p className="lg:hidden text-sm">Pinch to zoom, drag to rotate</p>
              <p className="hidden lg:block">
                Use scroll wheel to zoom, drag mouse to rotate
              </p>
              <hr className="mt-2 mb-4 text-slate-700" />
              <div className="text-sm md:text-base text-gray-300">
                <span className="px-2 py-1 bg-slate-800 text-white rounded-sm">
                  25.09.24
                </span>
                <div className="flex flex-col py-1.5">
                  <p>• Ver 1.0 release</p>
                  <p>• Initial question asked</p>
                </div>
              </div>
              {/* <hr className="pt-2 text-slate-700" /> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Bar Search */}
      <CommandBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
