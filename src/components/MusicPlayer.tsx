"use client";
import { useEffect, useState, useRef } from "react";
import { Howl, Howler } from "howler";

interface MusicPlayerProps {
  src: string;
}

export default function MusicPlayer({ src }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    const sound = new Howl({
      src: [src],
      loop: true,
      volume: volume,
      html5: true,
    });

    soundRef.current = sound;
    sound.play();
    setIsPlaying(true);

    return () => {
      sound.unload();
    };
  }, [src]);

  const togglePlay = () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    soundRef.current?.volume(v);
  };

  return (
    <div className="p-4 flex items-center gap-4 border-2 border-red-500">
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => changeVolume(parseFloat(e.target.value))}
        className="w-40 "
      />
    </div>
  );
}
