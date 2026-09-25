import { Studio } from 'src/types/index';
import { useSaveStudioMutation } from '@shared/hooks/mutations/studios/studioMutations';

type SavePatch = Partial<Studio>;

/**
 * Merge a section patch onto the current studio and PUT.
 * Always send a full document so backend PUT doesn't wipe fields.
 */
export function useStudioSectionSave(studio: Studio | undefined, studioId: string) {
  const saveMutation = useSaveStudioMutation(studioId);

  const savePatch = (patch: SavePatch) => {
    if (!studio?._id) return;
    const { languageToggle: _lt, houseRules: _hr, ...rest } = {
      ...studio,
      ...patch
    } as Studio & { languageToggle?: unknown; houseRules?: unknown };
    void _lt;
    void _hr;
    saveMutation.mutate(rest as Studio);
  };

  return {
    savePatch,
    isSaving: saveMutation.isPending
  };
}
