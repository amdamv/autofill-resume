import type { ResumeData, ITemplate } from '../types';
import { escape } from '../utils/latex-escape.util';

export function renderSkillsSection(data: ResumeData, _template: ITemplate): string {
  const g = data.skillGroups;
  const rows = [
    { label: 'Backend', values: g.backend },
    { label: 'Frontend', values: g.frontend },
    { label: 'Databases', values: g.databases },
    { label: 'DevOps', values: g.devops },
    { label: 'Cloud', values: g.cloud },
    { label: 'AI/LLM Tools', values: g.ai },
  ]
    .filter((row) => row.values.length)
    .map((row) => `    \\textbf{${row.label}:} ${escape(row.values.join(', '))}`)
    .join(' \\\\\n');

  if (!rows) return '';

  return String.raw`\section{Skills}
\begin{itemize}[leftmargin=0.15in, label={}, itemsep=1pt, topsep=1pt]
  \small{\item{
${rows}
  }}
\end{itemize}
\vspace{-12pt}`;
}
