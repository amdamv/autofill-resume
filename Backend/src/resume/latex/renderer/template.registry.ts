import type { ITemplate } from '../types';

import { akhmadClassicTemplate } from '../templates/akhmad-classic/akhmad-classic.template';
import { compactAtsTemplate } from '../templates/compact-ats/compact-ats.template';
import { modernBalancedTemplate } from '../templates/modern-balanced/modern-balanced.template';
import { faangProTemplate } from '../templates/faang-pro/faang-pro.template';

export const TEMPLATE_REGISTRY: Record<string, ITemplate> = {
  'akhmad-classic': akhmadClassicTemplate,
  'compact-ats': compactAtsTemplate,
  'modern-balanced': modernBalancedTemplate,
  'faang-pro': faangProTemplate,
};

export function getTemplate(templateId: string): ITemplate {
  const template = TEMPLATE_REGISTRY[templateId];
  if (template) {
    return template;
  }
  return akhmadClassicTemplate;
}

export function getTemplateMetaList(): ITemplate['meta'][] {
  return Object.values(TEMPLATE_REGISTRY).map((t) => t.meta);
}
