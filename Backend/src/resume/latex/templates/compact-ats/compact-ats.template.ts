import { BaseTemplate } from '../base/base.template';
import type { TemplateMeta, TemplateSection, TemplateStyles } from '../../types';
import { TemplateCategory } from '../../types';

const styles: TemplateStyles = {
  fontSize: '11pt',
  topMargin: '-0.3in',
  textHeight: '3.0in',
  sectionSpacing: '-9pt',
};

const meta: TemplateMeta = {
  id: 'compact-ats',
  name: 'Compact ATS',
  category: TemplateCategory.COMPACT,
  description: 'Space-optimized template designed for ATS parsing with compact layout',
  preview: '/previews/compact-ats.png',
  isPremium: false,
  version: '1.0.0',
  tags: ['compact', 'ats-optimized', 'single-page'],
};

const sections: TemplateSection[] = [
  'header',
  'skills',
  'experience',
  'education',
  'certificates',
];

export class CompactAtsTemplate extends BaseTemplate {
  meta = meta;
  styles = styles;
  sections = sections;
}

export const compactAtsTemplate = new CompactAtsTemplate();
