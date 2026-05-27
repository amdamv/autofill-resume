import type { PdfCandidateProfileDto, TailoredResumePdfDto } from '../../dto/render-resume.dto';

export interface ExperienceEntry {
  company: string;
  dates: string;
  role: string;
  location: string;
  bullets: string[];
}

export interface ProjectEntry {
  name: string;
  stack: string;
  bullets: string[];
}

export interface SkillGroups {
  backend: string[];
  frontend: string[];
  databases: string[];
  devops: string[];
  cloud: string[];
  ai: string[];
}

export interface ResumeData {
  profile: PdfCandidateProfileDto;
  resume: TailoredResumePdfDto;

  /** Cleaned job title */
  title: string;
  /** Prioritized and merged skills list */
  skills: string[];
  /** Skills grouped by category */
  skillGroups: SkillGroups;
  /** Tailored bullet points */
  bullets: string[];
  /** Processed work experience entries */
  experienceEntries: ExperienceEntry[];
  /** Processed project entries */
  projects: ProjectEntry[];
  /** Extracted certificate names */
  certificates: string[];
}
