import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';

import { RenderResumeDto } from '../../dto/render-resume.dto';
import type { ResumeData, ITemplate, RenderOptions, FilterId } from '../types';

import { getTemplate } from './template.registry';
import { SECTION_RENDERERS } from './section-renderer.registry';

import { clean, cleanArray } from '../utils/sanitize.util';
import { prioritizeSkills, groupSkills } from '../utils/skill-grouping.util';

const execFileAsync = promisify(execFile);

/**
 * Lightweight service that orchestrates the full LaTeX resume render pipeline:
 * 1. Load the template from the dynamic registry
 * 2. Prepare DTO data into a typed ResumeData object
 * 3. Render each section via the section registry
 * 4. Compile with pdflatex
 * 5. Return the PDF buffer
 */
@Injectable()
export class LatexRendererService {
  async renderPdf(dto: RenderResumeDto): Promise<Buffer> {
    const options: RenderOptions = {
      templateId: dto.templateId || 'akhmad-classic',
      filterId: (dto.filterId as FilterId) || 'source',
    };

    const template = getTemplate(options.templateId);
    const data = this.prepareData(dto, options);
    const tex = this.renderTex(data, template);

    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'resume-latex-'));
    const texPath = path.join(workDir, 'resume.tex');
    const pdfPath = path.join(workDir, 'resume.pdf');

    try {
      await fs.writeFile(texPath, tex, 'utf8');
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
    } catch (error: unknown) {
      const log = await fs
        .readFile(path.join(workDir, 'resume.log'), 'utf8')
        .catch(() => '');
      const message = error instanceof Error ? error.message : String(error);
      console.error('LaTeX render failed:', message, log.slice(-3000));
      throw new InternalServerErrorException(
        'Failed to render LaTeX resume PDF',
      );
    } finally {
      await fs
        .rm(workDir, { recursive: true, force: true })
        .catch(() => undefined);
    }
  }

  private prepareData(
    dto: RenderResumeDto,
    options: RenderOptions,
  ): ResumeData {
    const profile = dto.profile || {};
    const resume = dto.resume || {};

    const skills = prioritizeSkills(
      [
        ...new Set([
          ...cleanArray(resume.highlightedSkills),
          ...cleanArray(profile.skills),
        ]),
      ],
      options.filterId,
    );

    const maxBullets = options.templateId === 'compact-ats' ? 5 : 7;
    const bullets = cleanArray(resume.tailoredBullets).slice(0, maxBullets);
    const title = clean(resume.jobTitle) || clean(profile.title);
    const skillGroups = groupSkills(skills);

    const experienceEntries = this.buildExperienceEntries(dto, bullets, title);
    const projects = this.buildProjects(dto, skills);
    const certificates = this.buildCertificates(dto);

    return {
      profile,
      resume,
      title,
      skills,
      skillGroups,
      bullets,
      experienceEntries,
      projects,
      certificates,
    };
  }

  renderTex(data: ResumeData, template: ITemplate): string {
    const preamble = template.generatePreamble();
    const bodySections = template.sections
      .map((section) => {
        const renderer = SECTION_RENDERERS[section];
        if (!renderer) {
          console.warn(`No renderer registered for section: ${section}`);
          return '';
        }
        return renderer(data, template);
      })
      .filter(Boolean)
      .join('\n\n');

    return `${preamble}

\\begin{document}

${bodySections}

\\end{document}
`;
  }

  // Data preparation helpers
  private buildExperienceEntries(
    dto: RenderResumeDto,
    bullets: string[],
    title: string,
  ): ResumeData['experienceEntries'] {
    const explicitExperience = ((dto.resume || {}).experience || [])
      .map((item) => ({
        company: clean(item.company),
        dates: clean(item.dates),
        role: clean(item.position),
        location: clean(item.location),
        bullets: cleanArray(item.bullets),
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

    const companyName = clean((dto.resume || {}).companyName);
    const normalizedBullets = cleanArray(bullets);

    if (!companyName && !title && !normalizedBullets.length) {
      return [];
    }

    return [
      {
        company: companyName,
        dates: '',
        role: title,
        location: clean((dto.profile || {}).location),
        bullets: normalizedBullets.slice(0, 4),
      },
    ];
  }

  private buildProjects(
    dto: RenderResumeDto,
    skills: string[],
  ): ResumeData['projects'] {
    return ((dto.resume || {}).projects || [])
      .map((project) => ({
        name: clean(project.name),
        stack: clean(project.stack || skills.slice(0, 4).join(', ')),
        bullets: cleanArray(project.bullets),
      }))
      .filter(
        (project) => project.name || project.stack || project.bullets.length,
      );
  }

  private buildCertificates(dto: RenderResumeDto): string[] {
    const explicitCertificates = cleanArray((dto.resume || {}).certificates);
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
}
