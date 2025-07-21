import React from "react";
import MusicPlayer from "@/components/MusicPlayer";
import ImageGallery from "@/components/ImageGallery";

const images = [
  {
    src: "/artwork/6qkxkyrcthj71.png",
  },
];

const SecondContent = () => {
  return (
    <div>
      <h1 className="text-xl font-bold text-blue-600">Outer Dot 2</h1>
      <p>This is detailed info for Outer Dot 2!</p>
      {/* Artwork */}
      <ImageGallery images={images} />
    </div>
  );
};

export default SecondContent;
