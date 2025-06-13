"use client";

import { Command, CommandInput, CommandItem, CommandList } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { projectSearchData } from "@/app/content/projectSearchData";

export default function CommandBar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when CommandBar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Shortcut to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Filtered by tags only, shown only when user typed
  const filteredResults =
    search.trim() === ""
      ? []
      : projectSearchData.filter((project) =>
          project.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
        );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <Command className="bg-white rounded-xl w-full max-w-md shadow-xl p-4 relative">
        {/* 🔙 Back button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-500 hover:text-black text-sm"
        >
          ← Back
        </button>

        {/* 🔍 Input */}
        <CommandInput
          ref={inputRef}
          value={search}
          onValueChange={setSearch}
          placeholder="Search by tag..."
          className="w-full mt-10"
        />

        {/* ✅ Only show results if input is not empty */}
        {search.trim() !== "" && (
          <CommandList>
            {filteredResults.length > 0 ? (
              filteredResults.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    router.push(
                      project.id === "center"
                        ? "/content/center"
                        : `content/project-${project.id}/`
                    );
                    onClose();
                  }}
                  className="px-3 py-2 cursor-pointer aria-selected:bg-gray-200 aria-selected:text-black rounded"
                >
                  {project.tags.join(", ")}
                </CommandItem>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No matches found</div>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
