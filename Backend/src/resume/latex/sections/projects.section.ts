import type { ResumeData, ITemplate } from '../types';
import { escape } from '../utils/latex-escape.util';
import { cleanArray } from '../utils/sanitize.util';

export function renderProjectsSection(data: ResumeData, _template: ITemplate): string {
  const projects = data.projects;
  if (!projects.length) return '';

  const sections = projects.map((project) => {
    const bullets = cleanArray(project.bullets);
    const bulletList = bullets.length
      ? String.raw`      \resumeItemListStart
${bullets.map((bullet) => `        \\resumeItem{${escape(bullet)}}`).join('\n')}
      \resumeItemListEnd`
      : '';

    return String.raw`    \resumeProjectHeading
      {${escape(project.name)}}{${escape(project.stack)}}
${bulletList}`;
  });

  return String.raw`\section{Projects}
  \resumeSubHeadingListStart
${sections.join('\n\n')}
  \resumeSubHeadingListEnd
\vspace{-10pt}`;
}
