import { create } from 'zustand';
import { CandidateProfile, TailoredResume, ExperienceEntry } from '../types';
import { MOCK_JOBS } from '../data/mockJobs';

interface CustomField {
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

interface ResumeState {
  // Candidate Profile
  profile: CandidateProfile;
  setProfile: (profile: Partial<CandidateProfile>) => void;
  loadDemoProfile: () => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addProfileExperience: (entry: ExperienceEntry) => void;
  removeProfileExperience: (index: number) => void;
  updateProfileExperience: (
    index: number,
    entry: Partial<ExperienceEntry>,
  ) => void;
  addProfileExpBullet: (entryIndex: number, bullet: string) => void;
  removeProfileExpBullet: (entryIndex: number, bulletIndex: number) => void;

  // Saved Resumes Archive
  savedResumes: TailoredResume[];
  activeResumeId: string | null;
  setActiveResumeId: (id: string | null) => void;
  deleteResume: (id: string) => void;
  addResumeBullet: (bullet: string) => void;
  removeResumeBullet: (index: number) => void;
  addExperienceEntry: (entry: ExperienceEntry) => void;
  removeExperienceEntry: (index: number) => void;
  updateExperienceEntry: (
    index: number,
    entry: Partial<ExperienceEntry>,
  ) => void;
  addExperienceBullet: (entryIndex: number, bullet: string) => void;
  removeExperienceBullet: (entryIndex: number, bulletIndex: number) => void;

  // Job adaptation inputs
  jobDescription: string;
  targetCompany: string;
  targetRole: string;
  setJobInputs: (inputs: {
    jobDescription?: string;
    targetCompany?: string;
    targetRole?: string;
  }) => void;

  // Generator UI states
  isGenerating: boolean;
  generatorError: string | null;
  generateTailoredResume: (lang: 'ru' | 'en') => Promise<void>;

  // Extension Simulator states
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  customFields: CustomField[];
  addCustomField: (key: string, label: string, value: string) => void;
  removeCustomField: (key: string) => void;

  // Simulated Web Form on target page
  webFormFields: WebFormFields;
  setWebFormField: (key: keyof WebFormFields, value: string) => void;
  clearWebForm: () => void;

  // Extension Scan & Inject UI states
  scannedResume: TailoredResume | null;
  setScannedResume: (resume: TailoredResume | null) => void;
  isScanning: boolean;
  scanStatusStep: string | null;
  isInjecting: boolean;
  injectStep: string | null;
  showFormHighlight: boolean;

