import { Tool } from '@anthropic-ai/sdk/resources/messages';

export const tailoredResumeSchema: Tool.InputSchema = {
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
      description:
        'List of exactly 8 key skills matching this job posting, ranked by relevance.',
    },
    categorizedSkills: {
      type: 'array',
      description:
        'Skills organized into categories relevant to this job. Create 3-6 category groups based on the job requirements and tech stack. Each category should have 1-5 skills.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          category: {
            type: 'string',
            description:
              'A short category name like "Backend", "Frontend", "Databases", "Cloud", "AI/ML", "DevOps", or any relevant category based on the job posting.',
          },
          skills: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Skills belonging to this category. Include skills from the candidate profile AND add relevant missing skills from the job description.',
          },
        },
        required: ['category', 'skills'],
      },
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
      description:
        "Optional: improved version of the candidate's work experience entries with polished bullets tailored to the job. Keep the same companies and positions, just improve the bullet wording and add relevant tech stack keywords.",
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
            description:
              "Improved achievement bullets for this role. Keep realistic — don't fabricate fake metrics, but improve wording and add relevant tech keywords from the job posting.",
          },
        },
        required: ['company', 'position', 'dates', 'location', 'bullets'],
      },
    },
  },
  required: ['summary', 'highlightedSkills', 'tailoredBullets', 'coverLetter'],
};
