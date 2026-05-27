import type { FilterId } from '../types';

export const FILTER_SKILL_PRIORITY: Record<FilterId, readonly string[]> = {
  source: [
    'Node.js',
    'TypeScript',
    'NestJS',
    'Express',
    'SQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
  ],
  'backend-core': [
    'Node.js',
    'TypeScript',
    'NestJS',
    'Express',
    'SQL',
    'PostgreSQL',
    'Redis',
    'JWT',
  ],
  'cloud-devops': [
    'AWS',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Git',
    'GitHub',
    'Grafana',
    'Azure DevOps',
  ],
  'ai-middleware': [
    'Kafka',
    'NATS',
    'RabbitMQ',
    'WebSocket',
    'Redis',
    'OpenAI',
    'LangChain',
    'LLM pipelines',
  ],
} as const;

export type SkillPriorityFilter = keyof typeof FILTER_SKILL_PRIORITY;
