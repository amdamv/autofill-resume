export const RESUME_TEMPLATES = [
  {
    id: 'akhmad-classic',
    name: 'FAANG Style',
    badge: 'Default',
    description: {
      ru: 'Современное ATS-friendly резюме на одну страницу: About, Skills, Experience, Projects, Education, Certificates.',
      en: 'Modern one-page ATS-friendly software engineer resume: About, grouped Skills, Experience, Projects, Education, Certificates.',
    },
  },
  {
    id: 'compact-ats',
    name: 'Compact ATS',
    badge: 'Dense',
    description: {
      ru: 'Более плотная версия для вакансий, где нужно уместить максимум фактов на 1 странице.',
      en: 'A denser version for roles where you need to fit more evidence on one page.',
    },
  },
  {
    id: 'modern-balanced',
    name: 'Modern Balanced',
    badge: 'Clean',
    description: {
      ru: 'Чуть свободнее по воздуху, лучше для manual review рекрутером.',
      en: 'A more spacious layout that works better for manual recruiter review.',
    },
  },
] as const;

export const RESUME_FILTERS = [
  {
    id: 'source',
    name: 'Source PDF',
    description: {
      ru: 'Сохраняет структуру и акценты твоего исходного резюме.',
      en: 'Keeps the structure and emphasis of your source resume.',
    },
  },
  {
    id: 'backend-core',
    name: 'Backend Core',
    description: {
      ru: 'Поднимает выше Node.js, NestJS, API, PostgreSQL и Redis.',
      en: 'Prioritizes Node.js, NestJS, APIs, PostgreSQL, and Redis.',
    },
  },
  {
    id: 'cloud-devops',
    name: 'Cloud / DevOps',
    description: {
      ru: 'Фокус на AWS, Docker, Kubernetes, Terraform, CI/CD.',
      en: 'Focuses on AWS, Docker, Kubernetes, Terraform, and CI/CD.',
    },
  },
  {
    id: 'ai-middleware',
    name: 'AI Middleware',
    description: {
      ru: 'Фокус на Kafka, realtime, telemetry, OpenAI/LangChain и middleware.',
      en: 'Focuses on Kafka, realtime systems, telemetry, OpenAI/LangChain, and middleware.',
    },
  },
] as const;

export type ResumeTemplateId = (typeof RESUME_TEMPLATES)[number]['id'];
export type ResumeFilterId = (typeof RESUME_FILTERS)[number]['id'];