  // Extension actions
  scanVacancyAndGenerate: () => Promise<void>;
  autofillWebForm: () => Promise<void>;
}

const initialProfile: CandidateProfile = {
  name: 'Akhmad Akhmedov',
  title: 'Middle Node.js Backend Developer',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  location: '',
  skills: [
    'TypeScript',
    'JavaScript',
    'Node.js',
    'NestJS',
    'Express',
    'SQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'TypeORM',
    'Kafka',
    'NATS',
    'RabbitMQ',
    'WebSocket',
    'JWT',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'AWS',
    'MinIO',
    'Git',
    'GitHub',
    'Jest',
    'Swagger',
    'Postman',
    'Grafana',
    'Agile',
  ],
  experience:
    'Backend Developer with 4+ years of experience building scalable systems using Node.js, NestJS, PostgreSQL and Kafka. Delivered high-load microservices for scalable, business-critical systems including real-time and data-intensive applications. Skilled in system design, caching, authentication, queues, and DevOps. Strong in clean code, team collaboration, and Agile.',
  experienceEntries: [
    {
      company: 'Default LaTeX Resume',
      position: 'Middle Node.js Backend Developer',
      dates: '2022 - Present',
      location: '',
      bullets: [
        'Implemented batch notification system for tournament winners (up to 50) via Customer.io, resulting in a 25% increase in player retention.',
        'Implemented UTM tracking during user registration, enabling transparent traffic source analytics and improved marketing campaign optimization.',
        'Built a Responsible Gaming system with configurable limits and self-exclusion, significantly reducing user complaints.',
      ],
    },
  ],
  education:
    'National University of Radio Electronics, Bachelor of Science in Computer Science, Sep. 2018 - Nov. 2022, Kharkiv, Ukraine',
};

const initialDemoResume: TailoredResume = {
  id: 'demo-res-1',
  jobTitle: 'Middle Node.js Backend Developer',
  companyName: 'Default LaTeX Resume',
  tailoredAt: 'Default template',
  summary:
    'Backend Developer with 4+ years of experience building scalable systems using Node.js, NestJS, PostgreSQL and Kafka. Delivered high-load microservices for scalable, business-critical systems including real-time and data-intensive applications. Skilled in system design, caching, authentication, queues, and DevOps. Strong in clean code, team collaboration, and Agile.',
  highlightedSkills: [
    'TypeScript',
    'JavaScript',
    'Node.js',
    'NestJS',
    'Express',
    'SQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'TypeORM',
    'Kafka',
    'NATS',
    'RabbitMQ',
    'WebSocket',
    'JWT',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'AWS',
    'MinIO',
    'Git',
    'GitHub',
    'Jest',
    'Swagger',
    'Postman',
    'Grafana',
    'Agile',
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

export const useResumeStore = create<ResumeState>((set, get) => ({
  // Candidate Profile
  profile: initialProfile,
  setProfile: (updatedFields) =>
    set((state) => ({ profile: { ...state.profile, ...updatedFields } })),
  loadDemoProfile: () =>
    set((state) => ({
      profile: {
        ...initialProfile,
        name: state.profile.name || initialProfile.name,
        title: state.profile.title || initialProfile.title,
        email: state.profile.email || initialProfile.email,
        phone: state.profile.phone || initialProfile.phone,
        linkedin: state.profile.linkedin || initialProfile.linkedin,
        github: state.profile.github || initialProfile.github,
        location: state.profile.location || initialProfile.location,
        skills:
          state.profile.skills.length > 0
            ? state.profile.skills
            : initialProfile.skills,
        experience: state.profile.experience || initialProfile.experience,
        education: state.profile.education || initialProfile.education,
        experienceEntries:
          state.profile.experienceEntries &&
          state.profile.experienceEntries.length > 0
            ? state.profile.experienceEntries
            : initialProfile.experienceEntries,
      },
    })),
  addSkill: (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !get().profile.skills.includes(trimmed)) {
      set((state) => ({
        profile: {
          ...state.profile,
          skills: [...state.profile.skills, trimmed],
        },
      }));
    }
  },
  removeSkill: (skill) =>
    set((state) => ({
      profile: {
        ...state.profile,
        skills: state.profile.skills.filter((s) => s !== skill),
      },
    })),
  addProfileExperience: (entry) =>
    set((state) => ({
      profile: {
        ...state.profile,
        experienceEntries: [
          ...(state.profile.experienceEntries || []),
          { ...entry, bullets: entry.bullets || [] },
        ],
      },
    })),
  removeProfileExperience: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        experienceEntries: (state.profile.experienceEntries || []).filter(
          (_, i) => i !== index,
        ),
      },
    })),
  updateProfileExperience: (index, entry) =>
    set((state) => ({
      profile: {
        ...state.profile,
        experienceEntries: (state.profile.experienceEntries || []).map(
          (e, i) => (i === index ? { ...e, ...entry } : e),
        ),
      },
    })),
  addProfileExpBullet: (entryIndex, bullet) =>
    set((state) => {
      const trimmed = bullet.trim();
      if (!trimmed) return state;
      return {
        profile: {
          ...state.profile,
          experienceEntries: (state.profile.experienceEntries || []).map(
            (e, i) =>
              i === entryIndex ? { ...e, bullets: [...e.bullets, trimmed] } : e,
          ),
        },
      };
    }),
  removeProfileExpBullet: (entryIndex, bulletIndex) =>
    set((state) => ({
      profile: {
        ...state.profile,
        experienceEntries: (state.profile.experienceEntries || []).map(
          (e, i) =>
            i === entryIndex
              ? {
                  ...e,
                  bullets: e.bullets.filter((_, bi) => bi !== bulletIndex),
                }
              : e,
        ),
      },
    })),

