import { apiPost, apiPostBlob } from './client';
import type { CandidateProfile } from '../types/profile';

export type GenerateResumeResponse = {
  summary: string;
  highlightedSkills: string[];
  tailoredBullets: string[];
  coverLetter: string;
  experienceEntries?: Array<{
    company: string;
    position: string;
    dates: string;
    location: string;
    bullets: string[];
  }>;
};

export function generateResume(params: {
  profile: CandidateProfile;
  jobDescription: string;
  targetLanguage: string;
}) {
  return apiPost<GenerateResumeResponse>('/generate-resume', params);
}

export function renderPdf(payload: unknown) {
  return apiPostBlob('/generate-resume/render-pdf', payload);
}
