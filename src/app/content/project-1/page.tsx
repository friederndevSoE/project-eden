import PostContent from "@/components/PostContent";
import { englishSections } from "@/app/data/project-1";
import { images } from "@/app/data/project-1";

import MusicPlayer from "@/components/MusicPlayer";

export default function Project1Page() {
  return (
    <>
      <MusicPlayer src="/audio/MBU_Ending.mp3" />
      <p>Beginner Friendly: Depends</p>
      <PostContent
        englishSections={englishSections}
        images={images}
        storageKey="project-1-vietnamese"
      />
      <p>secret message here</p>
    </>
  );
}
