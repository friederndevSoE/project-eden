"use client";

import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useCursor } from "@react-three/drei";
import { createPortal } from "react-dom";
import * as THREE from "three";
import dynamic from "next/dynamic";

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

const RotatingSphere = ({
  onDotClick,
}: {
  onDotClick: (id: string) => void;
}) => {
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
            onClick={() => onDotClick(`project-${i + 1}`)}
          />
        ))}
      </group>
      <Dot position={[0, 0, 0]} onClick={() => onDotClick("center")} />
    </>
  );
};

const Modal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const DynamicContent = useMemo(
    () => dynamic(() => import(`@/app/content/${id}/page`), { ssr: false }),
    [id]
  );

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] overflow-auto p-4 relative">
        <button
          className="absolute top-4 right-4 text-black z-10"
          onClick={onClose}
        >
          ✕
        </button>
        <Suspense fallback={<p className="text-black">Loading...</p>}>
          <DynamicContent />
        </Suspense>
      </div>
    </div>,
    document.body
  );
};

export default function InteractiveSphere() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <>
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
          <RotatingSphere onDotClick={(id) => setSelectedProject(id)} />
        </Canvas>
      </div>

      {selectedProject && (
        <Modal id={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
}
