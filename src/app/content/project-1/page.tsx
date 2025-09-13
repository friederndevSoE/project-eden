import React, { useState } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import ImageGallery from "@/components/ImageGallery";

// 1. Isolate the content into a single string.
const englishContent = `ONEEE why me? 
some deserts on this planet, were oceans once
somewhere shrouded by the night, the sun will shine
sometimes i see dying birds, fall to the ground
but it used to fly so high`;

const images = [
  {
    src: "/artwork/photo_2023-07-02_11-59-38.jpg",
  },
  {
    src: "/artwork/6qkxkyrcthj71.png",
  },
  {
    src: "/artwork/Screenshot 2025-07-15 144005.png",
  },
  {
    src: "/artwork/cover.7566f8a5.avif",
  },
];

export default function FirstContent() {
  // 2. Use a state variable to hold the content to be displayed.
  const [content, setContent] = useState(englishContent);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  // 3. Create the function to handle the API call.
  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: englishContent }),
      });

      if (!response.ok) {
        throw new Error("Translation API failed");
      }

      const data = await response.json();
      setContent(data.translatedText);
      setIsTranslated(true);
    } catch (error) {
      console.error("Failed to translate:", error);
      // Optional: display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Create a function to revert the content back to English.
  const handleRevert = () => {
    setContent(englishContent);
    setIsTranslated(false);
  };

  // 5. Render the UI
  return (
    <div>
      {/* Music */}
      <MusicPlayer src="/audio/MBU_Ending.mp3" />

      {/* Conditionally render the button based on state */}
      <button
        onClick={isTranslated ? handleRevert : handleTranslate}
        disabled={isLoading}
        className="px-3 py-3 bg-red-600"
      >
        {isLoading
          ? "Translating..."
          : isTranslated
          ? "Revert to English"
          : "Translate to Vietnamese"}
      </button>

      {/* Content */}
      <div
        className="text-black"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<p>") }}
      />

      {/* Artwork */}
      <ImageGallery images={images} />
    </div>
  );
}
