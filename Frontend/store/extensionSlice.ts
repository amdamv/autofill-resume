import type { StateCreator } from 'zustand';
import type { TailoredResume } from '../types/resume';
import type { StoreState } from './index';
import type { LanguageCode } from '../i18n/languages';
import { DEFAULT_LANGUAGE } from '../i18n/languages';
import { MOCK_JOBS } from '../data/mockJobs';
import { scanVacancyAndGenerate } from '../services/jobfill.service';
import { autofillWebForm } from '../services/autofill.service';

interface CustomField {
  id: string;
  key: string;
  label: string;
  value: string;
}

interface WebFormFields {
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  summary: string;
  achievements: string;
  coverLetter: string;
  githubUrl: string;
  portfolioUrl: string;
  expectedSalary: string;
  customNotice: string;
}

const initialWebFormFields: WebFormFields = {
  fullName: '',
  email: '',
  phone: '',
  skills: '',
  summary: '',
  achievements: '',
  coverLetter: '',
  githubUrl: '',
  portfolioUrl: '',
  expectedSalary: '',
  customNotice: '',
};

export interface ExtensionSlice {
  selectedJobId: string;
  customFields: CustomField[];
  webFormFields: WebFormFields;
  scannedResume: TailoredResume | null;
  isScanning: boolean;
  scanStatusStep: string | null;
  isInjecting: boolean;
  injectStep: string | null;
  showFormHighlight: boolean;

  setSelectedJobId: (id: string) => void;
  addCustomField: (key: string, label: string, value: string) => void;
  removeCustomField: (key: string) => void;
  setWebFormField: (key: keyof WebFormFields, value: string) => void;
  clearWebForm: () => void;
  setScannedResume: (resume: TailoredResume | null) => void;
  scanVacancyAndGenerate: (lang: LanguageCode) => Promise<void>;
  autofillWebForm: () => Promise<void>;
}

export const createExtensionSlice: StateCreator<
  StoreState,
  [],
  [],
  ExtensionSlice
> = (set, get) => {
  let injectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let highlightTimeoutId: ReturnType<typeof setTimeout> | null = null;

  return {
  selectedJobId: '',
  customFields: [],
  webFormFields: initialWebFormFields,
  scannedResume: null,
  isScanning: false,
  scanStatusStep: null,
  isInjecting: false,
  injectStep: null,
  showFormHighlight: false,

  setSelectedJobId: (id) => set({ selectedJobId: id, scannedResume: null }),

  addCustomField: (key, label, value) => {
    const cleanKey = key.trim().toLowerCase();
    if (!cleanKey || !value.trim()) return;
    set((state) => ({
      customFields: [
        ...state.customFields.filter((f) => f.key !== cleanKey),
        { id: crypto.randomUUID(), key: cleanKey, label: label.trim() || cleanKey, value: value.trim() },
      ],
    }));
  },

  removeCustomField: (key) =>
    set((state) => ({
      customFields: state.customFields.filter((f) => f.key !== key),
    })),

  setWebFormField: (key, value) =>
    set((state) => ({
      webFormFields: { ...state.webFormFields, [key]: value },
    })),

  clearWebForm: () => set({ webFormFields: initialWebFormFields }),

  setScannedResume: (resume) => set({ scannedResume: resume }),

  scanVacancyAndGenerate: async (lang: LanguageCode = DEFAULT_LANGUAGE) => {
    if (get().isScanning) return;

    set({ isScanning: true, scanStatusStep: 'Connecting to AI...' });

    const activeJob =
      MOCK_JOBS.find((j) => j.id === get().selectedJobId) || MOCK_JOBS[0];

    try {
      const newResume = await scanVacancyAndGenerate(
        get().profile,
        activeJob.description,
        lang,
        { role: activeJob.role, company: activeJob.company },
        (message) => set({ scanStatusStep: message }),
      );

      set({
        scannedResume: newResume,
        scanStatusStep: "Готово! Кликните 'Автозаполнение'",
      });
    } catch (err: any) {
      console.error(err);
      set({ scanStatusStep: 'Ошибка генерации. Проверьте API Ключ.' });
    } finally {
      setTimeout(() => set({ scanStatusStep: null }), 3000);
      set({ isScanning: false });
    }
  },

  autofillWebForm: async () => {
    if (get().isInjecting) return;
    set({ isInjecting: true });

    const { profile, scannedResume, customFields } = get();

    await autofillWebForm({
      profile,
      scannedResume,
      customFields,
      onSetField: (key, value) =>
        set((s) => ({
          webFormFields: { ...s.webFormFields, [key]: value },
        })),
      onProgress: (step) => set({ injectStep: step }),
      onDone: () => {
        set({
          injectStep: 'Поля успешно заполнены JobFill! ✨',
          showFormHighlight: true,
        });

        if (injectTimeoutId) clearTimeout(injectTimeoutId);
        if (highlightTimeoutId) clearTimeout(highlightTimeoutId);

        injectTimeoutId = setTimeout(() => {
          set({ isInjecting: false, injectStep: null });
          injectTimeoutId = null;
        }, 1500);

        highlightTimeoutId = setTimeout(() => {
          set({ showFormHighlight: false });
          highlightTimeoutId = null;
        }, 3500);
      },
    });
  },
  };
};
