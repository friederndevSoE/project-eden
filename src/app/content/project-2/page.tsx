import PostContent from "@/components/PostContent";
import { englishSections } from "@/app/data/SteinsGate";
import { images } from "@/app/data/project-1";
import { projectSearchData } from "../projectSearchData";
import MusicPlayer from "@/components/MusicPlayer";

export default function SteinsGate() {
  const project = projectSearchData.find((p) => p.id === 2);
  return (
    <>
      <p>{project?.tags}</p>
      <p>Beginner Friendly: Depends</p>

      <MusicPlayer src="/audio/MBU_Ending.mp3" />
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
