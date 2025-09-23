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
    // sound.play();
    // setIsPlaying(true);

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
    <div className=" flex items-center border-y border-l md:border border-black mb-2">
      <button
        onClick={togglePlay}
        className="p-3 md:p-6 hover:bg-orange-200 transition-all duration-200 ease-in-out border-r border-black cursor-pointer"
      >
        {isPlaying ? (
          <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 1025 1024"
          >
            <path
              fill="#61384c"
              d="M896.428 1024h-128q-53 0-90.5-37.5t-37.5-90.5V128q0-53 37.5-90.5t90.5-37.5h128q53 0 90.5 37.5t37.5 90.5v768q0 53-37.5 90.5t-90.5 37.5zm-640 0h-128q-53 0-90.5-37.5T.428 896V128q0-53 37.5-90.5t90.5-37.5h128q53 0 90.5 37.5t37.5 90.5v768q0 53-37.5 90.5t-90.5 37.5z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 448 512"
          >
            <path
              fill="#61384c"
              d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
            ></path>
          </svg>
        )}
      </button>
      <div className="w-[89%] flex items-center gap-2 mx-3">
        <svg
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 15 15"
          className="opacity-80"
        >
          <path
            fill="#61384c"
            d="M9 1.5a.5.5 0 0 0-.757-.429L3.362 3.998H1.5a1.5 1.5 0 0 0-1.5 1.5v3.997c0 .83.672 1.5 1.5 1.5h1.862l4.88 2.926A.5.5 0 0 0 9 13.492V1.5ZM12 4v7h1V4h-1Zm-2 2v3h1V6h-1Z"
          ></path>
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          className=" w-full h-0.5 bg-orange-950/30 cursor-pointer appearance-none accent-[#61384c]"
        />
      </div>
    </div>
  );
}
