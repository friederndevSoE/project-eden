"use client";

import React, { useState, useRef, useEffect } from "react";
import ImageGallery from "@/components/ImageGallery";
import { motion } from "framer-motion";

const styleTemplates = {
  default: "text-[#292326]",
  quote: "text-gray-800 p-4 bg-brand-quote-bg/8 italic rounded",
  summary: "text-[#61384c]",
  conversation: "text-yellow-700",
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
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setVietnameseSections(JSON.parse(saved));
  }, [storageKey]);

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
          text: englishSections
            .map((s) => s.text)
            .join("\n\n---SECTION---\n\n"),
        }),
      });

      if (!response.ok) throw new Error("Translation API failed");

      const data = await response.json();
      const translatedArr = data.translatedText.split("\n\n---SECTION---\n\n");

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
      setErrorMessage(
        "⚠️ Failed to translate, sorry but Google might have remove the feature"
      );
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
    <div className="flex flex-col items-start w-full">
      {/* the translate button */}
      <button
        onClick={isTranslated ? handleRevert : handleTranslate}
        disabled={isLoading}
        className=" px-4 py-1.5 text-brand border border-brand  text-sm mr-1 m-auto transition-all shadow-[3px_3px_0px_#61384c] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-orange-200 cursor-pointer"
      >
        {isLoading
          ? "Translating... Don't exit..."
          : isTranslated
          ? "Xem nội dung nguyên bản"
          : "Translate to Vietnamese"}
      </button>

      {/* the content */}
      <div
        className="w-full relative text-black mt-2 p-3 border-l-2 border-y-2 md:border-2 border-gray-200 transition-all duration-300"
        style={{ minHeight: contentHeight ? `${contentHeight}px` : "auto" }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <motion.div
              className="flex space-x-2 mt-4"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                repeatType: "reverse",
              }}
            >
              <span className="w-3 h-3 bg-brand rounded-full" />
              <span className="w-3 h-3 bg-brand rounded-full" />
              <span className="w-3 h-3 bg-brand rounded-full" />
            </motion.div>
            <div className="flex flex-col items-center mt-4 gap-3">
              <p className="text-center">
                Đang được dịch sang tiếng Việt, thời gian chờ có thể lên tới
                <span className="underline"> 2 phút</span>.
              </p>
              <p className="text-sm italic text-center">
                Lưu ý: Nội dung chân thật nhất luôn nằm ở ngôn ngữ nguyên bản.
              </p>
            </div>
          </div>
        ) : (
          <div ref={contentRef}>
            {sections.map((section, idx) =>
              section.style === "hr" ? (
                <hr key={idx} className="my-6 border-t-2 border-gray-300" />
              ) : (
                <p
                  key={idx}
                  className={`mb-2 whitespace-pre-line ${
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
