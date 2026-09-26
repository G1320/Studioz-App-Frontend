import { Studio } from 'src/types/index';
import { useSaveStudioMutation } from '@shared/hooks/mutations/studios/studioMutations';

type SavePatch = Partial<Studio>;

/**
 * Section saves send **only the patch** via PATCH — never a full GET→PUT echo.
 * Full PUT still runs create-oriented Joi and rejects empty optional strings,
 * null numbers, description slashes, enriched items, etc.
 */
export function useStudioSectionSave(studio: Studio | undefined, studioId: string) {
  const saveMutation = useSaveStudioMutation(studioId);

  const savePatch = (patch: SavePatch) => {
    if (!studio?._id) return;

    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      clean[key] = value;
    }

    // Omit empty optional media strings (PATCH handler also nulls these)
    if (clean.coverAudioFile === '') {
      delete clean.coverAudioFile;
    }
    if (Array.isArray(clean.galleryAudioFiles)) {
      clean.galleryAudioFiles = (clean.galleryAudioFiles as string[]).filter((u) => !!u?.trim());
    }

    // Hours patch: never send nested Mongo _ids
    if (clean.studioAvailability && typeof clean.studioAvailability === 'object') {
      const avail = clean.studioAvailability as {
        days?: string[];
        times?: Array<{ start?: string; end?: string; _id?: string }>;
      };
      clean.studioAvailability = {
        days: avail.days,
        times: (avail.times || []).map(({ start, end }) => ({ start, end }))
      };
    }

    if (Object.keys(clean).length === 0) return;
    saveMutation.mutate(clean as Partial<Studio>);
  };

  return {
    savePatch,
    isSaving: saveMutation.isPending
  };
}
