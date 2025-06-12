import dynamic from "next/dynamic";
import InteractiveSphere from "@/components/3d/3d sphere";

const Scene3D = dynamic(() => import("../components/3d/test3d"), {
  loading: () => <div>Loading 3D scene...</div>,
});

export default function Home() {
  return (
    <>
      <h1>Elysia</h1>
      {/* <Scene3D /> */}
      <InteractiveSphere />
    </>
  );
}
