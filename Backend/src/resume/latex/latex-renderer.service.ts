import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';
import { RenderResumeDto } from '../dto/render-resume.dto';

const execFileAsync = promisify(execFile);

type RenderOptions = {
  templateId: 'akhmad-classic' | 'compact-ats' | 'modern-balanced';
  filterId: 'source' | 'backend-core' | 'cloud-devops' | 'ai-middleware';
};

const templateSettings = {
  'akhmad-classic': {
    fontSize: '11pt',
    topMargin: '-0.65in',
    textHeight: '1.25in',
    sectionSpacing: '-4pt',
    title: 'FAANG Style Software Engineer',
  },
  'compact-ats': {
    fontSize: '11pt',
    topMargin: '-0.3in',
    textHeight: '3.0in',
    sectionSpacing: '-9pt',
    title: 'Compact ATS',
  },
  'modern-balanced': {
    fontSize: '11pt',
    topMargin: '-1.05in',
    textHeight: '0.5in',
    sectionSpacing: '-2pt',
    title: 'Modern Balanced',
  },
} as const;

const filterSkillPriority = {
  source: [
    'Node.js',
    'TypeScript',
    'NestJS',
    'Express',
    'SQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
  ],
  'backend-core': [
    'Node.js',
    'TypeScript',
    'NestJS',
    'Express',
    'SQL',
    'PostgreSQL',
    'Redis',
    'JWT',
  ],
  'cloud-devops': [
    'AWS',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Git',
    'GitHub',
    'Grafana',
    'Azure DevOps',
  ],
  'ai-middleware': [
    'Kafka',
    'NATS',
    'RabbitMQ',
    'WebSocket',
    'Redis',
    'OpenAI',
    'LangChain',
    'LLM pipelines',
  ],
} as const;

