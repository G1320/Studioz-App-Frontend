// Mapping of English subcategories to their Hebrew translations
// Used to filter items regardless of which language they were created in
const subcategoryTranslations: Record<string, string[]> = {
  'music production': ['music production', 'הפקה מוזיקלית'],
  'podcast recording': ['podcast recording', 'הקלטות פודקאסט'],
  'vocal & instrument recording': ['vocal & instrument recording', 'הקלטות שירה וכלים'],
  'mixing': ['mixing', 'מיקסינג'],
  'mastering': ['mastering', 'מאסטרינג'],
  'sound design': ['sound design', 'עיצוב סאונד'],
  'film post production': ['film post production', 'פוסט פרודקשן לסרטים'],
  'voiceover & dubbing': ['voiceover & dubbing', 'קריינות ודיבוב'],
  'studio rental': ['studio rental', 'השכרת אולפן'],
  'band rehearsal': ['band rehearsal', 'חזרות להרכבים'],
  'foley & sound effects': ['foley & sound effects', 'פולי ואפקטים קוליים'],
  'workshops & classes': ['workshops & classes', 'סדנאות ושיעורים'],
  'remote production services': ['remote production services', 'שירותי הפקה מרחוק'],
  'restoration & archiving': ['restoration & archiving', 'שחזור וארכיון']
};

/**
 * Get all valid translations for a subcategory (English + Hebrew)
 */
const getSubcategoryVariants = (subCategory: string): string[] => {
  const normalized = subCategory.toLowerCase();
  // Check if it's a known English key
  if (subcategoryTranslations[normalized]) {
    return subcategoryTranslations[normalized];
  }
  // Check if it's a Hebrew value, find its English key
  for (const variants of Object.values(subcategoryTranslations)) {
    if (variants.some((v) => v.toLowerCase() === normalized)) {
      return variants;
    }
  }
  // Fallback to just the input
  return [subCategory];
};

export const filterBySubcategory = <T extends { subCategories?: string[]; subCategory?: string }>(
  data: T[],
  subCategory: string
): T[] => {
  // Get all valid translations of the subcategory
  const validVariants = getSubcategoryVariants(subCategory).map((v) => v.toLowerCase());

  return data.filter((item) => {
    // Check if any of the item's subcategories match any valid variant
    const matchesArray = item.subCategories?.some((sub) =>
      validVariants.includes(sub.toLowerCase())
    );
    const matchesLegacy = item.subCategory
      ? validVariants.includes(item.subCategory.toLowerCase())
      : false;

    return matchesArray || matchesLegacy;
  });
};
