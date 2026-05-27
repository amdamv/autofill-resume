const RESUME_TARGET_LANGUAGES: Record<string, string> = {
  ru: 'Russian',
  en: 'English',
};

export function getResumeTargetLanguageName(code?: string) {
  return RESUME_TARGET_LANGUAGES[code || 'ru'] ?? RESUME_TARGET_LANGUAGES.ru;
}
