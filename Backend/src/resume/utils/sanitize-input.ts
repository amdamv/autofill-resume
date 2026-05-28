export const sanitizeInput = (value: unknown, maxLength = 4000): string => {
  if (typeof value !== 'string') {
    return 'N/A';
  }

  return value
    .slice(0, maxLength)
    .replace(/<\|.*?\|>/g, '')
    .replace(/system:|assistant:|user:/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim();
};
