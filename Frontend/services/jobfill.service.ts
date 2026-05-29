import { generateResumeStream } from './resume';
import type { CandidateProfile } from '../types/profile';
import type { TailoredResume } from '../types/resume';
import type { LanguageCode } from '../i18n/languages';

export async function scanVacancyAndGenerate(
  profile: CandidateProfile,
  jobDescription: string,
  targetLanguage: LanguageCode,
  jobInfo: { role: string; company: string },
  onProgress: (message: string) => void,
): Promise<TailoredResume> {
  const rawResult = await generateResumeStream(
    { profile, jobDescription, targetLanguage },
    (event) => {
      if (event.type === 'progress' && event.data.message) {
        onProgress(event.data.message);
      }
    },
  );

  return {
    id: 'jobfill-res-' + Date.now(),
    jobTitle: jobInfo.role,
    companyName: jobInfo.company,
    tailoredAt: new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    summary: rawResult.summary,
    highlightedSkills: rawResult.highlightedSkills,
    categorizedSkills: rawResult.categorizedSkills,
    tailoredBullets: rawResult.tailoredBullets,
    coverLetter: rawResult.coverLetter,
  };
}
