import type { ITemplate } from './template-meta.type';
import type { ResumeData } from './resume-data.type';

export type SectionRenderer = (
  data: ResumeData,
  template: ITemplate,
) => string;
