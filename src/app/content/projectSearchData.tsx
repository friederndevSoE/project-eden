export type ProjectId = number | "center";

export type ProjectMeta = {
  id: ProjectId;
  title: string;
  tags: string[];
  description?: string; // Optional for future search
};

export const projectSearchData: ProjectMeta[] = [
  {
    id: "center",
    title: "Overview",
    tags: ["Elysia"],
  },
  {
    id: 1,
    title: "Project One",
    tags: ["Kevin"],
  },
  {
    id: 2,
    title: "Project Two",
    tags: ["Aponia"],
  },
  {
    id: 3,
    title: "Project Three",
    tags: ["Eden"],
  },
  {
    id: 4,
    title: "Project Four",
    tags: ["Vill-V"],
  },
  {
    id: 5,
    title: "Project Five",
    tags: ["Kalpas"],
  },
  {
    id: 6,
    title: "Project Six",
    tags: ["Su"],
  },
];
