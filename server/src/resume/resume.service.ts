import { Injectable, InternalServerErrorException, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { Tool, ToolUseBlock } from '@anthropic-ai/sdk/resources/messages';
import { GenerateResumeDto } from './dto/generate-resume.dto';

type TailoredResume = {
  summary: string;
  highlightedSkills: string[];
  tailoredBullets: string[];
  coverLetter: string;
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

    return payload as TailoredResume;
  }

  async generateTailoredResume(dto: GenerateResumeDto): Promise<TailoredResume> {
    const { profile, jobDescription, targetLanguage = 'ru' } = dto;
    const ai = this.getAiClient();
    const model = this.configService.get<string>('anthropicModel') || 'claude-sonnet-4-5-20250929';

    const skillsStr = Array.isArray(profile.skills) ? profile.skills.join(', ') : 'N/A';

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
`;

    try {
      const response = await ai.messages.create({
        model,
        max_tokens: 1200,
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
