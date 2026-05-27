import type { StateCreator } from 'zustand';
import type { TailoredResume, ExperienceEntry } from '../types/index';
import type { StoreState } from './index';
import { generateResume } from '../services/resume';
import { MOCK_JOBS } from '../data/mockJobs';

const initialDemoResume: TailoredResume = {
  id: 'demo-res-1',
  jobTitle: 'Middle Node.js Backend Developer',
  companyName: 'Default LaTeX Resume',
  tailoredAt: 'Default template',
  summary:
    'Backend Developer with 4+ years of experience building scalable systems using Node.js, NestJS, PostgreSQL and Kafka. Delivered high-load microservices for scalable, business-critical systems including real-time and data-intensive applications. Skilled in system design, caching, authentication, queues, and DevOps. Strong in clean code, team collaboration, and Agile.',
  highlightedSkills: [
    'TypeScript', 'JavaScript', 'Node.js', 'NestJS', 'Express',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'TypeORM',
    'Kafka', 'NATS', 'RabbitMQ', 'WebSocket', 'JWT',
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'MinIO',
    'Git', 'GitHub', 'Jest', 'Swagger', 'Postman', 'Grafana', 'Agile',
  ],
  tailoredBullets: [
    'Implemented batch notification system for tournament winners (up to 50) via Customer.io, resulting in a 25% increase in player retention.',
    'Implemented UTM tracking during user registration, enabling transparent traffic source analytics and improved marketing campaign optimization.',
    'Built a Responsible Gaming system with configurable limits and self-exclusion, significantly reducing user complaints.',
    'Built manual user verification functionality in the admin panel with enhanced filtering and status display, reducing support workload and cutting verification time by 30%.',
  ],
  coverLetter:
    'I am a Middle Node.js Backend Developer with 4+ years of experience building scalable services with Node.js, NestJS, PostgreSQL, Kafka, Redis and Docker. I have delivered high-load production features in gaming and real-time systems, including notifications, tracking, responsible gaming, verification workflows, authentication, caching and SQL optimization.',
};

export interface ResumeSlice {
  savedResumes: TailoredResume[];
  activeResumeId: string | null;
  jobDescription: string;
  targetCompany: string;
  targetRole: string;
  isGenerating: boolean;
  generatorError: string | null;

  setActiveResumeId: (id: string | null) => void;
  deleteResume: (id: string) => void;

  addResumeBullet: (bullet: string) => void;
  removeResumeBullet: (index: number) => void;

  addExperienceEntry: (entry: ExperienceEntry) => void;
  removeExperienceEntry: (index: number) => void;
  updateExperienceEntry: (index: number, entry: Partial<ExperienceEntry>) => void;
  addExperienceBullet: (entryIndex: number, bullet: string) => void;
  removeExperienceBullet: (entryIndex: number, bulletIndex: number) => void;

  setJobInputs: (inputs: {
    jobDescription?: string;
    targetCompany?: string;
    targetRole?: string;
  }) => void;

  generateTailoredResume: (lang: 'ru' | 'en') => Promise<void>;
}

