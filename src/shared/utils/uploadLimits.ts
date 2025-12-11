interface ImageLimitOptions {
  files: File[];
  currentCount: number;
  isFreeTier: boolean;
  maxFreeImages?: number;
}

interface ImageLimitResult {
  allowedFiles: File[];
  blocked: number;
  remainingAfter?: number;
}

/**
 * Enforces image upload limits for free tier.
 * Returns the files that are allowed to upload and how many were blocked.
 */
export const enforceImageUploadLimit = ({
  files,
  currentCount,
  isFreeTier,
  maxFreeImages = 3
}: ImageLimitOptions): ImageLimitResult => {
  if (!isFreeTier) {
    return { allowedFiles: files, blocked: 0, remainingAfter: undefined };
  }

  const remaining = Math.max(0, maxFreeImages - currentCount);
  if (remaining <= 0) {
    return { allowedFiles: [], blocked: files.length, remainingAfter: 0 };
  }

  const allowedFiles = files.slice(0, remaining);
  const blocked = files.length - allowedFiles.length;

  return { allowedFiles, blocked, remainingAfter: remaining - allowedFiles.length };
};

interface MergeGalleryOptions {
  isFreeTier: boolean;
  maxFreeImages?: number;
}

/**
 * Merges and de-duplicates gallery images, respecting free-tier limits.
 */
export const mergeGalleryImages = (
  existing: string[],
  incoming: string[],
  { isFreeTier, maxFreeImages = 3 }: MergeGalleryOptions
): string[] => {
  const deduped = Array.from(new Set([...existing, ...incoming]));
  return isFreeTier ? deduped.slice(0, maxFreeImages) : deduped;
};

