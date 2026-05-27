import type { SkillGroups } from '../types';
import { FILTER_SKILL_PRIORITY } from '../constants/skill-priority';
import type { FilterId } from '../types';

export function prioritizeSkills(
  skills: string[],
  filterId: FilterId,
): string[] {
  const priority = FILTER_SKILL_PRIORITY[filterId];
  return [
    ...priority.filter((skill) =>
      skills.some((item) => item.toLowerCase() === skill.toLowerCase()),
    ),
    ...skills.filter(
      (skill) =>
        !priority.some((item) => item.toLowerCase() === skill.toLowerCase()),
    ),
  ];
}

export function groupSkills(skills: string[]): SkillGroups {
  const has = (keywords: string[]) =>
    skills.filter((skill) =>
      keywords.some((keyword) =>
        skill.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );

  const backend = has([
    'Node',
    'TypeScript',
    'Java',
    'Python',
    'Nest',
    'Express',
    'GraphQL',
    'REST',
    'Microservices',
    'Kafka',
    'Rabbit',
    'NATS',
  ]).slice(0, 9);
  const frontend = has(['React', 'Next', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'State']).slice(0, 7);
  const databases = has(['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL']).slice(0, 7);
  const devops = has(['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'GitLab', 'Linux', 'Observability', 'Grafana']).slice(0, 8);
  const cloud = has([
    'AWS',
    'GCP',
    'Azure',
    'S3',
    'Lambda',
    'SQS',
    'SNS',
    'Cloud Run',
    'Oracle Cloud',
  ]).slice(0, 8);
  const ai = has(['OpenAI', 'LangChain', 'LLM', 'AI', 'Vector', 'RAG', 'Prompt']).slice(0, 7);

  return {
    backend,
    frontend,
    databases,
    devops,
    cloud,
    ai,
  };
}