  // Saved Resumes Archive
  savedResumes: [initialDemoResume],
  activeResumeId: 'demo-res-1',
  setActiveResumeId: (id) => set({ activeResumeId: id }),
  deleteResume: (id) =>
    set((state) => {
      const filtered = state.savedResumes.filter((r) => r.id !== id);
      const nextActiveId =
        state.activeResumeId === id
          ? filtered.length > 0
            ? filtered[0].id
            : null
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
            ? {
                ...r,
                tailoredBullets: r.tailoredBullets.filter(
                  (_, i) => i !== index,
                ),
              }
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
            ? {
                ...r,
                experience: [
                  ...(r.experience || []),
                  { ...entry, bullets: entry.bullets || [] },
                ],
              }
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
            ? {
                ...r,
                experience: (r.experience || []).filter((_, i) => i !== index),
              }
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
            ? {
                ...r,
                experience: (r.experience || []).map((e, i) =>
                  i === index ? { ...e, ...entry } : e,
                ),
              }
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
                  i === entryIndex
                    ? { ...e, bullets: [...e.bullets, trimmed] }
                    : e,
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
                    ? {
                        ...e,
                        bullets: e.bullets.filter(
                          (_, bi) => bi !== bulletIndex,
                        ),
                      }
                    : e,
                ),
              }
            : r,
        ),
      };
    }),

  // Job adaptation inputs
  jobDescription: MOCK_JOBS[0].description,
  targetCompany: MOCK_JOBS[0].company,
  targetRole: MOCK_JOBS[0].role,
  setJobInputs: (inputs) =>
    set((state) => ({
      jobDescription:
        inputs.jobDescription !== undefined
          ? inputs.jobDescription
          : state.jobDescription,
      targetCompany:
        inputs.targetCompany !== undefined
          ? inputs.targetCompany
          : state.targetCompany,
      targetRole:
        inputs.targetRole !== undefined ? inputs.targetRole : state.targetRole,
    })),

  // Generator UI states
  isGenerating: false,
  generatorError: null,

  generateTailoredResume: async (lang) => {
    const { profile, jobDescription, targetCompany, targetRole } = get();
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
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, jobDescription, targetLanguage: lang }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || errData.message || 'Failed to generate resume',
        );
      }

      const parsedData = await response.json();

      const newResume: TailoredResume = {
        id: 'res-' + Date.now(),
        jobTitle: targetRole || profile.title,
        companyName: targetCompany || 'AI Suggested Target',
        tailoredAt: new Date().toLocaleString(
          lang === 'ru' ? 'ru-RU' : 'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: 'numeric',
            month: 'short',
          },
        ),
        summary: parsedData.summary,
        highlightedSkills: parsedData.highlightedSkills,
        tailoredBullets: parsedData.tailoredBullets,
        coverLetter: parsedData.coverLetter,
        experience: parsedData.experienceEntries || [],
      };

      set((state) => ({
        profile: parsedData.experienceEntries
          ? {
              ...state.profile,
              experienceEntries: parsedData.experienceEntries,
            }
          : state.profile,
        savedResumes: [newResume, ...state.savedResumes],
        activeResumeId: newResume.id,
      }));
    } catch (err: any) {
      console.error(err);
      set({
        generatorError:
          err?.message || 'Something went wrong generating the resume.',
      });
    } finally {
      set({ isGenerating: false });
    }
  },

  // Extension Simulator states
  selectedJobId: 'job-1',
  setSelectedJobId: (id) => set({ selectedJobId: id, scannedResume: null }),
  customFields: [
    {
      key: 'github',
      label: 'GitHub Ссылка',
      value: 'https://github.com/amdamv',
    },
    { key: 'portfolio', label: 'Портфолио', value: 'https://amdamv' },
    { key: 'salary', label: 'Ожидаемая Зарплата', value: '3000$' },
    { key: 'noticePeriod', label: 'Срок выхода', value: 'Готов завтра' },
  ],
  addCustomField: (key, label, value) => {
    const cleanKey = key.trim().toLowerCase();
    if (!cleanKey || !value.trim()) return;
    const cleanLabel = label.trim() || cleanKey;
    set((state) => ({
      customFields: [
        ...state.customFields.filter((f) => f.key !== cleanKey),
        { key: cleanKey, label: cleanLabel, value: value.trim() },
      ],
    }));
  },
  removeCustomField: (key) =>
    set((state) => ({
      customFields: state.customFields.filter((f) => f.key !== key),
    })),

  // Simulated Web Form
  webFormFields: initialWebFormFields,
  setWebFormField: (key, value) =>
    set((state) => ({
      webFormFields: { ...state.webFormFields, [key]: value },
    })),
  clearWebForm: () => set({ webFormFields: initialWebFormFields }),

  // Extension Scan & Inject UI states
  scannedResume: null,
  setScannedResume: (resume) => set({ scannedResume: resume }),
  isScanning: false,
  scanStatusStep: null,
  isInjecting: false,
  injectStep: null,
  showFormHighlight: false,

  scanVacancyAndGenerate: async () => {
    if (get().isScanning) return;

    set({
      isScanning: true,
      scanStatusStep: '1. Чтение HTML-кода страницы...',
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    set({ scanStatusStep: '2. Парсинг требований вакансии ИИ...' });
    await new Promise((resolve) => setTimeout(resolve, 800));

    set({ scanStatusStep: '3. Сопоставление с вашим профилем...' });

    const activeJob =
      MOCK_JOBS.find((j) => j.id === get().selectedJobId) || MOCK_JOBS[0];

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: get().profile,
          jobDescription: activeJob.description,
          targetLanguage: 'ru',
        }),
      });

      if (!response.ok) {
        throw new Error('Произошла ошибка при генерации резюме');
      }

      set({ scanStatusStep: '4. Финализация сопроводительного письма...' });
      const rawResult = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newResume: TailoredResume = {
        id: 'jobfill-res-' + Date.now(),
        jobTitle: activeJob.role,
        companyName: activeJob.company,
        tailoredAt: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        summary: rawResult.summary,
        highlightedSkills: rawResult.highlightedSkills,
        tailoredBullets: rawResult.tailoredBullets,
        coverLetter: rawResult.coverLetter,
      };

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

    const inputsToFill = [
      { key: 'fullName', label: 'ФИО', value: profile.name },
      { key: 'email', label: 'Email адрес', value: profile.email || '' },
      { key: 'phone', label: 'Номер телефона', value: profile.phone || '' },
      {
        key: 'skills',
        label: 'Навыки',
        value: scannedResume
          ? scannedResume.highlightedSkills.join(', ')
          : profile.skills.join(', '),
      },
      {
        key: 'summary',
        label: 'О себе',
        value: scannedResume
          ? scannedResume.summary
          : 'Инженер-разработчик готовый решать бизнес задачи.',
      },
      {
        key: 'achievements',
        label: 'Опыт работы',
        value: scannedResume
          ? scannedResume.tailoredBullets.join('\n')
          : profile.experience,
      },
      {
        key: 'expectedSalary',
        label: 'ЗП',
        value: customFields.find((f) => f.key === 'salary')?.value || '',
      },
      {
        key: 'githubUrl',
        label: 'GitHub',
        value: customFields.find((f) => f.key === 'github')?.value || '',
      },
      {
        key: 'portfolioUrl',
        label: 'Портфолио',
        value: customFields.find((f) => f.key === 'portfolio')?.value || '',
      },
      {
        key: 'coverLetter',
        label: 'Письмо',
        value: scannedResume
          ? scannedResume.coverLetter
          : 'Здравствуйте! Очень заинтересовала вакансия.',
      },
      {
        key: 'customNotice',
        label: 'Выход на связь / Срок',
        value: customFields.find((f) => f.key === 'noticePeriod')?.value || '',
      },
    ] as const;

    for (const item of inputsToFill) {
      set({ injectStep: `Заполнение: ${item.label}...` });
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => ({
        webFormFields: {
          ...state.webFormFields,
          [item.key]: item.value,
        },
      }));
    }

    set({
      injectStep: 'Поля успешно заполнены JobFill! ✨',
      showFormHighlight: true,
    });

    setTimeout(() => {
      set({ isInjecting: false, injectStep: null });
    }, 1500);

    setTimeout(() => {
      set({ showFormHighlight: false });
    }, 3500);
  },
}));
