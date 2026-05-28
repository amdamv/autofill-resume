export type ExperienceEntry = {
  company: string;
  position: string;
  dates: string;
  location: string;
  bullets: string[];
};

export type TailoredResume = {
  summary: string;
  highlightedSkills: string[];
  tailoredBullets: string[];
  coverLetter: string;
  experienceEntries?: ExperienceEntry[];
};
