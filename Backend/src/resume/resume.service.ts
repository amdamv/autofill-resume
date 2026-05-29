import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import type { ToolUseBlock } from '@anthropic-ai/sdk/resources/messages';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import { getResumeTargetLanguageName } from './languages';
import { TailoredResume } from './types/resume-types';
import { tailoredResumeSchema } from './schemas/tailored-resume.schema';
import { sanitizeInput } from './utils/sanitize-input';
import { buildTailoredResumePrompt } from './prompts/tailored-resume.prompt';
import {
  DEFAULT_ANTHROPIC_MODEL,
  MAX_PROMPT_TOKENS,
} from './constants/ai.constants';

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
    const parsed = (
      typeof value === 'string' ? JSON.parse(value) : value
    ) as Partial<TailoredResume> & {
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
      throw new InternalServerErrorException(
        'Claude returned an invalid resume payload',
      );
    }

    const result: TailoredResume = {
      summary: payload.summary as string,
      highlightedSkills: payload.highlightedSkills as string[],
      tailoredBullets: payload.tailoredBullets as string[],
      coverLetter: payload.coverLetter as string,
    };

    if (Array.isArray(payload.experienceEntries)) {
      result.experienceEntries = payload.experienceEntries;
    }

    if (
      Array.isArray(payload.categorizedSkills) &&
      payload.categorizedSkills.every(
        (c: unknown) =>
          typeof c === 'object' &&
          c !== null &&
          typeof (c as any).category === 'string' &&
          Array.isArray((c as any).skills) &&
          (c as any).skills.every((s: unknown) => typeof s === 'string'),
      )
    ) {
      result.categorizedSkills = payload.categorizedSkills as {
        category: string;
        skills: string[];
      }[];
    }

    return result;
  }

  async generateTailoredResume(
    dto: GenerateResumeDto,
  ): Promise<TailoredResume> {
    const { profile, jobDescription, targetLanguage = 'ru' } = dto;
    const ai = this.getAiClient();
    const model =
      this.configService.get<string>('anthropicModel') ||
      DEFAULT_ANTHROPIC_MODEL;

    const skillsStr = Array.isArray(profile.skills)
      ? profile.skills.map((skill) => sanitizeInput(skill, 100)).join(', ')
      : 'N/A';

    const experienceEntriesStr =
      Array.isArray(profile.experienceEntries) &&
      profile.experienceEntries.length > 0
        ? profile.experienceEntries
            .map(
              (e) =>
                `- ${sanitizeInput(e.position, 120)} at ${sanitizeInput(e.company, 120)} (${sanitizeInput(e.dates, 80)}, ${sanitizeInput(e.location, 120)})\n  Achievements:\n    ${(e.bullets || [])
                  .slice(0, 4)
                  .map((b) => `• ${sanitizeInput(b, 150)}`)
                  .join('\n    ')}`,
            )
            .join('\n')
        : 'N/A';

    const sanitizedProfile = {
      name: sanitizeInput(profile.name, 120),
      title: sanitizeInput(profile.title, 120),
      experience: sanitizeInput(profile.experience, 3000),
      education: sanitizeInput(profile.education, 1500),
    };

    const sanitizedJobDescription = sanitizeInput(jobDescription, 8000);
    const targetLanguageName = getResumeTargetLanguageName(targetLanguage);

    const prompt = buildTailoredResumePrompt({
      name: sanitizedProfile.name,
      title: sanitizedProfile.title,
      skills: skillsStr,
      experience: sanitizedProfile.experience,
      experienceEntries: experienceEntriesStr,
      education: sanitizedProfile.education,
      jobDescription: sanitizedJobDescription,
      targetLanguage: targetLanguageName,
    });

    try {
      const response = await ai.messages.create({
        model,
        max_tokens: MAX_PROMPT_TOKENS,
        thinking: { type: 'disabled' },
        system: [
          {
            type: 'text',
            text: 'Use the format_tailored_resume tool exactly once with the finished tailored resume. Do not add commentary.',
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: prompt }],
        tools: [
          {
            name: 'format_tailored_resume',
            description:
              'Return the tailored resume content in the exact schema required by the app.',
            input_schema: tailoredResumeSchema,
            cache_control: { type: 'ephemeral' },
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
        throw new InternalServerErrorException(
          'No structured response received from Claude',
        );
      }

      return this.toTailoredResume(text);
    } catch (error: unknown) {
      console.error('Error generating tailored resume:', error);

      throw new InternalServerErrorException(
        'Internal server error during resume tailoring',
      );
    }
  }

  async generateTailoredResumeStream(
    dto: GenerateResumeDto,
    onEvent: (event: { type: string; data: any }) => void,
  ): Promise<TailoredResume> {
    const { profile, jobDescription, targetLanguage = 'ru' } = dto;
    const ai = this.getAiClient();
    const model =
      this.configService.get<string>('anthropicModel') ||
      DEFAULT_ANTHROPIC_MODEL;

    const skillsStr = Array.isArray(profile.skills)
      ? profile.skills.map((skill) => sanitizeInput(skill, 100)).join(', ')
      : 'N/A';

    const experienceEntriesStr =
      Array.isArray(profile.experienceEntries) &&
      profile.experienceEntries.length > 0
        ? profile.experienceEntries
            .map(
              (e) =>
                `- ${sanitizeInput(e.position, 120)} at ${sanitizeInput(e.company, 120)} (${sanitizeInput(e.dates, 80)}, ${sanitizeInput(e.location, 120)})\n  Achievements:\n    ${(e.bullets || [])
                  .slice(0, 4)
                  .map((b) => `• ${sanitizeInput(b, 150)}`)
                  .join('\n    ')}`,
            )
            .join('\n')
        : 'N/A';

    const sanitizedProfile = {
      name: sanitizeInput(profile.name, 120),
      title: sanitizeInput(profile.title, 120),
      experience: sanitizeInput(profile.experience, 3000),
      education: sanitizeInput(profile.education, 1500),
    };

    const sanitizedJobDescription = sanitizeInput(jobDescription, 8000);
    const targetLanguageName = getResumeTargetLanguageName(targetLanguage);

    const prompt = buildTailoredResumePrompt({
      name: sanitizedProfile.name,
      title: sanitizedProfile.title,
      skills: skillsStr,
      experience: sanitizedProfile.experience,
      experienceEntries: experienceEntriesStr,
      education: sanitizedProfile.education,
      jobDescription: sanitizedJobDescription,
      targetLanguage: targetLanguageName,
    });

    onEvent({
      type: 'progress',
      data: { step: 'analyzing', message: 'Analyzing job requirements...' },
    });

    try {
      const stream = ai.messages.stream({
        model,
        max_tokens: MAX_PROMPT_TOKENS,
        thinking: { type: 'disabled' },
        system: [
          {
            type: 'text',
            text: 'Use the format_tailored_resume tool exactly once with the finished tailored resume. Do not add commentary.',
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: prompt }],
        tools: [
          {
            name: 'format_tailored_resume',
            description:
              'Return the tailored resume content in the exact schema required by the app.',
            input_schema: tailoredResumeSchema,
            cache_control: { type: 'ephemeral' },
          },
        ],
        tool_choice: {
          type: 'tool',
          name: 'format_tailored_resume',
          disable_parallel_tool_use: true,
        },
      });

      onEvent({
        type: 'progress',
        data: { step: 'generating', message: 'Tailoring resume content...' },
      });

      const finalMessage = await stream.finalMessage();

      const toolUse = finalMessage.content.find(
        (block): block is ToolUseBlock =>
          block.type === 'tool_use' && block.name === 'format_tailored_resume',
      );

      if (toolUse) {
        const result = this.toTailoredResume(toolUse.input);
        onEvent({ type: 'result', data: result });
        return result;
      }

      const text = finalMessage.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')
        .trim();

      if (!text) {
        throw new InternalServerErrorException(
          'No structured response received from Claude',
        );
      }

      const result = this.toTailoredResume(text);
      onEvent({ type: 'result', data: result });
      return result;
    } catch (error: unknown) {
      console.error('Error in streaming resume generation:', error);
      onEvent({
        type: 'error',
        data: { message: 'Internal server error during resume tailoring' },
      });
      throw new InternalServerErrorException(
        'Internal server error during resume tailoring',
      );
    }
  }
}
