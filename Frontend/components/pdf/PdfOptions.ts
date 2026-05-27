export const RESUME_TEMPLATES = [
  {
    id: 'akhmad-classic',
    name: 'FAANG Style',
    badge: 'Default',
    description: 'Modern one-page ATS-friendly software engineer resume: About, grouped Skills, Experience, Projects, Education, Certificates.',
  },
  {
    id: 'compact-ats',
    name: 'Compact ATS',
    badge: 'Dense',
    description: 'Более плотная версия для вакансий, где нужно уместить максимум фактов на 1 странице.',
  },
  {
    id: 'modern-balanced',
    name: 'Modern Balanced',
    badge: 'Clean',
    description: 'Чуть свободнее по воздуху, лучше для manual review рекрутером.',
  },
] as const;

export const RESUME_FILTERS = [
  {
    id: 'source',
    name: 'Source PDF',
    description: 'Сохраняет структуру и акценты твоего исходного резюме.',
  },
  {
    id: 'backend-core',
    name: 'Backend Core',
    description: 'Поднимает выше Node.js, NestJS, API, PostgreSQL и Redis.',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud / DevOps',
    description: 'Фокус на AWS, Docker, Kubernetes, Terraform, CI/CD.',
  },
  {
    id: 'ai-middleware',
    name: 'AI Middleware',
    description: 'Фокус на Kafka, realtime, telemetry, OpenAI/LangChain и middleware.',
  },
] as const;

export type ResumeTemplateId = (typeof RESUME_TEMPLATES)[number]['id'];
export type ResumeFilterId = (typeof RESUME_FILTERS)[number]['id'];
