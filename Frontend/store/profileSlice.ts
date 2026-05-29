import type { StateCreator } from 'zustand';
import type { CandidateProfile, ExperienceEntry, EducationEntry, SocialLink, CertificateEntry } from '../types/profile';
import type { StoreState } from './index';

const emptyProfile: CandidateProfile = {
  name: '',
  title: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  location: '',
  skills: [],
  experience: '',
  education: '',
  experienceEntries: [],
  educationEntries: [],
  socialLinks: [],
  certificateEntries: [],
};

const demoProfile: CandidateProfile = {
  name: 'Akhmad Akhmedov',
  title: 'Middle Node.js Backend Developer',
  email: 'amdamv@example.com',
  phone: '+1 (234) 567-89-01',
  linkedin: 'https://linkedin.com/in/amdamv',
  github: 'https://github.com/amdamv',
  location: 'Albania, Durres',
  skills: [
    'TypeScript', 'JavaScript', 'Node.js', 'NestJS', 'Express',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'TypeORM',
    'Kafka', 'NATS', 'RabbitMQ', 'WebSocket', 'JWT',
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'MinIO',
    'Git', 'GitHub', 'Jest', 'Swagger', 'Postman', 'Grafana', 'Agile',
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
  educationEntries: [
    { id: crypto.randomUUID(), institution: 'National University of Radio Electronics', degree: 'Bachelor of Science', field: 'Computer Science', dates: 'Sep 2018 - Nov 2022', location: 'Kharkiv, Ukraine' },
  ],
  socialLinks: [
    { id: crypto.randomUUID(), platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/amdamv' },
    { id: crypto.randomUUID(), platform: 'github', label: 'GitHub', url: 'https://github.com/amdamv' },
    { id: crypto.randomUUID(), platform: 'telegram', label: 'Telegram', url: 'https://t.me/amdamv' },
  ],
  certificateEntries: [
    { id: crypto.randomUUID(), name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
    { id: crypto.randomUUID(), name: 'Google Cloud Professional Engineer', issuer: 'Google Cloud', date: '2024' },
  ],
};

export interface ProfileSlice {
  profile: CandidateProfile;
  setProfile: (fields: Partial<CandidateProfile>) => void;
  loadDemoProfile: () => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addProfileExperience: (entry: ExperienceEntry) => void;
  removeProfileExperience: (index: number) => void;
  updateProfileExperience: (index: number, entry: Partial<ExperienceEntry>) => void;
  addProfileExpBullet: (entryIndex: number, bullet: string) => void;
  removeProfileExpBullet: (entryIndex: number, bulletIndex: number) => void;
  addEducationEntry: (entry: EducationEntry) => void;
  removeEducationEntry: (index: number) => void;
  addSocialLink: (link: SocialLink) => void;
  removeSocialLink: (index: number) => void;
  addCertificateEntry: (entry: CertificateEntry) => void;
  removeCertificateEntry: (index: number) => void;
}

export const createProfileSlice: StateCreator<StoreState, [], [], ProfileSlice> = (set) => ({
  profile: emptyProfile,

  setProfile: (fields) =>
    set((state) => ({ profile: { ...state.profile, ...fields } })),

  loadDemoProfile: () =>
    set({
      profile: { ...demoProfile },
    }),

  addSkill: (skill) => {
    const trimmed = skill.trim();
    if (trimmed) {
      set((state) => {
        if (state.profile.skills.includes(trimmed)) return state;
        return {
          profile: { ...state.profile, skills: [...state.profile.skills, trimmed] },
        };
      });
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
              ? { ...e, bullets: e.bullets.filter((_, bi) => bi !== bulletIndex) }
              : e,
        ),
      },
    })),

  addEducationEntry: (entry) =>
    set((state) => {
      const entries = [...(state.profile.educationEntries || []), entry];
      return {
        profile: {
          ...state.profile,
          educationEntries: entries,
          education: entries.map(
            e => [e.institution, e.degree, e.field, e.dates, e.location].filter(Boolean).join(', ')
          ).join('; '),
        },
      };
    }),

  removeEducationEntry: (index) =>
    set((state) => {
      const entries = (state.profile.educationEntries || []).filter(
        (_, i) => i !== index,
      );
      return {
        profile: {
          ...state.profile,
          educationEntries: entries,
          education: entries.length
            ? entries.map(
                e => [e.institution, e.degree, e.field, e.dates, e.location].filter(Boolean).join(', ')
              ).join('; ')
            : '',
        },
      };
    }),

  addSocialLink: (link) =>
    set((state) => ({
      profile: {
        ...state.profile,
        socialLinks: [...(state.profile.socialLinks || []), link],
      },
    })),

  removeSocialLink: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        socialLinks: (state.profile.socialLinks || []).filter(
          (_, i) => i !== index,
        ),
      },
    })),

  addCertificateEntry: (entry) =>
    set((state) => ({
      profile: {
        ...state.profile,
        certificateEntries: [...(state.profile.certificateEntries || []), entry],
      },
    })),

  removeCertificateEntry: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        certificateEntries: (state.profile.certificateEntries || []).filter(
          (_, i) => i !== index,
        ),
      },
    })),
});
