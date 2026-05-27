export type FilterId = 'source' | 'backend-core' | 'cloud-devops' | 'ai-middleware';

export interface RenderOptions {
  templateId: string;
  filterId: FilterId;
}
