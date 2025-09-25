"use client";
import { useState } from "react";
import Image from "next/image";

interface ImageItem {
  src: string;
  alt?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selected, setSelected] = useState<ImageItem | null>(null);
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      {/* Horizontal scrollable thumbnails */}
      <div className="flex overflow-x-auto gap-4 py-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelected(img);
              setZoomed(false); // reset zoom when new image opens
            }}
          >
            <Image
              src={img.src}
              alt={img.alt || ""}
              width={680}
              height={180}
              className="cursor-pointer h-auto w-full object-cover transition-transform hover:scale-103"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setSelected(null)}
            className="absolute bottom-8 m-auto w-12 h-12 bg-black border-2 border-slate-700 rounded-full z-50 cursor-pointer hover:scale-[110%] transition-all duration-200 ease-in-out"
          >
            <div className="flex items-center justify-center">
              <svg
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#ffffff"
                  d="m3.5 2.086l4.5 4.5l4.5-4.5L13.914 3.5L9.414 8l4.5 4.5l-1.414 1.414l-4.5-4.5l-4.5 4.5L2.086 12.5l4.5-4.5l-4.5-4.5z"
                ></path>
              </svg>
            </div>
          </button>

          {/* Clickable Image for Zoom */}
          <div
            className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ${
              zoomed ? "scale-125 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            }`}
            onClick={() => setZoomed(!zoomed)}
          >
            <Image
              src={selected.src}
              alt={selected.alt || ""}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
