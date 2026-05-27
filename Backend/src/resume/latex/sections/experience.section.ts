import type { ResumeData, ITemplate } from '../types';
import { escape } from '../utils/latex-escape.util';
import { cleanArray } from '../utils/sanitize.util';

export function renderExperienceSection(data: ResumeData, _template: ITemplate): string {
  const entries = data.experienceEntries;
  if (!entries.length) return '';

  const sections = entries.map((section) => {
    const bullets = cleanArray(section.bullets);
    const bulletList = bullets.length
      ? String.raw`      \resumeItemListStart
${bullets.map((bullet) => `        \\resumeItem{${escape(bullet)}}`).join('\n')}
      \resumeItemListEnd`
      : '';

    return String.raw`    \resumeSubheading
      {${escape(section.company)}}{${escape(section.dates)}}
      {${escape(section.role)}}{${escape(section.location)}}
${bulletList}`;
  });

  return String.raw`\section{Experience}
  \resumeSubHeadingListStart
${sections.join('\n\n')}
  \resumeSubHeadingListEnd
\vspace{-10pt}`;
}
