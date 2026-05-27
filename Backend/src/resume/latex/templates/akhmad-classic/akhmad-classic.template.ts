import { BaseTemplate } from '../base/base.template';
import type { TemplateMeta, TemplateSection, TemplateStyles } from '../../types';
import { TemplateCategory } from '../../types';

const styles: TemplateStyles = {
  fontSize: '11pt',
  topMargin: '-0.65in',
  textHeight: '1.25in',
  sectionSpacing: '-4pt',
};

const meta: TemplateMeta = {
  id: 'akhmad-classic',
  name: 'Akhmad Classic',
  category: TemplateCategory.CLASSIC,
  description: 'FAANG-style software engineer resume template with clean sections',
  preview: '/previews/akhmad-classic.png',
  isPremium: false,
  version: '1.0.0',
  tags: ['classic', 'ats-friendly', 'engineering'],
};

const sections: TemplateSection[] = [
  'header',
  'about',
  'skills',
  'experience',
  'projects',
  'education',
  'certificates',
];

export class AkhmadClassicTemplate extends BaseTemplate {
  meta = meta;
  styles = styles;
  sections = sections;
}

export const akhmadClassicTemplate = new AkhmadClassicTemplate();
