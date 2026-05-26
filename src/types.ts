export interface CandidateProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  education: string;
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
}

export interface MockJobPosting {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  description: string;
}
