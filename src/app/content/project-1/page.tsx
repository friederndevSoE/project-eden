"use client";

import React, { useState, useRef, useEffect } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import ImageGallery from "@/components/ImageGallery";

// ✅ Step 1: Predefined style templates
const styleTemplates = {
  default: "text-black",
  quote: "text-gray-800 p-4 bg-slate-300",
  summary: "text-blue-600",
  conversation: "text-yellow-600",
};

// ✅ Step 2: English sections with text + style
const englishSections: { text: string; style: string }[] = [
  {
    text: `"ONEEE why me"?
some deserts on this planet, were oceans once
somewhere shrouded by the night, the sun will shine
sometimes i see dying birds, fall to the ground
but it used to fly so high`,
    style: "quote",
  },
  { text: "---", style: "hr" },
  {
    text: `too much of the past, for one to memorize
too many words remained, for one to read through the lines
the ebb and flow of the crowd, floods the world, and paradise
along the path of time`,
    style: "default",
  },
  {
    text: `say my name, when the trees, susurrate
once and again, tell a story lost in time
the way it starts, and the way it ends
never again, leaving a story in dismay
with serveral starts, but just one ends.`,
    style: "conversation",
  },
  { text: "---", style: "hr" },
];

const images = [
  { src: "/artwork/photo_2023-07-02_11-59-38.jpg" },
  { src: "/artwork/6qkxkyrcthj71.png" },
  { src: "/artwork/Screenshot 2025-07-15 144005.png" },
  { src: "/artwork/cover.7566f8a5.avif" },
];

export default function FirstContent() {
  const [sections, setSections] =
    useState<{ text: string; style: string }[]>(englishSections);
  const [vietnameseSections, setVietnameseSections] = useState<
    { text: string; style: string }[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined
  );
  const contentRef = useRef<HTMLDivElement>(null);

  // ✅ Load from localStorage if already translated before
  useEffect(() => {
    const saved = localStorage.getItem("vietnameseContent");
    if (saved) {
      const parsed = JSON.parse(saved) as { text: string; style: string }[];
      setVietnameseSections(parsed);
    }
  }, []);

  const handleTranslate = async () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
    setIsLoading(true);

    // ✅ Use cached translation if available
    if (vietnameseSections) {
      setSections(vietnameseSections);
      setIsTranslated(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: englishSections.map((s) => s.text).join("\n\n"),
        }),
      });

      if (!response.ok) throw new Error("Translation API failed");

      const data = await response.json();
      const translatedArr: string[] = data.translatedText.split(/\n\s*\n/);

      const translatedWithStyles = englishSections.map(
        (s, i): { text: string; style: string } => ({
          text: translatedArr[i] || s.text,
          style: s.style,
        })
      );

      setVietnameseSections(translatedWithStyles);
      localStorage.setItem(
        "vietnameseContent",
        JSON.stringify(translatedWithStyles)
      );

      setSections(translatedWithStyles);
      setIsTranslated(true);
    } catch (error) {
      console.error("Failed to translate:", error);
      setSections(englishSections);
      setIsTranslated(false);
      setErrorMessage("⚠️ Failed to translate. Please try again.");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = () => {
    setSections(englishSections);
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
          ? "Xem nguyên bản"
          : "Translate to Vietnamese (wait time up to 30s)"}
      </button>

      <div
        className="relative text-black mt-4 p-4 border rounded bg-gray-100 transition-all duration-300"
        style={{ minHeight: contentHeight ? `${contentHeight}px` : "auto" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 italic">
            ⏳ Translating content… please wait.
          </div>
        ) : (
          <div ref={contentRef}>
            {sections.map((section, idx) =>
              section.style === "hr" ? (
                <hr key={idx} className="my-6 border-t-2 border-gray-400" />
              ) : (
                <p
                  key={idx}
                  className={`mb-4 ${
                    styleTemplates[
                      section.style as keyof typeof styleTemplates
                    ] || styleTemplates.default
                  }`}
                >
                  {section.text}
                </p>
              )
            )}
          </div>
        )}
      </div>

      <ImageGallery images={images} />

      {errorMessage && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
