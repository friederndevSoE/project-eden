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
      <Command className="bg-white text-slate-700 w-full max-w-md p-4 relative mt-[80px] md:mt-[300px] shadow-[4px_4px_0px_1px_#61384C] overflow-hidden md:shadow-[6px_6px_0px_1px_#61384C]">
        {/* 🔙 Back button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-500 hover:text-black transition-all duration-150 ease-in text-sm flex items-center gap-1 cursor-pointer "
        >
          <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 15 15"
            className="rotate-180"
          >
            <path
              fill="#61384c"
              d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414Z"
            ></path>
          </svg>
          <span className="text-brand">Back</span>
        </button>

        {/* 🔍 Input */}
        <CommandInput
          ref={inputRef}
          value={search}
          onValueChange={setSearch}
          placeholder="Search something..."
          className="w-full mt-10 py-2 px-4 bg-slate-100 border-2 border-slate-300 rounded-sm"
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
                  className="px-3 py-2 mt-2 cursor-pointer rounded-sm aria-selected:bg-orange-200/50 aria-selected:text-black "
                >
                  {project.tags.join(", ")}
                </CommandItem>
              ))
            ) : (
              <div className="px-3 py-2 mt-2 text-slate-500">
                Search empty, how about trying something else?
              </div>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
