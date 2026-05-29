import type { StateCreator } from 'zustand';
import type { TailoredResume, ExperienceEntry } from '../types/index';
import type { StoreState } from './index';
import { generateResume } from '../services/resume';
import {
  getLanguageConfig,
  type LanguageCode,
} from '../i18n/languages';

export interface ResumeSlice {
  savedResumes: TailoredResume[];
  activeResumeId: string | null;
  jobDescription: string;
  targetCompany: string;
  targetRole: string;
  isGenerating: boolean;
  generatorError: string | null;

  // Portfolio skill state synced from ResumePortfolio for PDF generation
  portfolioCategorizedSkills: { category: string; skills: string[] }[];
  portfolioCategoryOrder: string[];

  setActiveResumeId: (id: string | null) => void;
  deleteResume: (id: string) => void;

  syncPortfolioSkills: (
    skills: { category: string; skills: string[] }[],
    order: string[],
  ) => void;

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

  generateTailoredResume: (lang: LanguageCode) => Promise<void>;
}

export const createResumeSlice: StateCreator<StoreState, [], [], ResumeSlice> = (set, get) => ({
  savedResumes: [],
  activeResumeId: null,
  jobDescription: '',
  targetCompany: '',
  targetRole: '',
  isGenerating: false,
  generatorError: null,
  portfolioCategorizedSkills: [],
  portfolioCategoryOrder: [],

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

  syncPortfolioSkills: (skills, order) =>
    set({ portfolioCategorizedSkills: skills, portfolioCategoryOrder: order }),

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
        tailoredAt: new Date().toLocaleString(getLanguageConfig(lang).locale, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: 'numeric',
          month: 'short',
        }),
        summary: parsedData.summary,
        highlightedSkills: parsedData.highlightedSkills,
        categorizedSkills: parsedData.categorizedSkills,
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
