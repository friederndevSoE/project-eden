"use client";

import { Command, CommandInput, CommandItem, CommandList } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Command className="bg-white rounded-xl w-[500px] shadow-xl p-4">
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search projects..."
          className="w-full"
        />
        <CommandList>
          {projectSearchData
            .filter(
              (project) =>
                project.title.toLowerCase().includes(search.toLowerCase()) ||
                project.tags.some((tag) =>
                  tag.toLowerCase().includes(search.toLowerCase())
                )
            )
            .map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => {
                  router.push(`/projects/${project.id}`);
                  onClose();
                }}
              >
                {project.title}
              </CommandItem>
            ))}
        </CommandList>
      </Command>
    </div>
  );
}
