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
            className="shrink-0 border-2 border-purple-500 m-auto"
          >
            <Image
              src={img.src}
              alt={img.alt || ""}
              width={180}
              height={180}
              className="cursor-pointer h-40 w-40 md:h-60 md:w-60 object-cover transition-transform hover:scale-103"
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
            className="absolute bottom-8 m-auto w-12 h-12 bg-red-400 z-50"
          ></button>

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
