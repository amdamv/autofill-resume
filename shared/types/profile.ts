export interface ExperienceEntry {
  company: string;
  position: string;
  dates: string;
  location: string;
  bullets: string[];
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  dates: string;
  location?: string;
}

export interface CertificateEntry {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
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
  educationEntries?: EducationEntry[];
  socialLinks?: SocialLink[];
  certificateEntries?: CertificateEntry[];
}
