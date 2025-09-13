"use client";

import React, { useState, useEffect } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import ImageGallery from "@/components/ImageGallery";

const englishContent = `ONEEE why me? 
some deserts on this planet, were oceans once
somewhere shrouded by the night, the sun will shine
sometimes i see dying birds, fall to the ground
but it used to fly so high`;

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

  // Load Vietnamese text from localStorage on mount
  useEffect(() => {
    const savedVN = localStorage.getItem("vietnameseContent");
    if (savedVN) {
      setVietnameseContent(savedVN);
    }
  }, []);

  const handleTranslate = async () => {
    // If we already have cached Vietnamese, just switch
    if (vietnameseContent) {
      setContent(vietnameseContent);
      setIsTranslated(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: englishContent }),
      });

      if (!response.ok) {
        throw new Error("Translation API failed");
      }

      const data = await response.json();

      // Save to state + localStorage
      setVietnameseContent(data.translatedText);
      localStorage.setItem("vietnameseContent", data.translatedText);

      setContent(data.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error("Failed to translate:", error);
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

      <div
        className="text-black whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<p>") }}
      />

      <ImageGallery images={images} />
    </div>
  );
}
