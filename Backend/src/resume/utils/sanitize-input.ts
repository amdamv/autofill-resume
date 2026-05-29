export const sanitizeInput = (value: unknown, maxLength = 4000): string => {
  if (typeof value !== 'string') {
    return 'N/A';
  }

  return value
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, '') // HTML теги
    .replace(/<\|.*?\|>/g, '')  // LLM спец-токены
    .replace(/system:|assistant:|user:/gi, '')    // ролевые префиксы
    .replace(/```[\s\S]*?```/g, '')    // блоки кода
    .trim();
};
