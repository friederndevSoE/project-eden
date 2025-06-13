"use client";

import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useCursor } from "@react-three/drei";
// import { createPortal } from "react-dom";
import * as THREE from "three";
import dynamic from "next/dynamic";

//for animations
import { motion, AnimatePresence } from "framer-motion";

// Animated Modal component
const AnimatedModal = ({
  isOpen,
  onClose,
  projectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | "center" | null;
}) => {
  const id = useMemo(() => {
    if (projectId === "center") return "center";
    if (typeof projectId === "number") return `project-${projectId}`;
    return null;
  }, [projectId]);

  const DynamicContent = useMemo(() => {
    if (!id) return null;
    return dynamic(() => import(`@/app/content/${id}/page`), { ssr: false });
  }, [id]);

  if (!isOpen || !DynamicContent) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-[90%] max-w-2xl p-6 rounded-xl shadow-lg relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 hover:text-black text-lg"
          >
            ×
          </button>
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicContent />
          </Suspense>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

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

// const Modal = ({ id, onClose }: { id: string; onClose: () => void }) => {
//   const DynamicContent = useMemo(
//     () => dynamic(() => import(`@/app/content/${id}/page`), { ssr: false }),
//     [id]
//   );

//   return createPortal(
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
//       <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] overflow-auto p-4 relative">
//         <button
//           className="absolute top-4 right-4 text-black z-10"
//           onClick={onClose}
//         >
//           ✕
//         </button>
//         <Suspense fallback={<p className="text-black">Loading...</p>}>
//           <DynamicContent />
//         </Suspense>
//       </div>
//     </div>,
//     document.body
//   );
// };

export default function InteractiveSphere() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<
    number | "center" | null
  >(null);

  const openModal = (id: number | "center") => {
    setActiveProjectId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveProjectId(null), 300);
  };

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
        <RotatingSphere onDotClick={openModal} />
      </Canvas>

      {/* Animated Modal */}
      <AnimatedModal
        isOpen={modalOpen}
        onClose={closeModal}
        projectId={activeProjectId}
      />
    </div>
  );
}
