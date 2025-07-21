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
            className="fixed inset-0  flex items-center justify-center z-50 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-[94%] max-w-2xl h-[80vh] p-6 relative overflow-hidden shadow-[4px_4px_0px_1px_rgba(59,_130,_246,_1)]  md:shadow-[6px_6px_0px_1px_rgba(59,_130,_246,_1)]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* sidebar decoration */}
              <button
                onClick={closeModal}
                className="absolute mt-[-1px] top-0 right-0 text-gray-700 w-6 h-6 text-lg border border-sky-600 cursor-pointer hover:bg-slate-300 transition-all duration-150 ease-in"
              >
                <div className="w-3 h-3 bg-red-400 rounded-full m-auto"></div>
              </button>
              <div className="absolute top-0 right-0 mt-[22px] w-6 h-full border border-sky-600"></div>

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
