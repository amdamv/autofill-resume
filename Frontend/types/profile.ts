export interface ExperienceEntry {
  company: string;
  position: string;
  dates: string;
  location: string;
  bullets: string[];
}

export interface CandidateProfile {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  skills: string[];
  experience: string;
  education: string;
  experienceEntries?: ExperienceEntry[];
}