export const createResumeSlice: StateCreator<StoreState, [], [], ResumeSlice> = (set, get) => ({
  savedResumes: [initialDemoResume],
  activeResumeId: 'demo-res-1',
  jobDescription: MOCK_JOBS[0].description,
  targetCompany: MOCK_JOBS[0].company,
  targetRole: MOCK_JOBS[0].role,
  isGenerating: false,
  generatorError: null,

  setActiveResumeId: (id) => set({ activeResumeId: id }),

  deleteResume: (id) =>
    set((state) => {
      const filtered = state.savedResumes.filter((r) => r.id !== id);
      const nextActiveId =
        state.activeResumeId === id
          ? filtered.length > 0 ? filtered[0].id : null
          : state.activeResumeId;
      return { savedResumes: filtered, activeResumeId: nextActiveId };
    }),

  addResumeBullet: (bullet) =>
    set((state) => {
      const trimmed = bullet.trim();
      if (!trimmed || !state.activeResumeId) return state;
      return {
        savedResumes: state.savedResumes.map((r) =>
          r.id === state.activeResumeId
            ? { ...r, tailoredBullets: [...r.tailoredBullets, trimmed] }
            : r,
        ),
      };
    }),

  removeResumeBullet: (index) =>
    set((state) => {
      if (!state.activeResumeId) return state;
      return {
        savedResumes: state.savedResumes.map((r) =>
          r.id === state.activeResumeId
            ? { ...r, tailoredBullets: r.tailoredBullets.filter((_, i) => i !== index) }
            : r,
        ),
      };
    }),

  addExperienceEntry: (entry) =>
    set((state) => {
      if (!state.activeResumeId) return state;
      return {
        savedResumes: state.savedResumes.map((r) =>
          r.id === state.activeResumeId
            ? { ...r, experience: [...(r.experience || []), { ...entry, bullets: entry.bullets || [] }] }
            : r,
        ),
      };
    }),

  removeExperienceEntry: (index) =>
    set((state) => {
      if (!state.activeResumeId) return state;
      return {
        savedResumes: state.savedResumes.map((r) =>
          r.id === state.activeResumeId
            ? { ...r, experience: (r.experience || []).filter((_, i) => i !== index) }
            : r,
        ),
      };
    }),

  updateExperienceEntry: (index, entry) =>
    set((state) => {
      if (!state.activeResumeId) return state;
      return {
        savedResumes: state.savedResumes.map((r) =>
          r.id === state.activeResumeId
            ? { ...r, experience: (r.experience || []).map((e, i) => (i === index ? { ...e, ...entry } : e)) }
            : r,
        ),
      };
    }),

  addExperienceBullet: (entryIndex, bullet) =>
    set((state) => {
      const trimmed = bullet.trim();
      if (!trimmed || !state.activeResumeId) return state;
      return {
        savedResumes: state.savedResumes.map((r) =>
          r.id === state.activeResumeId
            ? {
                ...r,
                experience: (r.experience || []).map((e, i) =>
                  i === entryIndex ? { ...e, bullets: [...e.bullets, trimmed] } : e,
                ),
              }
            : r,
        ),
      };
    }),

  removeExperienceBullet: (entryIndex, bulletIndex) =>
    set((state) => {
      if (!state.activeResumeId) return state;
      return {
        savedResumes: state.savedResumes.map((r) =>
          r.id === state.activeResumeId
            ? {
                ...r,
                experience: (r.experience || []).map((e, i) =>
                  i === entryIndex
                    ? { ...e, bullets: e.bullets.filter((_, bi) => bi !== bulletIndex) }
                    : e,
                ),
              }
            : r,
        ),
      };
    }),

  setJobInputs: (inputs) =>
    set((state) => ({
      jobDescription:
        inputs.jobDescription !== undefined ? inputs.jobDescription : state.jobDescription,
      targetCompany:
        inputs.targetCompany !== undefined ? inputs.targetCompany : state.targetCompany,
      targetRole:
        inputs.targetRole !== undefined ? inputs.targetRole : state.targetRole,
    })),

  generateTailoredResume: async (lang) => {
    const state = get();
    const { profile, jobDescription, targetCompany, targetRole } = state;

    if (!profile.name || !profile.title) {
      set({
        generatorError:
          lang === 'ru'
            ? 'Пожалуйста, заполните Имя и Должность в профиле'
            : 'Please fill Name and Title in profile',
      });
      return;
    }
    if (!jobDescription.trim()) {
      set({
        generatorError:
          lang === 'ru'
            ? 'Предоставьте описание вакансии для адаптации'
            : 'Please provide a job description for tailoring',
      });
      return;
    }

    set({ isGenerating: true, generatorError: null });

    try {
      const parsedData = await generateResume({
        profile,
        jobDescription,
        targetLanguage: lang,
      });

      const newResume: TailoredResume = {
        id: 'res-' + Date.now(),
        jobTitle: targetRole || profile.title,
        companyName: targetCompany || 'AI Suggested Target',
        tailoredAt: new Date().toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: 'numeric',
          month: 'short',
        }),
        summary: parsedData.summary,
        highlightedSkills: parsedData.highlightedSkills,
        tailoredBullets: parsedData.tailoredBullets,
        coverLetter: parsedData.coverLetter,
        experience: parsedData.experienceEntries || [],
      };

      set((s) => ({
        profile: parsedData.experienceEntries
          ? { ...s.profile, experienceEntries: parsedData.experienceEntries }
          : s.profile,
        savedResumes: [newResume, ...s.savedResumes],
        activeResumeId: newResume.id,
      }));
    } catch (err: any) {
      console.error(err);
      set({
        generatorError: err?.message || 'Something went wrong generating the resume.',
      });
    } finally {
      set({ isGenerating: false });
    }
  },
});
