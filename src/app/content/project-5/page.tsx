import PostContent from "@/components/PostContent";
import { projectSearchData } from "../projectSearchData";
import MusicPlayer from "@/components/MusicPlayer";

import { englishSections } from "@/app/data/MindBeneathUs";
import { images } from "@/app/data/MindBeneathUs";

export default function Blog() {
  //change the id accordingly using projectSearchData
  const project = projectSearchData.find((p) => p.id === 5);
  return (
    <>
      <div className="z-[99] bg-white">
        <div
          key={project?.id}
          style={{ backgroundColor: project?.color }}
          className=" font-bold text-white py-1 px-2 flex justify-between items-center"
        >
          <p>{project?.tags}</p>
          <p className="font-medium text-sm">[25.03_10H]</p>
        </div>

        <p className="text-xs mt-1 mb-2">
          Beginner Friendly{" "}
          <span className="py-0.5 px-1 rounded-md bg-green-200 text-shadow-green-800 ">
            Yes
          </span>
        </p>
        <MusicPlayer src="/audio/MBU_Ending.mp3" />
      </div>
      <PostContent
        englishSections={englishSections}
        images={images}
        //update this key for every project
        storageKey="project-5-vietnamese"
      />
    </>
  );
}
