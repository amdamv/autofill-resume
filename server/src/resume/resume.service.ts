import { Injectable, InternalServerErrorException, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { Tool, ToolUseBlock } from '@anthropic-ai/sdk/resources/messages';
import { GenerateResumeDto } from './dto/generate-resume.dto';

type ExperienceEntry = {
  company: string;
  position: string;
  dates: string;
  location: string;
  bullets: string[];
};

type TailoredResume = {
  summary: string;
  highlightedSkills: string[];
  tailoredBullets: string[];
  coverLetter: string;
  experienceEntries?: ExperienceEntry[];
};

const tailoredResumeSchema: Tool.InputSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: {
      type: 'string',
      description:
        'A professional profile summary tailored for this job, 3-4 lines maximum. Suitable for the "About Me" section.',
    },
    highlightedSkills: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of exactly 8 key skills matching this job posting, ranked by relevance.',
    },
    tailoredBullets: {
      type: 'array',
      items: { type: 'string' },
      description:
        '4-5 professional achievement bullet points for the work experience section. Incorporate language from the job description and metrics if possible.',
    },
    coverLetter: {
      type: 'string',
      description:
        'A highly short, engaging cover letter or recruiter introductory message (max 120 words).',
    },
    experienceEntries: {
      type: 'array',
      description: 'Optional: improved version of the candidate\'s work experience entries with polished bullets tailored to the job. Keep the same companies and positions, just improve the bullet wording and add relevant tech stack keywords.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          company: { type: 'string' },
          position: { type: 'string' },
          dates: { type: 'string' },
          location: { type: 'string' },
          bullets: {
            type: 'array',
            items: { type: 'string' },
            description: 'Improved achievement bullets for this role. Keep realistic — don\'t fabricate fake metrics, but improve wording and add relevant tech keywords from the job posting.',
          },
        },
        required: ['company', 'position', 'dates', 'location', 'bullets'],
      },
    },
  },
  required: ['summary', 'highlightedSkills', 'tailoredBullets', 'coverLetter'],
};

@Injectable()
export class ResumeService {
  private aiClient: Anthropic | null = null;

  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  private getAiClient(): Anthropic {
    if (!this.aiClient) {
      const apiKey = this.configService.get<string>('anthropicApiKey');
      if (!apiKey) {
        throw new BadRequestException(
          'ANTHROPIC_API_KEY environment variable is missing. Please configure it in your environment.',
        );
      }
      this.aiClient = new Anthropic({ apiKey });
    }
    return this.aiClient;
  }

  private toTailoredResume(value: unknown): TailoredResume {
    const parsed = (typeof value === 'string' ? JSON.parse(value) : value) as Partial<TailoredResume> & {
      tailored_resume?: Partial<TailoredResume>;
    };
    const payload = parsed.tailored_resume || parsed;
    const isValid =
      typeof payload.summary === 'string' &&
      Array.isArray(payload.highlightedSkills) &&
      payload.highlightedSkills.every((item) => typeof item === 'string') &&
      Array.isArray(payload.tailoredBullets) &&
      payload.tailoredBullets.every((item) => typeof item === 'string') &&
      typeof payload.coverLetter === 'string';

    if (!isValid) {
      throw new InternalServerErrorException('Claude returned an invalid resume payload');
    }

    const result: TailoredResume = {
      summary: payload.summary,
      highlightedSkills: payload.highlightedSkills,
      tailoredBullets: payload.tailoredBullets,
      coverLetter: payload.coverLetter,
    };

    if (Array.isArray(payload.experienceEntries)) {
      result.experienceEntries = payload.experienceEntries;
    }

    return result;
  }

