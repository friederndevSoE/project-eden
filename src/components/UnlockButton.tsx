import { useRef, useState } from "react";
import { motion } from "framer-motion";

const TARGET_TEXT = "Unlock";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

type UnlockButtonProps = {
  onClick?: () => void; // ✅ accept onClick from parent
};

const UnlockButton = ({ onClick }: UnlockButtonProps) => {
  return <EncryptButton onClick={onClick} />;
};

const EncryptButton = ({ onClick }: UnlockButtonProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      onClick={onClick} // ✅ forward onClick
      className="group relative overflow-hidden rounded-sm border-2 border-orange-200 bg-brand px-4 py-2 uppercase font-mono text-neutral-300 transition-colors hover:text-neutral-300"
    >
      <div className="relative z-10 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="mb-0.5"
        >
          <path
            fill="#d4d4d4"
            d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3zM9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V7z"
          ></path>
        </svg>
        <span>{text}</span>
      </div>
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-orange-200/0 from-40% via-orange-200/50 to-orange-200/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};

export default UnlockButton;
