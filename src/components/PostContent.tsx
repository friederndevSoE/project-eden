"use client";

import React, { useState, useRef, useEffect } from "react";
import ImageGallery from "@/components/ImageGallery";

const styleTemplates = {
  default: "text-black",
  quote: "text-gray-800 p-4 bg-slate-300/80",
  summary: "text-blue-600",
  conversation: "text-yellow-600",
};

export default function PostContent({
  englishSections,
  images,
  storageKey,
}: {
  englishSections: { text: string; style: string }[];
  images: { src: string }[];
  storageKey: string; // unique key per post for localStorage
}) {
  const [sections, setSections] =
    useState<{ text: string; style: string }[]>(englishSections);
  const [vietnameseSections, setVietnameseSections] = useState<
    { text: string; style: string }[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState<number>();
  const contentRef = useRef<HTMLDivElement>(null);

  //disable this for testing
  // useEffect(() => {
  //   const saved = localStorage.getItem(storageKey);
  //   if (saved) setVietnameseSections(JSON.parse(saved));
  // }, [storageKey]);

  const handleTranslate = async () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
    setIsLoading(true);

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
      const translatedArr: string[] = [];

      for (const section of englishSections) {
        if (section.style === "hr") {
          translatedArr.push("---");
          continue;
        }

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: section.text }),
        });
        const data = await res.json();
        translatedArr.push(data.translatedText);
      }
      const translatedWithStyles = englishSections.map((s, i) => ({
        text: translatedArr[i] || s.text,
        style: s.style,
      }));

      setVietnameseSections(translatedWithStyles);
      localStorage.setItem(storageKey, JSON.stringify(translatedWithStyles));

      setSections(translatedWithStyles);
      setIsTranslated(true);
    } catch (error) {
      console.error("Failed to translate:", error);
      setSections(englishSections);
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
      <button
        onClick={isTranslated ? handleRevert : handleTranslate}
        disabled={isLoading}
        className="px-3 py-3 bg-red-600 text-white"
      >
        {isLoading
          ? "Translating..."
          : isTranslated
          ? "Xem nguyên bản"
          : "Translate to Vietnamese"}
      </button>

      <div
        className="relative text-black mt-4 p-4 border rounded bg-gray-100 transition-all duration-300"
        style={{ minHeight: contentHeight ? `${contentHeight}px` : "auto" }}
      >
        {isLoading ? (
          <div className="text-center items-center justify-center h-full text-gray-500 ">
            <p>
              ⏳ Nội dung đang được dịch, thời gian chờ có thể lên tới 3 phút.
            </p>
            <p>
              Cảm ơn du khách, nhưng tôi sẽ vui hơn nếu được đọc nguyên bản 👉👈
            </p>
          </div>
        ) : (
          <div ref={contentRef}>
            {sections.map((section, idx) =>
              section.style === "hr" ? (
                <hr key={idx} className="my-6 border-t-2 border-gray-400" />
              ) : (
                <p
                  key={idx}
                  className={`mb-4 whitespace-pre-line ${
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
