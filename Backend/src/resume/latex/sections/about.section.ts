import type { ResumeData, ITemplate } from '../types';
import { escape } from '../utils/latex-escape.util';
import { clean } from '../utils/sanitize.util';

export function renderAboutSection(data: ResumeData, _template: ITemplate): string {
  const cleanSummary = clean(data.resume.summary);
  if (!cleanSummary) return '';

  return String.raw`\section{About}
\small{${escape(cleanSummary)}}
\vspace{-5pt}`;
}
