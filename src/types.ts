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

export interface TailoredResume {
  id: string;
  jobTitle: string;
  companyName: string;
  tailoredAt: string;
  summary: string;
  highlightedSkills: string[];
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
