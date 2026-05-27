import type { SectionRenderer, TemplateSection } from '../types';

import { renderHeaderSection } from '../sections/header.section';
import { renderAboutSection } from '../sections/about.section';
import { renderSkillsSection } from '../sections/skills.section';
import { renderExperienceSection } from '../sections/experience.section';
import { renderProjectsSection } from '../sections/projects.section';
import { renderEducationSection } from '../sections/education.section';
import { renderCertificatesSection } from '../sections/certificates.section';

export const SECTION_RENDERERS: Record<TemplateSection, SectionRenderer> = {
  header: renderHeaderSection,
  about: renderAboutSection,
  skills: renderSkillsSection,
  experience: renderExperienceSection,
  projects: renderProjectsSection,
  education: renderEducationSection,
  certificates: renderCertificatesSection,
};
