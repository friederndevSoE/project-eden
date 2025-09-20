import PostContent from "@/components/PostContent";
import { englishSections } from "@/app/data/project-1";
import { images } from "@/app/data/project-1";

export default function Project1Page() {
  return (
    <PostContent
      englishSections={englishSections}
      images={images}
      audioSrc="/audio/MBU_Ending.mp3"
      storageKey="project-1-vietnamese"
    />
  );
}
