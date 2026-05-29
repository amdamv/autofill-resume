import { apiPost, apiPostBlob, API_BASE } from './client';
import type { CandidateProfile } from '../types/profile';

export type GenerateResumeResponse = {
  summary: string;
  highlightedSkills: string[];
  categorizedSkills?: { category: string; skills: string[] }[];
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

export type StreamEvent = {
  type: string;
  data: { step?: string; message?: string };
};

export function generateResume(params: {
  profile: CandidateProfile;
  jobDescription: string;
  targetLanguage: string;
}) {
  return apiPost<GenerateResumeResponse>('/generate-resume', params);
}

export function generateResumeStream(
  params: {
    profile: CandidateProfile;
    jobDescription: string;
    targetLanguage: string;
  },
  onEvent: (event: StreamEvent) => void,
): Promise<GenerateResumeResponse> {
  return fetch(`${API_BASE}/generate-resume/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent = '';

    const read = (
      resolve: (v: GenerateResumeResponse) => void,
      reject: (e: Error) => void,
    ): void => {
      reader.read().then(({ done, value }) => {
        if (done) {
          reject(new Error('Stream ended without result'));
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === '') {
            currentEvent = '';
            continue;
          }
          if (trimmed.startsWith('event: ')) {
            currentEvent = trimmed.slice(7).trim();
          } else if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (currentEvent === 'result') {
                resolve(data as GenerateResumeResponse);
                return;
              }
              if (currentEvent === 'error') {
                reject(new Error(data.message || 'Stream error'));
                return;
              }
              onEvent({ type: currentEvent, data });
            } catch {
              // skip malformed JSON
            }
          }
        }

        read(resolve, reject);
      }).catch(reject);
    };

    return new Promise<GenerateResumeResponse>((resolve, reject) => {
      read(resolve, reject);
    });
  });
}

export function renderPdf(payload: unknown) {
  return apiPostBlob('/generate-resume/render-pdf', payload);
}
