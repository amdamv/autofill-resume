import { BaseTemplate } from '../base/base.template';
import type { TemplateMeta, TemplateSection, TemplateStyles } from '../../types';
import { TemplateCategory } from '../../types';

const styles: TemplateStyles = {
  fontSize: '10pt',
  topMargin: '-0.5in',
  textHeight: '1.5in',
  sectionSpacing: '-3pt',
};

const meta: TemplateMeta = {
  id: 'faang-pro',
  name: 'FAANG Pro',
  category: TemplateCategory.PREMIUM,
  description: 'Premium template optimized for FAANG applications with executive styling',
  preview: '/previews/faang-pro.png',
  isPremium: true,
  version: '1.0.0',
  tags: ['premium', 'faang', 'executive', 'pro'],
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

export class FaangProTemplate extends BaseTemplate {
  meta = meta;
  styles = styles;
  sections = sections;
}

export const faangProTemplate = new FaangProTemplate();
