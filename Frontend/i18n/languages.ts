export const SUPPORTED_LANGUAGES = [
  {
    code: 'ru',
    label: 'Русский',
    shortLabel: 'RU',
    locale: 'ru-RU',
  },
  {
    code: 'en',
    label: 'English',
    shortLabel: 'EN',
    locale: 'en-US',
  },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export function getLanguageConfig(code: LanguageCode) {
  return SUPPORTED_LANGUAGES.find((language) => language.code === code) ?? SUPPORTED_LANGUAGES[0];
}
