export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

export const generateUniqueSlug = (text: string, uniqueId?: string): string => {
  const slug = generateSlug(text);
  return uniqueId ? `${slug}-${uniqueId}` : slug;
};
