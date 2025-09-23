import PostContent from "@/components/PostContent";
import { projectSearchData } from "../projectSearchData";

import { images } from "@/app/data/CourtYard";
import MusicPlayer from "@/components/MusicPlayer";

import { englishSections } from "@/app/data/CourtYard";

export default function SteinsGate() {
  //change the id accordingly using projectSearchData
  const project = projectSearchData.find((p) => p.id === "center");
  return (
    <>
      <div className="z-[99] bg-white">
        <div
          key={project?.id}
          style={{ backgroundColor: project?.color }}
          className=" font-bold text-white py-1 px-2"
        >
          {project?.tags}
        </div>

        <MusicPlayer src="/audio/MBU_Ending.mp3" />
      </div>
      <PostContent
        englishSections={englishSections}
        images={images}
        //update this key for every project
        storageKey="project-center-vietnamese"
      />
    </>
  );
}
