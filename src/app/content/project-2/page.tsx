import PostContent from "@/components/PostContent";
import { images } from "@/app/data/CourtYard";
import { projectSearchData } from "../projectSearchData";
import MusicPlayer from "@/components/MusicPlayer";

import { englishSections } from "@/app/data/SteinsGate";

export default function SteinsGate() {
  //change the id accordingly using projectSearchData
  const project = projectSearchData.find((p) => p.id === 2);
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

        <p className="text-xs mt-1 mb-2">
          Beginner Friendly{" "}
          <span className="py-0.5 px-1 rounded-md bg-slate-200 text-slate-600 ">
            Depends
          </span>
        </p>
        <MusicPlayer src="/audio/MBU_Ending.mp3" />
      </div>
      <PostContent
        englishSections={englishSections}
        images={images}
        //update this key for every project
        storageKey="project-2-vietnamese"
      />
    </>
  );
}
