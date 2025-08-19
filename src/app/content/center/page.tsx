"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PasswordGate() {
  const [values, setValues] = useState<string[]>(["", "", ""]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const PASSWORD = "ELY";

  // Check if session already authorized
  useEffect(() => {
    const alreadyAuthorized = sessionStorage.getItem("authorized") === "true";
    if (alreadyAuthorized) {
      setIsAuthorized(true);
    } else {
      inputsRef.current[0]?.focus();
    }
  }, []);

  const resetInputs = () => {
    setValues(["", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    if (!/^[a-zA-Z]?$/.test(raw)) return; // only letters or empty
    const val = raw.toUpperCase();
    const next = [...values];
    next[index] = val;
    setValues(next);

    // Clear error state when typing again
    if (error) setError("");

    // Move to the next box if a character was typed
    if (val && index < 2) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        setValues(next);
        if (error) setError(""); // clear error if editing
        e.preventDefault();
        return;
      }
      if (index > 0) {
        const next = [...values];
        next[index - 1] = "";
        setValues(next);
        inputsRef.current[index - 1]?.focus();
        if (error) setError(""); // clear error if editing
        e.preventDefault();
        return;
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && index < 2) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }

    // Press Enter = try unlock
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  const setInputRef = (i: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[i] = el;
  };

  const handleUnlock = () => {
    const joined = values.join("");
    if (joined === PASSWORD) {
      setIsAuthorized(true);
      setError("");
      sessionStorage.setItem("authorized", "true"); // ✅ remember in this session
    } else {
      setError("Incorrect password, try again.");
      setShake(true);
      setTimeout(() => setShake(false), 400); // reset shake after animation
      setTimeout(() => resetInputs(), 500); // clear inputs after short delay
    }
  };

  if (isAuthorized) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold">Protected Content Revealed 🎉</h1>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <motion.div
        className="flex space-x-4"
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {values.map((val, i) => (
          <input
            key={i}
            ref={setInputRef(i)}
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-16 h-16 border-2 border-gray-400 text-3xl text-center uppercase
                       focus:outline-none focus:border-blue-500 rounded-lg"
          />
        ))}
      </motion.div>

      <button
        onClick={handleUnlock}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold 
                   hover:bg-blue-700 transition-colors"
      >
        Unlock
      </button>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
