export enum TemplateCategory {
  CLASSIC = 'classic',
  COMPACT = 'compact',
  MODERN = 'modern',
  PREMIUM = 'premium',
}

export type TemplateSection =
  | 'header'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certificates';

export interface TemplateStyles {
  fontSize: string;
  topMargin: string;
  textHeight: string;
  sectionSpacing: string;
  primaryColor?: string;
  fontFamily?: string;
  headingFont?: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  preview: string;
  isPremium: boolean;
  version: string;
  tags: string[];
}

export interface ITemplate {
  meta: TemplateMeta;
  styles: TemplateStyles;
  sections: TemplateSection[];

  generatePreamble(): string;
}
