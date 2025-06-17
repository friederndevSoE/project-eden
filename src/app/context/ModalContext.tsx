// purpose, this file provides a context for every page to access inside next.js, the context is the opening and closing modal when the dots is clicked

"use client";

import { createContext, useContext, useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

type ProjectId = number | "center" | null;

interface ModalContextType {
  openModal: (id: ProjectId) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<ProjectId>(null);

  const openModal = (id: ProjectId) => {
    setActiveProjectId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveProjectId(null), 300); // Delay to allow exit animation
  };

  // Compute dynamic import path
  const id = useMemo(() => {
    if (activeProjectId === "center") return "center";
    if (typeof activeProjectId === "number")
      return `project-${activeProjectId}`;
    return null;
  }, [activeProjectId]);

  const DynamicContent = useMemo(() => {
    if (!id) return null;
    return dynamic(() => import(`@/app/content/${id}/page`), { ssr: false });
  }, [id]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Global Animated Modal */}
      <AnimatePresence>
        {modalOpen && DynamicContent && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-[94%] max-w-2xl h-[80vh] p-6 rounded-xl shadow-lg relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-700 hover:text-black text-lg"
              >
                ×
              </button>

              <div className="overflow-y-auto h-full pr-2">
                <Suspense fallback={<div>Loading...</div>}>
                  <DynamicContent />
                </Suspense>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
