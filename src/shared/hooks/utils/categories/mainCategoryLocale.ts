/** Canonical English labels stored in the database for main categories. */
export const MAIN_CATEGORY_EN = {
  music: 'Music / Podcast Studio',
  photo: 'Photo / Video Studio'
} as const;

/** Known Hebrew labels (legacy + current copy). */
export const MAIN_CATEGORY_HE = {
  music: 'סטודיו מוזיקה / פודקאסט',
  photo: 'סטודיו צילום / וידאו'
} as const;

const MUSIC_VARIANTS = new Set<string>([MAIN_CATEGORY_EN.music, MAIN_CATEGORY_HE.music]);
const PHOTO_VARIANTS = new Set<string>([MAIN_CATEGORY_EN.photo, MAIN_CATEGORY_HE.photo]);

export function isMusicMainCategory(category: string, currentMusicLabel?: string): boolean {
  return MUSIC_VARIANTS.has(category) || (currentMusicLabel ? category === currentMusicLabel : false);
}

export function isPhotoMainCategory(category: string, currentPhotoLabel?: string): boolean {
  return PHOTO_VARIANTS.has(category) || (currentPhotoLabel ? category === currentPhotoLabel : false);
}

/** Map any known main-category label to the label for the active UI language. */
export function toCurrentMainCategoryLabel(
  category: string,
  currentMusicLabel: string,
  currentPhotoLabel: string
): string {
  if (isMusicMainCategory(category, currentMusicLabel)) return currentMusicLabel;
  if (isPhotoMainCategory(category, currentPhotoLabel)) return currentPhotoLabel;
  return category;
}

/** Map any known main-category label to the canonical English value for storage. */
export function toEnglishMainCategory(category: string): string {
  if (isMusicMainCategory(category)) return MAIN_CATEGORY_EN.music;
  if (isPhotoMainCategory(category)) return MAIN_CATEGORY_EN.photo;
  return category;
}
