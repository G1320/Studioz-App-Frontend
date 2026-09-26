import { Studio } from 'src/types/index';
import { useSaveStudioMutation } from '@shared/hooks/mutations/studios/studioMutations';

type SavePatch = Partial<Studio>;

/** GET-hydrated fields that Joi `validateStudio` rejects (unknown keys → 400). */
const STRIP_KEYS = [
  'languageToggle',
  'houseRules',
  'active',
  'createdBy',
  'averageRating',
  'reviewCount',
  'totalBookings',
  '__v',
  'items', // GET items are enriched; omit so findByIdAndUpdate keeps existing
  'sellerId',
  'updatedAt'
] as const;

/**
 * Merge a section patch onto the current studio and PUT a clean document.
 * Strips server-only / enriched fields so validation accepts the payload.
 */
export function useStudioSectionSave(studio: Studio | undefined, studioId: string) {
  const saveMutation = useSaveStudioMutation(studioId);

  const savePatch = (patch: SavePatch) => {
    if (!studio?._id) return;
    const merged = { ...studio, ...patch } as Record<string, unknown>;
    for (const key of STRIP_KEYS) {
      delete merged[key];
    }
    saveMutation.mutate(merged as unknown as Studio);
  };

  return {
    savePatch,
    isSaving: saveMutation.isPending
  };
}
