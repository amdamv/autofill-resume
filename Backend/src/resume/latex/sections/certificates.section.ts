import type { ResumeData, ITemplate } from '../types';
import { escape } from '../utils/latex-escape.util';

export function renderCertificatesSection(data: ResumeData, _template: ITemplate): string {
  const certificates = data.certificates;
  if (!certificates.length) return '';

  return String.raw`\section{Certificates}
\begin{itemize}[leftmargin=0.15in, label={}, itemsep=1pt, topsep=1pt]
  \small{
${certificates.map((certificate) => `    \\item{\\textbf{${escape(certificate)}}\\vspace{-5pt}}`).join('\n')}
  }
\end{itemize}`;
}
