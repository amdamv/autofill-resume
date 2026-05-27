import { BaseTemplate } from '../base/base.template';
import type { TemplateMeta, TemplateSection, TemplateStyles } from '../../types';
import { TemplateCategory } from '../../types';

const styles: TemplateStyles = {
  fontSize: '11pt',
  topMargin: '-1.05in',
  textHeight: '0.5in',
  sectionSpacing: '-2pt',
};

const meta: TemplateMeta = {
  id: 'modern-balanced',
  name: 'Modern Balanced',
  category: TemplateCategory.MODERN,
  description: 'Well-balanced modern layout with generous spacing and clean typography',
  preview: '/previews/modern-balanced.png',
  isPremium: false,
  version: '1.0.0',
  tags: ['modern', 'balanced', 'clean'],
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

export class ModernBalancedTemplate extends BaseTemplate {
  meta = meta;
  styles = styles;
  sections = sections;
}

export const modernBalancedTemplate = new ModernBalancedTemplate();
