import PostContent from "@/components/PostContent";
import { projectSearchData } from "../projectSearchData";

import { images } from "@/app/data/CourtYard";
import MusicPlayer from "@/components/MusicPlayer";

import { englishSections } from "@/app/data/CourtYard";

export default function Blog() {
  //change the id accordingly using projectSearchData
  const project = projectSearchData.find((p) => p.id === "center");
  return (
    <>
      <MusicPlayer src="/audio/MBU_Ending.mp3" />
      <PostContent
        englishSections={englishSections}
        images={[]}
        storageKey="project-center-vietnamese"
      />
      <div className="flex flex-col gap-2 mt-[-12px] text-left italic pl-4">
        <p>
          <span className="hover:underline">F</span>aint or the brightest stars
          will eventually burn themselves out.
        </p>
        <p>
          <span className="hover:underline">A</span>ll that remains in the
          courtyard will one day cease to exist, along with its soul, along with
          “you”, would “you” remember, or would “you” be here no longer?
        </p>
        <p>
          <span className="hover:underline">D</span>istant echo will one day be
          embraced by darkness and silence, leaving some lonely dots of light
          drifting to nowhere.
        </p>
        <p>
          <span className="hover:underline">E</span>
          ventually, the light will go out, go out along with their names.
        </p>
      </div>
    </>
  );
}
