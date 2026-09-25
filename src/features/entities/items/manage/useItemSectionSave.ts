import { Item } from 'src/types/index';
import { useSaveItemMutation } from '@shared/hooks/mutations/items/itemMutations';

type SavePatch = Partial<Item>;

/**
 * Merge a section patch onto the current item and PUT.
 * Always send a full document so backend PUT doesn't wipe fields.
 */
export function useItemSectionSave(item: Item | undefined, itemId: string) {
  const saveMutation = useSaveItemMutation(itemId, item?.studioId);

  const savePatch = (patch: SavePatch) => {
    if (!item?._id) return;
    const { languageToggle: _lt, ...rest } = {
      ...item,
      ...patch
    } as Item & { languageToggle?: unknown };
    void _lt;
    saveMutation.mutate(rest as Item);
  };

  return {
    savePatch,
    isSaving: saveMutation.isPending
  };
}
