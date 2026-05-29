import type { ExperienceEntry } from './profile';

export interface TailoredResume {
  id: string;
  jobTitle: string;
  companyName: string;
  tailoredAt: string;
  summary: string;
  highlightedSkills: string[];
  categorizedSkills?: { category: string; skills: string[] }[];
  tailoredBullets: string[];
  coverLetter: string;
  experience?: ExperienceEntry[];
}

export interface MockJobPosting {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  description: string;
}