@Injectable()
export class LatexRendererService {
  async renderPdf(dto: RenderResumeDto): Promise<Buffer> {
    const options: RenderOptions = {
      templateId:
        (dto.templateId as RenderOptions['templateId']) || 'akhmad-classic',
      filterId: (dto.filterId as RenderOptions['filterId']) || 'source',
    };
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'resume-latex-'));
    const texPath = path.join(workDir, 'resume.tex');
    const pdfPath = path.join(workDir, 'resume.pdf');

    try {
      await fs.writeFile(texPath, this.renderTex(dto, options), 'utf8');
      await execFileAsync(
        'xelatex',
        [
          '-interaction=nonstopmode',
          '-halt-on-error',
          '-file-line-error',
          'resume.tex',
        ],
        {
          cwd: workDir,
          timeout: 30000,
          maxBuffer: 1024 * 1024 * 8,
        },
      );
      return await fs.readFile(pdfPath);
    } catch (error: any) {
      const log = await fs
        .readFile(path.join(workDir, 'resume.log'), 'utf8')
        .catch(() => '');
      console.error(
        'LaTeX render failed:',
        error?.message || error,
        log.slice(-3000),
      );
      throw new InternalServerErrorException(
        'Failed to render LaTeX resume PDF',
      );
    } finally {
      await fs
        .rm(workDir, { recursive: true, force: true })
        .catch(() => undefined);
    }
  }

  renderTex(dto: RenderResumeDto, options: RenderOptions): string {
    const settings = templateSettings[options.templateId];
    const profile = dto.profile || {};
    const resume = dto.resume || {};
    const skills = this.prioritizeSkills(
      [
        ...new Set([
          ...this.cleanArray(resume.highlightedSkills),
          ...this.cleanArray(profile.skills),
        ]),
      ],
      options.filterId,
    );

    const bullets = this.cleanArray(resume.tailoredBullets).slice(
      0,
      options.templateId === 'compact-ats' ? 5 : 7,
    );
    const title = this.clean(resume.jobTitle) || this.clean(profile.title);
    const experienceSections = this.buildExperienceSections(
      dto,
      bullets,
      title,
    );
    const skillGroups = this.groupSkills(skills);
    const projects = this.buildProjects(dto, skills);
    const certificates = this.buildCertificates(dto, profile);
    const header = this.renderHeader(profile, title);
    const aboutSection = this.renderAboutSection(resume.summary);
    const portfolioCats = dto.portfolioCategorizedSkills?.length
      ? dto.portfolioCategorizedSkills
      : resume.categorizedSkills?.length
        ? resume.categorizedSkills
        : null;
    const skillsSection = portfolioCats
      ? this.renderCategorizedSkillsSection(portfolioCats)
      : this.renderSkillsSection(skillGroups);
    const experienceSection = experienceSections.length
      ? String.raw`\section{Experience}
  \resumeSubHeadingListStart
${experienceSections.map((section) => this.renderExperienceSection(section)).join('\n\n')}
  \resumeSubHeadingListEnd
\vspace{-10pt}`
      : '';
    const projectsSection = projects.length
      ? String.raw`\section{Projects}
  \resumeSubHeadingListStart
${projects.map((project) => this.renderProjectSection(project)).join('\n\n')}
  \resumeSubHeadingListEnd
\vspace{-10pt}`
      : '';
    const educationSection = this.renderEducationSection(profile.education);
    const certificatesSection = certificates.length
      ? String.raw`\section{Certificates}
\begin{itemize}[leftmargin=0.15in, label={}, itemsep=1pt, topsep=1pt]
  \small{
${certificates.map((certificate) => `    \\item{\\textbf{${this.escape(certificate)}}\\vspace{-5pt}}`).join('\n')}
  }
\end{itemize}`
      : '';

    return String.raw`\documentclass[letterpaper,${settings.fontSize}]{article}

\usepackage{fontspec}
\usepackage{polyglossia}

\setmainlanguage{english}
\setotherlanguage{russian}

\IfFontExistsTF{Arial}
  {\setmainfont{Arial}}
  {\setmainfont{DejaVu Sans}}
\defaultfontfeatures{Ligatures=TeX}
\usepackage[letterpaper,margin=0.55in]{geometry}
\usepackage{latexsym}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage{fontawesome5}
\usepackage{microtype}
\setlength{\columnsep}{-1pt}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}
\setlength{\parskip}{0pt}
\sloppy
\emergencystretch=2em

\titleformat{\section}{
  \vspace{${settings.sectionSpacing}}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]


\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small#2} \\
      \textit{\small#3} & \textit{\small#4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\newcommand{\resumeProjectHeading}[2]{
  \vspace{-2pt}\item
    \begin{tabular*}{1.0\textwidth}{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small#2} \\
    \end{tabular*}\vspace{-7pt}
}

\renewcommand\labelitemi{$\vcenter{\hbox{\tiny$\bullet$}}$}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

${header}
${aboutSection}
${skillsSection}
${experienceSection}
${projectsSection}
${educationSection}
${certificatesSection}

\end{document}
`;
  }

  private renderHeader(
    profile: RenderResumeDto['profile'],
    title: string,
  ): string {
    const name = this.clean(profile.name);
    const jobTitle = this.clean(title);

    const raw = (profile as any).socialLinks;
    const socialLinkEntries = (Array.isArray(raw) ? raw : [])
      .map((link: any) => ({
        icon: this.socialIcon(link.platform),
        url: this.normalizeUrl(link.url),
        label: this.clean(link.label) || this.stripProtocol(this.clean(link.url)),
      }))
      .filter((link: { url: string; label: string }) => link.url && link.label)
      .map(
        (link: { url: string; label: string; icon: string }) =>
          String.raw`\href{${this.safeUrl(link.url)}}{\raisebox{-0.2\height}${link.icon}\ \underline{${this.escape(link.label)}}}`,
      );

    const contacts = [
      profile.phone
        ? String.raw`\raisebox{-0.2\height}\faPhone\ ${this.escape(profile.phone)}`
        : '',
      profile.email
        ? String.raw`\href{mailto:${this.safeUrl(profile.email)}}{\raisebox{-0.2\height}\faEnvelope\ \underline{${this.escape(profile.email)}}}`
        : '',
      profile.linkedin
        ? String.raw`\href{${this.safeUrl(profile.linkedin)}}{\raisebox{-0.2\height}\faLinkedin\ \underline{${this.escape(this.stripProtocol(profile.linkedin))}}}`
        : '',
      profile.github
        ? String.raw`\href{${this.safeUrl(profile.github)}}{\raisebox{-0.2\height}\faGithub\ \underline{${this.escape(this.stripProtocol(profile.github))}}}`
        : '',
      ...socialLinkEntries,
      profile.location
        ? String.raw`\raisebox{-0.2\height}\faMapMarker* \ ${this.escape(profile.location)}`
        : '',
    ].filter(Boolean);

    if (!name && !jobTitle && !contacts.length) {
      return '';
    }

    const contactLines = this.contactLines(contacts)
      .map((line) => `    ${line.join(' ~ ')}`)
      .join(' \\\\\n');

    return String.raw`\begin{center}
${name ? `    {\\Huge \\scshape ${this.escape(name)}} \\\\ \\vspace{2pt}` : ''}
${jobTitle ? `    \\textbf{${this.escape(jobTitle)}} \\\\ \\vspace{3pt}` : ''}
${contacts.length ? `    \\footnotesize\n${contactLines}` : ''}
    \vspace{-8pt}
\end{center}`;
  }

  private contactLines(contacts: string[]): string[][] {
    return [contacts];
  }

  private renderAboutSection(summary?: string): string {
    const cleanSummary = this.clean(summary);
    if (!cleanSummary) return '';

    return String.raw`\section{About}
\small{${this.escape(cleanSummary)}}
\vspace{-5pt}`;
  }

  private renderSkillsSection(
    skillGroups: ReturnType<LatexRendererService['groupSkills']>,
  ): string {
    const rows = [
      { label: 'Backend', values: skillGroups.backend },
      { label: 'Frontend', values: skillGroups.frontend },
      { label: 'Databases', values: skillGroups.databases },
      { label: 'DevOps', values: skillGroups.devops },
      { label: 'Cloud', values: skillGroups.cloud },
      { label: 'AI/LLM Tools', values: skillGroups.ai },
    ]
      .filter((row) => row.values.length)
      .map(
        (row) =>
          `    \\textbf{${row.label}:} ${this.escape(row.values.join(', '))}`,
      )
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

  private renderCategorizedSkillsSection(
    categories: { category: string; skills: string[] }[],
  ): string {
    const rows = categories
      .filter((cat) => cat.skills.length > 0)
      .map(
        (cat) =>
          `    \\textbf{${this.escape(cat.category)}:} ${this.escape(cat.skills.join(', '))}`,
      )
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

  private renderEducationSection(education?: string): string {
    if (!this.clean(education)) return '';

    return String.raw`\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {${this.escape(this.educationSchool(education))}}{${this.escape(this.educationDates(education))}}
      {${this.escape(this.educationDegree(education))}}{${this.escape(this.educationLocation(education))}}
  \resumeSubHeadingListEnd
\vspace{-8pt}`;
  }

  private prioritizeSkills(
    skills: string[],
    filterId: RenderOptions['filterId'],
  ): string[] {
    const priority = filterSkillPriority[filterId];
    return [
      ...priority.filter((skill) =>
        skills.some((item) => item.toLowerCase() === skill.toLowerCase()),
      ),
      ...skills.filter(
        (skill) =>
          !priority.some((item) => item.toLowerCase() === skill.toLowerCase()),
      ),
    ];
  }

  private buildExperienceSections(
    dto: RenderResumeDto,
    bullets: string[],
    title: string,
  ) {
    const explicitExperience = ((dto.resume || {}).experience || [])
      .map((item) => ({
        company: this.clean(item.company),
        dates: this.clean(item.dates),
        role: this.clean(item.position),
        location: this.clean(item.location),
        bullets: this.cleanArray(item.bullets),
      }))
      .filter(
        (item) =>
          item.company ||
          item.dates ||
          item.role ||
          item.location ||
          item.bullets.length,
      );

    if (explicitExperience.length) {
      return explicitExperience;
    }

    const companyName = this.clean((dto.resume || {}).companyName);
    const normalizedBullets = this.cleanArray(bullets);

    if (!companyName && !title && !normalizedBullets.length) {
      return [];
    }

    return [
      {
        company: companyName,
        dates: '',
        role: title,
        location: this.clean((dto.profile || {}).location),
        bullets: normalizedBullets.slice(0, 4),
      },
    ];
  }

  private renderExperienceSection(section: {
    company: string;
    dates: string;
    role: string;
    location: string;
    bullets: string[];
  }): string {
    const bullets = this.cleanArray(section.bullets);
    const bulletList = bullets.length
      ? String.raw`      \resumeItemListStart
${bullets.map((bullet) => `        \\resumeItem{${this.escape(bullet)}}`).join('\n')}
      \resumeItemListEnd`
      : '';

    return String.raw`    \resumeSubheading
      {${this.escape(section.company)}}{${this.escape(section.dates)}}
      {${this.escape(section.role)}}{${this.escape(section.location)}}
${bulletList}`;
  }

  private buildProjects(dto: RenderResumeDto, skills: string[]) {
    return ((dto.resume || {}).projects || [])
      .map((project) => ({
        name: this.clean(project.name),
        stack: this.clean(project.stack || skills.slice(0, 4).join(', ')),
        bullets: this.cleanArray(project.bullets),
      }))
      .filter(
        (project) => project.name || project.stack || project.bullets.length,
      );
  }

  private renderProjectSection(project: {
    name: string;
    stack: string;
    bullets: string[];
  }): string {
    const bullets = this.cleanArray(project.bullets);
    const bulletList = bullets.length
      ? String.raw`      \resumeItemListStart
${bullets.map((bullet) => `        \\resumeItem{${this.escape(bullet)}}`).join('\n')}
      \resumeItemListEnd`
      : '';

    return String.raw`    \resumeProjectHeading
      {${this.escape(project.name)}}{${this.escape(project.stack)}}
${bulletList}`;
  }

  private buildCertificates(dto: RenderResumeDto, profile?: RenderResumeDto['profile']): string[] {
    const p = profile as any;
    const profileEntries = p?.certificateEntries;
    if (profileEntries && Array.isArray(profileEntries) && profileEntries.length) {
      return profileEntries
        .filter((c: any) => this.clean(c.name))
        .map((c: any) => {
          const parts = [this.clean(c.name), this.clean(c.issuer), this.clean(c.date)].filter(Boolean);
          return parts.join(', ');
        });
    }

    const explicitCertificates = this.cleanArray(
      (dto.resume || {}).certificates,
    );
    if (explicitCertificates.length) {
      return explicitCertificates;
    }

    const text = `${(dto.profile || {}).experience || ''} ${(dto.resume || {}).coverLetter || ''}`;
    const matches = text.match(
      /(?:Certificate|Certification|Course)s?:?\s*([^.;\n]+)/i,
    );
    if (matches?.[1]) {
      return matches[1]
        .split(/,| and /)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3);
    }

    return [];
  }

  private linkedinLabel(name: string): string {
    const slug = this.slugifyName(name) || 'yourlinkedin';
    return `linkedin.com/in/${slug}`;
  }

  private linkedinUrl(name: string): string {
    return `https://${this.linkedinLabel(name)}/`;
  }

  private githubLabel(name: string): string {
    const slug = this.slugifyName(name) || 'example';
    return `github.com/${slug}`;
  }

  private githubUrl(name: string): string {
    return `https://${this.githubLabel(name)}/`;
  }

  private slugifyName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private locationFromEducation(education?: string): string {
    const parts = (education || '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      return parts.slice(-2).join(', ');
    }
    return '';
  }

  private educationSchool(education?: string): string {
    return education?.split(',')[0]?.trim() || '';
  }

  private educationDegree(education?: string): string {
    return education?.split(',')[1]?.trim() || '';
  }

  private educationDates(education?: string): string {
    const match = education?.match(
      /[A-Z][a-z]{2}\.?\s+\d{4}\s*-\s*[A-Z][a-z]{2}\.?\s+\d{4}/,
    );
    return match?.[0] || '';
  }

  private educationLocation(education?: string): string {
    return this.locationFromEducation(education);
  }

  private groupSkills(skills: string[]) {
    const categories = [
      { key: 'backend', keywords: ['Node', 'TypeScript', 'Java', 'Python', 'Nest', 'Express', 'GraphQL', 'REST', 'Microservices', 'Kafka', 'Rabbit', 'NATS', 'Go', 'Rust', 'C#', 'PHP', 'Ruby'], max: 9 },
      { key: 'frontend', keywords: ['React', 'Next', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Redux', 'Vue', 'Angular', 'Svelte', 'Zustand'], max: 7 },
      { key: 'databases', keywords: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL', 'DynamoDB', 'Firebase', 'Cassandra'], max: 7 },
      { key: 'devops', keywords: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'GitLab', 'Linux', 'Observability', 'Grafana', 'Jenkins', 'Terraform', 'Ansible'], max: 8 },
      { key: 'cloud', keywords: ['AWS', 'GCP', 'Azure', 'S3', 'Lambda', 'SQS', 'SNS', 'Cloud Run', 'Oracle Cloud', 'DigitalOcean', 'Heroku', 'Vercel'], max: 8 },
      { key: 'ai', keywords: ['OpenAI', 'LangChain', 'LLM', 'Vector', 'RAG', 'Prompt', 'GenAI', 'Claude', 'Neural', 'TensorFlow', 'PyTorch'], max: 7 },
    ];

    const assigned = new Set<number>();
    const result: Record<string, string[]> = {
      backend: [],
      frontend: [],
      databases: [],
      devops: [],
      cloud: [],
      ai: [],
      other: [],
    };

    for (const cat of categories) {
      for (let i = 0; i < skills.length && result[cat.key].length < cat.max; i++) {
        if (assigned.has(i)) continue;
        if (cat.keywords.some((kw) => skills[i].toLowerCase().includes(kw.toLowerCase()))) {
          result[cat.key].push(skills[i]);
          assigned.add(i);
        }
      }
    }

    for (let i = 0; i < skills.length; i++) {
      if (!assigned.has(i)) result.other.push(skills[i]);
    }

    return result;
  }

  private clean(value?: string | null): string {
    return (value || '').trim();
  }

  private cleanArray(values?: string[] | null): string[] {
    return (values || []).map((value) => this.clean(value)).filter(Boolean);
  }

  private stripProtocol(value: string): string {
    return value.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  private escape(value?: string): string {
    return (value || '')
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  }

  private safeUrl(value?: string): string {
    return (value || '').replace(/[{}\s]/g, '');
  }

  private normalizeUrl(value?: string): string {
    const url = this.safeUrl(this.clean(value));
    if (!url) return '';
    if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url;
    return `https://${url}`;
  }

  private socialIcon(platform?: string): string {
    const icons: Record<string, string> = {
      linkedin: '\\faLinkedin',
      github: '\\faGithub',
      x: '\\faTwitter',
      twitter: '\\faTwitter',
      youtube: '\\faYoutube',
      telegram: '\\faTelegram',
      instagram: '\\faGlobe',
      stackoverflow: '\\faGlobe',
      website: '\\faGlobe',
      other: '\\faGlobe',
    };
    return icons[this.clean(platform).toLowerCase()] || '\\faGlobe';
  }
}
