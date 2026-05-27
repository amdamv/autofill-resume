import type { ResumeData, ITemplate } from '../types';
import { escape } from '../utils/latex-escape.util';
import {
  educationSchool,
  educationDegree,
  educationDates,
  educationLocation,
} from '../utils/education-parser.util';
import { clean } from '../utils/sanitize.util';

export function renderEducationSection(data: ResumeData, _template: ITemplate): string {
  const education = data.profile.education;
  if (!clean(education)) return '';

  return String.raw`\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {${escape(educationSchool(education))}}{${escape(educationDates(education))}}
      {${escape(educationDegree(education))}}{${escape(educationLocation(education))}}
  \resumeSubHeadingListEnd
\vspace{-8pt}`;
}
