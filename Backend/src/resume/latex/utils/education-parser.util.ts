import { clean } from './sanitize.util';

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function locationFromEducation(education?: string): string {
  const parts = (education || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return parts.slice(-2).join(', ');
  }
  return '';
}

export function educationSchool(education?: string): string {
  return clean(education?.split(',')[0]?.trim());
}

export function educationDegree(education?: string): string {
  return clean(education?.split(',')[1]?.trim());
}

export function educationDates(education?: string): string {
  const match = education?.match(
    /[A-Z][a-z]{2}\.?\s+\d{4}\s*-\s*[A-Z][a-z]{2}\.?\s+\d{4}/,
  );
  return match?.[0] || '';
}

export function educationLocation(education?: string): string {
  return locationFromEducation(education);
}

export function linkedinLabel(name: string): string {
  const slug = slugifyName(name) || 'yourlinkedin';
  return `linkedin.com/in/${slug}`;
}

export function linkedinUrl(name: string): string {
  return `https://${linkedinLabel(name)}/`;
}

export function githubLabel(name: string): string {
  const slug = slugifyName(name) || 'example';
  return `github.com/${slug}`;
}

export function githubUrl(name: string): string {
  return `https://${githubLabel(name)}/`;
}
