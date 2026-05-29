const ALLOWED_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:'];

export function normalizeUrl(value?: string): string {
  const raw = (value ?? '').trim().replace(/[{}\s]/g, '');
  if (!raw) return '';

  // prepend https:// if no scheme present
  const withScheme = /^[a-z][a-z0-9.+-]*:/i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(withScheme);
    if (!ALLOWED_SCHEMES.includes(parsed.protocol)) return '';
    return parsed.href;
  } catch {
    return '';
  }
}
