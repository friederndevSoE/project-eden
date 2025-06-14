//write tag here for searching projects

export type ProjectId = number | "center";

export type ProjectMeta = {
  id: ProjectId;
  title: string;
  tags: string[];
  color: string;
};

export const projectSearchData: ProjectMeta[] = [
  {
    id: "center",
    title: "Overview",
    tags: ["Elysia"],
    color: "#f87171",
  },
  {
    id: 1,
    title: "Project One",
    tags: ["Kevin"],
    color: "#60a5fa",
  },
  {
    id: 2,
    title: "Project Two",
    tags: ["Aponia"],
    color: "#a78bfa",
  },
  {
    id: 3,
    title: "Project Three",
    tags: ["Eden"],
    color: "#34d399",
  },
  {
    id: 4,
    title: "Project Four",
    tags: ["Vill-V"],
    color: "#facc15",
  },
  {
    id: 5,
    title: "Project Five",
    tags: ["Kalpas"],
    color: "#fb7185",
  },
  {
    id: 6,
    title: "Project Six",
    tags: ["Su"],
    color: "#38bdf8",
  },
];
