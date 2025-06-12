import React from "react";
import Link from "next/link";

const Center = () => {
  return (
    <div className="w-screen h-screen bg-white border-2 border-red-300">
      <Link
        href="/"
        className="inline-block mb-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
      >
        ← Back to Sphere
      </Link>
      <h1 className="text-xl font-bold">CENTER</h1>
    </div>
  );
};

export default Center;
