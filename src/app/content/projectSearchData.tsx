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
    tags: ["The Courtyard"],
    color: "#f87171",
  },
  {
    id: 1,
    title: "Project One",
    tags: ["Signalis"],
    color: "#c85858",
  },
  {
    id: 2,
    title: "Project Two",
    tags: ["Steins Gate"],
    color: "#79706e",
  },
  {
    id: 3,
    title: "Project Three",
    tags: ["Until Then"],
    color: "#85b960",
  },
  {
    id: 4,
    title: "Project Four",
    tags: ["Honkai Impact 3rd"],
    color: "#b876cb",
  },
  {
    id: 5,
    title: "Project Five",
    tags: ["Mind Beneath Us"],
    color: "#7BA7B5",
  },
  {
    id: 6,
    title: "Project Six",
    tags: ["Refind Self"],
    color: "#b49e67",
  },
  {
    id: 7,
    title: "Project Seven",
    tags: ["Echo of Starsong"],
    color: "#38bdf8",
  },
];
