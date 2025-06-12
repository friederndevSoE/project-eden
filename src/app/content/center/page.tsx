"use client";
import React from "react";

const ProjectModalContent = ({
  projectId,
}: {
  projectId: number | "center" | null;
}) => {
  if (projectId === "center") return <p>This is the center project info.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Project {projectId}</h2>
      <p>This is detailed content for project {projectId}. Customize freely!</p>
    </div>
  );
};

export default ProjectModalContent;