  async generateTailoredResume(dto: GenerateResumeDto): Promise<TailoredResume> {
    const { profile, jobDescription, targetLanguage = 'ru' } = dto;
    const ai = this.getAiClient();
    const model = this.configService.get<string>('anthropicModel') || 'claude-sonnet-4-5-20250929';

    const skillsStr = Array.isArray(profile.skills) ? profile.skills.join(', ') : 'N/A';

    const experienceEntriesStr =
      Array.isArray(profile.experienceEntries) && profile.experienceEntries.length > 0
        ? profile.experienceEntries
            .map(
              (e) =>
                `- ${e.position || 'N/A'} at ${e.company || 'N/A'} (${e.dates || 'N/A'}, ${e.location || 'N/A'})\n  Achievements:\n    ${(e.bullets || []).map((b) => `• ${b}`).join('\n    ')}`,
            )
            .join('\n')
        : 'N/A';

    const prompt = `
You are an elite career development AI coach and expert resume writer.
Your goal is to perfectly tailor the candidate's profile to align with the provided Target Job Description.

Candidate Profile Information:
- Full Name: ${profile.name || 'N/A'}
- Professional Title: ${profile.title || 'N/A'}
- Contact Email: ${profile.email || 'N/A'}
- Contact Phone: ${profile.phone || 'N/A'}
- Core Skills: ${skillsStr}
- Working Experience Summary: ${profile.experience || 'N/A'}
- Work History (Companies):
${experienceEntriesStr}
- Education Information: ${profile.education || 'N/A'}

Target Job Description:
"""
${jobDescription}
"""

Target Language: ${targetLanguage === 'en' ? 'English' : 'Russian'}

Instructions:
1. Translate and write ALL fields in the response schema using the target language above.
2. Tailor the content perfectly: highlight overlapping skills, frame experiences using strong action verbs to meet the job description's goals.
3. Be professional, direct, and convincing. Keep summaries ready for copy-pasting.
4. IMPORTANT — Sound human, not AI-generated. Avoid these overused buzzwords and AI clichés:
   - "Spearheaded", "Leveraged", "Utilized", "Dashboard", "Leverage synergies"
   - "Demonstrated", "Proven track record", "Robust", "Streamline", "Optimize" (use sparingly)
   - "Passionate", "Results-driven", "Detail-oriented", "Team player" (generic traits)
   - "Harness", "Orchestrate", "Navigate", "Landscape", "Toolkit", "Holistic"
   - Long lists of buzzwords strung together

   Instead: write plainly and directly like a real professional would. Short sentences. Real impact.

5. REWRITE raw or simple experience descriptions into professional achievement bullets. If the user wrote something basic like "worked on backend" or "fixed bugs", transform it into a specific, measurable, professional-sounding bullet point that a senior hiring manager would respect. But keep it believable — don't fabricate metrics.
6. Every bullet point must feel like it was written by a human professional, not generated by an LLM.
7. IMPORTANT — Also improve the candidate's Work History (Companies) entries:
   - Rewrite each bullet to sound more professional and relevant to the target job
   - Add relevant tech stack keywords from the job description naturally into the bullets (e.g., "Built REST API" → "Built REST API with NestJS and PostgreSQL")
   - If a company has no bullets, suggest 2-3 realistic improvements based on the role
   - Keep the same company names, positions, dates, and locations — only change the bullet wording
   - Don't fabricate specific metrics, but do improve vague descriptions
   - Return the improved entries in the "experienceEntries" field of the response schema
`;

    try {
      const response = await ai.messages.create({
        model,
        max_tokens: 2000,
        thinking: { type: 'disabled' },
        system:
          'Use the format_tailored_resume tool exactly once with the finished tailored resume. Do not add commentary.',
        messages: [{ role: 'user', content: prompt }],
        tools: [
          {
            name: 'format_tailored_resume',
            description: 'Return the tailored resume content in the exact schema required by the app.',
            input_schema: tailoredResumeSchema,
          },
        ],
        tool_choice: {
          type: 'tool',
          name: 'format_tailored_resume',
          disable_parallel_tool_use: true,
        },
      });

      const toolUse = response.content.find(
        (block): block is ToolUseBlock =>
          block.type === 'tool_use' && block.name === 'format_tailored_resume',
      );

      if (toolUse) {
        return this.toTailoredResume(toolUse.input);
      }

      const text = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')
        .trim();

      if (!text) {
        throw new InternalServerErrorException('No structured response received from Claude');
      }

      return this.toTailoredResume(text);
    } catch (error: any) {
      console.error('Error generating tailored resume:', error);
      throw new InternalServerErrorException(
        error?.message || 'Internal server error during resume tailoring',
      );
    }
  }
}
