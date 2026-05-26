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
        'pdflatex',
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
    const profile = dto.profile;
    const resume = dto.resume;
    const skills = this.prioritizeSkills(
      [...new Set([...resume.highlightedSkills, ...(profile.skills || [])])],
      options.filterId,
    );

    const bullets = resume.tailoredBullets.slice(
      0,
      options.templateId === 'compact-ats' ? 5 : 7,
    );
    const title = resume.jobTitle || profile.title;
    const experienceSections = this.buildExperienceSections(
      dto,
      bullets,
      title,
    );
    const skillGroups = this.groupSkills(skills);
    const projects = this.buildProjects(dto, skills);
    const certificates = this.buildCertificates(dto);

    return String.raw`\documentclass[letterpaper,${settings.fontSize}]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[english]{babel}
\usepackage{latexsym}
\IfFileExists{fullpage.sty}{\usepackage{fullpage}}{}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage{fontawesome5}
\setlength{\columnsep}{-1pt}
\IfFileExists{glyphtounicode.tex}{\input{glyphtounicode}}{}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1.19in}
\addtolength{\topmargin}{${settings.topMargin}}
\addtolength{\textheight}{${settings.textHeight}}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{${settings.sectionSpacing}}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

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

\begin{center}
    {\Huge \scshape ${this.escape(profile.name || 'Name Surname')}} \\ \vspace{2pt}
    \textbf{${this.escape(title || 'Software Engineer')}} \\ \vspace{3pt}
    \small
    \raisebox{-0.2\height}\faPhone\ ${this.escape(profile.phone || '123-456-7890')} ~
    \href{mailto:${this.safeUrl(profile.email || 'email@example.com')}}{\raisebox{-0.2\height}\faEnvelope\ \underline{${this.escape(profile.email || 'email@example.com')}}} ~
    \href{${this.safeUrl(this.linkedinUrl(profile.name))}}{\raisebox{-0.2\height}\faLinkedin\ \underline{${this.escape(this.linkedinLabel(profile.name))}}} ~
    \href{${this.safeUrl(this.githubUrl(profile.name))}}{\raisebox{-0.2\height}\faGithub\ \underline{${this.escape(this.githubLabel(profile.name))}}} ~
    \raisebox{-0.2\height}\faMapMarker* \ ${this.escape(this.locationFromEducation(profile.education))}
    \vspace{-8pt}
\end{center}

\section{About}
\small{
${this.escape(resume.summary || 'Software Engineer with experience building scalable, reliable, and maintainable production systems. Strong background in backend services, distributed architecture, cloud infrastructure, API design, and cross-functional delivery. Focused on measurable business impact, clean engineering practices, performance optimization, and high-quality user experiences.')}
}
\vspace{-6pt}

\section{Skills}
\begin{itemize}[leftmargin=0.15in, label={}, itemsep=1pt, topsep=1pt]
  \small{\item{
    \textbf{Backend:} ${this.escape(skillGroups.backend.join(', '))} \\
    \textbf{Frontend:} ${this.escape(skillGroups.frontend.join(', '))} \\
    \textbf{Databases:} ${this.escape(skillGroups.databases.join(', '))} \\
    \textbf{DevOps:} ${this.escape(skillGroups.devops.join(', '))} \\
    \textbf{Cloud:} ${this.escape(skillGroups.cloud.join(', '))} \\
    \textbf{AI/LLM Tools:} ${this.escape(skillGroups.ai.join(', '))}
  }}
\end{itemize}
\vspace{-14pt}

\section{Experience}
  \resumeSubHeadingListStart
${experienceSections.map((section) => this.renderExperienceSection(section)).join('\n\n')}
  \resumeSubHeadingListEnd
\vspace{-12pt}

\section{Projects}
  \resumeSubHeadingListStart
${projects.map((project) => this.renderProjectSection(project)).join('\n\n')}
  \resumeSubHeadingListEnd
\vspace{-12pt}

\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {${this.escape(this.educationSchool(profile.education))}}{${this.escape(this.educationDates(profile.education))}}
      {${this.escape(this.educationDegree(profile.education))}}{${this.escape(this.educationLocation(profile.education))}}
  \resumeSubHeadingListEnd
\vspace{-10pt}

\section{Certificates}
\begin{itemize}[leftmargin=0.15in, label={}, itemsep=1pt, topsep=1pt]
  \small{
${certificates.map((certificate) => `    \\item{\\textbf{${this.escape(certificate)}} -- Issuing Organization \\vspace{-5pt}}`).join('\n')}
  }
\end{itemize}

\end{document}
`;
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
    const companyName =
      dto.resume.companyName && dto.resume.companyName !== 'AI Suggested Target'
        ? dto.resume.companyName
        : 'Company 1';

    const normalizedBullets = bullets.length
      ? bullets
      : [
          'Achievement 1.',
          'Achievement 2.',
          'Achievement 3.',
          'Achievement 4.',
        ];

    return [
      {
        company: companyName,
        dates: 'Jan. 2024 -- Present',
        role: title || 'Full stack Developer',
        location: this.locationFromEducation(dto.profile.education),
        bullets: normalizedBullets.slice(0, 4),
      },
      {
        company: 'Company 2',
        dates: 'Jun. 2023 -- May 2024',
        role: title || 'Full stack Developer',
        location: this.locationFromEducation(dto.profile.education),
        bullets: [
          'Architected and developed scalable backend services, ensuring high availability and fault tolerance.',
          'Worked closely with the TeamLead to design core system components and choose practical technologies.',
          'Built secure authentication and authorization flows using JWT tokens.',
          'Integrated caching solutions to reduce API response times and improve user experience.',
        ],
      },
      {
        company: 'Company 3',
        dates: 'Jul. 2022 -- Apr. 2023',
        role: title || 'Full stack Developer',
        location: this.locationFromEducation(dto.profile.education),
        bullets: [
          'Mentored and onboarded new developers, accelerating their integration and technical growth.',
          'Developed scalable file upload and storage workflows for production applications.',
          'Optimized complex SQL queries, improving database performance under high traffic.',
          'Improved API documentation and testing workflows with Swagger, Postman, and automated checks.',
        ],
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
    return String.raw`    \resumeSubheading
      {${this.escape(section.company)}}{${this.escape(section.dates)}}
      {${this.escape(section.role)}}{${this.escape(section.location)}}
      \resumeItemListStart
${section.bullets.map((bullet) => `        \\resumeItem{${this.escape(bullet)}}`).join('\n')}
      \resumeItemListEnd`;
  }

  private buildProjects(dto: RenderResumeDto, skills: string[]) {
    const primaryStack = skills.slice(0, 4).join(', ') || 'Node.js, PostgreSQL, Redis, Docker';
    const aiStack = skills.some((skill) => /openai|langchain|llm|vector|rag/i.test(skill))
      ? skills.filter((skill) => /openai|langchain|llm|vector|rag|ai/i.test(skill)).slice(0, 4).join(', ')
      : 'OpenAI API, LangChain, Vector Search';

    return [
      {
        name: `${dto.resume.jobTitle || dto.profile.title || 'Scalable Job Processing Platform'}`,
        stack: primaryStack,
        bullets: [
          'Built a fault-tolerant platform with retries, rate limiting, and progress tracking for high-volume workloads.',
          'Improved processing throughput through batching, queue partitioning, and optimized database writes.',
        ],
      },
      {
        name: 'AI Knowledge Assistant',
        stack: aiStack,
        bullets: [
          'Developed a retrieval-augmented assistant for searching internal documentation with structured answers.',
          'Reduced average information lookup time through semantic search and reusable prompt templates.',
        ],
      },
    ];
  }

  private renderProjectSection(project: {
    name: string;
    stack: string;
    bullets: string[];
  }): string {
    return String.raw`    \resumeProjectHeading
      {${this.escape(project.name)}}{${this.escape(project.stack)}}
      \resumeItemListStart
${project.bullets.map((bullet) => `        \\resumeItem{${this.escape(bullet)}}`).join('\n')}
      \resumeItemListEnd`;
  }

  private buildCertificates(dto: RenderResumeDto): string[] {
    const text = `${dto.profile.experience} ${dto.resume.coverLetter}`;
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

    return ['Certificate 1', 'Certificate 2', 'Certificate 3'];
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
    return 'City, Country';
  }

  private educationSchool(education?: string): string {
    return education?.split(',')[0]?.trim() || 'Your State University';
  }

  private educationDegree(education?: string): string {
    return education?.split(',')[1]?.trim() || 'BSc in Computer Science';
  }

  private educationDates(education?: string): string {
    const match = education?.match(
      /[A-Z][a-z]{2}\.?\s+\d{4}\s*-\s*[A-Z][a-z]{2}\.?\s+\d{4}/,
    );
    return match?.[0] || 'Sep. 2001 -- June 2006';
  }

  private educationLocation(education?: string): string {
    return this.locationFromEducation(education);
  }

  private groupSkills(skills: string[]) {
    const has = (keywords: string[]) =>
      skills.filter((skill) =>
        keywords.some((keyword) =>
          skill.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );

    const backend = has([
      'Node',
      'TypeScript',
      'Java',
      'Python',
      'Nest',
      'Express',
      'GraphQL',
      'REST',
      'Microservices',
      'Kafka',
      'Rabbit',
      'NATS',
    ]).slice(0, 9);
    const frontend = has(['React', 'Next', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'State']).slice(0, 7);
    const databases = has(['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL']).slice(0, 7);
    const devops = has(['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'GitLab', 'Linux', 'Observability', 'Grafana']).slice(0, 8);
    const cloud = has([
      'AWS',
      'GCP',
      'Azure',
      'S3',
      'Lambda',
      'SQS',
      'SNS',
      'Cloud Run',
      'Oracle Cloud',
    ]).slice(0, 8);
    const ai = has(['OpenAI', 'LangChain', 'LLM', 'AI', 'Vector', 'RAG', 'Prompt']).slice(0, 7);

    return {
      backend: backend.length
        ? backend
        : ['Node.js', 'TypeScript', 'REST APIs', 'GraphQL', 'Microservices'],
      frontend: frontend.length
        ? frontend
        : ['React', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
      databases: databases.length
        ? databases
        : ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Query Optimization'],
      devops: devops.length
        ? devops
        : ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Linux', 'Observability'],
      cloud: cloud.length ? cloud : ['AWS', 'GCP', 'Azure', 'S3', 'Lambda', 'SQS'],
      ai: ai.length ? ai : ['OpenAI API', 'LangChain', 'Vector Databases', 'RAG'],
    };
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
}
