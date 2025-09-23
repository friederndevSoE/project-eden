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
            className="fixed inset-0 flex items-center justify-center z-50 text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-[94%] max-w-2xl h-full max-h-[80vh] p-4 pl-2 pt-2 md:p-6 relative overflow- shadow-[4px_4px_0px_1px_#61384C] overflow-hidden md:shadow-[6px_6px_0px_1px_#61384C]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* sidebar decoration */}
              <button
                onClick={closeModal}
                className="absolute mt-[-1px] top-0 right-0  w-6 h-6 text-lg border border-amber-900 cursor-pointer hover:bg-orange-200 transition-all duration-150 ease-in"
              >
                <svg
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 1216 1312"
                  className="m-auto"
                >
                  <path
                    fill="#B14D3F"
                    d="M1202 1066q0 40-28 68l-136 136q-28 28-68 28t-68-28L608 976l-294 294q-28 28-68 28t-68-28L42 1134q-28-28-28-68t28-68l294-294L42 410q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294l294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L880 704l294 294q28 28 28 68z"
                  ></path>
                </svg>
              </button>
              <div className="absolute top-0 right-0 mt-[22px] w-6 h-full border border-amber-900"></div>
              <div className="overflow-y-auto w-auto h-full pr-2">
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
