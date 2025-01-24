import Item from 'src/types/item';
import { parseJSON, stringifyJSON } from '@shared/utils/storageUtils';

export const getLocalModalOpen = (): boolean | null => parseJSON<boolean>('modalOpen', null);
export const setLocalModalOpen = (isOpen: boolean): void => stringifyJSON('modalOpen', isOpen);

export const getLocalSelectedItem = (): Item | null => parseJSON<Item>('selectedItem', null);
export const setLocalSelectedItem = (item: Item | null): void => stringifyJSON('selectedItem', item);
