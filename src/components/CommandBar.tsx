"use client";

import { Command, CommandInput, CommandItem, CommandList } from "cmdk";
import { useEffect, useRef, useState } from "react";
import { projectSearchData } from "@/app/content/projectSearchData";
import { useModal } from "@/app/context/ModalContext";

export default function CommandBar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { openModal } = useModal(); // Get openModal from context

  // Focus input when CommandBar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Shortcut 'esc' to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center px-4">
      <Command className="bg-white text-black w-full max-w-md shadow-xl p-4 relative mt-[80px] md:mt-[300px]">
        {/* 🔙 Back button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-500 hover:text-black transition-all duration-150 ease-in text-sm"
        >
          ← Back
        </button>

        {/* 🔍 Input */}
        <CommandInput
          ref={inputRef}
          value={search}
          onValueChange={setSearch}
          placeholder="Search something..."
          className="w-full mt-10 py-2 px-4 bg-slate-100"
        />

        {/* Only show results if input is not empty */}
        {/* Style the dropdown results */}
        {search.trim() !== "" && (
          <CommandList>
            {filteredResults.length > 0 ? (
              filteredResults.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    openModal(project.id); // ✅ Use modal from context
                    onClose();
                  }}
                  className="px-3 py-2 mt-2 cursor-pointer aria-selected:bg-slate-200 aria-selected:text-black "
                >
                  {project.tags.join(", ")}
                </CommandItem>
              ))
            ) : (
              <div className="px-3 py-2">
                Nothing, how about you try something else?
              </div>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
