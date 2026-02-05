export type Project = {
  title: string;
  description: string;
  stack: string[];
  url?: string;
};

export type Profile = {
  name: string;
  role: string;
  location?: string;
  bio?: string;
};

export const sampleProjects: Project[] = [
  {
    title: "Portfolio",
    description: "Personal site built with Next.js and Expo.",
    stack: ["Next.js", "Expo", "TypeScript"]
  }
];
