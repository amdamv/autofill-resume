import type { ResumeData, ITemplate } from '../types';
import type { PdfCandidateProfileDto } from '../../dto/render-resume.dto';
import { escape, safeUrl, stripProtocol } from '../utils/latex-escape.util';
import { clean } from '../utils/sanitize.util';

function contactLines(contacts: string[]): string[][] {
  if (contacts.length <= 3) {
    return [contacts];
  }

  const splitAt = Math.ceil(contacts.length / 2);
  return [contacts.slice(0, splitAt), contacts.slice(splitAt)];
}

function renderHeaderInternal(profile: PdfCandidateProfileDto, title: string): string {
  const name = clean(profile.name);
  const contacts = [
    profile.phone
      ? String.raw`\raisebox{-0.2\height}\faPhone\ ${escape(profile.phone)}`
      : '',
    profile.email
      ? String.raw`\href{mailto:${safeUrl(profile.email)}}{\raisebox{-0.2\height}\faEnvelope\ \underline{${escape(profile.email)}}}`
      : '',
    profile.linkedin
      ? String.raw`\href{${safeUrl(profile.linkedin)}}{\raisebox{-0.2\height}\faLinkedin\ \underline{${escape(stripProtocol(profile.linkedin))}}}`
      : '',
    profile.github
      ? String.raw`\href{${safeUrl(profile.github)}}{\raisebox{-0.2\height}\faGithub\ \underline{${escape(stripProtocol(profile.github))}}}`
      : '',
    profile.location
      ? String.raw`\raisebox{-0.2\height}\faMapMarker* \ ${escape(profile.location)}`
      : '',
  ].filter(Boolean);

  if (!name && !contacts.length) {
    return '';
  }

  const contactLinesArr = contactLines(contacts)
    .map((line) => `    ${line.join(' ~ ')}`)
    .join(' \\\\\n');

  return String.raw`\begin{center}
${name ? `    {\\Huge \\scshape ${escape(name)}} \\\\ \\vspace{2pt}` : ''}
${title ? `    \\textbf{${escape(title)}} \\\\ \\vspace{3pt}` : ''}
${contacts.length ? `    \\small\n${contactLinesArr}` : ''}
    \vspace{-8pt}
\end{center}`;
}

export function renderHeaderSection(data: ResumeData, _template: ITemplate): string {
  return renderHeaderInternal(data.profile, data.title);
}
