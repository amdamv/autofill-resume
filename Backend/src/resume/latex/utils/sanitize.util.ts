export function clean(value?: string | null): string {
  return (value || '').trim();
}

export function cleanArray(values?: string[] | null): string[] {
  return (values || []).map((v) => clean(v)).filter(Boolean);
}
