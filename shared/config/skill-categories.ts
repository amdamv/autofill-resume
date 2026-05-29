export enum SkillCategory {
  Backend = 'backend',
  Frontend = 'frontend',
  Databases = 'databases',
  DevOps = 'devops',
  Cloud = 'cloud',
  AI = 'ai',
}

export type SkillCategoryConfig = {
  key: SkillCategory;
  label: string;
  keywords: string[];
  max: number;
};

export const SKILL_CATEGORIES: SkillCategoryConfig[] = [
  { key: SkillCategory.Backend, label: 'Backend', keywords: ['Node', 'TypeScript', 'Java', 'Python', 'Nest', 'Express', 'GraphQL', 'REST', 'Microservices', 'Kafka', 'Rabbit', 'NATS', 'Go', 'Rust', 'C#', 'PHP', 'Ruby'], max: 9 },
  { key: SkillCategory.Frontend, label: 'Frontend', keywords: ['React', 'Next', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Redux', 'Vue', 'Angular', 'Svelte', 'Zustand'], max: 7 },
  { key: SkillCategory.Databases, label: 'Databases', keywords: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL', 'DynamoDB', 'Firebase', 'Cassandra'], max: 7 },
  { key: SkillCategory.DevOps, label: 'DevOps', keywords: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'GitLab', 'Linux', 'Observability', 'Grafana', 'Jenkins', 'Terraform', 'Ansible'], max: 8 },
  { key: SkillCategory.Cloud, label: 'Cloud', keywords: ['AWS', 'GCP', 'Azure', 'S3', 'Lambda', 'SQS', 'SNS', 'Cloud Run', 'Oracle Cloud', 'DigitalOcean', 'Heroku', 'Vercel'], max: 8 },
  { key: SkillCategory.AI, label: 'AI/LLM', keywords: ['OpenAI', 'LangChain', 'LLM', 'Vector', 'RAG', 'Prompt', 'GenAI', 'Claude', 'Neural', 'TensorFlow', 'PyTorch'], max: 7 },
];

const KEYWORD_MAP = SKILL_CATEGORIES.flatMap((cat) =>
  cat.keywords.map((kw) => ({ kw: kw.toLowerCase(), catKey: cat.key })),
);

/**
 * Match a skill name to its category key using substring matching.
 */
export function categorizeSkill(skill: string): SkillCategory {
  const l = skill.toLowerCase();
  const match = KEYWORD_MAP.find((entry) => l.includes(entry.kw));
  return match?.catKey || SkillCategory.Backend;
}

/** @deprecated Use `categorizeSkill` directly. Kept for backward compat. */
export function buildKeywordMap() {
  return KEYWORD_MAP;
}
