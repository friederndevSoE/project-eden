"use client";

import React, { useState, useEffect, useRef } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import ImageGallery from "@/components/ImageGallery";

const englishContent = `"ONEEE why me"? 
some deserts on this planet, were oceans once
somewhere shrouded by the night, the sun will shine
sometimes i see dying birds, fall to the ground
but it used to fly so high

too much of the past, for one to memorize
too many words remained, for one to read through the lines
the ebb and flow of the crowd, floods the world, and paradise
along the path of time

say my name, when the trees, susurrate
once and again, tell a story lost in time
the way it starts, and the way it ends
never again, leaving a story in dismay
with serveral starts, but just one ends.
`;

const images = [
  { src: "/artwork/photo_2023-07-02_11-59-38.jpg" },
  { src: "/artwork/6qkxkyrcthj71.png" },
  { src: "/artwork/Screenshot 2025-07-15 144005.png" },
  { src: "/artwork/cover.7566f8a5.avif" },
];

export default function FirstContent() {
  const [content, setContent] = useState(englishContent);
  const [vietnameseContent, setVietnameseContent] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Vietnamese text from localStorage on mount
  // useEffect(() => {
  //   const savedVN = localStorage.getItem("vietnameseContent");
  //   if (savedVN) {
  //     setVietnameseContent(savedVN);
  //   }
  // }, []);

  //Accommodate height change
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTranslate = async () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight); // lock current height
    }
    setIsLoading(true);

    if (vietnameseContent) {
      setContent(vietnameseContent);
      setIsTranslated(true);
      return;
    }

    setIsLoading(true);
    setContent("⏳ Translating content… please wait.");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: englishContent }),
      });

      if (!response.ok) throw new Error("Translation API failed");

      const data = await response.json();

      setVietnameseContent(data.translatedText);
      localStorage.setItem("vietnameseContent", data.translatedText);

      setContent(data.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error("Failed to translate:", error);

      // Restore English text and show popup error
      setContent(englishContent);
      setIsTranslated(false);
      setErrorMessage("⚠️ Failed to translate. Please try again.");
      setTimeout(() => setErrorMessage(null), 3000); // auto-hide popup
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = () => {
    setContent(englishContent);
    setIsTranslated(false);
  };

  return (
    <div>
      <MusicPlayer src="/audio/MBU_Ending.mp3" />

      <button
        onClick={isTranslated ? handleRevert : handleTranslate}
        disabled={isLoading}
        className="px-3 py-3 bg-red-600 text-white"
      >
        {isLoading
          ? "Translating..."
          : isTranslated
          ? "Revert to English"
          : "Translate to Vietnamese"}
      </button>

      {/* Content area */}
      <div
        className="relative text-black whitespace-pre-line mt-4 p-4 border rounded bg-gray-100 transition-all duration-300"
        style={{ minHeight: contentHeight ? `${contentHeight}px` : "auto" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 italic">
            ⏳ Translating content… please wait.
          </div>
        ) : (
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<p>") }}
          />
        )}
      </div>

      <ImageGallery images={images} />

      {/* Error popup */}
      {errorMessage && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
