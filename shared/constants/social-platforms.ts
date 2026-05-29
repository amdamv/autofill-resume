export const SOCIAL_PLATFORM_ICONS: Record<string, string> = {
  linkedin: 'linkedin',
  github: 'github',
  x: 'twitter',
  twitter: 'twitter',
  youtube: 'youtube',
  telegram: 'telegram',
  instagram: 'globe',
  stackoverflow: 'globe',
  website: 'globe',
  other: 'globe',
};

export function socialIcon(platform?: string): string {
  return SOCIAL_PLATFORM_ICONS[(platform ?? '').toLowerCase()] || 'globe';
}
