import PostContent from "@/components/PostContent";
import { englishSections } from "@/app/data/SteinsGate";
import { images } from "@/app/data/project-1";
import { projectSearchData } from "../projectSearchData";
import MusicPlayer from "@/components/MusicPlayer";

export default function SteinsGate() {
  const project = projectSearchData.find((p) => p.id === 2);
  return (
    <>
      <div className="z-[99] bg-white border border-red-500 ">
        <p className="">{project?.tags}</p>
        <p>
          Beginner Friendly:
          <span className="py-1 px-2 rounded-lg bg-slate-200 text-slate-600">
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
      <p>secret message here</p>
    </>
  );
}
