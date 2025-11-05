/**
 * Generate URL-friendly slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Generate unique slug by adding number suffix if needed
 */
export const generateUniqueSlug = (
  baseSlug: string,
  existingSlugs: string[]
): string => {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * Auto-generate slug from product title
 */
export const generateProductSlug = (title: string): string => {
  return generateSlug(title);
};

/**
 * Auto-generate slug from category name
 */
export const generateCategorySlug = (name: string): string => {
  return generateSlug(name);
};
